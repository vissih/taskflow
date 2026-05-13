import { useState } from "react";

import Modal from "../common/Modal.jsx";
import Icon from "../common/Icon.jsx";
import Av from "../common/Avatar.jsx";

import {
  nowISO
} from "../../utils/helper.js";

function ProjectModal({
  project,
  users,
  onSave,
  onDelete,
  onClose,
  currentUser
}) {

  const isNew = !project._id;

  const COLORS = [
    "#A3DC9A",
    "#DEE791",
    "#FFF9BD",
    "#FFD6BA",
    "#c4e8a0",
    "#f0c8a8",
    "#a8d4e8",
    "#e8a8c4"
  ];

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: COLORS[0],

    ownerId:
      currentUser._id,

    members: [
      currentUser._id
    ],

    deadline: "",

    ...project
  });

  const set = key => e =>
    setForm(f => ({
      ...f,
      [key]: e.target.value
    }));


  const toggleMember = id => {

    setForm(f => ({
      ...f,

      members: f.members.includes(id)

        ? f.members.filter(x => x !== id)

        : [...f.members, id]
    }));
  };


  const save = () => {

    if (!form.name.trim()) return;

    onSave({
      ...form,

      createdAt:
        form.createdAt || nowISO()
    });
  };

  return (
    <Modal onClose={onClose}>

      <div className="modal-title">

        <Icon
          n="folder-plus"
          style={{
            color: "var(--green-d)",
            fontSize: 20
          }}
        />

        {isNew
          ? "New Project"
          : "Edit Project"}
      </div>

      {/* NAME */}
      <div className="fg">

        <label className="flbl">
          Project Name *
        </label>

        <input
          className="finput"
          value={form.name}
          onChange={set("name")}
          placeholder="e.g. Diwali Campaign 2025"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="fg">

        <label className="flbl">
          Description
        </label>

        <textarea
          className="finput"
          value={form.description}
          onChange={set("description")}
          placeholder="What's this project about?"
        />
      </div>

      {/* DEADLINE */}
      <div className="fg">

        <label className="flbl">

          <Icon
            n="calendar"
            style={{
              fontSize: 13,
              verticalAlign: -2
            }}
          />

          {" "}Project Deadline
        </label>

        <input
          className="finput"
          type="date"
          value={form.deadline}
          onChange={set("deadline")}
        />
      </div>

      {/* COLORS */}
      <div className="fg">

        <label className="flbl">
          Project Color
        </label>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap"
          }}
        >

          {COLORS.map(c => (

            <div
              key={c}

              onClick={() =>
                setForm(f => ({
                  ...f,
                  color: c
                }))
              }

              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: c,
                cursor: "pointer",

                border:
                  form.color === c
                    ? "3px solid var(--text)"
                    : "3px solid transparent",

                transition:
                  "transform .15s, border .15s",

                transform:
                  form.color === c
                    ? "scale(1.2)"
                    : "scale(1)",

                boxShadow:
                  "0 1px 4px rgba(0,0,0,0.12)"
              }}
            />

          ))}
        </div>
      </div>

      {/* MEMBERS */}
      <div className="fg">

        <label className="flbl">
          Team Members
        </label>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8
          }}
        >

          {users.map(u => (

            <label
              key={u._id}

              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: 10,

                background:
                  form.members.includes(u._id)

                    ? "rgba(163,220,154,0.2)"

                    : "var(--bg2)",

                border: `1.5px solid ${
                  form.members.includes(u._id)

                    ? "rgba(163,220,154,0.5)"

                    : "var(--border)"
                }`,

                transition: "all .15s"
              }}
            >

              <input
                type="checkbox"

                checked={
                  form.members.includes(u._id)
                }

                onChange={() =>
                  toggleMember(u._id)
                }

                style={{
                  accentColor:
                    "var(--green-d)"
                }}
              />

              <Av user={u} />

              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                {u.name}
              </span>

              <span
                className={`badge role-${u.role}`}
                style={{
                  marginLeft: "auto"
                }}
              >
                {u.role}
              </span>
            </label>

          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="modal-footer">

        {!isNew &&
          currentUser.role === "admin" && (

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
            ? "Create"
            : "Save"}
        </button>
      </div>
    </Modal>
  );
}

export default ProjectModal;