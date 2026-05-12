export const uid = () => Math.random().toString(36).slice(2, 10);
export const nowISO = () => new Date().toISOString();
export const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso); return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }); };
export const fmtTime = (iso) => { if (!iso) return ""; const d = new Date(iso); return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); };
export const fmtDateTime = (iso) => { if (!iso) return ""; return `${fmtDate(iso)} · ${fmtTime(iso)}`; };
export const isOverdue = (due) => due && new Date(due) < new Date();
export const daysLeft = (due) => { if (!due) return null; return Math.ceil((new Date(due) - new Date()) / 86400000); };
