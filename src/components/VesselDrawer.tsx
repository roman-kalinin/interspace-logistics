import { useEffect } from "react";
import type { Vessel } from "../data/types";
import { pilotById, portById, manifests, vesselImage } from "../data/mock";
import { StatusPill, HealthDot, Avatar, RadialStat } from "./primitives";
import "./ManifestDrawer.css";

export function VesselDrawer({ vessel, onClose, inline = false }: { vessel: Vessel | null; onClose: () => void; inline?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!vessel) return null;
  const v = vessel;
  const p = v.pilot ? pilotById(v.pilot) : null;
  const loc = v.location === "in_transit" ? "In transit" : portById(v.location)?.name;
  const loadPct = Math.round((v.loadTons / v.capacityTons) * 100);
  const activeManifest = manifests.find((m) => m.vessel === v.id && ["in_transit", "delayed", "loading"].includes(m.status));

  return (
    <div className={`drawer-overlay ${inline ? "drawer-overlay-inline" : ""}`} onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        {vesselImage(v.id) && (
          <div className="drawer-hero">
            <img src={vesselImage(v.id)} alt={v.name} loading="lazy" />
            <div className="drawer-hero-grad" />
            <button className="drawer-close drawer-close-float" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
            <div className="drawer-hero-cap">
              <span className="drawer-hero-class cell-mono">{v.class}</span>
              <span className="drawer-hero-name">{v.name}</span>
            </div>
          </div>
        )}
        {!vesselImage(v.id) && (
          <div className="drawer-head">
            <div>
              <div className="drawer-id cell-mono">{v.class.toUpperCase()}</div>
              <div className="drawer-cargo">{v.name}</div>
            </div>
            <button className="drawer-close" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        <div className="drawer-pills">
          <StatusPill status={v.status} />
          <span className="pill pill-neutral"><HealthDot tier={v.health} /> {v.health}</span>
          <span className="pill pill-neutral">{loc}</span>
        </div>

        <div className="drawer-section-label">Telemetry</div>
        <div className="vessel-tele-grid">
          <RadialStat value={v.fuelPct} label="Fuel" sub="reaction mass" />
          <RadialStat value={v.hullIntegrityPct} label="Hull" sub="integrity" />
          <RadialStat value={loadPct} label="Load" sub={`${(v.loadTons / 1000).toFixed(1)}/${(v.capacityTons / 1000).toFixed(1)}kt`} tone="info" />
        </div>

        <div className="drawer-section-label">Vessel record</div>
        <div className="detail-grid">
          <Detail label="Class" value={v.class} />
          <Detail label="Capacity" value={`${(v.capacityTons / 1000).toFixed(1)} kt`} />
          <Detail label="Light-years logged" value={v.lightYearsLogged.toLocaleString()} />
          <Detail label="Next service" value={v.nextService === 0 ? "Overdue" : `${v.nextService} days`} />
        </div>

        {p && (
          <>
            <div className="drawer-section-label">Assigned pilot</div>
            <div className="assign-card">
              <div className="assign-pilot" style={{ marginTop: 0, paddingTop: 0, boxShadow: "none" }}>
                <Avatar name={p.name} hue={p.avatarHue} size={38} />
                <div>
                  <div className="ap-name">{p.name}</div>
                  <div className="ap-call cell-mono">{p.callsign} · {p.clearance} · {p.onTimePct}% on-time</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeManifest && (
          <>
            <div className="drawer-section-label">Current haul</div>
            <div className="assign-card">
              <div className="av-head"><span className="cell-mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{activeManifest.id}</span></div>
              <div className="av-name" style={{ marginTop: 4 }}>{activeManifest.cargo}</div>
              <div className="av-tele" style={{ marginLeft: 0, marginTop: 10 }}>
                <span>{portById(activeManifest.origin).code} → {portById(activeManifest.destination).code}</span>
                <span>{activeManifest.progress}% complete</span>
              </div>
            </div>
          </>
        )}

        <div className="drawer-actions">
          <button className="da-btn da-primary">Track live</button>
          <button className="da-btn">Service log</button>
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
