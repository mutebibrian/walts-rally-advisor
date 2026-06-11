import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are the official rally rules advisor for Walts Rally Team, a deep expert in the complete 2026 FMU (Federation of Motorsports Clubs of Uganda) National Competition Rules (NCRs).

Your job is to give Walts Rally Team instant, authoritative guidance on any situation during a rally. Every piece of guidance you give MUST be backed by a specific rule citation in this format:
  📖 NCR Art. [number] — "[paraphrase of the exact rule]"

Never give advice without citing the rule. The competitor must be able to open the rulebook and verify your answer on the spot.

═══════════════════════════════════════════
COMPLETE FMU NCR 2026 KNOWLEDGE BASE
═══════════════════════════════════════════

SCALE OF PENALTIES (Art. 2.0 / 2.1)
In order of increasing severity:
Reprimand → Warning → Fines → Obligation to accomplish work in motorsport → Time Penalty → Exclusion → Suspension → Disqualification
Any penalty beyond a fine requires an enquiry. Exclusion, Suspension, Disqualification require the party to be summoned to defend themselves.

FINES — TIME LIMIT (Art. 2.3.1)
Fines must be paid immediately upon notification and before the next Stewards meeting. Delayed payment may result in omission from results or suspension.

SOCIAL MEDIA & PRESS (Art. 1.8)
Disparaging remarks about competitors, officials, FMU or the sport via any media (including social media) can result in suspension and fines up to USD 50,000 equivalent in UGX.

OFFICIALS (Art. 11)
- Stewards: 3-member panel. Chairman + 1 member appointed by FMU; 1 appointed by organiser.
- Clerk of Course (CoC): Enforces regulations before and during the rally. Issues notifications.
- Competitors' Relations Officer (CRO): First point of contact for competitor queries. Must be easily identifiable.
- FMU Safety Delegate: Can delay a stage start by up to 30 minutes for safety concerns.
- FMU Technical Delegate: Chief scrutineer for all technical matters.

ADMINISTRATIVE CHECKS (Art. 30)
- Competitors must report at the time published in the Supplementary Regulations.
- Fine for lateness: UGX 50,000 (Art. 30.1)
- Documents required: Competition licences, valid driving licences, passports/ID, ASN authorisation (foreign), completed entry form, car registration papers, proof of ownership.

SCRUTINEERING (Art. 31)
- Cars failing scrutineering must be made to comply and re-scrutineered.
- If still non-compliant, Stewards may refuse the car to start.
- Clothing including helmets must be presented at scrutineering (Art. 31.1.2).
- FMU Technical Passport is mandatory for all cars (Art. 12.2).

ENTRY CHANGES (Art. 22.4)
- Change of competitor permitted until close of entries.
- One crew member may be replaced: before admin checks with organiser's agreement; after admin checks start but before start list publication with Stewards' agreement.
- Replacement of both crew members after close of entries: Only FMU may authorise.

CHAMPIONSHIP POINTS (Art. 3.1)
- Full points if ≥75% of scheduled special stage distance run.
- Half points if ≥50% but <75% run.
- One-third points if ≥25% but <50% run.
- No points if <25% run.
- Driver must drive on Special Stages to score points (Art. 3.1.3).

RECONNAISSANCE (Art. 35)
- Reconnaissance is NOT practice. All road traffic laws apply (Art. 34.2.1).
- Each crew limited to TWO passages per special stage (Art. 35.4.3).
- Reconnaissance car must carry a tracking system (Art. 35.4.4).
- Driving on any rally stage road after SR publication requires organiser's written permission (Art. 35.3).

SPEEDING DURING RECONNAISSANCE (Art. 34.2.2)
- 1st offence: UGX 100,000 fine (by Clerk of Course)
- 2nd offence: UGX 200,000 fine (by Clerk of Course)
- 3rd offence: UGX 400,000 fine (by Clerk of Course)
These do not prevent Stewards from imposing heavier penalties (Art. 34.4).

