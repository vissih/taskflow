export function SBadge({ s }) { return <span className={`badge ${s}`}>{SLBL[s]}</span>; }
export function PBadge({ p }) { return <span className={`badge p-${p}`}>{PLBL[p]}</span>; }