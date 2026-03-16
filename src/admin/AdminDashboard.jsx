import { useState, useEffect } from "react";
import { Search, X, Check } from "lucide-react";

const TYPES = ["Accelerator", "Incubator", "Campus / Coworking", "Community / Network", "Support Program", "Event"];
const ACCESS_OPTIONS = ["Open to all", "Application required"];
const COST_OPTIONS = ["Free", "Paid"];

export default function AdminDashboard({ token }) {
  const [initiatives, setInitiatives] = useState([]);
  const [changes, setChanges] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/initiatives", { headers: { "x-admin-token": token } })
      .then(r => r.json())
      .then(data => { setInitiatives(data); setLoading(false); });
  }, []);

  const update = (id, key, value) => {
    setChanges(prev => ({
      ...prev,
      [id]: { ...(prev[id] || initiatives.find(i => i.id === id)), [key]: value },
    }));
  };

  const get = (initiative, key) =>
    changes[initiative.id] ? changes[initiative.id][key] : initiative[key];

  const changedCount = Object.keys(changes).length;

  async function saveAll() {
    setSaving(true);
    try {
      await Promise.all(
        Object.entries(changes).map(([id, data]) =>
          fetch("/api/initiatives", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "x-admin-token": token },
            body: JSON.stringify({ id: Number(id), ...data }),
          })
        )
      );
      setInitiatives(prev => prev.map(i => changes[i.id] ? { ...i, ...changes[i.id] } : i));
      setChanges({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  const filtered = initiatives.filter(i =>
    !search ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.organization || "").toLowerCase().includes(search.toLowerCase())
  );

  const th = { padding: "10px 6px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", whiteSpace: "nowrap", borderBottom: "2px solid #e2e8f0" };
  const cell = { padding: "8px 6px", verticalAlign: "top" };
  const inp = { width: "100%", padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const sel = { ...inp, background: "white" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Initiatives</h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            {initiatives.length} total · {filtered.length} shown
            {changedCount > 0 && <span style={{ color: "#f59e0b", fontWeight: 600 }}> · {changedCount} unsaved change{changedCount !== 1 ? "s" : ""}</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10 }}>
            <Search size={15} style={{ color: "#94a3b8" }} />
            <input
              placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: 14, width: 200 }}
            />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} /></button>}
          </div>
          <button
            onClick={saveAll}
            disabled={saving || changedCount === 0}
            style={{
              padding: "9px 22px", background: saved ? "#10b981" : changedCount > 0 ? "#4f6df5" : "#e2e8f0",
              color: changedCount > 0 ? "white" : "#94a3b8",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
              cursor: changedCount > 0 ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}
          >
            {saved ? <><Check size={14} /> Saved!</> : saving ? "Saving…" : `Save changes${changedCount > 0 ? ` (${changedCount})` : ""}`}
          </button>
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
                <th style={{ ...th, paddingRight: 12 }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => (
                <tr key={i.id} style={{ borderBottom: "1px solid #f1f5f9", background: changes[i.id] ? "#fffbeb" : "white" }}>
                  <td style={{ ...cell, width: 36, color: "#94a3b8", fontSize: 12, paddingLeft: 12 }}>{i.id}</td>
                  <td style={cell}><input style={inp} value={get(i, "name") || ""} onChange={e => update(i.id, "name", e.target.value)} /></td>
                  <td style={cell}>
                    <select style={sel} value={get(i, "type") || ""} onChange={e => update(i.id, "type", e.target.value)}>
                      {TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </td>
                  <td style={cell}><input style={inp} value={get(i, "secondary_type") || ""} onChange={e => update(i.id, "secondary_type", e.target.value)} placeholder="—" /></td>
                  <td style={cell}><input style={inp} value={get(i, "organization") || ""} onChange={e => update(i.id, "organization", e.target.value)} /></td>
                  <td style={cell}><input style={inp} value={get(i, "url") || ""} onChange={e => update(i.id, "url", e.target.value)} /></td>
                  <td style={cell}>
                    <select style={sel} value={get(i, "access") || ""} onChange={e => update(i.id, "access", e.target.value)}>
                      {ACCESS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </td>
                  <td style={cell}>
                    <select style={sel} value={get(i, "cost") || ""} onChange={e => update(i.id, "cost", e.target.value)}>
                      {COST_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </td>
                  <td style={{ ...cell, paddingRight: 12 }}><textarea style={{ ...inp, minWidth: 180, minHeight: 56, resize: "vertical" }} value={get(i, "notes") || ""} onChange={e => update(i.id, "notes", e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
