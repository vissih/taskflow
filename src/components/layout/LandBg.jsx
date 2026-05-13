export default function LandBg() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
      <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", background: "rgba(163,220,154,0.22)", filter: "blur(70px)", top: -120, left: -80, animation: "floatY 7s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,249,189,0.35)", filter: "blur(60px)", top: 100, right: -60, animation: "floatY2 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(255,214,186,0.28)", filter: "blur(60px)", bottom: -80, left: "30%", animation: "floatY 11s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(222,231,145,0.3)", filter: "blur(40px)", bottom: 100, right: 100, animation: "floatY2 8s ease-in-out infinite" }} />
      {/* Floating emojis */}
      {[
        { e: "🌸", t: "12%", l: "8%",  d: "0s",  size: 28 },
        { e: "🌿", t: "20%", r: "10%", d: "1s",  size: 24 },
        { e: "✨", t: "65%", l: "5%",  d: "2s",  size: 22 },
        { e: "🍃", t: "40%", r: "7%",  d: "0.5s",size: 26 },
        { e: "🌻", t: "78%", l: "15%", d: "1.5s",size: 24 },
        { e: "☁️",  t: "8%",  r: "25%", d: "2.5s",size: 30 },
      ].map((x, i) => (
        <div key={i} style={{ position: "absolute", top: x.t, left: x.l, right: x.r, fontSize: x.size, opacity: .55, animation: `floatY ${4 + i * 0.7}s ease-in-out infinite`, animationDelay: x.d, pointerEvents: "none" }}>{x.e}</div>
      ))}
    </div>
  );
}