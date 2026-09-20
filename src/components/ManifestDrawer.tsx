import { useEffect } from "react";
import type { Manifest } from "../data/types";
import { portById, vesselById, pilotById } from "../data/mock";
import { StatusPill, HealthDot, Avatar } from "./primitives";
import "./ManifestDrawer.css";

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

export function ManifestDrawer({ manifest, onClose }: { manifest: Manifest | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!manifest) return null;
  const m = manifest;
  const o = portById(m.origin), d = portById(m.destination);
  const v = vesselById(m.vessel);
  const p = v ? pilotById(v.pilot ?? "") : null;
  const mi = milestoneIndex(m);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div>
            <div className="drawer-id cell-mono">{m.id}</div>
            <div className="drawer-cargo">{m.cargo}</div>
          </div>
          <button className="drawer-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="drawer-pills">
          <StatusPill status={m.status} />
          <StatusPill status={m.priority} />
          <span className="pill pill-neutral">{m.cargoClass}</span>
        </div>

        {/* Route */}
        <div className="drawer-route">
          <div className="dr-port">
            <div className="dr-code cell-mono">{o.code}</div>
            <div className="dr-name">{o.name}</div>
            <div className="dr-body">{o.body}</div>
          </div>
          <div className="dr-line">
            <div className="dr-track"><div className="dr-track-fill" style={{ width: `${m.progress}%` }} /></div>
            <div className="dr-ship" style={{ left: `${m.progress}%` }}>◈</div>
            <div className="dr-eta tnum">{m.status === "delivered" ? "Delivered" : `ETA ${m.etaHours}h`}</div>
          </div>
          <div className="dr-port dr-port-right">
            <div className="dr-code cell-mono">{d.code}</div>
            <div className="dr-name">{d.name}</div>
            <div className="dr-body">{d.body}</div>
          </div>
        </div>

        {/* Milestone timeline */}
        <div className="drawer-section-label">Milestone sequence</div>
        <div className="milestones">
          {MILESTONES.map((label, i) => {
            const state = i < mi ? "done" : i === mi ? "current" : "pending";
            return (
              <div key={label} className={`ms ms-${state}`}>
                <div className="ms-node">{state === "done" ? "✓" : i + 1}</div>
                <div className="ms-label">{label}</div>
                {i < MILESTONES.length - 1 && <div className={`ms-conn ${i < mi ? "on" : ""}`} />}
              </div>
            );
          })}
        </div>

        {/* Details grid */}
        <div className="drawer-section-label">Shipment</div>
        <div className="detail-grid">
          <Detail label="Client" value={m.client} />
          <Detail label="Mass" value={`${m.massTons.toLocaleString()} t`} />
          <Detail label="Declared value" value={fmtCr(m.valueCr)} />
          <Detail label="Departed" value={m.departedDaysAgo === 0 ? "Not yet" : `${m.departedDaysAgo}d ago`} />
        </div>

        {/* Assignment */}
        {v && (
          <>
            <div className="drawer-section-label">Assigned crew & vessel</div>
            <div className="assign-card">
              <div className="assign-vessel">
                <div className="av-head"><HealthDot tier={v.health} /> <span className="av-name">{v.name}</span></div>
                <div className="av-class">{v.class}</div>
                <div className="av-tele">
                  <span>Fuel <b className="tnum">{v.fuelPct}%</b></span>
                  <span>Hull <b className="tnum">{v.hullIntegrityPct}%</b></span>
                  <span>Load <b className="tnum">{Math.round((v.loadTons / v.capacityTons) * 100)}%</b></span>
                </div>
              </div>
              {p && (
                <div className="assign-pilot">
                  <Avatar name={p.name} hue={p.avatarHue} size={38} />
                  <div>
                    <div className="ap-name">{p.name}</div>
                    <div className="ap-call cell-mono">{p.callsign} · {p.clearance}</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="drawer-actions">
          <button className="da-btn da-primary">Track live</button>
          <button className="da-btn">Manifest doc</button>
          <button className="da-btn">Reassign</button>
        </div>
      </aside>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{value}</div>
    </div>
  );
}
