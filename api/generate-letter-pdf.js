// api/generate-letter-pdf.js
// Vercel Serverless Function — builds a formal restart-request letter as a
// PDF, embedding the driver's uploaded signature image. Returns the PDF as
// base64 so the frontend can preview/download it and pass it on to
// /api/send-letter for emailing.

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const PAGE_WIDTH = 612; // US Letter, points
const PAGE_HEIGHT = 792;
const MARGIN = 56;

function wrapText(font, text, maxWidth, fontSize) {
  const paragraphs = text.split(/\n+/);
  const lines = [];
  for (const para of paragraphs) {
    if (para.trim() === "") {
      lines.push("");
      continue;
    }
    const words = para.split(/\s+/);
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, fontSize) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
    lines.push(""); // blank line between paragraphs
  }
  return lines;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  const {
    driverName,
    coDriverName,
    carNumber,
    eventName,
    letterDate,
    cocName,
    letterBody,
    signatureDataUrl,
  } = req.body || {};

  if (!driverName || !carNumber || !letterBody) {
    return res.status(400).json({
      error: { message: "driverName, carNumber, and letterBody are required." },
    });
  }

  try {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let y = PAGE_HEIGHT - MARGIN;
    const contentWidth = PAGE_WIDTH - MARGIN * 2;
    const lineHeight = 15;

    const drawLine = (text, { size = 11, bold = false, color = rgb(0.1, 0.1, 0.1) } = {}) => {
      if (y < MARGIN + 60) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }
      page.drawText(text, {
        x: MARGIN,
        y,
        size,
        font: bold ? boldFont : font,
        color,
      });
      y -= lineHeight;
    };

    // Header
    drawLine("WALTS RALLY TEAM", { size: 16, bold: true, color: rgb(0.75, 0.22, 0.17) });
    drawLine("Formal Restart Request Letter", { size: 11, color: rgb(0.4, 0.4, 0.4) });
    y -= 10;

    drawLine(letterDate || new Date().toLocaleDateString("en-GB"));
    y -= 6;
    drawLine(`To: ${cocName || "The Clerk of the Course"}`, { bold: true });
    if (eventName) drawLine(eventName);
    y -= 6;
    drawLine(`Subject: Restart Request — Car #${carNumber}`, { bold: true });
    if (coDriverName) drawLine(`Driver: ${driverName}  |  Co-Driver: ${coDriverName}`);
    else drawLine(`Driver: ${driverName}`);
    y -= 14;

    // Body
    const bodyLines = wrapText(font, letterBody, contentWidth, 11);
    for (const line of bodyLines) {
      if (line === "") {
        y -= 6;
      } else {
        drawLine(line);
      }
    }

    y -= 20;
    drawLine("Sincerely,");
    y -= 8;

    // Signature image
    if (signatureDataUrl && signatureDataUrl.startsWith("data:image/")) {
      const isPng = signatureDataUrl.startsWith("data:image/png");
      const base64Data = signatureDataUrl.split(",")[1];
      const imgBytes = Buffer.from(base64Data, "base64");
      const img = isPng ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
      const sigMaxWidth = 160;
      const scale = sigMaxWidth / img.width;
      const sigWidth = img.width * scale;
      const sigHeight = img.height * scale;

      if (y - sigHeight < MARGIN) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - MARGIN;
      }
      page.drawImage(img, { x: MARGIN, y: y - sigHeight, width: sigWidth, height: sigHeight });
      y -= sigHeight + 6;
    } else {
      y -= 30; // leave blank space for a physical signature if none uploaded
    }

    drawLine(driverName, { bold: true });
    drawLine(`Driver, Car #${carNumber}`);
    drawLine("Walts Rally Team");

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    return res.status(200).json({ pdfBase64 });
  } catch (err) {
    return res.status(500).json({
      error: { message: `Failed to generate PDF: ${err.message}` },
    });
  }
}
