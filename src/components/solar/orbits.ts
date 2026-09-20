import { manifests, vesselById } from "../../data/mock";
import type { Manifest } from "../../data/types";

// Assign each spaceport an orbital radius + starting angle, so planets sit on
// rings around the sun in the XZ plane (y = 0). Deterministic per id.
interface OrbitDef { radius: number; angle: number; size: number; color: string; inclination: number }
const ORBIT: Record<string, OrbitDef> = {
  "sp-ven": { radius: 4.2,  angle: 0.6,  size: 0.34, color: "#c9a36b", inclination: 0.02 },
  "sp-ear": { radius: 5.8,  angle: 2.1,  size: 0.42, color: "#5b9bd5", inclination: 0.0 },
  "sp-lun": { radius: 6.7,  angle: 2.5,  size: 0.20, color: "#9aa0a8", inclination: 0.05 },
  "sp-mar": { radius: 7.9,  angle: 4.0,  size: 0.36, color: "#c56a4a", inclination: 0.03 },
  "sp-cer": { radius: 9.6,  angle: 5.4,  size: 0.22, color: "#8a8378", inclination: 0.08 },
  "sp-eur": { radius: 11.4, angle: 0.9,  size: 0.30, color: "#7fa896", inclination: 0.04 },
  "sp-tit": { radius: 13.2, angle: 3.3,  size: 0.32, color: "#d0b678", inclination: 0.06 },
};

export type Vec3 = [number, number, number];

export function portPosition(id: string): Vec3 {
  const o = ORBIT[id];
  if (!o) return [0, 0, 0];
  return [
    Math.cos(o.angle) * o.radius,
    Math.sin(o.angle * 1.3) * o.inclination * o.radius,
    Math.sin(o.angle) * o.radius,
  ];
}

export function portMeta(id: string) {
  return ORBIT[id];
}

export const orbitRadii = Object.values(ORBIT).map((o) => o.radius);

export interface CourierNode {
  manifest: Manifest;
  vesselName: string;
  pos: Vec3;
  delayed: boolean;
}

export function courierNodes(): CourierNode[] {
  const active = manifests.filter((m) => m.status === "in_transit" || m.status === "delayed");
  return active.map((m) => {
    const a = portPosition(m.origin);
    const b = portPosition(m.destination);
    const t = m.progress / 100;
    // arc slightly above the ecliptic for readability
    const lift = Math.sin(t * Math.PI) * 1.1;
    const pos: Vec3 = [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t + lift,
      a[2] + (b[2] - a[2]) * t,
    ];
    return {
      manifest: m,
      vesselName: vesselById(m.vessel)?.name ?? "Unknown",
      pos,
      delayed: m.status === "delayed",
    };
  });
}
