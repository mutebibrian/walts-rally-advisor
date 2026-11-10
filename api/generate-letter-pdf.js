export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    rallyName,
    rallyDate,
    carNumber,
    driverName,
    coDriverName,
    carModel,
    carClass,
    retirementLocation,
    retirementReason,
    timecardSurrendered,
    restartSection,
    targetTC,
    signatureDataUrl,
    submittedTime,
  } = req.body;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 25mm 20mm; }
  body { font-family: Arial, sans-serif; font-size: 11pt; color: #000; line-height: 1.5; }
  .header { text-align: center; border-bottom: 3px solid #C0392B; padding-bottom: 10px; margin-bottom: 20px; }
  .header h1 { font-size: 16pt; color: #C0392B; margin: 0; letter-spacing: 2px; }
  .header h2 { font-size: 11pt; color: #333; margin: 4px 0 0; font-weight: normal; }
  .logo-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 6px; }
  .checkered { font-size: 24pt; }
  .ref-block { text-align: right; font-size: 9pt; color: #555; margin-bottom: 16px; }
  .to-block { margin-bottom: 16px; }
  .to-block p { margin: 2px 0; }
  .subject { font-weight: bold; font-size: 12pt; border-left: 4px solid #C0392B; padding-left: 10px; margin: 16px 0; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  td { padding: 6px 10px; border: 1px solid #ccc; vertical-align: top; }
  td:first-child { font-weight: bold; width: 45%; background: #f7f7f7; }
  .section-title { font-weight: bold; font-size: 11pt; color: #C0392B; margin: 18px 0 6px; border-bottom: 1px solid #C0392B; }
  .body-text { margin: 10px 0; text-align: justify; }
  .numbered-item { margin: 6px 0 6px 20px; }
  .signature-section { margin-top: 30px; display: flex; gap: 40px; }
  .sig-box { flex: 1; }
  .sig-box p { margin: 2px 0; font-size: 10pt; }
  .sig-img { border-bottom: 1px solid #000; min-height: 50px; display: flex; align-items: flex-end; margin-bottom: 4px; }
  .sig-img img { max-height: 60px; max-width: 200px; }
  .official-box { flex: 1; border: 1px solid #999; padding: 10px; border-radius: 4px; }
  .official-line { border-bottom: 1px dashed #999; min-height: 28px; margin: 8px 0; }
  .footer { margin-top: 30px; border-top: 2px solid #C0392B; padding-top: 8px; font-size: 8pt; color: #666; text-align: center; }
  .article-ref { font-style: italic; color: #555; font-size: 9.5pt; }
</style>
</head>
<body>

<div class="header">
  <div class="logo-row">
    <img src="https://walts-rally-advisor.vercel.app/logo.png" alt="Rally Hub" style="height:60px; width:auto;"/>
    <div>
      <h2 style="margin:4px 0 0; font-weight:normal; color:#333;">FMU 2026 National Competition Rules — Official Document</h2>
    </div>
  </div>
</div>

<div class="ref-block">
  Document No: RH-RST-${carNumber || "000"}-2026<br/>
  Date Submitted: ${rallyDate || new Date().toLocaleDateString("en-GB")}<br/>
  Time: ${submittedTime || new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
</div>

<div class="to-block">
  <p><strong>To:</strong> The Clerk of the Course (CoC)</p>
  <p><strong>Via:</strong> Competitor Relations Officer (CRO)</p>
  <p><strong>Event:</strong> ${rallyName || "[Rally Name & Year]"}</p>
</div>

<div class="subject">RE: FORMAL NOTIFICATION OF INTENT TO RESTART UNDER NCR ART. 54.1.1</div>

<div class="section-title">1. COMPETITOR DETAILS</div>
<table>
  <tr><td>Car Number</td><td>#${carNumber || "___"}</td></tr>
  <tr><td>Driver Name</td><td>${driverName || "___"}</td></tr>
  <tr><td>Co-Driver Name</td><td>${coDriverName || "___"}</td></tr>
  <tr><td>Car Make / Model</td><td>${carModel || "___"}</td></tr>
  <tr><td>Class</td><td>${carClass || "___"}</td></tr>
  <tr><td>Entrant / Team</td><td>Rally Hub</td></tr>
</table>

<div class="section-title">2. RETIREMENT DETAILS</div>
<table>
  <tr><td>Retirement Location / SS / TC</td><td>${retirementLocation || "___"}</td></tr>
  <tr><td>Reason for Retirement</td><td>${retirementReason || "___"}</td></tr>
  <tr><td>Time Card Surrendered</td><td>${timecardSurrendered || "YES — Attached to this letter"}</td></tr>
</table>

<div class="section-title">3. RESTART REQUEST</div>
<table>
  <tr><td>Section / Leg to Restart From</td><td>${restartSection || "___"}</td></tr>
  <tr><td>Target Time Control (TC)</td><td>${targetTC || "___"}</td></tr>
</table>

<div class="section-title">4. FORMAL NOTIFICATION</div>
<p class="body-text">
  Dear Sir/Madam,
</p>
<p class="body-text">
  We, the undersigned, formally notify the Clerk of the Course of our intention to restart the above-referenced rally under the provisions of <strong>NCR Article 54.1.1</strong>, which states that a competitor who retires may restart from the beginning of the next section, provided written notification is submitted to the Clerk of the Course as soon as possible after retirement.
</p>
<p class="body-text">
  We confirm the following in accordance with the 2026 FMU National Competition Rules:
</p>
<p class="numbered-item">1. This written notification is submitted immediately upon retirement as required by NCR Art. 54.1.1.</p>
<p class="numbered-item">2. Our time card has been surrendered to the designated official as required.</p>
<p class="numbered-item">3. The vehicle retains its original body shell and engine block with all original scrutineering marks intact, in accordance with NCR Art. 55.2.</p>
<p class="numbered-item">4. We understand that the vehicle must report to the overnight regroup / parc fermé no later than ONE HOUR (60 minutes) before the scheduled start of the first vehicle, as required by NCR Art. 55.1.</p>
<p class="numbered-item">5. We acknowledge that time penalties will be applied for missed stages: 10 minutes plus the fastest class time per missed Special Stage, and 5 minutes plus the fastest class time per missed Super Special Stage, per NCR Art. 54.2.1.</p>
<p class="numbered-item">6. We confirm this is our first (and only permitted) restart during this leg, in accordance with NCR Art. 54.1.6.</p>

<p class="article-ref">
  NCR Art. 54.1.1 | NCR Art. 54.1.6 | NCR Art. 54.2.1 | NCR Art. 55.1 | NCR Art. 55.2
</p>

<div class="section-title">5. SIGNATURES</div>
<div class="signature-section">
  <div class="sig-box">
    <p><strong>Driver / Competitor Signature:</strong></p>
    <div class="sig-img">
      ${signatureDataUrl ? `<img src="${signatureDataUrl}" alt="Signature"/>` : ""}
    </div>
    <p>Name: <strong>${driverName || "___________________"}</strong></p>
    <p>Car: #${carNumber || "___"} &nbsp;|&nbsp; Date: ${rallyDate || "___________"}</p>
  </div>
  <div class="official-box">
    <p><strong>FOR OFFICIAL USE ONLY</strong></p>
    <p style="font-size:9pt;">Time Received:</p>
    <div class="official-line"></div>
    <p style="font-size:9pt;">Received By (CRO / CoC):</p>
    <div class="official-line"></div>
    <p style="font-size:9pt;">Official Signature:</p>
    <div class="official-line"></div>
    <p style="font-size:9pt;">Stamp:</p>
    <div class="official-line"></div>
  </div>
</div>

<div class="footer">
  Rally Hub — FMU 2026 NCR Rules Advisor &nbsp;|&nbsp; Generated ${new Date().toLocaleString("en-GB")} &nbsp;|&nbsp; This document is valid under the 2026 FMU National Competition Rules
</div>

</body>
</html>`;

  // Return HTML — the client will print/save it as PDF
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
