// api/send-letter.js
// Vercel Serverless Function — sends the generated restart-letter PDF to
// the Clerk of the Course via Resend's transactional email API.

const RESEND_ENDPOINT = "https://api.resend.com/emails";
// Resend's shared sandbox sender — works immediately with no domain
// verification. Once you verify your own domain in Resend, you can switch
// this to e.g. "Walts Rally Team <noreply@waltsrallyteam.com>".
const FROM_ADDRESS = "Walts Rally Team <onboarding@resend.dev>";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const rawKey = process.env.RESEND_API_KEY || "";
  const apiKey = rawKey.trim().replace(/[^\x20-\x7E]/g, "");

  if (!apiKey) {
    return res.status(500).json({
      error: { message: "Server misconfigured: RESEND_API_KEY is not set." },
    });
  }

  const { toEmail, driverName, carNumber, eventName, pdfBase64 } = req.body || {};

  if (!toEmail || !pdfBase64) {
    return res.status(400).json({
      error: { message: "toEmail and pdfBase64 are required." },
    });
  }

  const subject = `Restart Request — Car #${carNumber || "?"} — ${eventName || "Rally"}`;
  const html = `
    <p>Dear Clerk of the Course,</p>
    <p>Please find attached a formal restart request from <strong>${driverName || "the driver"}</strong>
    (Car #${carNumber || "?"}) for <strong>${eventName || "the event"}</strong>.</p>
    <p>The signed letter is attached as a PDF.</p>
    <p>Kind regards,<br/>Walts Rally Team</p>
  `;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [toEmail],
        subject,
        html,
        attachments: [
          {
            filename: `Restart_Request_Car${carNumber || ""}.pdf`,
            content: pdfBase64,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.message || JSON.stringify(data);
      return res.status(response.status).json({ error: { message: errMsg } });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    return res.status(502).json({
      error: { message: `Failed to send email via Resend: ${err.message}` },
    });
  }
}
