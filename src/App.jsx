import { useState, useEffect, useRef, useCallback } from "react";
import {
  SEED_USERS,
  SEED_PROJECTS,
  SEED_TASKS
} from "./data/seedData.js";
import {
  uid,
  nowISO,
  fmtDate,
  fmtTime,
  fmtDateTime,
  isOverdue,
  daysLeft
} from "./utils/helper.js";
import Icon from "./components/common/Icon";
import Av from "./components/common/Avatar";
import Modal from "./components/common/Modal";
import DueChip from "./components/common/DueChip";

import {
  SBadge,
  PBadge
} from "./components/common/Badges";

// ── Helpers ────────────────────────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = uid();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return { toasts, add };
}
const SLBL = { todo: "To Do", "in-progress": "In Progress", done: "Done" };
const PLBL = { high: "High", medium: "Medium", low: "Low" };

// ── Landing background blobs ───────────────────────────────────────────────
function LandBg() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: "rgba(163,220,154,0.22)", filter: "blur(70px)", top: -120, left: -80, animation: "floatY 7s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,249,189,0.35)", filter: "blur(60px)", top: 100, right: -60, animation: "floatY2 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(255,214,186,0.28)", filter: "blur(60px)", bottom: -80, left: "30%", animation: "floatY 11s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(222,231,145,0.3)", filter: "blur(40px)", bottom: 100, right: 100, animation: "floatY2 8s ease-in-out infinite" }} />
      {/* Floating emojis */}
      {[
        { e: "🌸", t: "12%", l: "8%",  d: "0s",  size: 28 },
        { e: "🌿", t: "20%", r: "10%", d: "1s",  size: 24 },
        { e: "✨", t: "65%", l: "5%",  d: "2s",  size: 22 },
        { e: "🍃", t: "40%", r: "7%",  d: "0.5s",size: 26 },
        { e: "🌻", t: "78%", l: "15%", d: "1.5s",size: 24 },
        { e: "☁️",  t: "8%",  r: "25%", d: "2.5s",size: 30 },
      ].map((x, i) => (
        <div key={i} style={{ position: "absolute", top: x.t, left: x.l, right: x.r, fontSize: x.size, opacity: .55, animation: `floatY ${4 + i * 0.7}s ease-in-out infinite`, animationDelay: x.d, pointerEvents: "none" }}>{x.e}</div>
      ))}
    </div>
  );
}

// ── Auth / Landing ─────────────────────────────────────────────────────────
function LandingPage({ users, onLogin, onSignup }) {
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

// ── Task Modal ─────────────────────────────────────────────────────────────
function TaskModal({ task, projects, users, onSave, onDelete, onClose, currentUser }) {
  const isNew = !task.id;
  const [form, setForm] = useState({ title: "", desc: "", projectId: projects[0]?.id || "", assigneeId: "", status: "todo", priority: "medium", due: "", timeEstimate: "", timeLogged: "", ...task });
  const [comment, setComment] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const save = () => {
    if (!form.title.trim()) return;
    onSave({ ...form, id: form.id || uid(), createdBy: form.createdBy || currentUser.id, createdAt: form.createdAt || nowISO(), comments: form.comments || [] });
  };

  const addComment = () => {
    if (!comment.trim()) return;
    const c = { id: uid(), userId: currentUser.id, text: comment.trim(), at: nowISO() };
    setForm(f => ({ ...f, comments: [...(f.comments || []), c] }));
    setComment("");
  };

  const timePercent = form.timeEstimate > 0 ? Math.min(100, Math.round((form.timeLogged / form.timeEstimate) * 100)) : 0;

  return (
    <Modal onClose={onClose} wide>
      <div className="modal-title">
        <Icon n={isNew ? "plus-circle" : "pencil"} style={{ color: "var(--green-d)", fontSize: 20 }} />
        {isNew ? "New Task" : "Edit Task"}
      </div>
      <div className="fg"><label className="flbl">Title *</label><input className="finput" value={form.title} onChange={set("title")} placeholder="What needs to be done?" /></div>
      <div className="fg"><label className="flbl">Description</label><textarea className="finput" value={form.desc} onChange={set("desc")} placeholder="Add more details…" /></div>
      <div className="frow">
        <div className="fg"><label className="flbl">Project</label>
          <select className="finput" value={form.projectId} onChange={set("projectId")}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="fg"><label className="flbl">Assignee</label>
          <select className="finput" value={form.assigneeId} onChange={set("assigneeId")}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>
      <div className="frow">
        <div className="fg"><label className="flbl">Status</label>
          <select className="finput" value={form.status} onChange={set("status")}>
            <option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option>
          </select>
        </div>
        <div className="fg"><label className="flbl">Priority</label>
          <select className="finput" value={form.priority} onChange={set("priority")}>
            <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
        </div>
      </div>
      <div className="fg"><label className="flbl"><Icon n="calendar" style={{ fontSize: 13, verticalAlign: -2 }} /> Due Date & Time</label>
        <input className="finput" type="datetime-local" value={form.due} onChange={set("due")} />
      </div>
      <div className="frow">
        <div className="fg"><label className="flbl"><Icon n="hourglass" style={{ fontSize: 13, verticalAlign: -2 }} /> Estimated Hours</label>
          <input className="finput" type="number" min="0" step="0.5" value={form.timeEstimate} onChange={set("timeEstimate")} placeholder="e.g. 4" />
        </div>
        <div className="fg"><label className="flbl"><Icon n="clock" style={{ fontSize: 13, verticalAlign: -2 }} /> Logged Hours</label>
          <input className="finput" type="number" min="0" step="0.5" value={form.timeLogged} onChange={set("timeLogged")} placeholder="e.g. 1.5" />
        </div>
      </div>
      {(form.timeEstimate > 0) && (
        <div style={{ marginBottom: 16, padding: "10px 12px", background: "var(--bg2)", borderRadius: "var(--r)", border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--text2)" }}>
            <span><Icon n="clock" style={{ fontSize: 12 }} /> Time Progress</span>
            <span style={{ fontWeight: 700, color: timePercent >= 100 ? "#c0522a" : "var(--green-d)" }}>{timePercent}%</span>
          </div>
          <div className="progress"><div className="progress-fill" style={{ width: `${timePercent}%`, background: timePercent >= 100 ? "#e07b6a" : "var(--green-d)" }} /></div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{form.timeLogged || 0}h logged of {form.timeEstimate}h estimated</div>
        </div>
      )}

      {!isNew && (
        <>
          <div className="sep" />
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon n="message-circle" style={{ color: "var(--peach-d)", fontSize: 16 }} />
            Comments ({(form.comments || []).length})
          </div>
          {(form.comments || []).map(c => {
            const u = users.find(x => x.id === c.userId);
            return <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <Av user={u} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 3 }}><strong style={{ color: "var(--text)" }}>{u?.name}</strong> · {fmtDateTime(c.at)}</div>
                <div style={{ fontSize: 13, color: "var(--text)", background: "var(--bg2)", borderRadius: 10, padding: "8px 12px", border: "1px solid var(--border)" }}>{c.text}</div>
              </div>
            </div>;
          })}
          <div style={{ display: "flex", gap: 8 }}>
            <input className="finput" value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment…" onKeyDown={e => e.key === "Enter" && addComment()} style={{ flex: 1 }} />
            <button className="btn primary sm" onClick={addComment}><Icon n="send" /></button>
          </div>
        </>
      )}

      <div className="modal-footer">
        {!isNew && (currentUser.role === "admin" || task.createdBy === currentUser.id) &&
          <button className="btn danger sm" onClick={() => { onDelete(form.id); onClose(); }}><Icon n="trash" />Delete</button>}
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm" onClick={save}><Icon n="check" />{isNew ? "Create Task" : "Save"}</button>
      </div>
    </Modal>
  );
}

