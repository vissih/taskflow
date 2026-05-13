import { useState } from "react";

import Icon from "../components/common/Icon.jsx";
import LandBg from "../components/layout/LandBg.jsx";

import { uid } from "../utils/helper.js";

export default function LandingPage({ users, onLogin, onSignup }) {
  const [mode, setMode] = useState(null); // null=hero, "login", "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [err, setErr] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    setErr("");
    if (mode === "login") {
      const u = users.find(x => x.email.toLowerCase() === form.email.toLowerCase());
      if (!u) { setErr("No account found with that email."); return; }
      onLogin(u);
    } else {
      if (!form.name.trim()) { setErr("Please enter your name."); return; }
      if (!form.email.trim()) { setErr("Please enter your email."); return; }
      if (users.find(x => x.email.toLowerCase() === form.email.toLowerCase())) { setErr("Email already registered."); return; }
      const initials = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
      const colors = ["#7bb56e","#c4a35a","#e07b6a","#7a9dc4","#a57ac4","#c4827a"];
      onSignup({ id: uid(), name: form.name, email: form.email, role: form.role, avatar: initials, color: colors[Math.floor(Math.random() * colors.length)] });
    }
  };

  const features = [
    { icon: "checklist",      label: "Smart Task Tracking" },
    { icon: "users",          label: "Team Collaboration" },
    { icon: "folder",         label: "Project Management" },
    { icon: "clock",          label: "Time Tracking" },
    { icon: "shield-check",   label: "Role-based Access" },
    { icon: "chart-bar",      label: "Progress Insights" },
  ];

  return (
    <div className="landing">
      <LandBg />
      {/* Nav */}
      <nav className="land-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 18, color: "var(--text)", zIndex: 10 }}>
          <div className="logo-icon">🌿</div> Taskflow
        </div>
        <div style={{ display: "flex", gap: 10, zIndex: 10 }}>
          {!mode && <>
            <button className="btn sm" onClick={() => setMode("login")}><Icon n="login" /> Sign In</button>
            <button className="btn primary sm" onClick={() => setMode("signup")}><Icon n="user-plus" /> Get Started</button>
          </>}
          {mode && <button className="btn sm" onClick={() => { setMode(null); setErr(""); }}><Icon n="arrow-left" /> Back</button>}
        </div>
      </nav>

      {/* Hero or Auth card */}
      {!mode ? (
        <>
          <div className="land-hero">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(163,220,154,0.3)", border: "1.5px solid rgba(163,220,154,0.5)", borderRadius: 99, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "var(--green-d)", marginBottom: 24, animation: "popIn .4s ease" }}>
              <span style={{ animation: "bounce 2s infinite" }}>🌱</span> Your cozy workspace for team work
            </div>
            <h1 className="land-title">Where great teams<br /><span>bloom together</span></h1>
            <p className="land-sub">Organize projects, track tasks, and collaborate seamlessly — all in one warm, delightful workspace designed for modern Indian teams.</p>
            <div className="land-ctas">
              <button className="btn primary" style={{ padding: "12px 28px", fontSize: 15 }} onClick={() => setMode("signup")}>
                <Icon n="seedling" /> Start for free
              </button>
              <button className="btn secondary" style={{ padding: "12px 28px", fontSize: 15 }} onClick={() => setMode("login")}>
                <Icon n="login" /> Sign in
              </button>
            </div>
            {/* Mini preview card */}
            <div style={{ marginTop: 48, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1.5px solid var(--border2)", borderRadius: "var(--r3)", padding: "20px 28px", display: "flex", gap: 32, boxShadow: "var(--shadow2)", animation: "slideUp .5s ease .2s both", flexWrap: "wrap", justifyContent: "center" }}>
              {[{ n: "12", l: "Projects", ico: "folder", c: "#A3DC9A" }, { n: "48", l: "Tasks Done", ico: "circle-check", c: "#DEE791" }, { n: "8", l: "Members", ico: "users", c: "#FFD6BA" }, { n: "99%", l: "Uptime", ico: "shield-check", c: "#FFF9BD" }].map(s => (
                <div key={s.l} style={{ textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.c, display: "grid", placeItems: "center", margin: "0 auto 8px", fontSize: 16 }}><Icon n={s.ico} /></div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="land-features">
            {features.map(f => (
              <div key={f.label} className="feat-chip">
                <Icon n={f.icon} style={{ fontSize: 16, color: "var(--green-d)" }} />
                {f.label}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="land-hero" style={{ paddingTop: 20 }}>
          <div className="land-card">
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div className="logo-icon" style={{ width: 44, height: 44, fontSize: 22, margin: "0 auto 12px", borderRadius: 14 }}>🌿</div>
              <div className="auth-title">{mode === "login" ? "Welcome back!" : "Join Taskflow"}</div>
              <div className="auth-sub">{mode === "login" ? "Sign in to your cozy workspace" : "Create your team workspace today"}</div>
            </div>
            {mode === "login" && (
              <div className="auth-demo">
                <strong style={{ color: "var(--green-d)" }}>🌸 Demo accounts:</strong><br />
                Admin: arjun@bloom.in &nbsp;|&nbsp; Members: priya@bloom.in, rohan@bloom.in, kavya@bloom.in<br />
                <em style={{ color: "var(--text3)" }}>(any password works)</em>
              </div>
            )}
            {mode === "signup" && <div className="fg"><label className="flbl">Full Name</label><input className="finput" value={form.name} onChange={set("name")} placeholder="Riya Sharma" /></div>}
            <div className="fg"><label className="flbl">Email</label><input className="finput" type="email" value={form.email} onChange={set("email")} placeholder="you@company.in" /></div>
            <div className="fg"><label className="flbl">Password</label><input className="finput" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" /></div>
            {mode === "signup" && (
              <div className="fg"><label className="flbl">Role</label>
                <select className="finput" value={form.role} onChange={set("role")}><option value="member">Member</option><option value="admin">Admin</option></select>
              </div>
            )}
            {err && <div style={{ color: "#c0522a", fontSize: 12, marginBottom: 14, padding: "9px 12px", background: "rgba(224,123,106,0.12)", borderRadius: 8, fontWeight: 600 }}>{err}</div>}
            <button className="btn primary" style={{ width: "100%", justifyContent: "center", padding: "11px" }} onClick={submit}>
              {mode === "login" ? <><Icon n="login" /> Sign In</> : <><Icon n="seedling" /> Create Account</>}
            </button>
            <div className="auth-toggle">
              {mode === "login" ? <>Don't have an account? <span onClick={() => { setMode("signup"); setErr(""); }}>Sign up free</span></> : <>Already have an account? <span onClick={() => { setMode("login"); setErr(""); }}>Sign in</span></>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
