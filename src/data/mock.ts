import type {
  Spaceport, Manifest, Vessel, Pilot, Alert, Trajectory, KpiPoint,
} from "./types";

// -------------------- Spaceports (system map nodes) --------------------
export const spaceports: Spaceport[] = [
  { id: "sp-ear", name: "Terra Prime",      body: "Earth",    code: "TER", x: 0.30, y: 0.62 },
  { id: "sp-lun", name: "Selene Station",   body: "Luna",     code: "SEL", x: 0.37, y: 0.50 },
  { id: "sp-mar", name: "Tharsis Gateway",  body: "Mars",     code: "THR", x: 0.55, y: 0.34 },
  { id: "sp-cer", name: "Ceres Depot",      body: "Ceres",    code: "CER", x: 0.68, y: 0.55 },
  { id: "sp-eur", name: "Europa Terminal",  body: "Europa",   code: "EUR", x: 0.80, y: 0.30 },
  { id: "sp-tit", name: "Titan Refinery",   body: "Titan",    code: "TIT", x: 0.90, y: 0.66 },
  { id: "sp-ven", name: "Aphrodite Yard",   body: "Venus",    code: "APH", x: 0.18, y: 0.40 },
];

export const portById = (id: string) => spaceports.find((p) => p.id === id)!;

export const trajectories: Trajectory[] = [
  { from: "sp-ear", to: "sp-mar", distanceAU: 0.52, transitDays: 6 },
  { from: "sp-ear", to: "sp-lun", distanceAU: 0.01, transitDays: 1 },
  { from: "sp-mar", to: "sp-cer", distanceAU: 0.68, transitDays: 8 },
  { from: "sp-cer", to: "sp-eur", distanceAU: 1.24, transitDays: 14 },
  { from: "sp-eur", to: "sp-tit", distanceAU: 1.88, transitDays: 19 },
  { from: "sp-ven", to: "sp-ear", distanceAU: 0.28, transitDays: 4 },
  { from: "sp-mar", to: "sp-eur", distanceAU: 1.42, transitDays: 15 },
];

// -------------------- Pilots --------------------
export const pilots: Pilot[] = [
  { id: "pl-01", name: "Mara Okonkwo",   callsign: "VESPER",  status: "on_mission", vessel: "vs-01", rating: 4.9, missionsCompleted: 312, onTimePct: 98, hoursThisCycle: 62, maxHours: 90, clearance: "Class-A", homeport: "sp-mar", avatarHue: 168 },
  { id: "pl-02", name: "Ilya Sorokin",   callsign: "GLACIER", status: "on_mission", vessel: "vs-02", rating: 4.6, missionsCompleted: 204, onTimePct: 94, hoursThisCycle: 71, maxHours: 90, clearance: "Class-A", homeport: "sp-eur", avatarHue: 210 },
  { id: "pl-03", name: "Reyna Castellanos", callsign: "SOLARA", status: "standby", vessel: "vs-03", rating: 4.8, missionsCompleted: 278, onTimePct: 96, hoursThisCycle: 40, maxHours: 90, clearance: "Class-B", homeport: "sp-ear", avatarHue: 38 },
  { id: "pl-04", name: "Tavi Renn",      callsign: "ORBIT",   status: "on_mission", vessel: "vs-04", rating: 4.3, missionsCompleted: 141, onTimePct: 89, hoursThisCycle: 83, maxHours: 90, clearance: "Class-B", homeport: "sp-cer", avatarHue: 288 },
  { id: "pl-05", name: "Devi Anand",     callsign: "MONSOON", status: "rest",     vessel: null,    rating: 4.7, missionsCompleted: 231, onTimePct: 95, hoursThisCycle: 12, maxHours: 90, clearance: "Class-A", homeport: "sp-ear", avatarHue: 130 },
  { id: "pl-06", name: "Cass Verrill",   callsign: "NOMAD",   status: "on_mission", vessel: "vs-05", rating: 4.5, missionsCompleted: 187, onTimePct: 92, hoursThisCycle: 55, maxHours: 90, clearance: "Class-C", homeport: "sp-tit", avatarHue: 12 },
  { id: "pl-07", name: "Jun Park",       callsign: "TEMPO",   status: "standby",  vessel: "vs-06", rating: 4.4, missionsCompleted: 163, onTimePct: 91, hoursThisCycle: 33, maxHours: 90, clearance: "Class-B", homeport: "sp-lun", avatarHue: 258 },
  { id: "pl-08", name: "Amara Diallo",   callsign: "EMBER",   status: "offline",  vessel: null,    rating: 4.2, missionsCompleted: 98,  onTimePct: 87, hoursThisCycle: 0,  maxHours: 90, clearance: "Class-C", homeport: "sp-ven", avatarHue: 348 },
];
export const pilotById = (id: string) => pilots.find((p) => p.id === id);

