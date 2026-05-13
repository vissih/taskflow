import { useState } from "react";

import Icon from "../components/common/Icon.jsx";
import Av from "../components/common/Avatar.jsx";
import DueChip from "../components/common/DueChip.jsx";

import {
  SBadge,
  PBadge
} from "../components/common/Badges.jsx";

import {
  fmtDate,
  fmtTime,
  daysLeft
} from "../utils/helper.js";

import {
  SLBL
} from "../utils/constants.js";

export default function TasksPage({ tasks, projects, users, currentUser, onNew, onSelect, onStatusChange }) {
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
                  <tr key={t._id} onClick={()=>canEdit(t)&&onSelect(t)} style={{ cursor: canEdit(t)?"pointer":"default" }}>
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
                    <div key={t._id} className="task-card" onClick={()=>canEdit(t)&&onSelect(t)}>
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