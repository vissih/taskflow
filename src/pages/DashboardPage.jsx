import Icon from "../components/common/Icon.jsx";
import Av from "../components/common/Avatar.jsx";

import {
  SBadge
} from "../components/common/Badges.jsx";

import {
  fmtDate,
  isOverdue
} from "../utils/helper.js";

export default function Dashboard({ tasks, projects, users, currentUser, onNewTask, onSelectTask }) {
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
              <div key={t._id} onClick={() => onSelectTask(t)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", background:"var(--bg2)", borderRadius:10, cursor:"pointer", marginBottom:8, border:"1px solid var(--border)", transition:"all .15s" }}
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
              <div key={p._id} style={{ marginBottom:14 }}>
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
              <div key={u._id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
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