import { useState, useEffect, useRef } from "react";
import API from "./utils/api.js";

import {
  SEED_PROJECTS,
  SEED_TASKS
} from "./data/seedData.js";

import {
  fmtDate,
  fmtTime,
  isOverdue
} from "./utils/helper.js";

import Icon from "./components/common/Icon.jsx";
import Av from "./components/common/Avatar.jsx";

import useToasts from "./hooks/useToasts.js";

import TaskModal from "./components/modals/TaskModal.jsx";
import ProjectModal from "./components/modals/ProjectModal.jsx";
import MemberModal from "./components/modals/MemberModal.jsx";
import PermsModal from "./components/modals/PermsModal.jsx";

import Toasts from "./components/common/Toasts.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./pages/DashboardPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import MembersPage from "./pages/MembersPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {

       const res = await API.get("/projects");

       setProjects(res.data);

     } catch (err) {

       console.log(err);
     }
    };

    fetchProjects();

  }, []);

  useEffect(() => {

    const fetchTasks = async () => {
      try {

        const res = await API.get("/tasks");

       setTasks(res.data);

      } catch (err) {

       console.log(err);
     }
    };

    fetchTasks();

  }, []);

  useEffect(() => {

   const fetchUsers = async () => {

      try {

        const res = await API.get("/users");

        setUsers(res.data);

      } catch (err) {

       console.log(err);
     }
   };

    fetchUsers();

  }, []);

  useEffect(() => {

    const savedUser = localStorage.getItem("user");
    
    if (savedUser) {

      setCurrentUser(
        JSON.parse(savedUser)
     );
   }

  }, []);

  if (!currentUser) return <LandingPage users={users} onLogin={u=>{setCurrentUser(u);toast(`Welcome back, ${u.name.split(" ")[0]}! 🌸`,"success");}} onSignup={u=>{setUsers(us=>[...us,u]);setCurrentUser(u);toast(`Welcome to Taskflow, ${u.name.split(" ")[0]}! 🌱`,"success");}} />;

  // ── CRUD helpers ──
  const saveTask = async (t) => {

    try {

     // UPDATE TASK
     if (t._id) {

       const res = await API.put(
         `/tasks/${t._id}`,
          t
        );

        setTasks(ts =>
          ts.map(x =>
            x._id === t._id
              ? res.data
              : x
          )
        );

        toast("Task updated ✨", "success");
      }

      // CREATE TASK
      else {

        const res = await API.post(
          "/tasks",
          t
        );

        setTasks(ts => [
          res.data,
          ...ts
        ]);

        toast("Task created 🌱", "success");
      }

      setTaskModal(null);

    } catch (err) {

      console.log(err);

     toast("Failed to save task", "error");
    }
  };
  const delTask = async (id) => {

    try {

      await API.delete(`/tasks/${id}`);

     setTasks(ts =>
       ts.filter(t => t._id !== id)
     );

     toast("Task removed", "info");

   } catch (err) {

     console.log(err);

     toast("Failed to delete task", "error");
   }
  };
  const chgStatus  = (id,status) => { setTasks(ts=>ts.map(t=>t.id===id?{...t,status}:t)); toast("Status updated ✅","success"); };
  const saveProj = async (p) => {

    try {

     // UPDATE PROJECT
     if (p._id) {

       const res = await API.put(
          `/projects/${p._id}`,
          p
       );

       setProjects(ps =>
         ps.map(x =>
           x._id === p._id
             ? res.data
             : x
         )
       );

       toast("Project updated ✨", "success");
      }

      // CREATE PROJECT
     else {

        const res = await API.post(
          "/projects",
         p
       );

       setProjects(ps => [
         res.data,
         ...ps
        ]);

       toast("Project created 🌱", "success");
      }

      setProjModal(null);

   } catch (err) {

      console.log(err);

      toast("Failed to save project", "error");
   }
  };
  const delProj = async (id) => {

   try {

      await API.delete(`/projects/${id}`);

     setProjects(ps =>
       ps.filter(p => p._id !== id)
      );

     setTasks(ts =>
       ts.filter(t => t.projectId !== id)
     );

      toast("Project deleted", "info");

    } catch (err) {

     console.log(err);

     toast("Failed to delete project", "error");
    }
  };
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
                    <div key={t._id} className="nitem" onClick={()=>{setTaskModal(t);setNotifOpen(false);}}>
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
            <div className="nav-item" style={{ color:"#c0522a" }} onClick={()=>{localStorage.clear();setCurrentUser(null);setPage("dashboard");toast("Signed out 👋","info");}}>
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
          {page==="settings"  && <SettingsPage currentUser={currentUser} onUpdateUser={updateUser} onLogout={()=>{localStorage.clear();setCurrentUser(null);setPage("dashboard");toast("Signed out 👋","info");}} users={users} />}
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
