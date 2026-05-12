import { uid, nowISO } from "../utils/helper.js";


export const SEED_USERS = [
  { id: "u1", name: "Arjun Sharma",   email: "arjun@bloom.in",  role: "admin",  avatar: "AS", color: "#7bb56e" },
  { id: "u2", name: "Priya Nair",     email: "priya@bloom.in",  role: "member", avatar: "PN", color: "#c4a35a" },
  { id: "u3", name: "Rohan Mehta",    email: "rohan@bloom.in",  role: "member", avatar: "RM", color: "#e07b6a" },
  { id: "u4", name: "Kavya Reddy",    email: "kavya@bloom.in",  role: "member", avatar: "KR", color: "#7a9dc4" },
];

export const SEED_PROJECTS = [
  { id: "p1", name: "Bloom Website Revamp", description: "Redesign the company website with a fresh, modern look", color: "#A3DC9A", ownerId: "u1", members: ["u1","u2","u3"], createdAt: nowISO() },
  { id: "p2", name: "Diwali Campaign 2025",  description: "Plan and execute the festive marketing campaign",      color: "#FFD6BA", ownerId: "u1", members: ["u1","u3","u4"], createdAt: nowISO() },
];

export const SEED_TASKS = [
  { id: "t1", title: "Redesign homepage hero section", desc: "Create a warm, inviting hero with animations",           projectId: "p1", assigneeId: "u2", status: "in-progress", priority: "high",   due: "2025-07-01T18:00", createdBy: "u1", createdAt: nowISO(), comments: [], timeEstimate: 4, timeLogged: 2.5 },
  { id: "t2", title: "Write brand style guide",         desc: "Document color palette, typography and spacing rules",  projectId: "p1", assigneeId: "u3", status: "todo",        priority: "medium", due: "2025-06-20T17:00", createdBy: "u1", createdAt: nowISO(), comments: [], timeEstimate: 6, timeLogged: 0 },
  { id: "t3", title: "Social media banner set",         desc: "Design Diwali themed banners for all platforms",        projectId: "p2", assigneeId: "u4", status: "done",        priority: "high",   due: "2025-05-30T12:00", createdBy: "u1", createdAt: nowISO(), comments: [], timeEstimate: 3, timeLogged: 3 },
  { id: "t4", title: "Email newsletter template",       desc: "Create festive email template with offer details",      projectId: "p2", assigneeId: "u3", status: "in-progress", priority: "medium", due: "2025-06-15T15:00", createdBy: "u1", createdAt: nowISO(), comments: [], timeEstimate: 5, timeLogged: 1.5 },
  { id: "t5", title: "Component library setup",         desc: "Build reusable React component library",               projectId: "p1", assigneeId: "u1", status: "in-progress", priority: "high",   due: "2025-06-25T17:00", createdBy: "u1", createdAt: nowISO(), comments: [], timeEstimate: 8, timeLogged: 3 },
  { id: "t6", title: "Photography shoot brief",         desc: "Brief the photographer for product shoot",             projectId: "p2", assigneeId: "u2", status: "todo",        priority: "low",    due: "2025-07-10T10:00", createdBy: "u2", createdAt: nowISO(), comments: [], timeEstimate: 1, timeLogged: 0 },
];