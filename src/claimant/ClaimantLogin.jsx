import { useState } from "react";

export default function ClaimantLogin({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/claimant-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ background: "white", borderRadius: 20, padding: 40, width: "100%", maxWidth: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e8ecf2" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🇳🇱</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>My listing</h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Sign in to manage your FounderHub NL listing</p>
        </div>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {error && <p style={{ fontSize: 13, color: "#ef4444", marginBottom: 12 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "11px", background: "#4f6df5", color: "white",
            border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
