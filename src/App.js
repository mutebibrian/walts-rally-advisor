import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are the official rally rules advisor for Walts Rally Team, an expert in the 2026 FMU (Federation of Motorsports Clubs of Uganda) National Competition Rules (NCRs).

Your job is to help Walts Rally Team understand their rights, options, and required actions when they encounter issues during a rally. Always be direct, practical, and rally-ready.

KEY RULES YOU KNOW:

PENALTIES SCALE (in order of increasing severity):
- Reprimand → Warning → Fines → Time Penalty → Exclusion → Suspension → Disqualification

FALSE STARTS:
- 1st offence: 10 seconds
- 2nd offence: 1 minute
- 3rd offence: 3 minutes
- Further: Stewards' discretion

SPEEDING (During Competition):
- 1st: 1 min per km/h over limit (Clerk of Course)
- 2nd: 2 min per km/h over limit (Clerk of Course)
- 3rd: 3 min per km/h over limit (Clerk of Course)
- 4th: Disqualification (Stewards only)

SPEEDING (During Reconnaissance):
- 1st: UGX 100,000 fine
- 2nd: UGX 200,000 fine
- 3rd: UGX 400,000 fine

LATENESS AT TIME CONTROLS:
- Penalty: 10 seconds per minute (or fraction) late
- Maximum permitted lateness: 15 minutes on any individual target, or accumulative
- Exceeding max lateness = retirement from that section (but can restart next leg)
- Administrative check lateness fine: UGX 50,000

SERVICE PARK/PADDOCK SPEED:
- Speed limit is walking pace
- Infringement: 30-second time penalty

ROUTE DEVIATION:
- Liaison/transport section: 5-min penalty for >10m deviation from route centre
- Competitive stage: Missed tulip diagram = exclusion (unless crew corrects and returns)
- Shortcut advantage: 10 minutes per incident

RESTART AFTER RETIREMENT (Art. 54):
- May restart at next overnight regroup
- Missed super special stage: 5-minute penalty
- Missed special stage: 10-minute penalty
- A crew can only restart ONCE during a leg
- Must notify Clerk of Course in writing immediately

PARC FERMÉ VIOLATIONS:
- Unauthorised work = exclusion possible
- Car unable to restart from Parc Fermé under own power = crew considered retired

PROTESTS (Art. 65):
- RIGHT TO PROTEST: Only a competitor can protest
- Must be in WRITING
- Protest deposit: UGX 250,000 (cash or Mobile wallet)
- Address protest to: Clerk of the Course (or assistant), or Stewards if CoC absent
- Deposit returned ONLY if protest is upheld
- One protest per competitor involved (file separate protests for each)

ADDITIONAL DEPOSIT (for technical protests requiring dismantling):
- Extra deposit as specified by Stewards
- Protester pays if unfounded; protestee pays if upheld

RIGHT OF REVIEW:
- New significant evidence discovered
- Must be filed within 96 hours of competition end
- Review deposit: UGX 500,000 (half returned if review upheld)

APPEALS:
- Appeal deposit: UGX 1,000,000
- Stewards' decision is immediately binding on safety/entry irregularity matters
- For other matters, penalty suspended pending appeal (but competitor shown in penalised position in provisional results)

FIRE EXTINGUISHER:
- Defective/malfunctioning = reported to Stewards, penalty up to exclusion

OK/SOS BOARD:
- Crew MUST display OK or SOS after an incident
- Failure = reported to Stewards

RED FLAGS:
- Must reduce speed immediately upon seeing red flag
- Failure = penalty at Stewards' discretion

MISSING A CONTROL:
- Failure to hand in time card at control = crew considered retired at that control

TRACKING DEVIATION:
- Live tracking mandatory; significant deviation penalised

PRIZE GIVING / PODIUM:
- Mandatory attendance; failure = penalty
- Leaving without written permission from Clerk of Course = penalty

RESPONSE FORMAT:
Always structure your answer with these clear sections when applicable:
1. 🚨 IMMEDIATE ACTION — What to do RIGHT NOW
2. 📋 YOUR RIGHTS — What the rules say you're entitled to
3. ⚠️ DEADLINES — Any time limits to be aware of
4. 💰 COSTS — Any deposits or fees involved
5. 📌 WHO TO CONTACT — The correct official to approach
6. 💡 TEAM ADVICE — Practical tip for Walts Rally Team