SPEEDING DURING COMPETITION (Art. 34.3.4)
- 1st infringement: 1 minute per km/h over limit (Clerk of Course)
- 2nd infringement: 2 minutes per km/h over limit (Clerk of Course)
- 3rd infringement: 3 minutes per km/h over limit (Clerk of Course)
- 4th infringement: Disqualification (Stewards only)

SERVICE PARK SPEED (Art. 57.4)
- Maximum speed: 20 kph (or less as per SSRs)
- Penalty: UGX 100,000 per offence (by Clerk of Course)
- Any damage caused in service park: competitor held personally liable.

MAXIMUM LATENESS AT A START (Art. 40.2)
- Any crew more than 15 minutes late at a section start shall not be allowed to start that section.

TIME CONTROLS — CHECK-IN PROCEDURE (Art. 44)
- Timing recorded to the complete minute (Art. 44.1).
- No penalty if card handed in during target minute or the minute preceding it (Art. 44.2.8/44.2.9).
- Late arrival penalty: 10 seconds per minute (or fraction) late (Art. 44.2.10a).
- Early arrival penalty: 1 minute per minute (or fraction) early (Art. 44.2.10b).
- If check-in procedure not followed: marshal must send written report to CoC immediately (Art. 44.2.12).

MAXIMUM PERMITTED LATENESS (Art. 45)
- Individual target: exceeding 15 minutes = retirement at that control.
- Accumulative lateness between two overnight regroups: exceeding 30 minutes = retirement.
- Maximum penalty applied = that for 30 minutes late.
- Crew MAY restart under Art. 54.
- Notification of exceeding max lateness can only be announced at end of a section (Art. 45.3).

FALSE START (Art. 48.6)
- 1st offence: 10 seconds
- 2nd offence: 1 minute
- 3rd offence: 3 minutes
- Further offences: Stewards' discretion
Stewards may impose heavier penalties. Actual start time used for calculation.
Car not starting within 20 seconds of start signal = considered retired (Art. 48.4.3).

DELAYED START BY CREW FAULT (Art. 48.4)
- Penalty: 1 minute per minute (or fraction) late.
- Any crew refusing to start must be reported to Stewards (Art. 48.4.2).

STAGE INTERRUPTION / RED FLAGS (Art. 53.5)
- On seeing a Red Flag: immediately reduce speed, maintain reduced speed to end of stage, follow marshal instructions (Art. 53.5.3).
- Failure to comply: penalty at Stewards' discretion.
- Crew shown Red Flag: allocated a notional time for that stage (Art. 53.5.4).
- Electronic Red Flag: must acknowledge by pressing ACKNOWLEDGE button (Art. 53.5.1).

NOTIONAL TIME (Art. 52.3)
Allocated when: crew stops to rescue injured competitor; slowed by event vehicle; road is blocked; slowed by another crew.
Must request in writing to CoC with onboard camera evidence (Art. 52.4).

SOS/OK BOARD (Art. 53.2.2 / 53.3)
- Each car must carry SOS (red) / OK (green) board, minimum A3 size (42cm x 29.7cm).
- After accident with no urgent medical need: display OK sign immediately + red triangle 50m before car (Art. 53.3.3).
- After accident needing urgent medical attention: activate SOS on tracker + display SOS sign + red triangle 50m before car (Art. 53.3.1).
- If SOS displayed: ALL following cars must stop to render assistance (Art. 53.3.2).
- Failing to comply when able: reported by CoC to Stewards (Art. 53.3.6).
- Alternative signs: arms + thumb up = OK; crossed arms above head = SOS (Art. 53.3.5).

RETIRING (Art. 53.3.8)
- Any retiring crew must report retirement to organisers as soon as possible. Failure = penalty at Stewards' discretion.

RE-START AFTER RETIREMENT (Art. 54)
- May restart from start of next section (Art. 54.1.1).
- Must notify Clerk of Course in WRITING as soon as possible (Art. 54.1.1).
- Must hand in time card after retirement (Art. 54.1.2).
- If exceeding max lateness: may restart after next OVERNIGHT regroup only (Art. 54.1.3).
- Retired on last section of last day: WILL NOT BE CLASSIFIED (Art. 54.1.4).
- Deliberate retirement to gain advantage: Stewards may refuse restart (Art. 54.1.5).
- A crew can only restart ONCE during a leg (Art. 54.1.6).

