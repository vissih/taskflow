export default function Icon({ n, style, className = "" }) {
  return (
    <i
      className={`ti ti-${n} ${className}`}
      style={style}
      aria-hidden
    />
  );
}