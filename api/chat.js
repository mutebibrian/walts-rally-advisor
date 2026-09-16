// api/chat.js
// Vercel Serverless Function — proxies requests to Groq so the API key
// never ships in the browser bundle and the browser never talks to
// api.groq.com directly (avoiding the CORS "Failed to fetch" error).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const rawKey = process.env.GROQ_API_KEY || "";
  // Strip whitespace/newlines and any non-ASCII characters (e.g. smart quotes
  // accidentally copied alongside the key) that would break the header.
  const apiKey = rawKey.trim().replace(/[^\x20-\x7E]/g, "");

  if (!apiKey) {
    return res.status(500).json({
      error: { message: "Server misconfigured: GROQ_API_KEY is not set." },
    });
  }
  if (apiKey.length !== rawKey.trim().length) {
    return res.status(500).json({
      error: {
        message: `GROQ_API_KEY contains invalid non-ASCII characters (raw length ${rawKey.trim().length}, clean length ${apiKey.length}). Re-copy the key from console.groq.com/keys into a plain text field and re-save it in Vercel.`,
      },
    });
  }
  if (!apiKey.startsWith("gsk_") || apiKey.length < 40 || apiKey.length > 80) {
    return res.status(500).json({
      error: {
        message: `GROQ_API_KEY looks malformed (length ${apiKey.length}, starts with "${apiKey.slice(0, 6)}..."). Expected a key starting with "gsk_" around 56 characters long. Check what's actually stored in Vercel.`,
      },
    });
  }

  const { messages, model, max_tokens } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({
      error: { message: "Request body must include a 'messages' array." },
    });
  }

  try {
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model || "openai/gpt-oss-120b",
          max_tokens: max_tokens || 1500,
          messages,
        }),
      }
    );

    const data = await groqResponse.json();
    return res.status(groqResponse.status).json(data);
  } catch (err) {
    return res
      .status(502)
      .json({ error: { message: `Upstream request to Groq failed: ${err.message}` } });
  }
}