// ── Project Modal ──────────────────────────────────────────────────────────
function ProjectModal({ project, users, onSave, onDelete, onClose, currentUser }) {
  const isNew = !project.id;
  const COLORS = ["#A3DC9A","#DEE791","#FFF9BD","#FFD6BA","#c4e8a0","#f0c8a8","#a8d4e8","#e8a8c4"];
  const [form, setForm] = useState({ name: "", description: "", color: COLORS[0], ownerId: currentUser.id, members: [currentUser.id], deadline: "", ...project });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const toggleMember = id => setForm(f => ({ ...f, members: f.members.includes(id) ? f.members.filter(x => x !== id) : [...f.members, id] }));
  const save = () => { if (!form.name.trim()) return; onSave({ ...form, id: form.id || uid(), createdAt: form.createdAt || nowISO() }); };

  return (
    <Modal onClose={onClose}>
      <div className="modal-title"><Icon n="folder-plus" style={{ color: "var(--green-d)", fontSize: 20 }} />{isNew ? "New Project" : "Edit Project"}</div>
      <div className="fg"><label className="flbl">Project Name *</label><input className="finput" value={form.name} onChange={set("name")} placeholder="e.g. Diwali Campaign 2025" /></div>
      <div className="fg"><label className="flbl">Description</label><textarea className="finput" value={form.description} onChange={set("description")} placeholder="What's this project about?" /></div>
      <div className="fg"><label className="flbl"><Icon n="calendar" style={{ fontSize: 13, verticalAlign: -2 }} /> Project Deadline</label>
        <input className="finput" type="date" value={form.deadline} onChange={set("deadline")} />
      </div>
      <div className="fg">
        <label className="flbl">Project Color</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COLORS.map(c => <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: form.color === c ? "3px solid var(--text)" : "3px solid transparent", transition: "transform .15s, border .15s", transform: form.color === c ? "scale(1.2)" : "scale(1)", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }} />)}
        </div>
      </div>
      <div className="fg">
        <label className="flbl">Team Members</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {users.map(u => <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "8px 12px", borderRadius: 10, background: form.members.includes(u.id) ? "rgba(163,220,154,0.2)" : "var(--bg2)", border: `1.5px solid ${form.members.includes(u.id) ? "rgba(163,220,154,0.5)" : "var(--border)"}`, transition: "all .15s" }}>
            <input type="checkbox" checked={form.members.includes(u.id)} onChange={() => toggleMember(u.id)} style={{ accentColor: "var(--green-d)" }} />
            <Av user={u} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{u.name}</span>
            <span className={`badge role-${u.role}`} style={{ marginLeft: "auto" }}>{u.role}</span>
          </label>)}
        </div>
      </div>
      <div className="modal-footer">
        {!isNew && currentUser.role === "admin" &&
          <button className="btn danger sm" onClick={() => { onDelete(form.id); onClose(); }}><Icon n="trash" />Delete</button>}
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm" onClick={save}><Icon n="check" />{isNew ? "Create" : "Save"}</button>
      </div>
    </Modal>
  );
}

