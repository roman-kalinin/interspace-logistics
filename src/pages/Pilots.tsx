import { pilots, vesselById, portById } from "../data/mock";
import { StatusPill, Avatar, KpiTile } from "../components/primitives";
import "./pages.css";

export function Pilots() {
  const onMission = pilots.filter((p) => p.status === "on_mission").length;
  const avgOnTime = Math.round(pilots.reduce((s, p) => s + p.onTimePct, 0) / pilots.length);
  const nearLimit = pilots.filter((p) => p.hoursThisCycle / p.maxHours > 0.85).length;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-title">Pilots</div>
          <div className="page-desc">Crew roster · duty-hour limits & performance</div>
        </div>
      </div>

      <div className="kpi-row">
        <KpiTile label="On mission" value={onMission} />
        <KpiTile label="Avg on-time" value={avgOnTime} unit="%" />
        <KpiTile label="Near duty limit" value={nearLimit} delta={{ dir: "up", value: "1", good: false }} />
        <KpiTile label="Total crew" value={pilots.length} />
      </div>

      <div className="card-grid">
        {pilots.map((p) => {
          const v = p.vessel ? vesselById(p.vessel) : null;
          const dutyPct = Math.round((p.hoursThisCycle / p.maxHours) * 100);
          const dutyTone = dutyPct > 90 ? "critical" : dutyPct > 75 ? "caution" : "nominal";
          const home = portById(p.homeport);
          return (
            <div key={p.id} className="pilot-card">
              <div className="pc-head">
                <Avatar name={p.name} hue={p.avatarHue} size={42} />
                <div className="pc-id">
                  <div className="pc-name">{p.name}</div>
                  <div className="pc-call">{p.callsign} · {p.clearance}</div>
                </div>
                <StatusPill status={p.status} />
              </div>

              <div className="pc-stats">
                <div>
                  <div className="pc-stat-label">Rating</div>
                  <div className="pc-stat-val"><span className="rating">★ {p.rating.toFixed(1)}</span></div>
                </div>
                <div>
                  <div className="pc-stat-label">On-time</div>
                  <div className="pc-stat-val tnum">{p.onTimePct}%</div>
                </div>
                <div>
                  <div className="pc-stat-label">Missions</div>
                  <div className="pc-stat-val tnum">{p.missionsCompleted}</div>
                </div>
              </div>

              <div className="duty-clock">
                <div className="duty-head">
                  <span className="duty-label">Duty cycle · homeport {home?.code}</span>
                  <span className="duty-val tnum">{p.hoursThisCycle} / {p.maxHours}h</span>
                </div>
                <div className="pbar" style={{ height: 5 }}>
                  <div className={`pbar-fill pbar-${dutyTone}`} style={{ width: `${dutyPct}%` }} />
                </div>
              </div>

              <div className="vc-foot" style={{ marginTop: 14 }}>
                {v ? <>Aboard <span style={{ color: "var(--ink-1)", fontWeight: 600 }}>{v.name}</span></> : "No active assignment"}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
