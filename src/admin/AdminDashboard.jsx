import { useState, useEffect } from "react";
import { Search, X, Check } from "lucide-react";

const TYPES = ["Accelerator", "Incubator", "Campus / Coworking", "Community / Network", "Support Program", "Event"];
const ACCESS_OPTIONS = ["Open to all", "Application required"];
const COST_OPTIONS = ["Free", "Paid"];

function EditRow({ initiative, token, onSaved }) {
  const [form, setForm] = useState({ ...initiative });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const f = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/initiatives", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id: initiative.id, ...form }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved({ ...initiative, ...form });
    } finally {
      setSaving(false);
    }
  }

  const cell = { padding: "8px 6px", verticalAlign: "top" };
  const inp = {
    width: "100%", padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: 6,
    fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };
  const sel = { ...inp, background: "white" };

  return (
    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
      <td style={{ ...cell, width: 36, color: "#94a3b8", fontSize: 12, paddingLeft: 12 }}>{initiative.id}</td>
      <td style={cell}><input style={inp} value={form.name} onChange={f("name")} /></td>
      <td style={cell}>
        <select style={sel} value={form.type} onChange={f("type")}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </td>
      <td style={cell}><input style={inp} value={form.secondary_type || ""} onChange={f("secondary_type")} placeholder="—" /></td>
      <td style={cell}><input style={inp} value={form.organization || ""} onChange={f("organization")} /></td>
      <td style={cell}><input style={inp} value={form.url || ""} onChange={f("url")} /></td>
      <td style={cell}>
        <select style={sel} value={form.access} onChange={f("access")}>
          {ACCESS_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </td>
      <td style={cell}>
        <select style={sel} value={form.cost} onChange={f("cost")}>
          {COST_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
      </td>
      <td style={cell}><textarea style={{ ...inp, minWidth: 180, minHeight: 56, resize: "vertical" }} value={form.notes || ""} onChange={f("notes")} /></td>
      <td style={{ ...cell, paddingRight: 12 }}>
        <button onClick={save} disabled={saving} style={{
          padding: "6px 12px", background: saved ? "#10b981" : "#4f6df5", color: "white",
          border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
        }}>
          {saved ? <><Check size={12} /> Saved</> : saving ? "…" : "Save"}
        </button>
      </td>
    </tr>
  );
}

export default function AdminDashboard({ token }) {
  const [initiatives, setInitiatives] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/initiatives", { headers: { "x-admin-token": token } })
      .then(r => r.json())
      .then(data => { setInitiatives(data); setLoading(false); });
  }, []);

  const filtered = initiatives.filter(i =>
    !search ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.organization || "").toLowerCase().includes(search.toLowerCase())
  );

  const th = { padding: "10px 6px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", whiteSpace: "nowrap", borderBottom: "2px solid #e2e8f0" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Initiatives</h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{initiatives.length} total · {filtered.length} shown</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10 }}>
          <Search size={15} style={{ color: "#94a3b8" }} />
          <input
            placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", fontSize: 14, width: 200 }}
          />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} /></button>}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading…</p>
      ) : (
        <div style={{ overflowX: "auto", background: "white", borderRadius: 14, border: "1px solid #e8ecf2" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead style={{ background: "#f8fafc" }}>
              <tr>
                <th style={{ ...th, paddingLeft: 12 }}>#</th>
                <th style={th}>Name</th>
                <th style={th}>Type</th>
                <th style={th}>Secondary</th>
                <th style={th}>Organisation</th>
                <th style={th}>URL</th>
                <th style={th}>Access</th>
                <th style={th}>Cost</th>
                <th style={th}>Notes</th>
                <th style={{ ...th, paddingRight: 12 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <EditRow
                  key={i.id}
                  initiative={i}
                  token={token}
                  onSaved={(updated) => setInitiatives(prev => prev.map(x => x.id === updated.id ? updated : x))}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
