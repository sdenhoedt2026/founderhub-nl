import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

function statusBadge(status) {
  const styles = {
    pending:  { background: "#fef3c7", color: "#92400e" },
    approved: { background: "#d1fae5", color: "#065f46" },
    denied:   { background: "#fee2e2", color: "#991b1b" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{ ...s, padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>
      {status}
    </span>
  );
}

export default function AdminClaims({ token }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  useEffect(() => {
    fetch("/api/claims", { headers: { "x-admin-token": token } })
      .then(r => r.json())
      .then(data => { setClaims(data); setLoading(false); });
  }, []);

  async function act(claimId, action) {
    setActing(claimId + action);
    await fetch("/api/claim-approve", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ claim_id: claimId, action }),
    });
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: action === "approve" ? "approved" : "denied" } : c));
    setActing(null);
  }

  const pending = claims.filter(c => c.status === "pending");
  const done = claims.filter(c => c.status !== "pending");

  const th = { padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748b", borderBottom: "2px solid #e2e8f0" };
  const td = { padding: "12px", fontSize: 13, color: "#1e293b", borderBottom: "1px solid #f1f5f9", verticalAlign: "top" };

  function ClaimTable({ rows, showActions }) {
    return (
      <div style={{ overflowX: "auto", background: "white", borderRadius: 14, border: "1px solid #e8ecf2" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              <th style={th}>Initiative</th>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Org</th>
              <th style={th}>Reason</th>
              <th style={th}>Date</th>
              <th style={th}>Status</th>
              {showActions && <th style={th}></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map(c => (
              <tr key={c.id}>
                <td style={td}><strong>{c.initiative_name}</strong><br /><span style={{ color: "#94a3b8", fontSize: 11 }}>#{c.initiative_id}</span></td>
                <td style={td}>{c.claimant_name}</td>
                <td style={td}><a href={`mailto:${c.claimant_email}`} style={{ color: "#4f6df5" }}>{c.claimant_email}</a></td>
                <td style={td}>{c.claimant_org || "—"}</td>
                <td style={{ ...td, maxWidth: 200 }}><span style={{ fontSize: 12, color: "#475569" }}>{c.reason || "—"}</span></td>
                <td style={{ ...td, whiteSpace: "nowrap", color: "#64748b" }}>{new Date(c.created_at).toLocaleDateString("nl-NL")}</td>
                <td style={td}>{statusBadge(c.status)}</td>
                {showActions && (
                  <td style={td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => act(c.id, "approve")}
                        disabled={!!acting}
                        style={{ padding: "5px 10px", background: "#10b981", color: "white", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        onClick={() => act(c.id, "deny")}
                        disabled={!!acting}
                        style={{ padding: "5px 10px", background: "#ef4444", color: "white", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <X size={12} /> Deny
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={showActions ? 8 : 7} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: 32 }}>No claims</td></tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  if (loading) return <p style={{ color: "#64748b", fontSize: 14 }}>Loading…</p>;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Claim Requests</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>
        {pending.length} pending · {done.length} resolved
      </p>

      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 12 }}>Pending</h3>
      <ClaimTable rows={pending} showActions={true} />

      {done.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", margin: "32px 0 12px" }}>Resolved</h3>
          <ClaimTable rows={done} showActions={false} />
        </>
      )}
    </div>
  );
}
