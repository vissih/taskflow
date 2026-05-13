import Icon from "./Icon.jsx";

export default function Toasts({ toasts }) {
  const ico = {
    success: "circle-check",
    error: "alert-circle",
    info: "info-circle"
  };

  const clr = {
    success: "var(--green-d)",
    error: "#e07b6a",
    info: "var(--peach-d)"
  };

  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <Icon
            n={ico[t.type] || "info-circle"}
            style={{
              color: clr[t.type],
              fontSize: 16
            }}
          />
          {t.msg}
        </div>
      ))}
    </div>
  );
}