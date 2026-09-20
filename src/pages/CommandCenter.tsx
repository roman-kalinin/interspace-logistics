import { useState, useRef } from "react";
import { SolarSystem3D } from "../components/solar/SolarSystem3D";
import type { Variant, SolarSystem3DHandle } from "../components/solar/SolarSystem3D";
import { DevFab } from "../components/solar/DevFab";
import { CourierPanel } from "../components/solar/CourierPanel";
import { VesselDrawer } from "../components/VesselDrawer";
import { HealthDot, MiniGauge } from "../components/primitives";
import { kpis, vessels, alerts, pilotById, throughput, onTimeTrend } from "../data/mock";
import { Sparkline } from "../components/primitives";
import type { Vessel, Manifest } from "../data/types";
import "./pages.css";
import "../components/solar/hud.css";

const cr = (n: number) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : (n / 1e3).toFixed(0) + "K");
const VARIANT_LABEL: Record<Variant, string> = { 1: "Orbital", 2: "Cinematic", 3: "Tactical" };
const ago = (m: number) => (m < 60 ? `${m}m` : `${Math.floor(m / 60)}h`) + " ago";
const SEV: Record<string, string> = { critical: "Critical", caution: "Caution", nominal: "Resolved" };

export function CommandCenter() {
  const [variant, setVariant] = useState<Variant>(2);
  const [vessel, setVessel] = useState<Vessel | null>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [alertsOpen, setAlertsOpen] = useState(true);
  const mapRef = useRef<SolarSystem3DHandle>(null);
  const activeVessels = vessels.filter((v) => v.status === "active").slice(0, 4);
  const openAlerts = alerts.filter((a) => a.severity !== "nominal");

  const closeCourier = () => { setManifest(null); mapRef.current?.deselect(); };

  return (
    <div className="cc-stage">
      {/* The 3D map is the whole surface */}
      <SolarSystem3D ref={mapRef} variant={variant} onSelectManifest={(m) => setManifest(m)} />

      {/* ---- HUD: top bar ---- */}
      <div className="hud hud-top">
        <div className="hud-title">
          <span className="hud-name">Command Center</span>
          <span className="hud-sub"><span className="hdot hdot-nominal hdot-pulse" /> Sol Network · {VARIANT_LABEL[variant]} view</span>
        </div>
        <div className="hud-live"><span className="hdot hdot-nominal hdot-pulse" /> LIVE</div>
      </div>

      {/* ---- HUD: KPI chips (top-left, under title) ---- */}
      <div className="hud hud-kpis">
        <KpiChip label="Active manifests" value={String(kpis.activeManifests)} spark={throughput.map((t) => t.v)} />
        <KpiChip label="On-time" value={`${kpis.onTimePct}%`} spark={onTimeTrend.map((t) => t.v)} good />
        <KpiChip label="Fleet active" value={`${kpis.fleetActive}/${kpis.fleetTotal}`} />
        <KpiChip label="Value in flight" value={`₡${cr(kpis.valueInFlightCr)}`} good />
      </div>

      {/* ---- HUD: Control Tower (left) ---- */}
      <div className={`hud hud-alerts ${alertsOpen ? "" : "collapsed"}`}>
        <button className="hud-panel-head" onClick={() => setAlertsOpen((o) => !o)}>
          <span>Control Tower</span>
          <span className="hud-badge tnum">{openAlerts.length}</span>
          <svg className={`hud-chev ${alertsOpen ? "up" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {alertsOpen && (
          <div className="hud-alert-list">
            {openAlerts.map((a) => (
              <div key={a.id} className="hud-alert">
                <div className="hud-alert-top">
                  <span className={`hud-sev hud-sev-${a.severity}`}>{SEV[a.severity]}</span>
                  <span className="hud-alert-time tnum">{ago(a.minutesAgo)}</span>
                </div>
                <div className="hud-alert-title">{a.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- HUD: fleet strip (bottom) ---- */}
      <div className="hud hud-fleet">
        {activeVessels.map((v) => {
          const p = pilotById(v.pilot!);
          return (
            <button key={v.id} className="hud-vessel" onClick={() => setVessel(v)}>
              <div className="hud-vessel-id">
                <div className="hud-vessel-name"><HealthDot tier={v.health} pulse={v.health !== "nominal"} /> {v.name}</div>
                <div className="hud-vessel-meta">{p?.callsign} · {v.class}</div>
              </div>
              <div className="hud-vessel-gauges">
                <MiniGauge value={v.fuelPct} label="Fuel" />
                <MiniGauge value={v.hullIntegrityPct} label="Hull" tone={v.hullIntegrityPct < 60 ? "critical" : v.hullIntegrityPct < 80 ? "caution" : "nominal"} />
                <MiniGauge value={Math.round((v.loadTons / v.capacityTons) * 100)} label="Load" tone="info" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ---- Courier detail panel (right, in-map, no backdrop) ---- */}
      <CourierPanel manifest={manifest} onClose={closeCourier} />

      {/* Vessel drawer still used for fleet-strip clicks (kept as slide-in, but no blur) */}
      <VesselDrawer vessel={vessel} onClose={() => setVessel(null)} inline />

      <DevFab variant={variant} onChange={setVariant} />
    </div>
  );
}

function KpiChip({ label, value, spark, good }: { label: string; value: string; spark?: number[]; good?: boolean }) {
  return (
    <div className="kpi-chip">
      <div className="kpi-chip-label">{label}</div>
      <div className="kpi-chip-row">
        <span className="kpi-chip-value tnum">{value}</span>
        {spark && <Sparkline data={spark} w={48} h={16} color={good ? "var(--nominal)" : "var(--ink-3)"} />}
      </div>
    </div>
  );
}
