// api/chat.js
// Vercel Serverless Function — proxies chat requests to Google's Gemini API.
// The frontend sends an OpenAI-style request ({ messages: [...] }) and
// expects an OpenAI-style response ({ choices: [{ message: { content } }] }),
// so this function translates both directions. This keeps the frontend
// provider-agnostic — swapping AI providers again later only means editing
// this file, not App.js.
//
// Resilience: Gemini models occasionally return 503 ("currently experiencing
// high demand") during traffic spikes. Since this app is used live during
// rally events, a single stuck request is a real problem — so this function
// retries briefly, then falls back to alternate models (different capacity
// pools) before giving up. It also treats a 404 "model no longer available"
// error (which Google has issued for several models during 2026 as it
// retires older versions) as a signal to skip straight to the next model in
// the chain, since retrying the same deprecated model is pointless but a
// different model may still work.

const MODEL_FALLBACK_CHAIN = ["gemini-3.6-flash", "gemini-3.1-pro-preview", "gemini-3.1-flash-lite"];
const RETRIES_PER_MODEL = 2; // 1 initial attempt + 1 retry, per model
const RETRY_DELAY_MS = 900;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const rawKey = process.env.GEMINI_API_KEY || "";
  const apiKey = rawKey.trim().replace(/[^\x20-\x7E]/g, "");

  if (!apiKey) {
    return res.status(500).json({
      error: { message: "Server misconfigured: GEMINI_API_KEY is not set." },
    });
  }
  if (apiKey.length !== rawKey.trim().length) {
    return res.status(500).json({
      error: {
        message: `GEMINI_API_KEY contains invalid non-ASCII characters (raw length ${rawKey.trim().length}, clean length ${apiKey.length}). Re-copy the key from aistudio.google.com/apikey into a plain text field and re-save it in Vercel.`,
      },
    });
  }

  const { messages, model, max_tokens } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({
      error: { message: "Request body must include a 'messages' array." },
    });
  }

  // Gemini's Generative Language API wants the system prompt separated out
  // as `system_instruction`, and the rest of the conversation as `contents`
  // with role "user" or "model" (not "assistant").
  const systemMessages = messages.filter((m) => m.role === "system");
  const conversationMessages = messages.filter((m) => m.role !== "system");

  const systemInstructionText = systemMessages.map((m) => m.content).join("\n\n");

  const contents = conversationMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const requestBody = {
    contents,
    generationConfig: {
      maxOutputTokens: max_tokens || 1500,
    },
  };
  if (systemInstructionText) {
    requestBody.system_instruction = { parts: [{ text: systemInstructionText }] };
  }

  // Build the model attempt order: an explicit request from the frontend
  // goes first, followed by the fallback chain (skipping duplicates).
  const requestedModel = (model && model.startsWith("gemini-")) ? model : null;
  const modelOrder = requestedModel
    ? [requestedModel, ...MODEL_FALLBACK_CHAIN.filter((m) => m !== requestedModel)]
    : MODEL_FALLBACK_CHAIN;

  let lastError = null;

  for (const geminiModel of modelOrder) {
    for (let attempt = 1; attempt <= RETRIES_PER_MODEL; attempt++) {
      try {
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify(requestBody),
          }
        );

        const data = await geminiResponse.json();

        if (geminiResponse.ok) {
          const candidate = data?.candidates?.[0];
          const replyText =
            candidate?.content?.parts?.map((p) => p.text || "").join("") || "";

          if (!replyText) {
            // e.g. blocked by safety filters — this isn't a demand/outage
            // issue, so don't retry or fall back; surface it directly.
            const finishReason = candidate?.finishReason || "unknown";
            return res.status(200).json({
              choices: [
                {
                  message: {
                    content: `No response text was returned (finish reason: ${finishReason}).`,
                  },
                },
              ],
            });
          }

          // Success. Reshape into the OpenAI-style response App.js expects.
          return res.status(200).json({
            choices: [
              {
                message: { role: "assistant", content: replyText },
              },
            ],
            _servedBy: geminiModel, // harmless debugging aid, ignored by the frontend
          });
        }

        const errMsg = data?.error?.message || JSON.stringify(data);
        lastError = { status: geminiResponse.status, message: errMsg };

        const isTransientOverload = geminiResponse.status === 503 || geminiResponse.status === 429;
        const isModelUnavailable =
          geminiResponse.status === 404 ||
          /no longer available|not found|deprecated/i.test(errMsg);

        if (isModelUnavailable) {
          // This specific model is gone/renamed — retrying it won't help,
          // but a different model in the chain might still work. Skip
          // straight to the next model (break out of the retry loop for
          // this one).
          break;
        }

        if (!isTransientOverload) {
          // A genuinely bad request, auth failure, etc. — the same problem
          // would recur on every model, so fail fast instead of burning
          // through the whole chain.
          return res.status(geminiResponse.status).json({ error: { message: errMsg } });
        }

        if (attempt < RETRIES_PER_MODEL) {
          await sleep(RETRY_DELAY_MS);
        }
        // otherwise, fall through to the next model in modelOrder
      } catch (err) {
        lastError = { status: 502, message: `Upstream request to Gemini failed: ${err.message}` };
        if (attempt < RETRIES_PER_MODEL) {
          await sleep(RETRY_DELAY_MS);
        }
      }
    }
  }

  // Every model in the chain failed with a retryable error.
  return res.status(lastError?.status || 503).json({
    error: {
      message: `${lastError?.message || "All models are currently unavailable."} (tried: ${modelOrder.join(", ")})`,
    },
  });
}
