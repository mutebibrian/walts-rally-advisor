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
- For other matters, penalty suspended pending appeal

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
  { icon: "🚦", label: "False Start", prompt: "We just received a false start penalty on a stage. What are our options?" },
  { icon: "🔍", label: "Rival Cheating", prompt: "We suspect a rival car is running illegal modifications. How do we protest?" },
  { icon: "🃏", label: "Wrong Time on Card", prompt: "The marshal put the wrong time on our time card at a control. What do we do?" },
  { icon: "🔧", label: "Want to Restart", prompt: "Our car broke down and we had to retire. Can we restart and what penalties apply?" },
  { icon: "🗺️", label: "Route Deviation", prompt: "We were given a route deviation penalty but we think it was unfair. How do we challenge it?" },
  { icon: "⏰", label: "Late to Admin", prompt: "We arrived late to administrative checks. What is the fine and what do we do?" },
  { icon: "🚩", label: "Red Flag on Stage", prompt: "We saw a red flag mid-stage. What exactly must we do now?" },
  { icon: "💨", label: "Speeding Fine", prompt: "We got a speeding fine during reconnaissance. What are the exact amounts and can we appeal?" },
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
          background: isUser
            ? "linear-gradient(135deg, #C0392B, #922B21)"
            : "#ffffff",
          color: isUser ? "#fff" : "#1a1a1a",
          boxShadow: isUser
            ? "0 4px 15px rgba(192,57,43,0.3)"
            : "0 2px 12px rgba(0,0,0,0.08)",
          fontSize: 14, lineHeight: 1.7,
          whiteSpace: "pre-wrap", border: isUser ? "none" : "1px solid #eee",
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
              FMU 2026 Rules Advisor
            </div>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 20,
            padding: "4px 10px", display: "flex", alignItems: "center", gap: 5,
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
              boxShadow: "0 0 6px #4ade80",
            }} />
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>

        {showIntro && (
          <div style={{ paddingBottom: 8 }}>
            {/* Hero Card */}
            <div style={{
              background: "linear-gradient(135deg, #C0392B 0%, #7B241C 100%)",
              borderRadius: 20, padding: "24px 20px", marginBottom: 16, textAlign: "center",
              boxShadow: "0 8px 30px rgba(192,57,43,0.3)",
            }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>🏎️</div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
                Race Day Advisor
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, lineHeight: 1.6 }}>
                Instant FMU rules guidance for any situation on or off the stage
              </div>
            </div>

            {/* Quick Scenarios */}
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
        {/* Quick chips when chatting */}
        {!showIntro && (
          <div style={{ display: "flex", gap: 6, marginBottom: 8, overflowX: "auto", paddingBottom: 2 }}>
            {QUICK_SCENARIOS.slice(0, 5).map((s, i) => (
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
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #C0392B, #922B21)"
                : "#e8e8e8",
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