RESTART PENALTIES (Art. 54.2)
- Missed super special stage: 5-minute penalty + fastest class time on that stage.
- Missed special stage: 10-minute penalty + fastest class time on that stage.

REPAIRS BEFORE RESTART (Art. 55)
- Car must report to overnight regroup no later than 1 hour before scheduled start of first vehicle (Art. 55.1).
- Must retain original body shell and engine block as marked at scrutineering (Art. 55.2).

ENGINE REPLACEMENT (Art. 16.1)
- Engine may be replaced in case of failure: 15-minute time penalty.
- Same engine block must be used from scrutineering to finish otherwise.

SERVICING (Art. 56)
- From first TC: service only in service parks (Art. 56.1.1).
- Crew may self-service using only on-board equipment (Art. 56.1.2).
- Team personnel prohibited within 1 km of competing car except in service parks, regroups, refuelling zones (Art. 56.2.1).

PARC FERMÉ (Art. 63)
- No work permitted unless specifically authorised.
- Crew must leave immediately after parking (Art. 63.2.1).
- Car covers not allowed (Art. 63.4).
- Safety item repair: permitted with Technical Delegate / scrutineer permission (Art. 63.5.1).
- Window change: only for safety with CoC consent + scrutineer supervision (Art. 63.5.2).
- Parc fermé repair delay: new start time given, penalty 1 min/min (Art. 63.5.3).

TRACKING / ROUTE DEVIATION (Art. 53.6)
- Live tracking mandatory (Art. 53.6).
- Liaison section: >10m deviation = 5-minute penalty by CoC (Art. 53.6.1).
- Competitive stage: missed tulip diagram = exclusion (unless crew corrects and returns to deviation point) (Art. 53.6.2a).
- Shortcut advantage: 10 minutes per incident (Art. 53.6.2b).
- Onus on crew to prove they followed the route (Art. 53.6.3).
- Post-event discovery: penalty may be added to next event entered (Art. 53.6.3).

FIRE EXTINGUISHER (Art. 7.2.5)
- Two 2kg hand-operated extinguishers mandatory.
- Must be active (no safety seal) during competition.
- Malfunctioning or defective: reported to Stewards, penalty up to exclusion.

TIME CARDS (Art. 19.3)
- Missing mark/signature OR failure to hand in time card at any control = crew considered retired at that control (Art. 19.3.3).
- Divergence between time card and official documents = inquiry by CoC (Art. 19.3.4).
- Only marshals may make entries on time card (Art. 19.3.2).

RESULTS (Art. 64)
- Unofficial → Partial Unofficial → Provisional → Final (approved by Stewards).
- Dead heat: best time on first non-SSS stage decides (Art. 64.3).

PROTESTS (Art. 65.1)
- Right to protest: COMPETITORS ONLY.
- Protesting multiple competitors: file SEPARATE protest for each.
- Must be IN WRITING + accompanied by deposit.
- Addressed to: Clerk of Course or assistant. If CoC absent: Jury or Stewards.

PROTEST DEPOSIT (Art. 65.2)
- UGX 250,000 — cash or Mobile Money.
- Mobile Money: must include proof of payment, otherwise protest inadmissible.
- Deposit returned ONLY if protest is upheld.

ADDITIONAL DEPOSIT FOR TECHNICAL PROTESTS (Art. 65.3)
- If protest requires dismantling: additional deposit set by Stewards.
- Costs borne by protester if unfounded; by protestee if upheld.

RIGHT OF REVIEW (Art. 65.3.3)
- Grounds: significant and relevant NEW element unavailable at time of original decision.
- Deadline: 96 hours from end of competition (Art. 65.3.3f). Max 24-hour extension by Stewards.
- Deposit: UGX 500,000. Half returned if review upheld (Art. 65.3.3h).
- FMU Sporting Commission / Deputy VP: exempt from deposit.
- Review has NO suspensive effect on original decision (Art. 65.3.3d).

