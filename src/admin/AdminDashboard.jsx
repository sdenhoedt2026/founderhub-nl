import { useState, useEffect } from "react";
import { Search, X, Check, Trash2, Plus } from "lucide-react";

const TYPES = ["Accelerator", "Incubator", "Campus / Coworking", "Community / Network", "Support Program", "Event"];
const ACCESS_OPTIONS = ["Open to all", "Application required"];
const COST_OPTIONS = ["Free", "Paid"];

const EMPTY_INITIATIVE = { name: "", type: TYPES[0], secondary_type: "", organization: "", url: "", access: ACCESS_OPTIONS[0], cost: COST_OPTIONS[0], notes: "", province: "", city: "" };

export default function AdminDashboard({ token }) {
  const [initiatives, setInitiatives] = useState([]);
  const [changes, setChanges] = useState({});
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInitiative, setNewInitiative] = useState(EMPTY_INITIATIVE);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

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

  async function deleteInitiative(id) {
    await fetch("/api/initiatives", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id }),
    });
    setInitiatives(prev => prev.filter(i => i.id !== id));
    setChanges(prev => { const c = { ...prev }; delete c[id]; return c; });
    setConfirmDelete(null);
  }

  async function addInitiative() {
    if (!newInitiative.name.trim()) { setAddError("Name is required."); return; }
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/initiatives", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify(newInitiative),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error || "Failed to create initiative."); return; }
      setInitiatives(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setShowAddModal(false);
      setNewInitiative(EMPTY_INITIATIVE);
    } finally {
      setAdding(false);
    }
  }

  const filtered = initiatives.filter(i => {
    if (typeFilter && i.type !== typeFilter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) &&
      !(i.organization || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const th = { padding: "10px 6px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", whiteSpace: "nowrap", borderBottom: "2px solid #e2e8f0" };
  const cell = { padding: "8px 6px", verticalAlign: "top" };
  const inp = { width: "100%", padding: "6px 8px", border: "1px solid #e2e8f0", borderRadius: 6, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const sel = { ...inp, background: "white" };

  return (
    <div>
      {/* Confirm delete modal */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>Delete initiative?</h3>
            <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px" }}>
              <strong>{confirmDelete.name}</strong> will be permanently removed from the database.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: "9px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => deleteInitiative(confirmDelete.id)} style={{ flex: 1, padding: "9px", background: "#ef4444", color: "white", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add initiative modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", borderRadius: 16, padding: 28, maxWidth: 500, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>Add initiative</h3>
              <button onClick={() => { setShowAddModal(false); setAddError(""); setNewInitiative(EMPTY_INITIATIVE); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Name *", key: "name", type: "input" },
                { label: "Organisation", key: "organization", type: "input" },
                { label: "URL", key: "url", type: "input" },
                { label: "City", key: "city", type: "input" },
                { label: "Province", key: "province", type: "input" },
              ].map(({ label, key, type }) => (
                <label key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{label}</span>
                  <input
                    style={{ padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit" }}
                    value={newInitiative[key]}
                    onChange={e => setNewInitiative(p => ({ ...p, [key]: e.target.value }))}
                  />
                </label>
              ))}
              {[
                { label: "Type", key: "type", options: TYPES },
                { label: "Secondary type", key: "secondary_type", options: ["", ...TYPES], placeholder: "None" },
                { label: "Access", key: "access", options: ACCESS_OPTIONS },
                { label: "Cost", key: "cost", options: COST_OPTIONS },
              ].map(({ label, key, options, placeholder }) => (
                <label key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{label}</span>
                  <select
                    style={{ padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", background: "white", fontFamily: "inherit" }}
                    value={newInitiative[key]}
                    onChange={e => setNewInitiative(p => ({ ...p, [key]: e.target.value }))}
                  >
                    {options.map(o => <option key={o} value={o}>{o || "— None —"}</option>)}
                  </select>
                </label>
              ))}
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Notes</span>
                <textarea
                  style={{ padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit", minHeight: 72, resize: "vertical" }}
                  value={newInitiative.notes}
                  onChange={e => setNewInitiative(p => ({ ...p, notes: e.target.value }))}
                />
              </label>
              {addError && <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>{addError}</p>}
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => { setShowAddModal(false); setAddError(""); setNewInitiative(EMPTY_INITIATIVE); }} style={{ flex: 1, padding: "9px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button onClick={addInitiative} disabled={adding} style={{ flex: 1, padding: "9px", background: "#4f6df5", color: "white", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {adding ? "Adding…" : <><Plus size={14} /> Add initiative</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>Initiatives</h2>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            {initiatives.length} total · {filtered.length} shown
            {changedCount > 0 && <span style={{ color: "#f59e0b", fontWeight: 600 }}> · {changedCount} unsaved change{changedCount !== 1 ? "s" : ""}</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "white", border: "1.5px solid #e2e8f0", borderRadius: 10 }}>
            <Search size={15} style={{ color: "#94a3b8" }} />
            <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", fontSize: 14, width: 160 }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={14} /></button>}
          </div>
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{ padding: "9px 12px", border: typeFilter ? "1.5px solid #4f6df5" : "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: typeFilter ? 600 : 400, color: typeFilter ? "#4f6df5" : "#64748b", background: typeFilter ? "#f0f4ff" : "white", outline: "none", cursor: "pointer" }}
          >
            <option value="">All types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {/* Add button */}
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: "9px 16px", background: "#0f172a", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={15} /> Add
          </button>
          {/* Save button */}
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
                <th style={th}>Notes</th>
                <th style={{ ...th, paddingRight: 12 }}></th>
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
                  <td style={cell}><textarea style={{ ...inp, minWidth: 180, minHeight: 56, resize: "vertical" }} value={get(i, "notes") || ""} onChange={e => update(i.id, "notes", e.target.value)} /></td>
                  <td style={{ ...cell, paddingRight: 12 }}>
                    <button
                      onClick={() => setConfirmDelete(i)}
                      title="Delete"
                      style={{ padding: "6px 8px", background: "none", border: "1px solid #fecaca", borderRadius: 7, cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
