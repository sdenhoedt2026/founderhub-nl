import { useState } from "react";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminClaims from "./AdminClaims.jsx";

export default function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || "");
  const [tab, setTab] = useState("initiatives");

  function onLogin(t) {
    localStorage.setItem("admin_token", t);
    setToken(t);
  }

  async function onLogout() {
    await fetch("/api/admin-logout", {
      method: "POST",
      headers: { "x-admin-token": token },
    });
    localStorage.removeItem("admin_token");
    setToken("");
  }

  if (!token) return <AdminLogin onLogin={onLogin} />;

  const navBtn = (label, id) => (
    <button
      onClick={() => setTab(id)}
      style={{
        background: "none", border: "none", cursor: "pointer", padding: "8px 4px",
        fontSize: 14, fontWeight: tab === id ? 600 : 400,
        color: tab === id ? "#4f6df5" : "#64748b",
        borderBottom: tab === id ? "2px solid #4f6df5" : "2px solid transparent",
      }}
    >{label}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #e8ecf2", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>🇳🇱 FounderHub NL</span>
            <span style={{ fontSize: 12, background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>Admin</span>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {navBtn("Initiatives", "initiatives")}
            {navBtn("Claims", "claims")}
            <button onClick={onLogout} style={{
              background: "none", border: "1px solid #e2e8f0", cursor: "pointer",
              padding: "6px 14px", borderRadius: 8, fontSize: 13, color: "#64748b",
            }}>Log out</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {tab === "initiatives" && <AdminDashboard token={token} />}
        {tab === "claims" && <AdminClaims token={token} />}
      </div>
    </div>
  );
}
