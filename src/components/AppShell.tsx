import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { CommandPalette } from "./CommandPalette";
import { kpis } from "../data/mock";
import "./AppShell.css";

const NAV = [
  { to: "/", label: "Command Center", icon: IconGrid, end: true },
  { to: "/manifests", label: "Manifests", icon: IconBox, badge: kpis.activeManifests },
  { to: "/fleet", label: "Fleet", icon: IconShip },
  { to: "/pilots", label: "Pilots", icon: IconCrew },
  { to: "/analytics", label: "Analytics", icon: IconChart },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><IconOrbit /></div>
          <div className="brand-name">
            Interspace
            <span className="brand-sub">Logistics · Sol Network</span>
          </div>
        </div>

        <button className="search-trigger" onClick={() => setPaletteOpen(true)}>
          <IconSearch />
          <span>Search or jump to…</span>
          <kbd>⌘K</kbd>
        </button>

        <nav className="nav">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
                <Icon />
                <span>{n.label}</span>
                {n.badge != null && <span className="nav-badge tnum">{n.badge}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="nav-section-label">Network</div>
        <nav className="nav">
          <a className="nav-item nav-static"><IconPin /><span>Spaceports</span><span className="nav-badge tnum">7</span></a>
          <a className="nav-item nav-static"><IconRoute /><span>Trajectories</span></a>
        </nav>

        <div className="sidebar-foot">
          <div className="net-status">
            <span className="hdot hdot-nominal hdot-pulse" />
            <span>All relays nominal</span>
          </div>
          <div className="sol-time tnum">SOL 3000.238 · 14:22 UTC-M</div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <Breadcrumb path={loc.pathname} />
          <div className="topbar-actions">
            <button className="tb-btn"><IconBell />{kpis.openAlerts > 0 && <span className="tb-dot" />}</button>
            <button className="tb-btn"><IconFilter /></button>
            <div className="tb-user">
              <span className="avatar" style={{ width: 28, height: 28, fontSize: 11, background: "linear-gradient(135deg,#2a3340,#1a2029)", color: "var(--ink-1)" }}>OC</span>
            </div>
          </div>
        </div>
        <div className="content">{children}</div>
      </main>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

function Breadcrumb({ path }: { path: string }) {
  const map: Record<string, string> = {
    "/": "Command Center", "/manifests": "Manifests", "/fleet": "Fleet",
    "/pilots": "Pilots", "/analytics": "Analytics",
  };
  const label = map[path] ?? path.slice(1);
  return (
    <div className="crumb">
      <span className="crumb-root">Sol Network</span>
      <span className="crumb-sep">/</span>
      <span className="crumb-cur">{label}</span>
    </div>
  );
}

// -------------------- Icons (inline, stroke) --------------------
function I({ children }: { children: ReactNode }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}
function IconGrid() { return <I><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></I>; }
function IconBox() { return <I><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5M12 13v8" /></I>; }
function IconShip() { return <I><path d="M12 2l4 7v6l-4 5-4-5V9l4-7z" /><path d="M8 12h8" /></I>; }
function IconCrew() { return <I><circle cx="12" cy="8" r="3.2" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></I>; }
function IconChart() { return <I><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></I>; }
function IconPin() { return <I><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" /></I>; }
function IconRoute() { return <I><circle cx="5" cy="19" r="2.4" /><circle cx="19" cy="5" r="2.4" /><path d="M7 17c6-1 8-4 10-10" strokeDasharray="2 2.5" /></I>; }
function IconSearch() { return <I><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></I>; }
function IconBell() { return <I><path d="M18 8a6 6 0 10-12 0c0 7-3 8-3 8h18s-3-1-3-8z" /><path d="M13.7 21a2 2 0 01-3.4 0" /></I>; }
function IconFilter() { return <I><path d="M4 4h16l-6.5 8v6l-3 2v-8L4 4z" /></I>; }
function IconOrbit() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none" /><ellipse cx="12" cy="12" rx="10" ry="4.6" transform="rotate(28 12 12)" /></svg>; }