// ── Member Modal ───────────────────────────────────────────────────────────
function MemberModal({ onSave, onClose, currentUser }) {
  const [form, setForm] = useState({ name: "", email: "", role: "member", department: "", bio: "" });
  const COLORS = ["#7bb56e","#c4a35a","#e07b6a","#7a9dc4","#a57ac4","#c4827a"];
  const save = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const ini = form.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
    onSave({ ...form, id: uid(), avatar: ini, color: COLORS[Math.floor(Math.random()*COLORS.length)] });
  };
  return (
    <Modal onClose={onClose}>
      <div className="modal-title"><Icon n="user-plus" style={{ color: "var(--green-d)", fontSize: 20 }} />Invite Member</div>
      <div className="fg"><label className="flbl">Full Name *</label><input className="finput" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="Ananya Iyer" /></div>
      <div className="fg"><label className="flbl">Email *</label><input className="finput" type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} placeholder="ananya@company.in" /></div>
      <div className="frow">
        <div className="fg"><label className="flbl">Role</label>
          <select className="finput" value={form.role} onChange={e => setForm(f=>({...f,role:e.target.value}))}>
            <option value="member">Member</option>
            {currentUser.role === "admin" && <option value="admin">Admin</option>}
          </select>
        </div>
        <div className="fg"><label className="flbl">Department</label><input className="finput" value={form.department} onChange={e => setForm(f=>({...f,department:e.target.value}))} placeholder="Design, Dev…" /></div>
      </div>
      <div className="fg"><label className="flbl">Short Bio</label><input className="finput" value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} placeholder="What do they do?" /></div>
      <div className="modal-footer">
        <button className="btn sm" onClick={onClose}>Cancel</button>
        <button className="btn primary sm" onClick={save}><Icon n="check" />Send Invite</button>
      </div>
    </Modal>
  );
}

