export default function Av({ user, size = "" }) {
  if (!user) return null;
  return <div className={`av ${size}`} style={{ background: user.color + "28", color: user.color }} title={user.name}>{user.avatar}</div>;
}