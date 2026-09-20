# Interspace Logistics — MVP Product Spec & Build Document

*Interplanetary logistics SaaS · Year 3000 · React prototype*

---

## 1. Research summary (real-world grounding)

We studied current logistics/fleet/freight SaaS (Samsara, Motive, FourKites, project44, Flexport, Convoy/Uber Freight, ShipBob, Freightos), aerospace mission-ops UIs (SpaceX, NASA, satellite trackers), and modern SaaS design references (Linear, Vercel, Retool, Datadog). Ten conventions recur across every serious logistics product:

1. **Map + synced list is the home screen** — a live geospatial view paired with a filterable list; selecting in one highlights the other.
2. **Dual-axis status model** — every tracked entity has a *lifecycle stage* (where it is) and a *health flag* (on-time / at-risk / delayed). Users filter primarily by health.
3. **Exception-first design** — the product's job is surfacing what needs attention; nominal items recede ("control tower" framing).
4. **Milestone / event timeline per entity** — a horizontal progress tracker that fills as the shipment advances.
5. **KPI tile row** across the top — clickable, filters the list below.
6. **Entity detail** as drawer/panel or full page with tabs.
7. **Consistent status color language** — nominal / caution / fault / inactive.
8. **Global filters** governing the whole view.
9. **Alerts feed** with acknowledge/resolve workflow.
10. **Analytics** as a separate Datadog-style dashboard with a time-range picker.

**Interplanetary twist (differentiators):** transfer/launch **windows as a scheduling resource** (from satellite-pass UIs) and a **fuel / reaction-mass / crew-duty countdown** (the aerospace analog of trucking's Hours-of-Service clock).

## 2. Domain model

| Real-world | Our entity | Lifecycle | Health flag |
|---|---|---|---|
| Shipment / load | **Manifest** | loading → in_transit → delivered (+ delayed / held) | nominal / caution / critical |
| Vehicle | **Vessel** | idle → active → maintenance → offline | nominal / caution / critical |
| Route / lane | **Trajectory** | (origin → destination, distance in AU, transit days) | — |
| Driver / crew | **Pilot** | standby → on_mission → rest → offline (duty-hour clock) | within / near limit |
| Hub / port | **Spaceport** | (network node on system map) | — |
| Alert | **Alert** | new → ack → resolved | info / warn / critical |

## 3. MVP scope — 5 backbone screens

1. **Command Center** *(home)* — system map of vessels + trajectories, synced fleet list, KPI tile row, live alerts rail. The map+list convention.
2. **Manifests** — the operational workhorse. Filterable/sortable table of every shipment with lifecycle stage, health flag, ETA, assigned vessel, priority. Row click → detail drawer with milestone timeline, route, cargo, assigned vessel & pilot.
3. **Fleet** — vessel cards/list + detail: status, assignment, fuel, hull integrity, utilization, next service. Telemetry-forward.
4. **Pilots** — crew roster with duty-hour clock (the HOS analog), rating, on-time %, current assignment.
5. **Analytics** — Datadog-style dashboard: throughput trend, on-time trend, tonnage in/out, fleet utilization donut, cargo mix, lane performance. Time-range picker.

Cross-cutting: **command palette (⌘K)**, global search, alerts control-tower rail, consistent status pills.

## 4. Design language

Modeled on the attached Linear reference: near-monochrome, dark-first, **no hard dividers** — regions separated by layered translucent surfaces and opacity, not outlines. Color appears **only for status** (nominal green, caution amber, critical red, info blue) and is otherwise absent. Aerospace-telemetry accents: monospace numerics with explicit units, nominal/caution/fault language, T-plus event sequences. Generous whitespace, calm density, subtle motion (fade-ins, pulsing live dots, animated route dashes).

Tokens live in `src/index.css`. Charts use a muted, monochrome-leaning series palette validated for contrast.

## 5. Tech

React 19 + TypeScript + Vite · React Router · Recharts for charts · hand-built SVG system map · mock data in `src/data`. No backend — fully client-side prototype with realistic seeded data.

## 6. Component inventory

- `AppShell` — sidebar nav + top bar + command palette host
- `Sidebar`, `TopBar`, `CommandPalette`
- `KpiTile`, `StatusPill`, `HealthDot`, `Sparkline`, `ProgressBar`, `Gauge`, `Avatar`
- `SystemMap` (SVG: spaceports, animated trajectories, moving vessels)
- `FleetList`, `ManifestTable`, `ManifestDetail` (drawer), `MilestoneTimeline`
- `VesselCard`, `PilotCard`, `DutyClock`
- `AlertsRail`, `AlertCard`
- Charts: `ThroughputChart`, `OnTimeChart`, `TonnageChart`, `UtilizationDonut`, `CargoMixChart`

## 7. Build order

1. Design tokens ✓ · mock data ✓
2. Primitives (StatusPill, KpiTile, HealthDot, ProgressBar, Gauge, Avatar, Sparkline)
3. AppShell + Sidebar + TopBar + routing
4. SystemMap → Command Center
5. Manifests table + detail drawer + milestone timeline
6. Fleet + Pilots
7. Analytics dashboard
8. Command palette + polish pass
