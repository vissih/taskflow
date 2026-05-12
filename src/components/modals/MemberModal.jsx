import { useState } from "react";

import Modal from "../common/Modal.jsx";
import Icon from "../common/Icon.jsx";

import {
  uid
} from "../../utils/helper.js";

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

export default MemberModal;