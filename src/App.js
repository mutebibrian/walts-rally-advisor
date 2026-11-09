import { useState, useRef, useEffect } from "react";



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
  { icon: "📄", label: "Restart Letter", prompt: "restart letter" },
];

export default function WaltsRallyAdvisor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showLetterForm, setShowLetterForm] = useState(false);
  const [letterForm, setLetterForm] = useState({
    rallyName: "", rallyDate: "", carNumber: "44", driverName: "Walter Kibande",
    coDriverName: "", carModel: "", carClass: "", retirementLocation: "",
    retirementReason: "", timecardSurrendered: "YES", restartSection: "", targetTC: "",
  });
  const [signature, setSignature] = useState(null);
  const sigCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Signature canvas handlers
  const startDraw = (e) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = sigCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.lineCap = "round";
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const endDraw = () => {
    setIsDrawing(false);
    setSignature(sigCanvasRef.current.toDataURL());
  };
  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const generateLetter = async () => {
    const response = await fetch("/api/generate-letter-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...letterForm, signatureDataUrl: signature, submittedTime: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) }),
    });
    const html = await response.text();
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 800);
    setShowLetterForm(false);
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    // Detect restart letter request
    const lowerText = userText.toLowerCase();
    if (lowerText.includes("restart letter") || lowerText.includes("create letter") || lowerText.includes("generate letter") || lowerText.includes("restart form")) {
      setShowLetterForm(true);
      setShowIntro(false);
      setInput("");
      return;
    }
    setInput("");
    setShowIntro(false);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const errMsg = data?.error?.message || JSON.stringify(data);
        setMessages([...newMessages, { role: "assistant", content: `⚠️ API Error (${response.status}): ${errMsg}` }]);
      } else {
        const reply = data.reply || "No response received.";
        setMessages([...newMessages, { role: "assistant", content: reply }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: `⚠️ Connection error: ${err.message}` }]);
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

  const Field = ({ label, field, placeholder, type = "text" }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: "bold", color: "#555", marginBottom: 3 }}>{label}</div>
      <input type={type} placeholder={placeholder} value={letterForm[field]}
        onChange={e => setLetterForm(p => ({ ...p, [field]: e.target.value }))}
        style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13, boxSizing: "border-box" }} />
    </div>
  );

  return (
    <div style={{
      height: "100dvh", background: "#f5f5f5", display: "flex", flexDirection: "column",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden",
    }}>

      {/* RESTART LETTER MODAL */}
      {showLetterForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: 20, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: "bold", color: "#C0392B" }}>🏁 RESTART NOTIFICATION LETTER</div>
                <div style={{ fontSize: 11, color: "#777" }}>NCR Art. 54.1.1 — Fill in details below</div>
              </div>
              <button onClick={() => setShowLetterForm(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#999" }}>✕</button>
            </div>

            <div style={{ fontSize: 12, fontWeight: "bold", color: "#C0392B", marginBottom: 8, borderBottom: "1px solid #eee", paddingBottom: 4 }}>RALLY INFO</div>
            <Field label="Rally Name & Year" field="rallyName" placeholder="e.g. Pearl of Africa Rally 2026" />
            <Field label="Date" field="rallyDate" placeholder="e.g. 09/11/2026" type="date" />

            <div style={{ fontSize: 12, fontWeight: "bold", color: "#C0392B", margin: "12px 0 8px", borderBottom: "1px solid #eee", paddingBottom: 4 }}>COMPETITOR DETAILS</div>
            <Field label="Car Number" field="carNumber" placeholder="e.g. 44" />
            <Field label="Driver Name" field="driverName" placeholder="e.g. Walter Kibande" />
            <Field label="Co-Driver Name" field="coDriverName" placeholder="e.g. John Doe" />
            <Field label="Car Make / Model" field="carModel" placeholder="e.g. Subaru Impreza WRX" />
            <Field label="Car Class" field="carClass" placeholder="e.g. National 4WD" />

            <div style={{ fontSize: 12, fontWeight: "bold", color: "#C0392B", margin: "12px 0 8px", borderBottom: "1px solid #eee", paddingBottom: 4 }}>RETIREMENT DETAILS</div>
            <Field label="Retirement Location / SS / TC" field="retirementLocation" placeholder="e.g. SS3 / After TC4" />
            <Field label="Reason for Retirement" field="retirementReason" placeholder="e.g. Mechanical failure — suspension" />
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: "bold", color: "#555", marginBottom: 3 }}>Time Card Surrendered?</div>
              <select value={letterForm.timecardSurrendered}
                onChange={e => setLetterForm(p => ({ ...p, timecardSurrendered: e.target.value }))}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 13 }}>
                <option>YES</option><option>NO</option>
              </select>
            </div>
            <Field label="Section / Leg to Restart From" field="restartSection" placeholder="e.g. Leg 2 / Section 3" />
            <Field label="Target Time Control" field="targetTC" placeholder="e.g. TC4B — Overnight Regroup Exit" />

            <div style={{ fontSize: 12, fontWeight: "bold", color: "#C0392B", margin: "12px 0 8px", borderBottom: "1px solid #eee", paddingBottom: 4 }}>DRIVER SIGNATURE</div>
            <div style={{ fontSize: 11, color: "#777", marginBottom: 6 }}>Draw your signature in the box below:</div>
            <canvas ref={sigCanvasRef} width={420} height={100}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
              style={{ border: "2px solid #C0392B", borderRadius: 8, width: "100%", height: 100, touchAction: "none", cursor: "crosshair", background: "#fafafa" }} />
            <button onClick={clearSignature} style={{ marginTop: 4, fontSize: 11, color: "#C0392B", background: "none", border: "none", cursor: "pointer", padding: 0 }}>✕ Clear signature</button>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowLetterForm(false)}
                style={{ flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: 8, background: "#f5f5f5", cursor: "pointer", fontSize: 13 }}>
                Cancel
              </button>
              <button onClick={generateLetter}
                style={{ flex: 2, padding: "12px", border: "none", borderRadius: 8, background: "#C0392B", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: "bold" }}>
                🖨️ Generate & Print PDF Letter
              </button>
            </div>
          </div>
        </div>
      )}

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
              Rally Hub
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
