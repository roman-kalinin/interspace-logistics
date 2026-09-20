import { useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { throughput, onTimeTrend, dailyTonnage, fleetUtilization, cargoMix, kpis } from "../data/mock";
import { KpiTile } from "../components/primitives";
import "./pages.css";

const AXIS = { fontSize: 11, fill: "rgba(244,245,247,0.42)" };
const RANGES = ["7d", "30d", "90d", "1yr"];

function ChartTip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rc-tip">
      <div className="rc-tip-label">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="rc-tip-row">
          <span className="rc-tip-key"><span className="rc-tip-dot" style={{ background: p.color || p.stroke || p.fill }} />{p.name}</span>
          <span className="rc-tip-val tnum">{p.value}{unit}</span>
        </div>
      ))}
    </div>
  );
}

export function Analytics() {
  const [range, setRange] = useState("30d");

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-title">Analytics</div>
          <div className="page-desc">Network performance · throughput, reliability & utilization</div>
        </div>
        <div className="time-range">
          {RANGES.map((r) => (
            <button key={r} className={`tr-btn ${range === r ? "on" : ""}`} onClick={() => setRange(r)}>{r}</button>
          ))}
        </div>
      </div>

      <div className="kpi-row">
        <KpiTile label="On-time delivery" value={kpis.onTimePct} unit="%" delta={{ dir: "up", value: "2 pts", good: true }} />
        <KpiTile label="Weekly throughput" value={261} unit=" mfx" delta={{ dir: "up", value: "12%", good: true }} />
        <KpiTile label="Fleet utilization" value={73} unit="%" delta={{ dir: "up", value: "4%", good: true }} />
        <KpiTile label="Avg transit" value={9.4} unit=" days" delta={{ dir: "down", value: "0.6d", good: true }} />
      </div>

      <div className="an-grid">
        {/* Throughput area */}
        <div className="chart-card">
          <div className="chart-head">
            <span className="chart-title">Manifest throughput</span>
            <span className="chart-big tnum">261</span>
          </div>
          <div className="chart-sub">Completed manifests per week</div>
          <div className="chart-body" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughput} margin={{ top: 4, right: 6, left: -6, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-tp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--info)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--info)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--grid)" />
                <XAxis dataKey="t" tick={AXIS} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTip />} cursor={{ stroke: "var(--ink-4)", strokeWidth: 1 }} />
                <Area type="monotone" dataKey="v" name="Manifests" stroke="var(--info)" strokeWidth={2} fill="url(#g-tp)" dot={false} activeDot={{ r: 4, fill: "var(--info)" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* On-time line */}
        <div className="chart-card">
          <div className="chart-head">
            <span className="chart-title">On-time delivery rate</span>
            <span className="chart-big tnum">96%</span>
          </div>
          <div className="chart-sub">OTIF trend, rolling weekly</div>
          <div className="chart-body" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={onTimeTrend} margin={{ top: 4, right: 6, left: -6, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--grid)" />
                <XAxis dataKey="t" tick={AXIS} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={AXIS} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTip unit="%" />} cursor={{ stroke: "var(--ink-4)", strokeWidth: 1 }} />
                <Line type="monotone" dataKey="v" name="On-time" stroke="var(--nominal)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "var(--nominal)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tonnage bars — 2 series (legend + colors distinct) */}
        <div className="chart-card wide">
          <div className="chart-head">
            <span className="chart-title">Cargo tonnage — inbound vs outbound</span>
          </div>
          <div className="chart-sub">Daily throughput by direction (tons)</div>
          <div className="chart-body" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTonnage} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barGap={3}>
                <CartesianGrid vertical={false} stroke="var(--grid)" />
                <XAxis dataKey="t" tick={AXIS} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<ChartTip unit=" t" />} cursor={{ fill: "var(--fill-subtle)" }} />
                <Bar dataKey="outbound" name="Outbound" fill="var(--info)" radius={[3, 3, 0, 0]} maxBarSize={22} />
                <Bar dataKey="inbound" name="Inbound" fill="#b58a6e" radius={[3, 3, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span><span className="lg-sq" style={{ background: "var(--info)" }} /> Outbound</span>
            <span><span className="lg-sq" style={{ background: "#b58a6e" }} /> Inbound</span>
          </div>
        </div>

        {/* Fleet utilization donut */}
        <div className="chart-card">
          <div className="chart-head"><span className="chart-title">Fleet status</span></div>
          <div className="chart-sub">Vessel distribution</div>
          <div className="donut-wrap">
            <div style={{ width: 150, height: 150, position: "relative" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={fleetUtilization} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={3} stroke="none">
                    {fleetUtilization.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
                <div className="donut-center">
                  <div className="chart-big tnum">{kpis.fleetTotal}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>vessels</div>
                </div>
              </div>
            </div>
            <div className="chart-legend" style={{ flexDirection: "column", gap: 9 }}>
              {fleetUtilization.map((e) => (
                <span key={e.name}><span className="lg-sq" style={{ background: e.color }} /> {e.name} <b style={{ color: "var(--ink-1)", marginLeft: 4 }} className="tnum">{e.value}</b></span>
              ))}
            </div>
          </div>
        </div>

        {/* Cargo mix horizontal bars */}
        <div className="chart-card">
          <div className="chart-head"><span className="chart-title">Cargo mix in flight</span></div>
          <div className="chart-sub">Tonnage by cargo class</div>
          <div className="chart-body" style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cargoMix} layout="vertical" margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" tick={{ ...AXIS, fontSize: 11.5 }} axisLine={false} tickLine={false} width={92} />
                <Tooltip content={<ChartTip unit=" t" />} cursor={{ fill: "var(--fill-subtle)" }} />
                <Bar dataKey="tons" name="Tonnage" fill="var(--series-1)" radius={[0, 4, 4, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
