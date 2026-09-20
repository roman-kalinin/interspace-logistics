import type { Manifest } from "../../data/types";
import { portById, vesselById, pilotById, vesselImage } from "../../data/mock";
import { StatusPill, HealthDot, Avatar } from "../primitives";
import "./hud.css";

const MILESTONES = ["Booked", "Loaded", "Departed", "In transit", "Approach", "Delivered"];
function milestoneIndex(m: Manifest): number {
  switch (m.status) {
    case "held": return 0;
    case "loading": return 1;
    case "delivered": return 6;
    case "delayed": return 3;
    default: return m.progress > 85 ? 4 : m.progress > 5 ? 3 : 2;
  }
}
const fmtCr = (n: number) => "₡" + n.toLocaleString("en-US");

export function CourierPanel({ manifest, onClose }: { manifest: Manifest | null; onClose: () => void }) {
  if (!manifest) return null;
  const m = manifest;
  const o = portById(m.origin), d = portById(m.destination);
  const v = vesselById(m.vessel);
  const p = v ? pilotById(v.pilot ?? "") : null;
  const mi = milestoneIndex(m);
  const img = vesselImage(m.vessel);

  return (
    <div className="courier-panel">
      <button className="cp-close cp-close-float" onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      {img && (
        <div className="cp-hero">
          <img src={img} alt={v?.name} loading="lazy" />
          <div className="cp-hero-grad" />
          <div className="cp-hero-cap">
            <span className="cp-hero-class cell-mono">{v?.class}</span>
            <span className="cp-hero-name">{v?.name}</span>
          </div>
        </div>
      )}

      <div className="cp-body">
      <div className="cp-head">
        <div>
          <div className="cp-id cell-mono">{m.id}{!img && ` · ${v?.name}`}</div>
          <div className="cp-cargo">{m.cargo}</div>
        </div>
        {!img && (
          <button className="cp-close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <div className="cp-pills">
        <StatusPill status={m.status} />
        <StatusPill status={m.priority} />
        <span className="pill pill-neutral">{m.cargoClass}</span>
      </div>

      {/* route */}
      <div className="cp-route">
        <div className="cp-port">
          <div className="cp-code cell-mono">{o.code}</div>
          <div className="cp-pname">{o.body}</div>
        </div>
        <div className="cp-line">
          <div className="cp-track"><div className="cp-track-fill" style={{ width: `${m.progress}%` }} /></div>
          <div className="cp-eta tnum">{m.status === "delivered" ? "Delivered" : `ETA ${m.etaHours}h`}</div>
        </div>
        <div className="cp-port cp-right">
          <div className="cp-code cell-mono">{d.code}</div>
          <div className="cp-pname">{d.body}</div>
        </div>
      </div>

      {/* milestones */}
      <div className="cp-label">Milestone sequence</div>
      <div className="cp-ms">
        {MILESTONES.map((label, i) => {
          const state = i < mi ? "done" : i === mi ? "current" : "pending";
          return (
            <div key={label} className={`cp-ms-item cp-ms-${state}`}>
              <div className="cp-ms-node">{state === "done" ? "✓" : i + 1}</div>
              <div className="cp-ms-label">{label}</div>
              {i < MILESTONES.length - 1 && <div className={`cp-ms-conn ${i < mi ? "on" : ""}`} />}
            </div>
          );
        })}
      </div>

      {/* details */}
      <div className="cp-grid">
        <Detail label="Client" value={m.client} />
        <Detail label="Mass" value={`${m.massTons.toLocaleString()} t`} />
        <Detail label="Value" value={fmtCr(m.valueCr)} />
        <Detail label="Departed" value={m.departedDaysAgo === 0 ? "Not yet" : `${m.departedDaysAgo}d ago`} />
      </div>

      {/* assignment */}
      {v && (
        <div className="cp-assign">
          <div className="cp-assign-vessel">
            <HealthDot tier={v.health} />
            <span className="cp-av-name">{v.name}</span>
            <span className="cp-av-tele tnum">Fuel {v.fuelPct}% · Hull {v.hullIntegrityPct}%</span>
          </div>
          {p && (
            <div className="cp-assign-pilot">
              <Avatar name={p.name} hue={p.avatarHue} size={30} />
              <div>
                <div className="cp-ap-name">{p.name}</div>
                <div className="cp-ap-call cell-mono">{p.callsign} · {p.clearance}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="cp-actions">
        <button className="cp-btn cp-primary">Track live</button>
        <button className="cp-btn">Reassign</button>
      </div>
      </div>{/* .cp-body */}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="cp-detail">
      <div className="cp-detail-label">{label}</div>
      <div className="cp-detail-value">{value}</div>
    </div>
  );
}
