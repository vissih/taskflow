import { useEffect } from "react";

export default function Modal({ children, onClose, wide }) {
  useEffect(() => { const e = ev => ev.key === "Escape" && onClose(); window.addEventListener("keydown", e); return () => window.removeEventListener("keydown", e); }, [onClose]);
  return <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}><div className={`modal${wide ? " wide" : ""}`}>{children}</div></div>;
}