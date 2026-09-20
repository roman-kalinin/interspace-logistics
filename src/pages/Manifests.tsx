import { useState, useMemo } from "react";
import { manifests, portById, vesselById } from "../data/mock";
import type { Manifest } from "../data/types";
import { StatusPill, ProgressBar, KpiTile } from "../components/primitives";
import { ManifestDrawer } from "../components/ManifestDrawer";
import "./pages.css";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "in_transit", label: "In transit" },
  { key: "loading", label: "Loading" },
  { key: "delayed", label: "Delayed" },
  { key: "held", label: "Held" },
  { key: "delivered", label: "Delivered" },
] as const;

const cr = (n: number) => (n >= 1e6 ? "₡" + (n / 1e6).toFixed(1) + "M" : "₡" + (n / 1e3).toFixed(0) + "K");

export function Manifests() {
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Manifest | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: manifests.length };
    for (const m of manifests) c[m.status] = (c[m.status] ?? 0) + 1;
    return c;
  }, []);

  const rows = useMemo(() => {
    let r = manifests;
    if (filter !== "all") r = r.filter((m) => m.status === filter);
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter((m) => (m.id + m.cargo + m.client).toLowerCase().includes(s));
    }
    // exception-first: delayed/held float up
    const rank: Record<string, number> = { delayed: 0, held: 1, in_transit: 2, loading: 3, delivered: 4 };
    return [...r].sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9));
  }, [filter, q]);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-title">Manifests</div>
          <div className="page-desc">All cargo shipments across the network · exception-first ordering</div>
        </div>
      </div>

      <div className="kpi-row">
        <KpiTile label="In transit" value={counts.in_transit ?? 0} />
        <KpiTile label="Delayed" value={counts.delayed ?? 0} delta={{ dir: "up", value: "1", good: false }} />
        <KpiTile label="Held at port" value={counts.held ?? 0} />
        <KpiTile label="Delivered (7d)" value={counts.delivered ?? 0} />
      </div>

      <div className="toolbar">
        <div className="seg">
          {FILTERS.map((f) => (
            <button key={f.key} className={`seg-btn ${filter === f.key ? "on" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}<span className="seg-n tnum">{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </div>
        <div className="toolbar-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search manifests…" />
        </div>
      </div>

      <div className="table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Manifest</th>
              <th>Route</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Progress</th>
              <th className="num">Mass</th>
              <th className="num">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const o = portById(m.origin), d = portById(m.destination);
              const v = vesselById(m.vessel);
              const tone = m.status === "delayed" ? "critical" : m.status === "held" ? "caution" : m.status === "delivered" ? "nominal" : "info";
              return (
                <tr key={m.id} onClick={() => setSelected(m)}>
                  <td>
                    <div className="cell-strong cell-mono">{m.id}</div>
                    <div className="cell-sub">{m.cargo}</div>
                  </td>
                  <td>
                    <span className="route-cell">
                      <span className="route-code">{o.code}</span>
                      <span className="route-arrow">→</span>
                      <span className="route-code">{d.code}</span>
                    </span>
                    <div className="cell-sub">{v?.name ?? "Unassigned"}</div>
                  </td>
                  <td><StatusPill status={m.status} /></td>
                  <td><StatusPill status={m.priority} dot={false} /></td>
                  <td>
                    <div className="progress-cell">
                      <ProgressBar value={m.progress} tone={tone} />
                      <span className="progress-pct tnum">{m.progress}%</span>
                    </div>
                  </td>
                  <td className="num tnum">{m.massTons.toLocaleString()} t</td>
                  <td className="num tnum">{cr(m.valueCr)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ManifestDrawer manifest={selected} onClose={() => setSelected(null)} />
    </>
  );
}
