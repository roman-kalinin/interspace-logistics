// ============================================================
// Interspace Logistics — Domain Model (Year 3000)
// Grounded in real logistics SaaS entities:
//   Shipment -> Manifest, Vehicle -> Vessel, Driver -> Pilot,
//   Route -> Trajectory, Hub -> Spaceport.
// ============================================================

export type ManifestStatus =
  | "in_transit"
  | "loading"
  | "delivered"
  | "delayed"
  | "held"; // customs / quarantine hold

export type VesselStatus = "active" | "idle" | "maintenance" | "offline";
export type PilotStatus = "on_mission" | "standby" | "rest" | "offline";
export type Priority = "standard" | "priority" | "critical";
export type HealthTier = "nominal" | "caution" | "critical";

export interface Spaceport {
  id: string;
  name: string;      // e.g. "Tharsis Gateway"
  body: string;      // celestial body, e.g. "Mars"
  code: string;      // 3-letter code, e.g. "THR"
  x: number;         // normalized 0..1 position on system map
  y: number;
}

export interface Trajectory {
  from: string;      // spaceport id
  to: string;        // spaceport id
  distanceAU: number;
  transitDays: number;
}

export interface Manifest {
  id: string;              // e.g. "MFX-4820"
  origin: string;          // spaceport id
  destination: string;     // spaceport id
  vessel: string;          // vessel id
  status: ManifestStatus;
  priority: Priority;
  cargo: string;           // description
  cargoClass: string;      // e.g. "Cryo-organics", "Fissile", "Consumer"
  massTons: number;
  progress: number;        // 0..100
  etaHours: number;        // hours remaining
  departedDaysAgo: number;
  client: string;
  valueCr: number;         // credits
}

export interface Vessel {
  id: string;              // e.g. "VSL-Aurora"
  name: string;
  class: string;           // e.g. "Hauler-IX", "Frigate-C"
  status: VesselStatus;
  pilot: string | null;    // pilot id
  location: string;        // spaceport id or "in_transit"
  fuelPct: number;
  hullIntegrityPct: number;
  capacityTons: number;
  loadTons: number;
  lightYearsLogged: number;
  nextService: number;     // days
  health: HealthTier;
  image?: string;          // generated hangar-shot image path (optional)
}

export interface Pilot {
  id: string;
  name: string;
  callsign: string;
  status: PilotStatus;
  vessel: string | null;   // assigned vessel id
  rating: number;          // 0..5
  missionsCompleted: number;
  onTimePct: number;
  hoursThisCycle: number;
  maxHours: number;        // duty limit
  clearance: string;       // e.g. "Class-A"
  homeport: string;        // spaceport id
  avatarHue: number;       // for generated avatar
}

export interface Alert {
  id: string;
  severity: HealthTier;
  title: string;
  detail: string;
  entity: string;          // related entity id
  minutesAgo: number;
}

export interface KpiPoint { t: string; v: number; }
