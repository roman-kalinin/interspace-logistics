import { useState } from "react";
import { vessels, pilotById, portById } from "../data/mock";
import { StatusPill, HealthDot, Gauge, KpiTile } from "../components/primitives";
import { VesselDrawer } from "../components/VesselDrawer";
import type { Vessel } from "../data/types";
import "./pages.css";

export function Fleet() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Vessel | null>(null);
  const shown = filter === "all" ? vessels : vessels.filter((v) => v.status === filter);
  const active = vessels.filter((v) => v.status === "active").length;
  const avgHull = Math.round(vessels.reduce((s, v) => s + v.hullIntegrityPct, 0) / vessels.length);
  const needService = vessels.filter((v) => v.nextService <= 4).length;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-title">Fleet</div>
          <div className="page-desc">Vessel roster · telemetry & maintenance status</div>
        </div>
      </div>

      <div className="kpi-row">
        <KpiTile label="Vessels active" value={`${active}/${vessels.length}`} />
        <KpiTile label="Avg hull integrity" value={avgHull} unit="%" />
        <KpiTile label="Service due (≤4d)" value={needService} delta={{ dir: "up", value: "2", good: false }} />
        <KpiTile label="Light-years logged" value={vessels.reduce((s, v) => s + v.lightYearsLogged, 0).toLocaleString()} />
      </div>

      <div className="toolbar">
        <div className="seg">
          {["all", "active", "idle", "maintenance", "offline"].map((k) => (
            <button key={k} className={`seg-btn ${filter === k ? "on" : ""}`} onClick={() => setFilter(k)}>
              {k[0].toUpperCase() + k.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card-grid">
        {shown.map((v) => {
          const p = v.pilot ? pilotById(v.pilot) : null;
          const loadPct = Math.round((v.loadTons / v.capacityTons) * 100);
          const loc = v.location === "in_transit" ? "In transit" : portById(v.location)?.name;
          return (
            <div key={v.id} className="vessel-card" onClick={() => setSelected(v)} style={{ cursor: "pointer" }}>
              <div className="vc-head">
                <div>
                  <div className="vc-name"><HealthDot tier={v.health} pulse={v.health !== "nominal"} /> {v.name}</div>
                  <div className="vc-class">{v.class} · {loc}</div>
                </div>
                <StatusPill status={v.status} />
              </div>

              <div className="vc-gauges">
                <Gauge value={v.fuelPct} label="Fuel" sub="reaction mass" />
                <Gauge value={v.hullIntegrityPct} label="Hull" sub="integrity" />
              </div>

              <div className="vc-tele">
                <div className="tele">
                  <div className="tele-label">Load</div>
                  <div className="tele-val tnum">{loadPct}<span className="u">%</span></div>
                </div>
                <div className="tele">
                  <div className="tele-label">Capacity</div>
                  <div className="tele-val tnum">{(v.capacityTons / 1000).toFixed(1)}<span className="u">kt</span></div>
                </div>
                <div className="tele">
                  <div className="tele-label">Next svc</div>
                  <div className="tele-val tnum">{v.nextService}<span className="u">d</span></div>
                </div>
              </div>

              <div className="vc-foot">
                {p ? <>Piloted by <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{p.callsign}</span></> : "Unassigned"}
              </div>
            </div>
          );
        })}
      </div>

      <VesselDrawer vessel={selected} onClose={() => setSelected(null)} />
    </>
  );
}