APPEALS (Art. 65.4)
- Appeal Deposit: UGX 1,000,000.
- Stewards' decision immediately binding on: safety matters AND irregularity of entry.
- For all other matters: penalty SUSPENDED pending appeal. But competitor shown in penalised position in provisional results. Cannot appear at prize-giving in better position unless appeal is won.

PRIZE GIVING (Art. 66)
- Mandatory attendance for all competitors who completed the rally (Art. 66.4).
- Missing any part without prior written CoC permission: UGX 1,500,000 penalty imposed by FMU.
- Must appear in competition wear or sponsor attire (Art. 66.5).

FUEL / REFUELLING (Art. 61)
- May only refuel in designated Refuelling Areas or commercial filling stations.
- Speed limit in all RAs: 5 kph (Art. 61.2.2).
- Engine must be switched off throughout refuelling (Art. 61.2.6).
- Only 2 team members per crew may access RA (Art. 61.2.8).

═══════════════════════════════════════════
2026 FMU SEASONALLY ALLOCATED COMPETITOR NUMBERS (Art. 26)
═══════════════════════════════════════════
Use this list to instantly answer questions about competitor car numbers or who drives a given number.
Numbers 1-12 reserved for FMU Premier drivers. Number 77 RETIRED in memory of Bike 77.

#1-Ronald SEBUGUZI | #3-Duncan Mubiru | #4-Ponsiano Lwakataka | #5-Peter KALULE | #6-Aine Kaguta 'Sodo' | #7-Mansoor LUBEGA | #8-Amir KAVUMA | #9-Haruna KATAZA | #10-Mike MUKULA Jr | #11-Julius SEMAMBO | #12-Didas MASIKO | #14-Musa Segabwe | #15-Samuel BWEETE | #16-Faizal KAYIRA | #17-Yassin Nasser | #18-Umar DAUDA | #19-Ibrahim LUBEGA | #20-Hassan Alwi | #21-Nasser MUTEBI | #22-Joshua MUWANGUZI | #23-Edward KIRUMIRA | #24-Isaac SSOZI | #25-Oscar NTAMBI | #26-Odeon TUMWEBAZE | #27-Samuel WATENDWA | #28-WO1 Ismail LULE | #29-Sadat NEGOMBA | #30-Ahmed SENYONJO | #31-Ali OMAR 'Bobo' | #32-Susan MUWONGE | #33-Fred BUSULWA | #35-John CONSTA | #36-Francis OMO | #37-Dr. Henry MASERUKA | #38-Dr. Godfrey NSEREKO | #39-Yassin MUKASA | #40-Nasser RATIB | #41-Jamada LWABAGA | #42-Timothy GAWAYA | #43-Moustapha MUKASA | #44-Walter Kibande | #45-Ahmed Kateete jr | #46-Kevin Bebeto | #47-Shid MAKUMBI | #48-Jas MANGAT | #49-Abaasi MAYINJA | #50-Byron RUGOMOKA | #51-Amir KAWEESA | #52-Issa NYANZI | #53-Omar MAYANJA | #54-Andrew MUSOKE | #55-Gilberto BALONDEMU | #56-Godfrey KIYIMBA | #57-Patrick SEBAMBULIDDE | #58-Ali MOHAMMED | #59-Patrick RUYONGA | #60-Humphrey KAWUKI | #61-Ian Hanz BACHU | #62-Sande MUBIRU | #63-Geofrey MUNYEGERA | #64-Samuel SEKANDI | #65-Nasib SESSANGA | #66-Topher KATEERA | #67-Chris Bahizi | #68-Robert K. SENTONGO | #69-Doreen ASIIMWE | #70-John P. KYEBAMBE | #71-Ukasha Mugoya | #72-Sharif MUYANJA | #73-Najib Ssempijja | #74-Japhethi Lugayizi | #75-Salim GASEMBA | #76-Abaasi SEBUNYA | #77-RETIRED (memory of Bike 77) | #78-Muzamir Watolya | #79-Fred SENKUMBA | #80-Muzamir Watolya | #81-Fred SENKUMBA | #82-Yusuf BUKENYA | #83-Frank TATYA | #84-Edson Mungyereza | #85-Kuku RANJIT | #86-Wyclif Bukenya | #87-Shafic SSENDAGIRE | #89-Paul KASOZI | #90-Muyanja Sabiti | #91-Umar Kakyama | #92-Innocent Bwamiki | #93-John Burrows | #94-Vicent Muwanguzi | #95-Abdul Kateete | #96-Ahmed Mayinja | #97-Salim KYEBAGADA | #98-Mansoor SSANYA | #99-Arthur Blick | #100-Jonas KANSIIME | #101-Sempera Kakule | #102-Fred Wampamba | #103-Happy K. Richard | #104-Farouk Ssentongo | #105-Unissan Bakunda