// -------------------- Vessels --------------------
export const vessels: Vessel[] = [
  { id: "vs-01", name: "Aurora Reach",   class: "Hauler-IX",  status: "active",      pilot: "pl-01", location: "in_transit", fuelPct: 72, hullIntegrityPct: 96, capacityTons: 4800, loadTons: 4210, lightYearsLogged: 214, nextService: 12, health: "nominal" },
  { id: "vs-02", name: "Pale Meridian",  class: "Frigate-C",  status: "active",      pilot: "pl-02", location: "in_transit", fuelPct: 41, hullIntegrityPct: 88, capacityTons: 2600, loadTons: 2280, lightYearsLogged: 402, nextService: 4,  health: "caution" },
  { id: "vs-03", name: "Ostra",          class: "Courier-II", status: "idle",        pilot: "pl-03", location: "sp-ear",      fuelPct: 98, hullIntegrityPct: 99, capacityTons: 600,  loadTons: 0,    lightYearsLogged: 77,  nextService: 28, health: "nominal" },
  { id: "vs-04", name: "Deepwell",       class: "Hauler-IX",  status: "active",      pilot: "pl-04", location: "in_transit", fuelPct: 33, hullIntegrityPct: 71, capacityTons: 4800, loadTons: 4650, lightYearsLogged: 588, nextService: 1,  health: "critical" },
  { id: "vs-05", name: "Cinder Ark",     class: "Bulk-VII",   status: "active",      pilot: "pl-06", location: "in_transit", fuelPct: 64, hullIntegrityPct: 92, capacityTons: 9200, loadTons: 8800, lightYearsLogged: 331, nextService: 9,  health: "nominal" },
  { id: "vs-06", name: "Halcyon",        class: "Courier-II", status: "idle",        pilot: "pl-07", location: "sp-lun",      fuelPct: 88, hullIntegrityPct: 97, capacityTons: 600,  loadTons: 120,  lightYearsLogged: 156, nextService: 21, health: "nominal" },
  { id: "vs-07", name: "Wrensong",       class: "Frigate-C",  status: "maintenance", pilot: "pl-05", location: "sp-ear",      fuelPct: 100,hullIntegrityPct: 54, capacityTons: 2600, loadTons: 0,    lightYearsLogged: 720, nextService: 0,  health: "critical" },
  { id: "vs-08", name: "Gallows Humor",  class: "Bulk-VII",   status: "offline",     pilot: null,    location: "sp-ven",      fuelPct: 6,  hullIntegrityPct: 82, capacityTons: 9200, loadTons: 0,    lightYearsLogged: 244, nextService: 16, health: "caution" },
];
export const vesselById = (id: string) => vessels.find((v) => v.id === id);

// AI-generated hangar-shot images (Higgsfield) for vessels that have one.
const VESSEL_IMAGES: Record<string, string> = {
  "vs-01": "/vessels/vs-01.png", // Aurora Reach
  "vs-02": "/vessels/vs-02.png", // Pale Meridian
  "vs-04": "/vessels/vs-04.png", // Deepwell
  "vs-05": "/vessels/vs-05.png", // Cinder Ark
};
export const vesselImage = (id: string | undefined | null) => (id ? VESSEL_IMAGES[id] : undefined);

// -------------------- Manifests (shipments) --------------------
export const manifests: Manifest[] = [
  { id: "MFX-4820", origin: "sp-ear", destination: "sp-mar", vessel: "vs-01", status: "in_transit", priority: "priority", cargo: "Hydroponic seed vaults", cargoClass: "Cryo-organics", massTons: 4210, progress: 68, etaHours: 46, departedDaysAgo: 4, client: "Ares Terraform Co.", valueCr: 8_420_000 },
  { id: "MFX-4821", origin: "sp-cer", destination: "sp-eur", vessel: "vs-02", status: "delayed",    priority: "critical", cargo: "Fusion reactor cores", cargoClass: "Fissile", massTons: 2280, progress: 52, etaHours: 128, departedDaysAgo: 7, client: "Europa Deepwater", valueCr: 41_900_000 },
  { id: "MFX-4822", origin: "sp-mar", destination: "sp-cer", vessel: "vs-04", status: "in_transit", priority: "standard", cargo: "Regolith printers", cargoClass: "Industrial", massTons: 4650, progress: 81, etaHours: 22, departedDaysAgo: 6, client: "Belt Mining Guild", valueCr: 12_100_000 },
  { id: "MFX-4823", origin: "sp-tit", destination: "sp-eur", vessel: "vs-05", status: "in_transit", priority: "priority", cargo: "Refined methalox", cargoClass: "Volatiles", massTons: 8800, progress: 34, etaHours: 210, departedDaysAgo: 3, client: "Outer Fuel Ltd.", valueCr: 6_750_000 },
  { id: "MFX-4824", origin: "sp-ear", destination: "sp-lun", vessel: "vs-06", status: "loading",    priority: "standard", cargo: "Medical synth-plasma", cargoClass: "Med-cold", massTons: 120, progress: 0, etaHours: 26, departedDaysAgo: 0, client: "Selene Health Board", valueCr: 2_300_000 },
  { id: "MFX-4825", origin: "sp-ven", destination: "sp-ear", vessel: "vs-08", status: "held",       priority: "priority", cargo: "Rare-earth concentrate", cargoClass: "Bulk-ore", massTons: 7600, progress: 0, etaHours: 96, departedDaysAgo: 1, client: "Terra Foundries", valueCr: 18_400_000 },
  { id: "MFX-4818", origin: "sp-mar", destination: "sp-ear", vessel: "vs-03", status: "delivered",  priority: "standard", cargo: "Geologic survey data cores", cargoClass: "Consumer", massTons: 40, progress: 100, etaHours: 0, departedDaysAgo: 9, client: "Cartography Union", valueCr: 900_000 },
  { id: "MFX-4826", origin: "sp-lun", destination: "sp-mar", vessel: "vs-07", status: "held",       priority: "critical", cargo: "Atmospheric processors", cargoClass: "Industrial", massTons: 1800, progress: 0, etaHours: 152, departedDaysAgo: 0, client: "Ares Terraform Co.", valueCr: 29_600_000 },
];
export const manifestById = (id: string) => manifests.find((m) => m.id === id);

