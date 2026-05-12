import { useState } from "react";

import Modal from "../common/Modal.jsx";
import Icon from "../common/Icon.jsx";
import Av from "../common/Avatar.jsx";

import {
  fmtDateTime,
  nowISO,
  uid
} from "../../utils/helper.js";

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

export default TaskModal;