// ── Permissions modal ──────────────────────────────────────────────────────
function PermsModal({ onClose }) {
  const perms = {
    Admin: [
      ["Create & delete projects", true], ["Edit any project", true], ["Invite & remove members", true],
      ["Change member roles", true], ["Create tasks in any project", true], ["Edit any task", true],
      ["Delete any task", true], ["Log time on any task", true], ["View all activity", true],
    ],
    Member: [
      ["Create & delete projects", false], ["Edit assigned projects", true], ["Invite members", false],
      ["Change member roles", false], ["Create tasks in joined projects", true], ["Edit own/assigned tasks", true],
      ["Delete own tasks", true], ["Log time on assigned tasks", true], ["View team activity", true],
    ],
  };
  return (
    <Modal onClose={onClose}>
      <div className="modal-title"><Icon n="shield-check" style={{ color: "var(--green-d)", fontSize: 20 }} />Role Permissions</div>
      <div className="perm-grid">
        {Object.entries(perms).map(([role, items]) => (
          <div key={role} className="perm-card">
            <div className="perm-title">
              <span className={`badge role-${role.toLowerCase()}`}>{role}</span>
            </div>
            {items.map(([label, allowed]) => (
              <div key={label} className={`perm-item ${allowed ? "yes" : "no"}`}>
                <Icon n={allowed ? "circle-check" : "circle-x"} style={{ fontSize: 13 }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="modal-footer"><button className="btn primary sm" onClick={onClose}>Got it</button></div>
    </Modal>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────
function Dashboard({ tasks, projects, users, currentUser, onNewTask, onSelectTask }) {
  const myTasks  = tasks.filter(t => t.assigneeId === currentUser.id);
  const overdue  = tasks.filter(t => isOverdue(t.due) && t.status !== "done");
  const done     = tasks.filter(t => t.status === "done");
  const inprog   = tasks.filter(t => t.status === "in-progress");
  const recent   = [...tasks].sort((a,b) => new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  const totalEst = tasks.reduce((s,t) => s + (+t.timeEstimate||0), 0);
  const totalLog = tasks.reduce((s,t) => s + (+t.timeLogged||0), 0);

  const greet = () => { const h = new Date().getHours(); if (h<12) return "Good morning"; if (h<17) return "Good afternoon"; return "Good evening"; };

  return (
    <div className="page">
      <div className="ph">
        <div>
          <div className="pt">{greet()}, {currentUser.name.split(" ")[0]} 🌸</div>
          <div className="pd">{new Date().toLocaleDateString("en-IN", { weekday:"long", month:"long", day:"numeric" })}</div>
        </div>
        <button className="btn primary" onClick={onNewTask}><Icon n="plus" />New Task</button>
      </div>

      <div className="stat-grid">
        {[
          { label:"Total Tasks",  val:tasks.length,   sub:`${inprog.length} in progress`,      cls:"c-green",  icon:"checklist" },
          { label:"My Tasks",     val:myTasks.length, sub:`${myTasks.filter(t=>t.status!=="done").length} pending`, cls:"c-yellow", icon:"user" },
          { label:"Completed",    val:done.length,    sub:`${Math.round(done.length/Math.max(tasks.length,1)*100)}% complete`, cls:"c-cream", icon:"circle-check" },
          { label:"Overdue",      val:overdue.length, sub:"needs attention",                   cls:"c-peach",  icon:"alert-triangle" },
        ].map((s,i) => (
          <div key={s.label} className={`stat-card ${s.cls} ai s${i+1}`}>
            <div className="stat-lbl">{s.label}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
            <Icon n={s.icon} className="stat-ico" />
          </div>
        ))}
      </div>

      {/* Time summary bar */}
      {totalEst > 0 && (
        <div className="card ai s2" style={{ marginBottom: 20, padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Icon n="clock" style={{ fontSize: 18, color: "var(--peach-d)" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text2)", marginBottom: 5 }}>
                <span style={{ fontWeight: 700 }}>Team Time Progress</span>
                <span><strong style={{ color: "var(--text)" }}>{totalLog}h</strong> of {totalEst}h logged</span>
              </div>
              <div className="progress"><div className="progress-fill" style={{ width: `${Math.min(100, Math.round(totalLog/totalEst*100))}%`, background: "var(--peach-d)" }} /></div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card ai s2">
          <div className="sh"><div><div className="st">Recent Tasks</div><div className="ss">Latest activity across all projects</div></div></div>
          {recent.map(t => {
            const assignee = users.find(u=>u.id===t.assigneeId);
            const project  = projects.find(p=>p.id===t.projectId);
            return (
              <div key={t.id} onClick={() => onSelectTask(t)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--bg2)", borderRadius:10, cursor:"pointer", marginBottom:8, border:"1px solid var(--border)", transition:"all .15s" }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--bg2)"}>
                <span className={`prio-dot ${t.priority}`} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>
                  <div style={{ fontSize:11, color:"var(--text3)" }}>{project?.name}</div>
                </div>
                <SBadge s={t.status} />
                {assignee && <Av user={assignee} />}
              </div>
            );
          })}
        </div>

        <div className="card ai s3">
          <div className="sh"><div><div className="st">Projects</div><div className="ss">{projects.length} active</div></div></div>
          {projects.map(p => {
            const pts  = tasks.filter(t=>t.projectId===p.id);
            const done = pts.filter(t=>t.status==="done").length;
            const pct  = pts.length ? Math.round(done/pts.length*100) : 0;
            return (
              <div key={p.id} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:p.color, boxShadow:`0 0 0 3px ${p.color}40` }} />
                  <span style={{ fontSize:13, fontWeight:700, flex:1 }}>{p.name}</span>
                  <span style={{ fontSize:12, color:"var(--text3)", fontWeight:600 }}>{done}/{pts.length}</span>
                </div>
                <div className="progress"><div className="progress-fill" style={{ width:`${pct}%`, background:p.color==="var(--green)"||p.color==="#A3DC9A"?"var(--green-d)":p.color }} /></div>
              </div>
            );
          })}
          <div className="sep" />
          <div className="st" style={{ fontSize:13, marginBottom:12 }}>Team</div>
          {users.map(u => {
            const ut = tasks.filter(t=>t.assigneeId===u.id);
            const dn = ut.filter(t=>t.status==="done").length;
            return (
              <div key={u.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <Av user={u} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700 }}>{u.name}</div>
                  <div style={{ fontSize:11, color:"var(--text3)" }}>{ut.length} tasks · {dn} done{u.department ? ` · ${u.department}` : ""}</div>
                </div>
                <span className={`badge role-${u.role}`}>{u.role}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Tasks Page ─────────────────────────────────────────────────────────────
function TasksPage({ tasks, projects, users, currentUser, onNew, onSelect, onStatusChange }) {
  const [view, setView]     = useState("list");
  const [fProj, setFProj]   = useState("all");
  const [fStat, setFStat]   = useState("all");
  const [fPrio, setFPrio]   = useState("all");
  const [fUser, setFUser]   = useState("all");
  const [search, setSearch] = useState("");

  const vis = tasks.filter(t => {
    if (fProj !== "all" && t.projectId !== fProj) return false;
    if (fStat !== "all" && t.status !== fStat) return false;
    if (fPrio !== "all" && t.priority !== fPrio) return false;
    if (fUser !== "all" && t.assigneeId !== fUser) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const canEdit = t => currentUser.role === "admin" || t.createdBy === currentUser.id || t.assigneeId === currentUser.id;
  const canCreate = p => currentUser.role === "admin" || (p && p.members.includes(currentUser.id));

  return (
    <div className="page">
      <div className="ph">
        <div><div className="pt">Tasks</div><div className="pd">{vis.length} of {tasks.length} shown</div></div>
        <div style={{ display:"flex", gap:8 }}>
          <div className="tabs" style={{ marginBottom:0 }}>
            <div className={`tab ${view==="list"?"active":""}`} onClick={()=>setView("list")}><Icon n="list" style={{ fontSize:14 }} /> List</div>
            <div className={`tab ${view==="kanban"?"active":""}`} onClick={()=>setView("kanban")}><Icon n="layout-kanban" style={{ fontSize:14 }} /> Kanban</div>
          </div>
          <button className="btn primary" onClick={onNew}><Icon n="plus" />New Task</button>
        </div>
      </div>

      <div className="fstrip">
        <div style={{ position:"relative" }}>
          <Icon n="search" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"var(--text3)" }} />
          <input className="finput" style={{ paddingLeft:30, width:180, borderRadius:99 }} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" />
        </div>
        {[
          { val:fProj, set:setFProj, opts:[["all","All Projects"],...projects.map(p=>[p.id,p.name])], w:160 },
          { val:fStat, set:setFStat, opts:[["all","All Statuses"],["todo","To Do"],["in-progress","In Progress"],["done","Done"]], w:150 },
          { val:fPrio, set:setFPrio, opts:[["all","All Priorities"],["high","High"],["medium","Medium"],["low","Low"]], w:150 },
          { val:fUser, set:setFUser, opts:[["all","All Members"],...users.map(u=>[u.id,u.name])], w:150 },
        ].map((f,i) => (
          <select key={i} className="finput" style={{ width:f.w, borderRadius:99 }} value={f.val} onChange={e=>f.set(e.target.value)}>
            {f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        ))}
      </div>

      {view === "list" ? (
        <div className="tbl-wrap ai">
          <table>
            <thead><tr><th>Task</th><th>Project</th><th>Assignee</th><th>Status</th><th>Priority</th><th>Due</th><th>Time</th><th></th></tr></thead>
            <tbody>
              {vis.length === 0 && <tr><td colSpan={8}><div className="empty"><Icon n="leaf" /><p>No tasks match your filters 🌿</p></div></td></tr>}
              {vis.map(t => {
                const assignee = users.find(u=>u.id===t.assigneeId);
                const project  = projects.find(p=>p.id===t.projectId);
                const d = daysLeft(t.due);
                const te = +t.timeEstimate||0, tl = +t.timeLogged||0;
                return (
                  <tr key={t.id} onClick={()=>canEdit(t)&&onSelect(t)} style={{ cursor: canEdit(t)?"pointer":"default" }}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span className={`prio-dot ${t.priority}`} />
                        <div>
                          <div style={{ fontWeight:700 }}>{t.title}</div>
                          {t.desc && <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>{t.desc.slice(0,55)}{t.desc.length>55?"…":""}</div>}
                        </div>
                      </div>
                    </td>
                    <td>{project && <div style={{ display:"flex", alignItems:"center", gap:6 }}><div style={{ width:8, height:8, borderRadius:"50%", background:project.color }} />{project.name}</div>}</td>
                    <td>{assignee ? <div style={{ display:"flex", alignItems:"center", gap:7 }}><Av user={assignee} /><span style={{ fontSize:12, fontWeight:600 }}>{assignee.name.split(" ")[0]}</span></div> : <span style={{ color:"var(--text3)" }}>—</span>}</td>
                    <td><SBadge s={t.status} /></td>
                    <td><PBadge p={t.priority} /></td>
                    <td>
                      {t.due ? <span style={{ fontSize:12, fontWeight:600, color: d<0?"#c0522a":d<=3?"#c08030":"var(--text3)" }}>
                        {d<0 ? "⚠ " : ""}{fmtDate(t.due)}{t.due.includes("T")&&<div style={{ fontSize:10, color:"var(--text3)" }}>{fmtTime(t.due)}</div>}
                      </span> : <span style={{ color:"var(--text3)" }}>—</span>}
                    </td>
                    <td>
                      {te > 0 && <div>
                        <span className={`time-chip ${tl>te?"over":""}`}>{tl}/{te}h</span>
                        <div className="progress" style={{ marginTop:4, width:60 }}><div className="progress-fill" style={{ width:`${Math.min(100,Math.round(tl/te*100))}%`, background: tl>te?"#e07b6a":"var(--green-d)" }} /></div>
                      </div>}
                    </td>
                    <td>
                      {canEdit(t) && (
                        <select className="finput" style={{ fontSize:12, padding:"4px 8px", width:"auto", borderRadius:99 }} value={t.status} onClick={e=>e.stopPropagation()} onChange={e=>{e.stopPropagation();onStatusChange(t.id,e.target.value);}}>
                          <option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="kanban ai">
          {["todo","in-progress","done"].map(status => {
            const col = vis.filter(t=>t.status===status);
            const colors = { todo:"var(--text3)", "in-progress":"#b8a020", done:"var(--green-d)" };
            const bgs    = { todo:"var(--bg3)", "in-progress":"rgba(222,231,145,0.25)", done:"rgba(163,220,154,0.2)" };
            return (
              <div key={status} className="kanban-col" style={{ background: bgs[status] }}>
                <div className="kanban-hdr">
                  <div style={{ width:9, height:9, borderRadius:"50%", background:colors[status] }} />
                  <div className="kanban-title">{SLBL[status]}</div>
                  <div className="kanban-cnt">{col.length}</div>
                </div>
                {col.length===0 && <div style={{ color:"var(--text3)", fontSize:12, textAlign:"center", padding:20 }}>No tasks here 🌿</div>}
                {col.map(t => {
                  const assignee = users.find(u=>u.id===t.assigneeId);
                  const project  = projects.find(p=>p.id===t.projectId);
                  return (
                    <div key={t.id} className="task-card" onClick={()=>canEdit(t)&&onSelect(t)}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                        <span className={`prio-dot ${t.priority}`} style={{ marginTop:5 }} />
                        <div className="task-title">{t.title}</div>
                      </div>
                      {project && <div style={{ fontSize:11, color:"var(--text3)", marginBottom:8, display:"flex", alignItems:"center", gap:4 }}>
                        <div style={{ width:6, height:6, borderRadius:"50%", background:project.color }} />{project.name}
                      </div>}
                      <div className="task-meta">
                        <PBadge p={t.priority} />
                        {t.due && <DueChip due={t.due} />}
                        {t.timeEstimate > 0 && <span className="time-chip">{+t.timeLogged||0}/{+t.timeEstimate}h</span>}
                        {assignee && <div style={{ marginLeft:"auto" }}><Av user={assignee} /></div>}
                      </div>
                    </div>
                  );
                })}
                <button className="btn sm" style={{ width:"100%", justifyContent:"center", marginTop:8, borderStyle:"dashed", borderRadius:99 }} onClick={onNew}>
                  <Icon n="plus" />Add Task
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Projects Page ──────────────────────────────────────────────────────────
function ProjectsPage({ projects, tasks, users, currentUser, onNew, onEdit }) {
  const totalTasks = tasks.length;
  return (
    <div className="page">
      <div className="ph">
        <div><div className="pt">Projects</div><div className="pd">{projects.length} active projects · {totalTasks} tasks</div></div>
        {currentUser.role === "admin" && <button className="btn primary" onClick={onNew}><Icon n="folder-plus" />New Project</button>}
      </div>
      {projects.length === 0 && <div className="empty"><Icon n="folder" /><p>No projects yet. Create your first one! 🌱</p></div>}
      <div className="proj-grid">
        {projects.map((p, i) => {
          const pts   = tasks.filter(t=>t.projectId===p.id);
          const done  = pts.filter(t=>t.status==="done").length;
          const inp   = pts.filter(t=>t.status==="in-progress").length;
          const pct   = pts.length ? Math.round(done/pts.length*100) : 0;
          const mems  = users.filter(u=>p.members.includes(u.id));
          const canEd = currentUser.role==="admin" || p.ownerId===currentUser.id;
          const overT = pts.filter(t=>isOverdue(t.due)&&t.status!=="done").length;
          const te    = pts.reduce((s,t)=>s+(+t.timeEstimate||0),0);
          const tl    = pts.reduce((s,t)=>s+(+t.timeLogged||0),0);
          return (
            <div key={p.id} className={`proj-card ai s${Math.min(i+1,4)}`} style={{ background:`linear-gradient(135deg, ${p.color}25, ${p.color}08)`, cursor:canEd?"pointer":"default" }} onClick={()=>canEd&&onEdit(p)}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:14, background:p.color+"50", display:"grid", placeItems:"center", fontSize:20, boxShadow:`0 2px 10px ${p.color}60` }}>
                  🗂
                </div>
                {canEd && <button className="btn xs icon" onClick={e=>{e.stopPropagation();onEdit(p);}} style={{ borderRadius:99 }}><Icon n="pencil" style={{ fontSize:13 }} /></button>}
              </div>
              <div className="proj-name">{p.name}</div>
              <div className="proj-desc">{p.description}</div>
              {p.deadline && <div style={{ fontSize:12, color:"var(--text2)", marginBottom:8, display:"flex", alignItems:"center", gap:5 }}><Icon n="calendar" style={{ fontSize:13 }} />Deadline: {fmtDate(p.deadline)}</div>}
              <div style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--text2)", marginBottom:5, fontWeight:600 }}>
                  <span>Progress</span><span>{pct}%</span>
                </div>
                <div className="progress" style={{ height:7 }}><div className="progress-fill" style={{ width:`${pct}%`, background:p.color==="var(--green)"||p.color==="#A3DC9A"?"var(--green-d)":p.color }} /></div>
              </div>
              {te > 0 && <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:"var(--text3)", marginBottom:4, fontWeight:600 }}>TIME: {tl}h / {te}h</div>
                <div className="progress"><div className="progress-fill" style={{ width:`${Math.min(100,Math.round(tl/te*100))}%`, background:"var(--peach-d)", height:4 }} /></div>
              </div>}
              <div className="proj-foot">
                <div className="av-stack">{mems.slice(0,4).map(u=><Av key={u.id} user={u} />)}{mems.length>4&&<div className="av" style={{ background:"var(--bg3)", color:"var(--text3)", fontSize:10 }}>+{mems.length-4}</div>}</div>
                <div style={{ display:"flex", gap:10, fontSize:12, color:"var(--text2)", fontWeight:600 }}>
                  <span title="Tasks">📋 {pts.length}</span>
                  <span title="In Progress" style={{ color:"#b8a020" }}>⏳ {inp}</span>
                  <span title="Done" style={{ color:"var(--green-d)" }}>✅ {done}</span>
                  {overT > 0 && <span title="Overdue" style={{ color:"#c0522a" }}>⚠️ {overT}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Members Page ───────────────────────────────────────────────────────────
function MembersPage({ users, tasks, projects, currentUser, onInvite, onRemove, onShowPerms }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="page">
      <div className="ph">
        <div><div className="pt">Team Members</div><div className="pd">{users.length} members · {users.filter(u=>u.role==="admin").length} admin{users.filter(u=>u.role==="admin").length!==1?"s":""}</div></div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn sm" onClick={onShowPerms}><Icon n="shield-check" />Permissions</button>
          {currentUser.role==="admin" && <button className="btn primary" onClick={onInvite}><Icon n="user-plus" />Invite</button>}
        </div>
      </div>

      <div className="mem-grid">
        {users.map((u, i) => {
          const ut   = tasks.filter(t=>t.assigneeId===u.id);
          const done = ut.filter(t=>t.status==="done").length;
          const inp  = ut.filter(t=>t.status==="in-progress").length;
          const pct  = ut.length ? Math.round(done/ut.length*100) : 0;
          const myProjs = projects.filter(p=>p.members.includes(u.id));
          const te   = ut.reduce((s,t)=>s+(+t.timeEstimate||0),0);
          const tl   = ut.reduce((s,t)=>s+(+t.timeLogged||0),0);
          return (
            <div key={u.id} className={`mem-card ai s${Math.min(i+1,4)}`} onClick={()=>setSelected(selected?.id===u.id?null:u)} style={{ cursor:"pointer", border: selected?.id===u.id ? "1.5px solid var(--green-d)" : "" }}>
              <Av user={u} size="xl" />
              <div>
                <div className="mem-name">{u.name}</div>
                <div className="mem-email">{u.email}</div>
                {u.department && <div style={{ fontSize:11, color:"var(--text3)", marginTop:2 }}>🏢 {u.department}</div>}
              </div>
              <span className={`badge role-${u.role}`}>{u.role}</span>
              {u.bio && <div style={{ fontSize:12, color:"var(--text2)", fontStyle:"italic" }}>"{u.bio}"</div>}

              <div style={{ display:"flex", gap:14, fontSize:12, color:"var(--text2)" }}>
                <span title="Total">📋 {ut.length}</span>
                <span title="In Progress" style={{ color:"#b8a020" }}>⏳ {inp}</span>
                <span title="Done" style={{ color:"var(--green-d)" }}>✅ {done}</span>
              </div>
              <div style={{ width:"100%" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text3)", marginBottom:4, fontWeight:700 }}>
                  <span>Task completion</span><span>{pct}%</span>
                </div>
                <div className="progress"><div className="progress-fill" style={{ width:`${pct}%`, background:u.color }} /></div>
              </div>
              {te > 0 && <div style={{ width:"100%", fontSize:11, color:"var(--text3)", fontWeight:600 }}>
                ⏱ {tl}h logged / {te}h est.
              </div>}
              <div style={{ fontSize:11, color:"var(--text3)" }}>
                {myProjs.map(p=><span key={p.id} style={{ display:"inline-flex", alignItems:"center", gap:3, marginRight:6 }}><div style={{ width:6,height:6,borderRadius:"50%",background:p.color }} />{p.name}</span>)}
              </div>
              {currentUser.role==="admin" && u.id!==currentUser.id && (
                <button className="btn danger xs" onClick={e=>{e.stopPropagation();onRemove(u.id);}}><Icon n="user-minus" style={{ fontSize:12 }} />Remove</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Settings Page ──────────────────────────────────────────────────────────
function SettingsPage({ currentUser, onUpdateUser, onLogout, users }) {
  const [form, setForm] = useState({ name: currentUser.name, email: currentUser.email, department: currentUser.department||"", bio: currentUser.bio||"" });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  return (
    <div className="page" style={{ maxWidth:640 }}>
      <div className="ph"><div><div className="pt">Settings</div><div className="pd">Manage your account</div></div></div>
      <div className="card ai" style={{ marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:800, marginBottom:16 }}>Your Profile</div>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <Av user={currentUser} size="xl" />
          <div>
            <div style={{ fontWeight:800, fontSize:16 }}>{currentUser.name}</div>
            <div style={{ fontSize:12, color:"var(--text3)" }}>{currentUser.email}</div>
            <span className={`badge role-${currentUser.role}`} style={{ marginTop:6, display:"inline-block" }}>{currentUser.role}</span>
          </div>
        </div>
        <div className="frow">
          <div className="fg"><label className="flbl">Full Name</label><input className="finput" value={form.name} onChange={set("name")} /></div>
          <div className="fg"><label className="flbl">Email</label><input className="finput" value={form.email} onChange={set("email")} /></div>
        </div>
        <div className="frow">
          <div className="fg"><label className="flbl">Department</label><input className="finput" value={form.department} onChange={set("department")} placeholder="Design, Engineering…" /></div>
          <div className="fg"><label className="flbl">Short Bio</label><input className="finput" value={form.bio} onChange={set("bio")} placeholder="What do you do?" /></div>
        </div>
        <button className="btn primary sm" onClick={()=>onUpdateUser(form)}><Icon n="check" />Save Changes</button>
      </div>
      <div className="card ai s1" style={{ marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:800, marginBottom:4 }}>Workspace Stats</div>
        <div style={{ fontSize:12, color:"var(--text3)", marginBottom:14 }}>Your contributions at a glance</div>
        <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
          {[
            { l:"Members", v:users.length, e:"👥" },
            { l:"Your Role", v:currentUser.role, e:"🎖" },
          ].map(s=><div key={s.l} style={{ background:"var(--bg2)", border:"1.5px solid var(--border)", borderRadius:12, padding:"12px 16px", textAlign:"center" }}>
            <div style={{ fontSize:20 }}>{s.e}</div>
            <div style={{ fontSize:18, fontWeight:800 }}>{s.v}</div>
            <div style={{ fontSize:11, color:"var(--text3)", fontWeight:700 }}>{s.l}</div>
          </div>)}
        </div>
      </div>
      <div className="card ai s2">
        <div style={{ fontSize:14, fontWeight:800, marginBottom:4 }}>Sign Out</div>
        <div style={{ fontSize:12, color:"var(--text3)", marginBottom:14 }}>You can sign back in anytime</div>
        <button className="btn danger" onClick={onLogout}><Icon n="logout" />Sign Out</button>
      </div>
    </div>
  );
}

// ── Toasts ─────────────────────────────────────────────────────────────────
function Toasts({ toasts }) {
  const ico = { success:"circle-check", error:"alert-circle", info:"info-circle" };
  const clr = { success:"var(--green-d)", error:"#e07b6a", info:"var(--peach-d)" };
  return (
    <div className="toast-wrap">
      {toasts.map(t=>(
        <div key={t.id} className={`toast ${t.type}`}>
          <Icon n={ico[t.type]||"info-circle"} style={{ color:clr[t.type], fontSize:16 }} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users,    setUsers]    = useState(SEED_USERS);
  const [projects, setProjects] = useState(SEED_PROJECTS);
  const [tasks,    setTasks]    = useState(SEED_TASKS);
  const [page, setPage]         = useState("dashboard");
  const [taskModal,    setTaskModal]    = useState(null);
  const [projModal,    setProjModal]    = useState(null);
  const [memberModal,  setMemberModal]  = useState(false);
  const [permsModal,   setPermsModal]   = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const notifRef = useRef(null);
  const { toasts, add: toast } = useToasts();

  useEffect(() => {
    const h = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!currentUser) return <LandingPage users={users} onLogin={u=>{setCurrentUser(u);toast(`Welcome back, ${u.name.split(" ")[0]}! 🌸`,"success");}} onSignup={u=>{setUsers(us=>[...us,u]);setCurrentUser(u);toast(`Welcome to Taskflow, ${u.name.split(" ")[0]}! 🌱`,"success");}} />;

  // ── CRUD helpers ──
  const saveTask = t => {
    setTasks(ts => ts.find(x=>x.id===t.id) ? ts.map(x=>x.id===t.id?t:x) : [...ts,t]);
    toast(tasks.find(x=>x.id===t.id) ? "Task updated ✨" : "Task created 🌱","success");
    setTaskModal(null);
  };
  const delTask    = id => { setTasks(ts=>ts.filter(t=>t.id!==id)); toast("Task removed","info"); };
  const chgStatus  = (id,status) => { setTasks(ts=>ts.map(t=>t.id===id?{...t,status}:t)); toast("Status updated ✅","success"); };
  const saveProj   = p => { setProjects(ps=>ps.find(x=>x.id===p.id)?ps.map(x=>x.id===p.id?p:x):[...ps,p]); toast("Project saved 🗂","success"); setProjModal(null); };
  const delProj    = id => { setProjects(ps=>ps.filter(p=>p.id!==id)); setTasks(ts=>ts.filter(t=>t.projectId!==id)); toast("Project deleted","info"); };
  const invMember  = u => { setUsers(us=>[...us,u]); toast(`${u.name} invited 🌸`,"success"); setMemberModal(false); };
  const remMember  = id => { setUsers(us=>us.filter(u=>u.id!==id)); toast("Member removed","info"); };
  const updateUser = form => { setCurrentUser(u=>({...u,...form})); setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,...form}:u)); toast("Profile updated ✨","success"); };

  const myProjs  = projects.filter(p=>p.members.includes(currentUser.id));
  const overdue  = tasks.filter(t=>isOverdue(t.due)&&t.status!=="done");

  const navItems = [
    { id:"dashboard", label:"Dashboard",  icon:"layout-dashboard" },
    { id:"tasks",     label:"Tasks",      icon:"checklist",       badge:tasks.filter(t=>t.status!=="done").length },
    { id:"projects",  label:"Projects",   icon:"folder" },
    { id:"members",   label:"Members",    icon:"users" },
  ];

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <div className="app">
        {/* ── Topbar ── */}
        <header className="topbar">
          <div className="logo">
            <div className="logo-icon">🌿</div>
            Taskflow
          </div>
          <div className="tb-search">
            <Icon n="search" className="si" />
            <input placeholder="Search tasks, projects…" onFocus={()=>setPage("tasks")} />
          </div>
          <div className="tb-right">
            {overdue.length > 0 && (
              <div onClick={()=>setPage("tasks")} style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", background:"rgba(255,214,186,0.5)", border:"1.5px solid var(--peach-d)", borderRadius:99, fontSize:12, fontWeight:700, color:"var(--peach-d)", cursor:"pointer", transition:"all .2s", animation:"bounce 2s infinite" }}>
                <Icon n="alert-triangle" style={{ fontSize:13 }} />{overdue.length} overdue
              </div>
            )}
            <div ref={notifRef} style={{ position:"relative" }}>
              <div className={`icon-btn ${notifOpen?"active":""}`} onClick={()=>setNotifOpen(v=>!v)} style={{ position:"relative" }}>
                <Icon n="bell" />
                {overdue.length>0 && <span style={{ position:"absolute", top:6, right:6, width:7, height:7, background:"#e07b6a", borderRadius:"50%", border:"2px solid var(--bg1)" }} />}
              </div>
              {notifOpen && (
                <div className="npanel">
                  <div className="npanel-title">🔔 Notifications</div>
                  {overdue.slice(0,5).map(t=>(
                    <div key={t.id} className="nitem" onClick={()=>{setTaskModal(t);setNotifOpen(false);}}>
                      <p>⚠️ <strong>{t.title}</strong> is overdue</p>
                      <small>{fmtDate(t.due)} {t.due.includes("T")?`· ${fmtTime(t.due)}`:""}</small>
                    </div>
                  ))}
                  {overdue.length===0 && <div style={{ padding:"14px 12px", fontSize:13, color:"var(--text3)", textAlign:"center" }}>All caught up! 🌸</div>}
                </div>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:9, padding:"5px 12px 5px 6px", background:"var(--bg2)", border:"1.5px solid var(--border)", borderRadius:99, cursor:"pointer", transition:"all .2s" }}
              onClick={()=>setPage("settings")}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--bg3)";e.currentTarget.style.borderColor="var(--border2)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="var(--bg2)";e.currentTarget.style.borderColor="var(--border)";}}>
              <Av user={currentUser} />
              <span style={{ fontSize:13, fontWeight:700 }}>{currentUser.name.split(" ")[0]}</span>
              <Icon n="chevron-down" style={{ fontSize:13, color:"var(--text3)" }} />
            </div>
          </div>
        </header>

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="nav-label">Navigation</div>
          {navItems.map(n=>(
            <div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>setPage(n.id)}>
              <Icon n={n.icon} />{n.label}
              {n.badge>0 && <span className="nav-badge">{n.badge}</span>}
            </div>
          ))}

          <div className="sdivider" />
          <div className="nav-label">My Projects</div>
          {myProjs.map(p=>(
            <div key={p.id} className="nav-item" onClick={()=>setPage("projects")}>
              <div className="proj-dot" style={{ background:p.color, boxShadow:`0 0 0 2px ${p.color}50` }} />
              <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{p.name}</span>
            </div>
          ))}
          {currentUser.role==="admin" && (
            <div className="nav-item" style={{ borderStyle:"dashed", border:"1.5px dashed var(--border2)", marginTop:4, opacity:.7 }} onClick={()=>setProjModal({})}>
              <Icon n="plus" /><span>New Project</span>
            </div>
          )}

          <div className="sidebar-btm">
            <div className={`nav-item ${page==="settings"?"active":""}`} onClick={()=>setPage("settings")}>
              <Icon n="settings" />Settings
            </div>
            <div className="nav-item" style={{ color:"#c0522a" }} onClick={()=>{setCurrentUser(null);setPage("dashboard");toast("Signed out 👋","info");}}>
              <Icon n="logout" />Sign Out
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="main">
          {page==="dashboard" && <Dashboard tasks={tasks} projects={projects} users={users} currentUser={currentUser} onNewTask={()=>setTaskModal({})} onSelectTask={t=>setTaskModal(t)} />}
          {page==="tasks"     && <TasksPage tasks={tasks} projects={projects} users={users} currentUser={currentUser} onNew={()=>setTaskModal({})} onSelect={t=>setTaskModal(t)} onStatusChange={chgStatus} />}
          {page==="projects"  && <ProjectsPage projects={projects} tasks={tasks} users={users} currentUser={currentUser} onNew={()=>setProjModal({})} onEdit={p=>setProjModal(p)} />}
          {page==="members"   && <MembersPage users={users} tasks={tasks} projects={projects} currentUser={currentUser} onInvite={()=>setMemberModal(true)} onRemove={remMember} onShowPerms={()=>setPermsModal(true)} />}
          {page==="settings"  && <SettingsPage currentUser={currentUser} onUpdateUser={updateUser} onLogout={()=>{setCurrentUser(null);setPage("dashboard");toast("Signed out 👋","info");}} users={users} />}
        </main>
      </div>

      {/* ── Modals ── */}
      {taskModal!==null   && <TaskModal   task={taskModal}   projects={projects} users={users} currentUser={currentUser} onSave={saveTask}  onDelete={delTask} onClose={()=>setTaskModal(null)} />}
      {projModal!==null   && <ProjectModal project={projModal} users={users} onSave={saveProj} onDelete={delProj} onClose={()=>setProjModal(null)} currentUser={currentUser} />}
      {memberModal        && <MemberModal  onSave={invMember} onClose={()=>setMemberModal(false)} currentUser={currentUser} />}
      {permsModal         && <PermsModal   onClose={()=>setPermsModal(false)} />}

      <Toasts toasts={toasts} />
    </>
  );
}
