import Icon from "./Icon.jsx";
import { daysLeft, fmtDate } from "../../utils/helper.js";

export default function DueChip({ due }) {
  if (!due) return null;
  const d = daysLeft(due);
  const cls = d < 0 ? "overdue" : d <= 3 ? "soon" : "ok";
  const ico = d < 0 ? "alert-triangle" : "calendar";
  return <span className={`due-chip ${cls}`}><Icon n={ico} style={{ fontSize: 11 }} />{fmtDate(due)}</span>;
}