// -------------------- Alerts --------------------
export const alerts: Alert[] = [
  { id: "al-1", severity: "critical", title: "Hull integrity below threshold", detail: "Deepwell hull at 71% — service due in <24h. Recommend reroute to Ceres Depot dry-dock.", entity: "vs-04", minutesAgo: 8 },
  { id: "al-2", severity: "critical", title: "Manifest MFX-4821 delayed", detail: "Fusion cores held at Ceres for radiation re-cert. ETA slipped +36h.", entity: "MFX-4821", minutesAgo: 34 },
  { id: "al-3", severity: "caution", title: "Fuel reserve low", detail: "Pale Meridian at 41% — next resupply window in 2 days at Europa.", entity: "vs-02", minutesAgo: 96 },
  { id: "al-4", severity: "caution", title: "Pilot duty limit approaching", detail: "ORBIT (Tavi Renn) at 83/90h this cycle. Schedule relief before Ceres arrival.", entity: "pl-04", minutesAgo: 140 },
  { id: "al-5", severity: "nominal", title: "MFX-4818 delivered", detail: "Survey cores confirmed received at Terra Prime. Chain-of-custody closed.", entity: "MFX-4818", minutesAgo: 220 },
];

// -------------------- Time-series KPIs (for charts) --------------------
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const throughput: KpiPoint[] = [
  { t: "W-6", v: 182 }, { t: "W-5", v: 201 }, { t: "W-4", v: 194 },
  { t: "W-3", v: 228 }, { t: "W-2", v: 240 }, { t: "W-1", v: 233 }, { t: "Now", v: 261 },
];
export const onTimeTrend: KpiPoint[] = [
  { t: "W-6", v: 91 }, { t: "W-5", v: 89 }, { t: "W-4", v: 93 },
  { t: "W-3", v: 92 }, { t: "W-2", v: 95 }, { t: "W-1", v: 94 }, { t: "Now", v: 96 },
];
export const dailyTonnage = days.map((t, i) => ({
  t,
  outbound: [1240, 1380, 1120, 1610, 1720, 980, 1450][i],
  inbound: [980, 1100, 1240, 1010, 1330, 760, 1180][i],
}));

export const fleetUtilization = [
  { name: "In transit", value: 5, color: "var(--info)" },
  { name: "Idle", value: 2, color: "var(--ink-3)" },
  { name: "Maintenance", value: 1, color: "var(--caution)" },
  { name: "Offline", value: 1, color: "var(--critical)" },
];

export const cargoMix = [
  { label: "Volatiles", tons: 8800 },
  { label: "Industrial", tons: 6450 },
  { label: "Cryo-organics", tons: 4210 },
  { label: "Fissile", tons: 2280 },
  { label: "Bulk-ore", tons: 7600 },
  { label: "Med-cold", tons: 120 },
];

// -------------------- Derived headline KPIs --------------------
export const kpis = {
  activeManifests: manifests.filter((m) => ["in_transit", "loading"].includes(m.status)).length,
  inTransit: manifests.filter((m) => m.status === "in_transit").length,
  onTimePct: 96,
  fleetActive: vessels.filter((v) => v.status === "active").length,
  fleetTotal: vessels.length,
  pilotsOnMission: pilots.filter((p) => p.status === "on_mission").length,
  openAlerts: alerts.filter((a) => a.severity !== "nominal").length,
  tonnageInFlight: manifests
    .filter((m) => m.status === "in_transit")
    .reduce((s, m) => s + m.massTons, 0),
  valueInFlightCr: manifests
    .filter((m) => ["in_transit", "loading", "delayed"].includes(m.status))
    .reduce((s, m) => s + m.valueCr, 0),
};
