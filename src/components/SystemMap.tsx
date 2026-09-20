import { useState } from "react";
import { spaceports, trajectories, manifests, portById, vesselById, pilotById } from "../data/mock";
import "./SystemMap.css";

// Map normalized coords -> viewbox
const VB_W = 1000, VB_H = 560;
const px = (x: number) => x * VB_W;
const py = (y: number) => y * VB_H;

export function SystemMap({ onSelectVessel }: { onSelectVessel?: (id: string) => void }) {
  const [hover, setHover] = useState<string | null>(null);

  // Active in-transit manifests -> a vessel dot positioned along its trajectory
  const active = manifests.filter((m) => m.status === "in_transit" || m.status === "delayed");

  return (
    <div className="sysmap">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="sysmap-svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(230,180,80,0.28)" />
            <stop offset="100%" stopColor="rgba(230,180,80,0)" />
          </radialGradient>
          <radialGradient id="port-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* faint concentric orbital rings centered near the sun */}
        {[140, 250, 360, 470].map((r) => (
          <ellipse key={r} cx={px(0.12)} cy={py(0.5)} rx={r} ry={r * 0.62} className="orbit-ring" />
        ))}

        {/* star field */}
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x * VB_W} cy={s.y * VB_H} r={s.r} className="star" style={{ animationDelay: `${s.d}s` }} />
        ))}

        {/* sun */}
        <circle cx={px(0.12)} cy={py(0.5)} r="70" fill="url(#sun-glow)" />
        <circle cx={px(0.12)} cy={py(0.5)} r="10" className="sun-core" />

        {/* trajectories */}
        {trajectories.map((t, i) => {
          const a = portById(t.from), b = portById(t.to);
          const mx = (px(a.x) + px(b.x)) / 2;
          const my = (py(a.y) + py(b.y)) / 2 - 40;
          const d = `M ${px(a.x)} ${py(a.y)} Q ${mx} ${my} ${px(b.x)} ${py(b.y)}`;
          const isActive = active.some((m) => m.origin === t.from && m.destination === t.to);
          return (
            <g key={i}>
              <path d={d} className="traj-base" />
              {isActive && <path d={d} className="traj-active" />}
            </g>
          );
        })}

        {/* vessels in transit */}
        {active.map((m) => {
          const a = portById(m.origin), b = portById(m.destination);
          const mx = (px(a.x) + px(b.x)) / 2;
          const my = (py(a.y) + py(b.y)) / 2 - 40;
          const pos = quad(px(a.x), py(a.y), mx, my, px(b.x), py(b.y), m.progress / 100);
          const v = vesselById(m.vessel);
          const tone = m.status === "delayed" ? "critical" : "info";
          return (
            <g
              key={m.id}
              className="vessel-node"
              transform={`translate(${pos.x} ${pos.y})`}
              onMouseEnter={() => setHover(m.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => v && onSelectVessel?.(v.id)}
            >
              <circle r="14" className={`vessel-halo halo-${tone}`} />
              <circle r="4.5" className={`vessel-dot dot-${tone}`} />
              {hover === m.id && (
                <g className="vessel-tip" transform="translate(14 -8)">
                  <rect x="0" y="-24" width="168" height="46" rx="8" className="tip-bg" />
                  <text x="10" y="-8" className="tip-title">{v?.name}</text>
                  <text x="10" y="10" className="tip-sub">{m.id} · {pilotById(v?.pilot ?? "")?.callsign} · {m.progress}%</text>
                </g>
              )}
            </g>
          );
        })}

        {/* spaceports */}
        {spaceports.map((p) => (
          <g key={p.id} transform={`translate(${px(p.x)} ${py(p.y)})`} className="port-node">
            <circle r="26" fill="url(#port-glow)" />
            <circle r="5" className="port-dot" />
            <circle r="9" className="port-ring" />
            <text x="0" y="-16" className="port-label" textAnchor="middle">{p.name}</text>
            <text x="0" y="26" className="port-code" textAnchor="middle">{p.body}</text>
          </g>
        ))}
      </svg>

      <div className="sysmap-legend">
        <span><span className="lg-dot dot-info" /> In transit</span>
        <span><span className="lg-dot dot-critical" /> Delayed</span>
        <span><span className="lg-dot lg-port" /> Spaceport</span>
      </div>
    </div>
  );
}

// quadratic bezier point
function quad(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, t: number) {
  const mt = 1 - t;
  return {
    x: mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
    y: mt * mt * y0 + 2 * mt * t * cy + t * t * y1,
  };
}

const STARS = Array.from({ length: 60 }, (_, i) => ({
  x: ((i * 137.5) % 100) / 100,
  y: ((i * 53.3) % 100) / 100,
  r: (i % 5 === 0 ? 1.3 : 0.7),
  d: (i % 7) * 0.4,
}));
