import Image from "next/image";
import { cn } from "@/lib/utils";

const GROUND = 690;

// Lattice transmission tower silhouette, base on the ground line.
function Pylon({ x, h, fill = "#0a1220", opacity = 1 }) {
  const w = h * 0.26;
  const top = GROUND - h;
  const legIn = w * 0.12;
  const levels = [0.18, 0.4, 0.62, 0.82];
  const half = (t) => legIn + (w / 2 - legIn) * (1 - t); // half-width at height fraction t
  const y = (t) => GROUND - h * t;
  const arms = [
    { t: 0.92, len: w * 1.1 },
    { t: 0.78, len: w * 1.35 },
  ];
  return (
    <g stroke={fill} strokeWidth={Math.max(1.4, h / 120)} fill="none" opacity={opacity} strokeLinecap="round">
      <line x1={x - w / 2} y1={GROUND} x2={x - legIn} y2={top} />
      <line x1={x + w / 2} y1={GROUND} x2={x + legIn} y2={top} />
      {levels.map((t, i) => {
        const t2 = levels[i + 1] ?? 1;
        return (
          <g key={t}>
            <line x1={x - half(t)} y1={y(t)} x2={x + half(t)} y2={y(t)} />
            <line x1={x - half(t)} y1={y(t)} x2={x + half(t2)} y2={y(t2)} />
            <line x1={x + half(t)} y1={y(t)} x2={x - half(t2)} y2={y(t2)} />
          </g>
        );
      })}
      {arms.map((a) => (
        <g key={a.t}>
          <line x1={x - a.len} y1={y(a.t)} x2={x + a.len} y2={y(a.t)} strokeWidth={Math.max(2, h / 70)} />
          <line x1={x - a.len} y1={y(a.t)} x2={x} y2={y(a.t + 0.07)} />
          <line x1={x + a.len} y1={y(a.t)} x2={x} y2={y(a.t + 0.07)} />
        </g>
      ))}
    </g>
  );
}

// Sagging conductor between two points.
const wire = (x1, y1, x2, y2, sag) => `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + sag} ${x2} ${y2}`;

function Bushing({ x, top }) {
  const sheds = Array.from({ length: Math.floor((120 - top) / 14) }, (_, i) => top + 14 + i * 14);
  return (
    <g>
      <rect x={x - 5} y={top} width="10" height={140 - top} fill="#1c1917" />
      {sheds.map((cy) => (
        <ellipse key={cy} cx={x} cy={cy} rx="15" ry="4.2" fill="#292524" stroke="#57534e" strokeWidth="0.8" />
      ))}
      <rect x={x - 3} y={top - 12} width="6" height="14" fill="#a8a29e" />
      <circle cx={x} cy={top - 14} r="5" fill="#d6d3d1" />
      <rect x={x - 12} y="132" width="24" height="10" rx="2" fill="#78716c" />
    </g>
  );
}

// A large, static power-transformer illustration lit from the right by the setting sun.
function Transformer({ id }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4b5565" />
          <stop offset="0.55" stopColor="#8f9bab" />
          <stop offset="1" stopColor="#d6a779" />
        </linearGradient>
        <linearGradient id={`${id}-fin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5d6878" />
          <stop offset="1" stopColor="#c99a6e" />
        </linearGradient>
      </defs>

      {/* concrete plinth */}
      <rect x="10" y="392" width="490" height="16" rx="2" fill="#3b4453" />
      <rect x="10" y="392" width="490" height="3" fill="#94a3b8" fillOpacity="0.4" />

      {/* radiators */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={374 + i * 13} y="176" width="9" height="212" rx="3" fill={`url(#${id}-fin)`} stroke="#3b4453" strokeWidth="0.8" />
      ))}
      <rect x="368" y="168" width="124" height="12" rx="3" fill="#6b7686" />
      <rect x="368" y="384" width="124" height="12" rx="3" fill="#6b7686" />

      {/* tank */}
      <rect x="34" y="150" width="344" height="244" rx="8" fill={`url(#${id}-steel)`} stroke="#2a3140" strokeWidth="1.5" />
      {[78, 124, 170, 216, 262, 308, 354].map((x) => (
        <line key={x} x1={x} y1="162" x2={x} y2="384" stroke="#2a3140" strokeOpacity="0.45" />
      ))}
      <rect x="26" y="138" width="360" height="16" rx="4" fill="#5b6676" stroke="#2a3140" />

      {/* conservator tank */}
      <rect x="176" y="112" width="12" height="30" fill="#4b5565" />
      <rect x="318" y="112" width="12" height="30" fill="#4b5565" />
      <rect x="110" y="54" width="330" height="62" rx="31" fill={`url(#${id}-steel)`} stroke="#2a3140" strokeWidth="1.5" />
      <rect x="150" y="62" width="250" height="7" rx="3.5" fill="#fff" fillOpacity="0.28" />
      <circle cx="428" cy="85" r="12" fill="#e2e8f0" stroke="#475569" />

      {/* HV bushings, LV bushings */}
      {[70, 130, 190].map((x) => (
        <Bushing key={x} x={x} top={0} />
      ))}
      {[250, 290, 330].map((x) => (
        <Bushing key={x} x={x} top={56} />
      ))}

      {/* control cabinet + OLTC */}
      <rect x="62" y="236" width="86" height="120" rx="6" fill="#cbd5e1" stroke="#2a3140" />
      <rect x="72" y="248" width="66" height="40" rx="3" fill="#0f172a" />
      <circle cx="105" cy="268" r="13" fill="none" stroke="#fbbf24" strokeWidth="2" />
      <line x1="105" y1="268" x2="113" y2="261" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <rect x="170" y="268" width="64" height="88" rx="5" fill="#cbd5e1" stroke="#2a3140" />
      <circle cx="202" cy="296" r="13" fill="#0f172a" stroke="#64748b" />
      <line x1="202" y1="296" x2="210" y2="290" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

