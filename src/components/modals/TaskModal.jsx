import { useState } from "react";

import Modal from "../common/Modal.jsx";
import Icon from "../common/Icon.jsx";
import Av from "../common/Avatar.jsx";

import {
  fmtDateTime,
  nowISO,
  uid
} from "../../utils/helper.js";

function TaskModal({
  task,
  projects,
  users,
  onSave,
  onDelete,
  onClose,
  currentUser
}) {

  const isNew = !task._id;

  const [form, setForm] = useState({
    title: "",
    desc: "",
    projectId: projects[0]?._id || null,
    assigneeId: null,
    status: "todo",
    priority: "medium",
    due: "",
    timeEstimate: "",
    timeLogged: "",
    ...task
  });

  const [comment, setComment] = useState("");

  const set = key => e => {
    setForm(f => ({
      ...f,
      [key]: e.target.value
    }));
  };

  const save = () => {

    if (!form.title.trim()) return;

    onSave({
      ...form,

      projectId:
        form.projectId || null,

      assigneeId:
        form.assigneeId || null,

      createdBy:
        form.createdBy || currentUser._id,

      createdAt:
        form.createdAt || nowISO(),

      comments:
        form.comments || []
    });
  };

  const addComment = () => {

    if (!comment.trim()) return;

    const c = {
      id: uid(),
      userId: currentUser._id,
      text: comment.trim(),
      at: nowISO()
    };

    setForm(f => ({
      ...f,
      comments: [
        ...(f.comments || []),
        c
      ]
    }));

    setComment("");
  };

  const timePercent =
    form.timeEstimate > 0
      ? Math.min(
          100,
          Math.round(
            (form.timeLogged / form.timeEstimate) * 100
          )
        )
      : 0;

  return (
    <Modal onClose={onClose} wide>

      <div className="modal-title">
        <Icon
          n={isNew ? "plus-circle" : "pencil"}
          style={{
            color: "var(--green-d)",
            fontSize: 20
          }}
        />

        {isNew ? "New Task" : "Edit Task"}
      </div>

      {/* TITLE */}
      <div className="fg">
        <label className="flbl">
          Title *
        </label>

        <input
          className="finput"
          value={form.title}
          onChange={set("title")}
          placeholder="What needs to be done?"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="fg">
        <label className="flbl">
          Description
        </label>

        <textarea
          className="finput"
          value={form.desc}
          onChange={set("desc")}
          placeholder="Add more details…"
        />
      </div>

      {/* PROJECT + ASSIGNEE */}
      <div className="frow">

        <div className="fg">
          <label className="flbl">
            Project
          </label>

          <select
            className="finput"
            value={form.projectId || ""}
            onChange={set("projectId")}
          >

            <option value="">
              Select Project
            </option>

            {projects.map(p => (
              <option
                key={p._id}
                value={p._id}
              >
                {p.name}
              </option>
            ))}

          </select>
        </div>

        <div className="fg">
          <label className="flbl">
            Assignee
          </label>

          <select
            className="finput"
            value={form.assigneeId || ""}
            onChange={set("assigneeId")}
          >

            <option value="">
              Unassigned
            </option>

            {users.map(u => (
              <option
                key={u._id}
                value={u._id}
              >
                {u.name}
              </option>
            ))}

          </select>
        </div>
      </div>

      {/* STATUS + PRIORITY */}
      <div className="frow">

        <div className="fg">
          <label className="flbl">
            Status
          </label>

          <select
            className="finput"
            value={form.status}
            onChange={set("status")}
          >
            <option value="todo">
              To Do
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="done">
              Done
            </option>
          </select>
        </div>

        <div className="fg">
          <label className="flbl">
            Priority
          </label>

          <select
            className="finput"
            value={form.priority}
            onChange={set("priority")}
          >
            <option value="high">
              High
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="low">
              Low
            </option>
          </select>
        </div>
      </div>

      {/* DUE DATE */}
      <div className="fg">

        <label className="flbl">
          <Icon
            n="calendar"
            style={{
              fontSize: 13,
              verticalAlign: -2
            }}
          />

          {" "}Due Date & Time
        </label>

        <input
          className="finput"
          type="datetime-local"
          value={form.due}
          onChange={set("due")}
        />
      </div>

      {/* TIME TRACKING */}
      <div className="frow">

        <div className="fg">
          <label className="flbl">
            Estimated Hours
          </label>

          <input
            className="finput"
            type="number"
            min="0"
            step="0.5"
            value={form.timeEstimate}
            onChange={set("timeEstimate")}
          />
        </div>

        <div className="fg">
          <label className="flbl">
            Logged Hours
          </label>

          <input
            className="finput"
            type="number"
            min="0"
            step="0.5"
            value={form.timeLogged}
            onChange={set("timeLogged")}
          />
        </div>
      </div>

      {(form.timeEstimate > 0) && (

        <div
          style={{
            marginBottom: 16,
            padding: "10px 12px",
            background: "var(--bg2)",
            borderRadius: "var(--r)",
            border: "1px solid var(--border)"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              fontSize: 12
            }}
          >
            <span>
              Time Progress
            </span>

            <span
              style={{
                fontWeight: 700
              }}
            >
              {timePercent}%
            </span>
          </div>

          <div className="progress">
            <div
              className="progress-fill"
              style={{
                width: `${timePercent}%`
              }}
            />
          </div>
        </div>
      )}

      {/* COMMENTS */}
      {!isNew && (
        <>
          <div className="sep" />

          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              marginBottom: 12
            }}
          >
            Comments
          </div>

          {(form.comments || []).map(c => {

            const u = users.find(
              x => x._id === c.userId
            );

            return (
              <div
                key={c._id}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 12
                }}
              >

                <Av user={u} />

                <div style={{ flex: 1 }}>

                  <div
                    style={{
                      fontSize: 12,
                      marginBottom: 3
                    }}
                  >
                    <strong>
                      {u?.name}
                    </strong>

                    {" · "}

                    {fmtDateTime(c.at)}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      background: "var(--bg2)",
                      borderRadius: 10,
                      padding: "8px 12px"
                    }}
                  >
                    {c.text}
                  </div>
                </div>
              </div>
            );
          })}

          <div
            style={{
              display: "flex",
              gap: 8
            }}
          >

            <input
              className="finput"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment…"
              onKeyDown={e =>
                e.key === "Enter" && addComment()
              }
              style={{ flex: 1 }}
            />

            <button
              className="btn primary sm"
              onClick={addComment}
            >
              <Icon n="send" />
            </button>
          </div>
        </>
      )}

      {/* FOOTER */}
      <div className="modal-footer">

        {!isNew && (
          currentUser.role === "admin" ||
          task.createdBy === currentUser._id
        ) && (

          <button
            className="btn danger sm"
            onClick={() => {
              onDelete(form._id);
              onClose();
            }}
          >
            <Icon n="trash" />
            Delete
          </button>
        )}

        <button
          className="btn sm"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="btn primary sm"
          onClick={save}
        >
          <Icon n="check" />

          {isNew
            ? "Create Task"
            : "Save"}
        </button>
      </div>
    </Modal>
  );
}

export default TaskModal;