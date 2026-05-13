import { useState } from "react";

import Icon from "../components/common/Icon.jsx";
import Av from "../components/common/Avatar.jsx";

export default function MembersPage({ users, tasks, projects, currentUser, onInvite, onRemove, onShowPerms }) {
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