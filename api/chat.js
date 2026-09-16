// api/chat.js
// Vercel Serverless Function — proxies chat requests to Google's Gemini API.
// The frontend sends an OpenAI-style request ({ messages: [...] }) and
// expects an OpenAI-style response ({ choices: [{ message: { content } }] }),
// so this function translates both directions. This keeps the frontend
// provider-agnostic — swapping AI providers again later only means editing
// this file, not App.js.

const GEMINI_MODEL_DEFAULT = "gemini-2.5-flash";

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

  const geminiModel = (model && model.startsWith("gemini-")) ? model : GEMINI_MODEL_DEFAULT;

  const requestBody = {
    contents,
    generationConfig: {
      maxOutputTokens: max_tokens || 1500,
    },
  };
  if (systemInstructionText) {
    requestBody.system_instruction = { parts: [{ text: systemInstructionText }] };
  }

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

    if (!geminiResponse.ok) {
      // Surface Gemini's error message through the same shape the frontend
      // already expects from the old Groq integration.
      const errMsg = data?.error?.message || JSON.stringify(data);
      return res.status(geminiResponse.status).json({ error: { message: errMsg } });
    }

    const candidate = data?.candidates?.[0];
    const replyText =
      candidate?.content?.parts?.map((p) => p.text || "").join("") || "";

    if (!replyText) {
      // e.g. blocked by safety filters — surface the finish reason clearly.
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

    // Reshape into the OpenAI-style response App.js already expects.
    return res.status(200).json({
      choices: [
        {
          message: { role: "assistant", content: replyText },
        },
      ],
    });
  } catch (err) {
    return res
      .status(502)
      .json({ error: { message: `Upstream request to Gemini failed: ${err.message}` } });
  }
}