// Hero background: a graded photograph ({ src, position } from lib/hero-photo), or the built-in dusk
// illustration when none is given. The gradients keep the copy readable either way.
export function HeroBackdrop({ image, className }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden bg-[#0b1628]", className)}>
      {image ? (
        <Image
          src={image.src}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: image.position }}
          className="animate-kenburns object-cover contrast-[1.08] saturate-[1.15]"
        />
      ) : (
        <svg viewBox="0 0 1600 760" preserveAspectRatio="xMaxYMax slice" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="hb-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0a1426" />
              <stop offset="0.42" stopColor="#1d3557" />
              <stop offset="0.66" stopColor="#7a4a54" />
              <stop offset="0.82" stopColor="#e07a3a" />
              <stop offset="1" stopColor="#f6b24a" />
            </linearGradient>
            <radialGradient id="hb-sun" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
              <stop offset="0.25" stopColor="#ffb84d" stopOpacity="0.6" />
              <stop offset="1" stopColor="#ff8a3d" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hb-ground" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1a1f2b" />
              <stop offset="1" stopColor="#07090f" />
            </linearGradient>
            <filter id="hb-blur" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          <rect width="1600" height="760" fill="url(#hb-sky)" />
          <circle cx="1330" cy="560" r="330" fill="url(#hb-sun)" />

          {/* clouds catching the last light */}
          <g filter="url(#hb-blur)">
            <ellipse cx="1200" cy="250" rx="360" ry="30" fill="#f59e6b" opacity="0.55" />
            <ellipse cx="760" cy="330" rx="300" ry="24" fill="#d97a5a" opacity="0.4" />
            <ellipse cx="1420" cy="380" rx="280" ry="22" fill="#fbbf6a" opacity="0.5" />
            <ellipse cx="420" cy="220" rx="320" ry="26" fill="#6d84a8" opacity="0.35" />
          </g>

          {/* distant towers + conductors */}
          <Pylon x={560} h={300} fill="#1b2231" opacity={0.4} />
          <Pylon x={900} h={340} fill="#141a27" opacity={0.55} />
          <Pylon x={1640} h={340} fill="#0a1220" />
          <g fill="none" stroke="#0a1220" strokeOpacity="0.7" strokeWidth="1.4">
            <path d={wire(470 - 80, 460, 820 - 90, 400, 26)} />
            <path d={wire(470 + 80, 460, 820 + 90, 400, 26)} />
            <path d={wire(820 + 90, 400, 1560 - 110, 380, 34)} />
            <path d={wire(820 - 90, 400, 1560 - 110, 380, 34)} />
          </g>

          {/* ground */}
          <rect y={GROUND - 4} width="1600" height="80" fill="url(#hb-ground)" />
          <rect y={GROUND - 4} width="1600" height="3" fill="#f6b24a" opacity="0.35" />
          <g opacity="0.9">
            {Array.from({ length: 40 }, (_, i) => (
              <rect key={i} x={i * 40} y={GROUND + 52} width="22" height="6" fill={i % 2 ? "#fbbf24" : "#0b0f17"} />
            ))}
          </g>

          {/* hero transformer */}
          <g transform={`translate(930 ${GROUND - 4 - 408 * 1.08}) scale(1.08)`}>
            <Transformer id="hb" />
          </g>
          <ellipse cx="1190" cy={GROUND + 2} rx="320" ry="10" fill="#000" opacity="0.45" />
        </svg>
      )}
      {/* colour grade + legibility: navy wash on the copy side, warm highlight on the far side */}
      <div className="absolute inset-0 bg-[#0b1e3a]/25 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07142a]/90 via-[#07142a]/60 to-[#07142a]/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgb(251_191_36/0.18),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07142a]/70 to-transparent" />
    </div>
  );
}
