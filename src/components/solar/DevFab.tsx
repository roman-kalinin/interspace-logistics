import { useState } from "react";
import type { Variant } from "./SolarSystem3D";
import "./solar.css";

const OPTIONS: { v: Variant; name: string; desc: string }[] = [
  { v: 1, name: "Orbital", desc: "Top-down plane" },
  { v: 2, name: "Cinematic", desc: "Tilted, auto-orbit" },
  { v: 3, name: "Tactical", desc: "Grid overlay" },
];

export function DevFab({ variant, onChange }: { variant: Variant; onChange: (v: Variant) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="dev-fab">
      {open && (
        <div className="dev-fab-menu">
          <div className="dev-fab-title">Command Center variant</div>
          {OPTIONS.map((o) => (
            <button
              key={o.v}
              className={`dev-opt ${variant === o.v ? "on" : ""}`}
              onClick={() => { onChange(o.v); }}
            >
              <span className="dev-opt-num">{o.v}</span>
              <span className="dev-opt-meta">
                <span className="dev-opt-name">{o.name}</span>
                <span className="dev-opt-desc">{o.desc}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      <button className={`dev-fab-btn ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)} title="Switch variant (dev)">
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 5.4L20 8l-4 4 1 6-5-2.8L7 18l1-6-4-4 5.6-.6L12 2z" /></svg>
        )}
        {!open && <span className="dev-fab-badge">{variant}</span>}
      </button>
    </div>
  );
}
