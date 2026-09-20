import type { ReactNode } from "react";
import type { HealthTier } from "../data/types";
import "./primitives.css";

// -------------------- Status metadata --------------------
const STATUS_META: Record<string, { label: string; tone: string }> = {
  // manifest
  in_transit: { label: "In transit", tone: "info" },
  loading: { label: "Loading", tone: "neutral" },
  delivered: { label: "Delivered", tone: "nominal" },
  delayed: { label: "Delayed", tone: "critical" },
  held: { label: "Held", tone: "caution" },
  // vessel
  active: { label: "Active", tone: "nominal" },
  idle: { label: "Idle", tone: "neutral" },
  maintenance: { label: "Maintenance", tone: "caution" },
  offline: { label: "Offline", tone: "critical" },
  // pilot
  on_mission: { label: "On mission", tone: "info" },
  standby: { label: "Standby", tone: "nominal" },
  rest: { label: "Rest", tone: "neutral" },
  // priority
  standard: { label: "Standard", tone: "neutral" },
  priority: { label: "Priority", tone: "caution" },
  critical: { label: "Critical", tone: "critical" },
};

export function StatusPill({ status, dot = true }: { status: string; dot?: boolean }) {
  const m = STATUS_META[status] ?? { label: status, tone: "neutral" };
  return (
    <span className={`pill pill-${m.tone}`}>
      {dot && <span className="pill-dot" />}
      {m.label}
    </span>
  );
}

export function HealthDot({ tier, pulse = false }: { tier: HealthTier; pulse?: boolean }) {
  return <span className={`hdot hdot-${tier} ${pulse ? "hdot-pulse" : ""}`} title={tier} />;
}

// -------------------- KPI tile --------------------
export function KpiTile({
  label, value, unit, delta, spark, onClick, active,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: { dir: "up" | "down"; value: string; good?: boolean };
  spark?: number[];
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button className={`kpi ${onClick ? "kpi-click" : ""} ${active ? "kpi-active" : ""}`} onClick={onClick}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value tnum">
        {value}
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
      <div className="kpi-foot">
        {delta && (
          <span className={`kpi-delta ${delta.good ? "good" : "bad"}`}>
            {delta.dir === "up" ? "↑" : "↓"} {delta.value}
          </span>
        )}
        {spark && <Sparkline data={spark} />}
      </div>
    </button>
  );
}

// -------------------- Sparkline --------------------
export function Sparkline({ data, w = 68, h = 20, color = "var(--ink-3)" }: { data: number[]; w?: number; h?: number; color?: string }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / range) * (h - 3) - 1.5;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// -------------------- Progress bar --------------------
export function ProgressBar({ value, tone = "info", height = 4 }: { value: number; tone?: string; height?: number }) {
  return (
    <div className="pbar" style={{ height }}>
      <div className={`pbar-fill pbar-${tone}`} style={{ width: `${Math.max(2, Math.min(100, value))}%` }} />
    </div>
  );
}

// -------------------- Radial gauge (fuel, hull) --------------------
export function Gauge({ value, label, sub, tone }: { value: number; label: string; sub?: string; tone?: string }) {
  const r = 26, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const t = tone ?? (value < 25 ? "critical" : value < 50 ? "caution" : "nominal");
  return (
    <div className="gauge">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--fill-med)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={r} fill="none"
          stroke={`var(--${t})`} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
          transform="rotate(-90 32 32)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x="32" y="34" className="gauge-num tnum" textAnchor="middle">{value}</text>
      </svg>
      <div className="gauge-meta">
        <div className="gauge-label">{label}</div>
        {sub && <div className="gauge-sub">{sub}</div>}
      </div>
    </div>
  );
}

// -------------------- Radial stat (big number + ring, for drawers) --------------------
function toneFor(v: number) { return v < 25 ? "critical" : v < 45 ? "caution" : "nominal"; }

export function RadialStat({ value, label, sub, tone }: { value: number; label: string; sub?: string; tone?: string }) {
  const r = 30, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const t = tone ?? toneFor(value);
  return (
    <div className="rstat">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--fill-med)" strokeWidth="4" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={`var(--${t})`} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off}
          transform="rotate(-90 40 40)"
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.2,0.8,0.2,1)" }}
        />
        <text x="40" y="42" className="rstat-num tnum" textAnchor="middle">{value}<tspan className="rstat-pct">%</tspan></text>
      </svg>
      <div className="rstat-label">{label}</div>
      {sub && <div className="rstat-sub">{sub}</div>}
    </div>
  );
}

// -------------------- Mini gauge (small labeled ring, value inside) --------------------
export function MiniGauge({ value, label, tone }: { value: number; label: string; tone?: string }) {
  const r = 17, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const t = tone ?? toneFor(value);
  return (
    <div className="mgauge">
      <svg width="46" height="46" viewBox="0 0 46 46">
        <circle cx="23" cy="23" r={r} fill="none" stroke="var(--fill-med)" strokeWidth="3.5" />
        <circle cx="23" cy="23" r={r} fill="none" stroke={`var(--${t})`} strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 23 23)"
          style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.2,0.8,0.2,1)" }} />
        <text x="23" y="26" className="mgauge-num tnum" textAnchor="middle">{value}</text>
      </svg>
      <div className="mgauge-label">{label}</div>
    </div>
  );
}

// -------------------- Load meter (segmented, non-bar) --------------------
export function LoadMeter({ value, segments = 10 }: { value: number; segments?: number }) {
  const filled = Math.round((value / 100) * segments);
  return (
    <div className="lmeter">
      {Array.from({ length: segments }).map((_, i) => (
        <span key={i} className={`lmeter-seg ${i < filled ? "on" : ""}`} />
      ))}
    </div>
  );
}

// -------------------- Avatar (generated) --------------------
export function Avatar({ name, hue, size = 30 }: { name: string; hue: number; size?: number }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <span
      className="avatar tnum"
      style={{
        width: size, height: size, fontSize: size * 0.38,
        background: `linear-gradient(135deg, hsl(${hue} 42% 26%), hsl(${hue} 46% 18%))`,
        color: `hsl(${hue} 60% 78%)`,
      }}
    >
      {initials}
    </span>
  );
}

// -------------------- Card --------------------
export function Card({ children, className = "", ...rest }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`} {...rest}>{children}</div>;
}

// -------------------- Section header --------------------
export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-title">
      <span>{children}</span>
      {action}
    </div>
  );
}
