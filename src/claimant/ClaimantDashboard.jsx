import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const TYPES = ["Accelerator", "Incubator", "Campus / Coworking", "Community / Network", "Support Program", "Event"];

export default function ClaimantDashboard({ session, onLogout }) {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/initiatives")
      .then(r => r.json())
      .then(data => {
        setInitiatives(data.filter(i => session.initiativeIds.includes(i.id)));
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e8ecf2", padding: "0 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>🇳🇱 My listing</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#64748b" }}>{session.email}</span>
            <button onClick={onLogout} style={{ background: "none", border: "1px solid #e2e8f0", cursor: "pointer", padding: "6px 14px", borderRadius: 8, fontSize: 13, color: "#64748b" }}>
              Log out
            </button>
          </div>
        </div>
      </nav>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Your listings</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28 }}>Edit your initiative information below. Changes are published immediately.</p>

        {loading ? <p style={{ color: "#64748b" }}>Loading…</p> : initiatives.map(i => (
          <InitiativeEditCard key={i.id} initiative={i} token={session.token} />
        ))}

        {!loading && initiatives.length === 0 && (
          <p style={{ color: "#64748b", fontSize: 14 }}>No listings assigned to your account yet.</p>
        )}
      </div>
    </div>
  );
}

function InitiativeEditCard({ initiative, token }) {
  const [form, setForm] = useState({ ...initiative });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/initiatives", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-claimant-token": token },
      body: JSON.stringify({ id: initiative.id, ...form }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const label = (text) => (
    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>{text}</label>
  );
  const inp = { width: "100%", padding: "9px 11px", border: "1.5px solid #e2e8f0", borderRadius: 9, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #e8ecf2", padding: 28, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 20px" }}>{initiative.name}</h3>
      <form onSubmit={save}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div>
            {label("Name")}
            <input style={inp} value={form.name} onChange={f("name")} />
          </div>
          <div>
            {label("Organisation")}
            <input style={inp} value={form.organization || ""} onChange={f("organization")} />
          </div>
          <div>
            {label("Type")}
            <select style={{ ...inp, background: "white" }} value={form.type} onChange={f("type")}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            {label("Website URL")}
            <input style={inp} value={form.url || ""} onChange={f("url")} type="url" />
          </div>
          <div>
            {label("Access")}
            <select style={{ ...inp, background: "white" }} value={form.access} onChange={f("access")}>
              <option>Open to all</option>
              <option>Application required</option>
            </select>
          </div>
          <div>
            {label("Cost")}
            <select style={{ ...inp, background: "white" }} value={form.cost} onChange={f("cost")}>
              <option>Free</option>
              <option>Paid</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          {label("Notes / Description")}
          <textarea rows={3} style={{ ...inp, resize: "vertical" }} value={form.notes || ""} onChange={f("notes")} />
        </div>
        <button type="submit" disabled={saving} style={{
          padding: "10px 24px", background: saved ? "#10b981" : "#4f6df5", color: "white",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6,
          transition: "background 0.2s",
        }}>
          {saved ? <><Check size={14} /> Saved!</> : saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
