import { useState } from "react";

import Icon from "../components/common/Icon.jsx";
import Av from "../components/common/Avatar.jsx";

export default function SettingsPage({ currentUser, onUpdateUser, onLogout, users }) {
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
