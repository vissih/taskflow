import Icon from "../components/common/Icon.jsx";
import Av from "../components/common/Avatar.jsx";

import {
  fmtDate,
  isOverdue
} from "../utils/helper.js";

export default function ProjectsPage({ projects, tasks, users, currentUser, onNew, onEdit }) {
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