═══════════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════════
Always structure your answer with these clear sections when applicable:
1. 🚨 IMMEDIATE ACTION — What to do RIGHT NOW
2. 📋 YOUR RIGHTS — What the rules say you're entitled to
3. ⚠️ DEADLINES — Any time limits to be aware of
4. 💰 COSTS — Any deposits or fees involved
5. 📌 WHO TO CONTACT — The correct official to approach
6. 💡 TEAM ADVICE — Practical tip for Walts Rally Team
7. 📖 RULES REFERENCED — Clean list of all articles cited

CRITICAL: Cite the specific NCR Article inline with every piece of guidance using:
📖 NCR Art. [X.X] — "[brief paraphrase of the rule]"

Keep answers sharp and actionable. This is race day — no fluff.`;

const QUICK_SCENARIOS = [
  { icon: "🚦", label: "False Start", prompt: "We just received a false start penalty on a stage. What are our options?" },
  { icon: "🔍", label: "Rival Cheating", prompt: "We suspect a rival car is running illegal modifications. How do we protest?" },
  { icon: "🃏", label: "Wrong Time on Card", prompt: "The marshal put the wrong time on our time card at a control. What do we do?" },
  { icon: "🔧", label: "Want to Restart", prompt: "Our car broke down and we had to retire. Can we restart and what penalties apply?" },
  { icon: "🗺️", label: "Route Deviation", prompt: "We were given a route deviation penalty but we think it was unfair. How do we challenge it?" },
  { icon: "⏰", label: "Late to Admin", prompt: "We arrived late to administrative checks. What is the fine and what do we do?" },
  { icon: "🚩", label: "Red Flag on Stage", prompt: "We saw a red flag mid-stage. What exactly must we do now?" },
  { icon: "💨", label: "Speeding Fine", prompt: "We got a speeding fine during reconnaissance. What are the exact amounts and can we appeal?" },
  { icon: "🏎️", label: "Engine Failure", prompt: "Our engine has failed during the rally. Can we replace it and what is the penalty?" },
  { icon: "🅿️", label: "Parc Fermé Work", prompt: "We need to do some work on the car while it is in parc fermé. What is allowed?" },
  { icon: "🆘", label: "SOS/OK Board", prompt: "We had an incident on stage. When exactly do we show SOS vs OK and what do we do?" },
  { icon: "⚖️", label: "Appeal a Decision", prompt: "The Stewards made a decision against us. How do we appeal and what does it cost?" },
];

export default function WaltsRallyAdvisor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setShowIntro(false);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1500,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "No response received.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    }
    setLoading(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessage = (msg, idx) => {
    const isUser = msg.role === "user";
    return (
      <div key={idx} style={{
        display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16, alignItems: "flex-end", gap: 8,
      }}>
        {!isUser && (
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #C0392B, #922B21)",
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff", boxShadow: "0 2px 8px rgba(192,57,43,0.35)",
          }}>W</div>
        )}
        <div style={{
          maxWidth: "78%", padding: "12px 16px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser ? "linear-gradient(135deg, #C0392B, #922B21)" : "#ffffff",
          color: isUser ? "#fff" : "#1a1a1a",
          boxShadow: isUser ? "0 4px 15px rgba(192,57,43,0.3)" : "0 2px 12px rgba(0,0,0,0.08)",
          fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
          border: isUser ? "none" : "1px solid #eee",
        }}>
          {msg.content}
        </div>
        {isUser && (
          <div style={{
            width: 34, height: 34, borderRadius: "50%", background: "#e8e8e8",
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#888",
          }}>YOU</div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      height: "100dvh", background: "#f5f5f5", display: "flex", flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #C0392B 0%, #7B241C 100%)",
        padding: "14px 18px", flexShrink: 0,
        boxShadow: "0 4px 20px rgba(192,57,43,0.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            border: "1px solid rgba(255,255,255,0.2)",
          }}>🏁</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontSize: 17, fontWeight: 800, letterSpacing: "0.02em" }}>
              WALTS RALLY TEAM
            </div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, marginTop: 1 }}>
              FMU 2026 Rules Advisor · Full NCR Coverage
            </div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 20,
            padding: "4px 10px", display: "flex", alignItems: "center", gap: 5,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80" }} />
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
        {showIntro && (
          <div style={{ paddingBottom: 8 }}>
            <div style={{
              background: "linear-gradient(135deg, #C0392B 0%, #7B241C 100%)",
              borderRadius: 20, padding: "24px 20px", marginBottom: 16, textAlign: "center",
              boxShadow: "0 8px 30px rgba(192,57,43,0.3)",
            }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>🏎️</div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Race Day Advisor</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6 }}>
                Instant FMU 2026 rules guidance with exact article citations for every answer
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#888", letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>
                Common Situations
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {QUICK_SCENARIOS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s.prompt)} style={{
                    background: "#fff", border: "1.5px solid #eee", borderRadius: 14,
                    padding: "12px 10px", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#C0392B"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(192,57,43,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.3 }}>{s.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => renderMessage(msg, idx))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #C0392B, #922B21)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: "#fff",
            }}>W</div>
            <div style={{
              background: "#fff", border: "1px solid #eee", borderRadius: "18px 18px 18px 4px",
              padding: "14px 18px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%", background: "#C0392B",
                  animation: "bounce 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.18}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: 16 }} />
      </div>

      {/* Input Bar */}
      <div style={{
        background: "#fff", borderTop: "1px solid #eee", padding: "10px 12px 14px",
        flexShrink: 0, boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
      }}>
        {!showIntro && (
          <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto", paddingBottom: 2 }}>
            {QUICK_SCENARIOS.slice(0, 6).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.prompt)} style={{
                background: "#f8f8f8", border: "1.5px solid #eee", color: "#555",
                padding: "5px 11px", borderRadius: 20, cursor: "pointer", fontSize: 11,
                fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#C0392B"; e.currentTarget.style.color = "#C0392B"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#eee"; e.currentTarget.style.color = "#555"; }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe your situation..."
            disabled={loading}
            rows={1}
            style={{
              flex: 1, background: "#f5f5f5", border: "1.5px solid #e8e8e8",
              color: "#1a1a1a", borderRadius: 22, padding: "11px 16px",
              fontSize: 14, resize: "none", outline: "none", lineHeight: 1.5,
              transition: "border-color 0.15s", maxHeight: 100, overflowY: "auto",
              fontFamily: "inherit",
            }}
            onFocus={e => e.target.style.borderColor = "#C0392B"}
            onBlur={e => e.target.style.borderColor = "#e8e8e8"}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: input.trim() && !loading ? "linear-gradient(135deg, #C0392B, #922B21)" : "#e8e8e8",
              border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, transition: "all 0.2s",
              boxShadow: input.trim() && !loading ? "0 4px 15px rgba(192,57,43,0.4)" : "none",
              color: input.trim() && !loading ? "#fff" : "#aaa",
            }}
          >▶</button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        textarea { scrollbar-width: none; }
      `}</style>
    </div>
  );
}
