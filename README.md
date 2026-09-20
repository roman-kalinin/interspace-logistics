# Interspace Logistics

An interplanetary logistics SaaS prototype — a fleet/freight "control tower" set in the year 3000. Built as a polished, product-grade React prototype grounded in a real UX research cycle of current logistics platforms (Samsara, FourKites, Flexport, Linear, Datadog).

## Highlights

- **Command Center** — a real, rotatable **3D solar system** (react-three-fiber) as the operational map. Planets carry AI-generated surface textures; couriers ride their trajectory arcs. Click a courier to fly the camera in and open its detail panel. The whole HUD (KPIs, Control Tower alerts, fleet strip, courier detail) floats *inside* the map as glass panels. A floating dev button switches 3 map variants (Orbital / Cinematic / Tactical).
- **Manifests** — exception-first shipment table with a detail drawer and milestone timeline.
- **Fleet** — vessel roster with radial fuel/hull telemetry and AI-generated hangar-shot imagery per vessel.
- **Pilots** — crew roster with duty-hour clocks.
- **Analytics** — throughput, on-time, tonnage, utilization and cargo-mix charts.
- **⌘K command palette**, near-monochrome dividerless design, color only for status.

## Stack

React 19 · TypeScript · Vite · React Router · Recharts · three.js / @react-three/fiber / drei. Fully client-side with seeded mock data in `src/data`.

## Develop

```bash
npm install
npm run dev
```

Build: `npm run build` · Preview: `npm run preview`

## Notes

- Vessel images (`public/vessels/`) and planet textures (`public/textures/`) were generated with the Higgsfield MCP.
- See [`SPEC.md`](SPEC.md) for the research summary and MVP definition.
