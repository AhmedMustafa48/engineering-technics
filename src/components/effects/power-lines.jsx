// Transmission-line catenaries with dashes flowing along them, like current.
// Pure SVG + CSS, so it costs nothing to hydrate.
export function PowerLines({ className }) {
  const lines = [
    { d: "M-20 60 Q 180 140 380 70 T 780 70 T 1180 60 T 1620 70", delay: "0s", width: 1.5 },
    { d: "M-20 95 Q 180 175 380 105 T 780 105 T 1180 95 T 1620 105", delay: "-2s", width: 1 },
    { d: "M-20 130 Q 180 205 380 140 T 780 140 T 1180 130 T 1620 140", delay: "-4s", width: 1 },
  ];
  return (
    <svg aria-hidden viewBox="0 0 1600 200" preserveAspectRatio="none" className={className} fill="none">
      {lines.map((l) => (
        <g key={l.d}>
          <path d={l.d} stroke="currentColor" strokeOpacity="0.35" strokeWidth={l.width} vectorEffect="non-scaling-stroke" />
          <path
            d={l.d}
            stroke="currentColor"
            strokeWidth={l.width + 0.5}
            strokeDasharray="6 234"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="animate-flow"
            style={{ animationDelay: l.delay }}
          />
        </g>
      ))}
    </svg>
  );
}
