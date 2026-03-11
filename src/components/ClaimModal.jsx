import { useState } from "react";
import { X } from "lucide-react";

export default function ClaimModal({ initiative, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", org: "", reason: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  async function submit(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initiative_id: initiative.id,
          initiative_name: initiative.name,
          claimant_name: form.name,
          claimant_email: form.email,
          claimant_org: form.org,
          reason: form.reason,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputStyle = {
    width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0",
    borderRadius: 10, fontSize: 14, color: "#1e293b", outline: "none",
    fontFamily: "inherit", boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.4)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: "white", borderRadius: 20, padding: 32, maxWidth: 480,
        width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>Claim this listing</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>{initiative.name}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={20} style={{ color: "#94a3b8" }} />
          </button>
        </div>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", margin: "0 0 8px" }}>Request sent!</h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px" }}>
              We'll review your request and get back to you by email.
            </p>
            <button onClick={onClose} style={{
              padding: "10px 24px", background: "#4f6df5", color: "white",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p style={{ fontSize: 14, color: "#475569", marginBottom: 20, lineHeight: 1.6 }}>
              Are you the owner or manager of this initiative? Fill in your details below and we'll review your request.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Your name *</label>
                <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Email address *</label>
                <input type="email" style={inputStyle} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Organisation</label>
                <input style={inputStyle} value={form.org} onChange={e => setForm(f => ({ ...f, org: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Why are you claiming this listing?</label>
                <textarea
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="e.g. I am the founder / programme manager of this initiative"
                />
              </div>
            </div>
            {status === "error" && (
              <p style={{ fontSize: 13, color: "#ef4444", marginTop: 12 }}>Something went wrong. Please try again.</p>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button type="button" onClick={onClose} style={{
                flex: 1, padding: "10px", background: "#f1f5f9", color: "#475569",
                border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>Cancel</button>
              <button type="submit" disabled={status === "loading"} style={{
                flex: 2, padding: "10px", background: "#4f6df5", color: "white",
                border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: status === "loading" ? "not-allowed" : "pointer",
                opacity: status === "loading" ? 0.7 : 1,
              }}>
                {status === "loading" ? "Sending…" : "Submit claim request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