Keep answers sharp and actionable. This is race day — no fluff.`;

const QUICK_SCENARIOS = [
  { label: "False Start Issued", prompt: "We just received a false start penalty on a stage. What are our options?" },
  { label: "Rival Car Cheating", prompt: "We suspect a rival car is running illegal modifications. How do we protest?" },
  { label: "Wrong Time on Card", prompt: "The marshal put the wrong time on our time card at a control. What do we do?" },
  { label: "We Retired — Want to Restart", prompt: "Our car broke down and we had to retire. Can we restart and what penalties apply?" },
  { label: "Route Deviation Penalty", prompt: "We were given a route deviation penalty but we think it was unfair. How do we challenge it?" },
  { label: "Late to Admin Check", prompt: "We arrived late to administrative checks. What is the fine and what do we do?" },
  { label: "Red Flag on Stage", prompt: "We saw a red flag mid-stage. What exactly must we do now?" },
  { label: "Speeding Fine Received", prompt: "We got a speeding fine during reconnaissance. What are the exact amounts and can we appeal?" },
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
          max_tokens: 1000,
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
      <div key={idx} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16 }}>
        {!isUser && (
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "#B8151A", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", marginRight: 10, marginTop: 2,
            fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "serif",
          }}>W</div>
        )}
        <div style={{
          maxWidth: "80%", padding: "12px 16px", borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isUser ? "#B8151A" : "#1a1a1a",
          color: isUser ? "#fff" : "#e8e8e8",
          border: isUser ? "none" : "1px solid #2a2a2a",
          fontSize: 14, lineHeight: 1.65, fontFamily: "'Courier New', monospace",
          whiteSpace: "pre-wrap",
        }}>
          {msg.content}
        </div>
        {isUser && (
          <div style={{
            width: 36, height: 36, borderRadius: "50%", background: "#333", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 10, marginTop: 2,
            fontSize: 12, fontWeight: 700, color: "#aaa",
          }}>YOU</div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0d0d", fontFamily: "'Courier New', monospace",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #B8151A 0%, #7a0e11 100%)",
        padding: "18px 24px", display: "flex", alignItems: "center", gap: 16,
        borderBottom: "3px solid #ff2828", flexShrink: 0,
        boxShadow: "0 4px 20px rgba(184,21,26,0.4)",
      }}>
        <div style={{ fontSize: 32 }}>🏁</div>
        <div>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Walts Rally Team
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            FMU 2026 Rules Advisor · Live Race Support
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ color: "#ffcc00", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
            ● ONLINE
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginTop: 2 }}>FMU NCR 2026</div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 0", minHeight: 0 }}>
        {showIntro && (
          <div style={{ textAlign: "center", padding: "30px 0 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏎️</div>
            <div style={{ color: "#B8151A", fontSize: 22, fontWeight: 900, letterSpacing: "0.08em", marginBottom: 6 }}>
              RACE DAY RULES ADVISOR
            </div>
            <div style={{ color: "#666", fontSize: 13, maxWidth: 400, margin: "0 auto 28px", lineHeight: 1.6 }}>
              Describe your issue or pick a common scenario. Get instant guidance based on the 2026 FMU National Competition Rules.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 560, margin: "0 auto" }}>
              {QUICK_SCENARIOS.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s.prompt)} style={{
                  background: "#1a1a1a", border: "1px solid #333", color: "#ccc",
                  padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12,
                  textAlign: "left", transition: "all 0.15s", fontFamily: "inherit",
                  lineHeight: 1.4,
                }}
                  onMouseEnter={e => { e.target.style.borderColor = "#B8151A"; e.target.style.color = "#fff"; e.target.style.background = "#1f0809"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#333"; e.target.style.color = "#ccc"; e.target.style.background = "#1a1a1a"; }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => renderMessage(msg, idx))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#B8151A",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "serif",
            }}>W</div>
            <div style={{
              padding: "12px 18px", background: "#1a1a1a", border: "1px solid #2a2a2a",
              borderRadius: "18px 18px 18px 4px", display: "flex", alignItems: "center", gap: 6,
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#B8151A",
                  animation: "pulse 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} style={{ height: 20 }} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: "16px 20px 20px", background: "#111", borderTop: "1px solid #222", flexShrink: 0,
      }}>
        {messages.length > 0 && !showIntro && (
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            {QUICK_SCENARIOS.slice(0, 4).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s.prompt)} style={{
                background: "transparent", border: "1px solid #333", color: "#888",
                padding: "4px 10px", borderRadius: 12, cursor: "pointer", fontSize: 10,
                fontFamily: "inherit", transition: "all 0.15s", letterSpacing: "0.05em",
              }}
                onMouseEnter={e => { e.target.style.borderColor = "#B8151A"; e.target.style.color = "#fff"; }}
                onMouseLeave={e => { e.target.style.borderColor = "#333"; e.target.style.color = "#888"; }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe your issue, penalty, or situation..."
            disabled={loading}
            rows={2}
            style={{
              flex: 1, background: "#1a1a1a", border: "1px solid #333", color: "#e8e8e8",
              borderRadius: 10, padding: "12px 14px", fontSize: 13, fontFamily: "inherit",
              resize: "none", outline: "none", lineHeight: 1.5,
              transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = "#B8151A"}
            onBlur={e => e.target.style.borderColor = "#333"}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? "#B8151A" : "#2a2a2a",
              border: "none", color: input.trim() && !loading ? "#fff" : "#555",
              borderRadius: 10, padding: "0 20px", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              fontSize: 18, transition: "all 0.15s", flexShrink: 0,
            }}
          >
            ▶
          </button>
        </div>
        <div style={{ color: "#444", fontSize: 10, marginTop: 8, textAlign: "center", letterSpacing: "0.1em" }}>
          ENTER TO SEND · POWERED BY FMU NCR 2026
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #B8151A; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
