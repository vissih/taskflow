import Modal from "../common/Modal.jsx";
import Icon from "../common/Icon.jsx";

function PermsModal({ onClose }) {
  const perms = {
    Admin: [
      ["Create & delete projects", true], ["Edit any project", true], ["Invite & remove members", true],
      ["Change member roles", true], ["Create tasks in any project", true], ["Edit any task", true],
      ["Delete any task", true], ["Log time on any task", true], ["View all activity", true],
    ],
    Member: [
      ["Create & delete projects", false], ["Edit assigned projects", true], ["Invite members", false],
      ["Change member roles", false], ["Create tasks in joined projects", true], ["Edit own/assigned tasks", true],
      ["Delete own tasks", true], ["Log time on assigned tasks", true], ["View team activity", true],
    ],
  };
  return (
    <Modal onClose={onClose}>
      <div className="modal-title"><Icon n="shield-check" style={{ color: "var(--green-d)", fontSize: 20 }} />Role Permissions</div>
      <div className="perm-grid">
        {Object.entries(perms).map(([role, items]) => (
          <div key={role} className="perm-card">
            <div className="perm-title">
              <span className={`badge role-${role.toLowerCase()}`}>{role}</span>
            </div>
            {items.map(([label, allowed]) => (
              <div key={label} className={`perm-item ${allowed ? "yes" : "no"}`}>
                <Icon n={allowed ? "circle-check" : "circle-x"} style={{ fontSize: 13 }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="modal-footer"><button className="btn primary sm" onClick={onClose}>Got it</button></div>
    </Modal>
  );
}


export default PermsModal;