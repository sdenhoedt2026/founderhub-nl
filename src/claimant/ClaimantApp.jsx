import { useState } from "react";
import ClaimantLogin from "./ClaimantLogin.jsx";
import ClaimantDashboard from "./ClaimantDashboard.jsx";

export default function ClaimantApp() {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("claimant_session") || "null"); } catch { return null; }
  });

  function onLogin(s) {
    localStorage.setItem("claimant_session", JSON.stringify(s));
    setSession(s);
  }

  function onLogout() {
    localStorage.removeItem("claimant_session");
    setSession(null);
  }

  if (!session) return <ClaimantLogin onLogin={onLogin} />;
  return <ClaimantDashboard session={session} onLogout={onLogout} />;
}
