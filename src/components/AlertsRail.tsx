import { alerts } from "../data/mock";
import { SectionTitle } from "./primitives";
import "./AlertsRail.css";

const ago = (m: number) => (m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`) + " ago";
const SEV_LABEL: Record<string, string> = { critical: "Critical", caution: "Caution", nominal: "Resolved" };

export function AlertsRail() {
  return (
    <div className="alerts-rail">
      <SectionTitle action={<span className="rail-count tnum">{alerts.filter((a) => a.severity !== "nominal").length} open</span>}>
        Control Tower
      </SectionTitle>
      <div className="alert-list">
        {alerts.map((a) => (
          <div key={a.id} className="alert-card">
            <div className="alert-top">
              <span className={`sev-tag sev-${a.severity}`}>{SEV_LABEL[a.severity]}</span>
              <span className="alert-time tnum">{ago(a.minutesAgo)}</span>
            </div>
            <div className="alert-title">{a.title}</div>
            <div className="alert-detail">{a.detail}</div>
            {a.severity !== "nominal" && (
              <div className="alert-actions">
                <button className="alert-btn">Acknowledge</button>
                <button className="alert-btn alert-btn-ghost">View</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
