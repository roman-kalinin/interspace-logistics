import { useRef, useMemo, useState, useEffect, forwardRef, useImperativeHandle, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Stars, Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { spaceports, portById } from "../../data/mock";
import type { Manifest } from "../../data/types";
import { portPosition, portMeta, courierNodes, orbitRadii } from "./orbits";

export type Variant = 1 | 2 | 3;

// Per-variant scene styling
const VARIANTS: Record<Variant, {
  name: string;
  bg: string;
  camera: [number, number, number];
  sunColor: string;
  sunIntensity: number;
  ambient: number;
  ringColor: string;
  ringOpacity: number;
  grid: boolean;
  starDensity: number;
  planetEmissive: number;
}> = {
  1: { name: "Orbital", bg: "#07080a", camera: [0, 34, 0.1], sunColor: "#ffcf6b", sunIntensity: 2.2, ambient: 0.35, ringColor: "#ffffff", ringOpacity: 0.10, grid: false, starDensity: 1, planetEmissive: 0.15 },
  2: { name: "Cinematic", bg: "#0a0b10", camera: [20, 15, 26], sunColor: "#ffb347", sunIntensity: 3.0, ambient: 0.18, ringColor: "#7fa8d0", ringOpacity: 0.14, grid: false, starDensity: 1.6, planetEmissive: 0.25 },
  3: { name: "Tactical", bg: "#04070a", camera: [14, 16, 18], sunColor: "#4fd6c0", sunIntensity: 1.6, ambient: 0.5, ringColor: "#3ecf8e", ringOpacity: 0.22, grid: true, starDensity: 0.5, planetEmissive: 0.1 },
};

// ---------------- Sun ----------------
function Sun({ color, intensity }: { color: string; intensity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.05; });
  return (
    <group>
      <pointLight color={color} intensity={intensity * 60} distance={80} decay={1.6} />
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh scale={1.35}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      <mesh scale={2.1}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

// ---------------- Orbit ring ----------------
function OrbitRing({ radius, color, opacity }: { radius: number; color: string; opacity: number }) {
  const pts = useMemo(() => {
    const p: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      p.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return p;
  }, [radius]);
  return <Line points={pts} color={color} lineWidth={1} transparent opacity={opacity} />;
}

// ---------------- Planet + label ----------------
function PlanetMesh({ id, emissive, size, color, onHover }: { id: string; emissive: number; size: number; color: string; onHover: (h: boolean) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useTexture(`/textures/${id}.png`);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.04; });
  return (
    <mesh
      ref={ref}
      onPointerOver={(e) => { e.stopPropagation(); onHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { onHover(false); document.body.style.cursor = "auto"; }}
    >
      <sphereGeometry args={[size, 48, 48]} />
      <meshStandardMaterial map={tex} color="#ffffff" emissive="#ffffff" emissiveIntensity={0.32} emissiveMap={tex} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

function Planet({ id, emissive }: { id: string; emissive: number }) {
  const meta = portMeta(id);
  const port = portById(id);
  const pos = portPosition(id);
  const [hover, setHover] = useState(false);
  if (!meta) return null;
  return (
    <group position={pos}>
      <Suspense fallback={
        <mesh>
          <sphereGeometry args={[meta.size, 24, 24]} />
          <meshStandardMaterial color={meta.color} emissive={meta.color} emissiveIntensity={emissive} roughness={0.7} metalness={0.1} />
        </mesh>
      }>
        <PlanetMesh id={id} emissive={emissive} size={meta.size} color={meta.color} onHover={setHover} />
      </Suspense>
      <Html center position={[0, meta.size + 0.35, 0]} style={{ pointerEvents: "none" }} zIndexRange={[10, 0]}>
        <div className={`sys3d-planet-label ${hover ? "hot" : ""}`}>
          <span className="s3d-pl-name">{port.name}</span>
          <span className="s3d-pl-body">{port.body}</span>
        </div>
      </Html>
    </group>
  );
}

// ---------------- Courier ship ----------------
function Courier({ node, selected, onSelect }: {
  node: ReturnType<typeof courierNodes>[number];
  selected: boolean;
  onSelect: (m: Manifest, pos: THREE.Vector3) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const color = node.delayed ? "#e5674e" : "#5b9bd5";
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2 + node.pos[0]) * 0.08;
      ref.current.scale.setScalar((selected || hover ? 1.5 : 1) * s);
    }
  });
  const vpos = new THREE.Vector3(...node.pos);
  return (
    <group position={node.pos}>
      {/* pulse halo */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      <group
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = "auto"; }}
        onClick={(e) => { e.stopPropagation(); onSelect(node.manifest, vpos); }}
      >
        {/* enlarged invisible hit target */}
        <mesh>
          <sphereGeometry args={[0.55, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
        </mesh>
        {/* ring marker for visibility */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.26, 0.32, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {(hover || selected) && (
        <Html center position={[0, 0.4, 0]} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
          <div className="sys3d-ship-tip">
            <div className="s3d-tip-name">{node.vesselName}</div>
            <div className="s3d-tip-sub">{node.manifest.id} · {node.manifest.progress}%</div>
          </div>
        </Html>
      )}
    </group>
  );
}

// ---------------- Trajectory arc ----------------
function TrajectoryArc({ from, to, progress, delayed }: { from: string; to: string; progress: number; delayed: boolean }) {
  const pts = useMemo(() => {
    const a = new THREE.Vector3(...portPosition(from));
    const b = new THREE.Vector3(...portPosition(to));
    const p: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const lift = Math.sin(t * Math.PI) * 1.1;
      p.push(new THREE.Vector3(
        a.x + (b.x - a.x) * t,
        a.y + (b.y - a.y) * t + lift,
        a.z + (b.z - a.z) * t,
      ));
    }
    return p;
  }, [from, to]);
  const done = Math.max(2, Math.round((progress / 100) * pts.length));
  return (
    <>
      <Line points={pts} color="#ffffff" lineWidth={1} transparent opacity={0.06} />
      <Line points={pts.slice(0, done)} color={delayed ? "#e5674e" : "#5b9bd5"} lineWidth={1.5} transparent opacity={0.55} />
    </>
  );
}

// ---------------- Camera fly-to ----------------
function CameraRig({ target, controls, resetNonce, resetCam }: {
  target: THREE.Vector3 | null;
  controls: React.MutableRefObject<any>;
  resetNonce: number;
  resetCam: [number, number, number];
}) {
  const { camera } = useThree();
  const desired = useRef<{ cam: THREE.Vector3; look: THREE.Vector3 } | null>(null);

  useEffect(() => {
    if (target && controls.current) {
      const dir = target.clone().normalize();
      const camPos = target.clone().add(dir.multiplyScalar(3.2)).add(new THREE.Vector3(0, 1.6, 0));
      desired.current = { cam: camPos, look: target.clone() };
    }
  }, [target, controls]);

  // fly back to the overview when deselected
  useEffect(() => {
    if (resetNonce > 0) {
      desired.current = { cam: new THREE.Vector3(...resetCam), look: new THREE.Vector3(0, 0, 0) };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetNonce]);

  useFrame(() => {
    if (desired.current) {
      camera.position.lerp(desired.current.cam, 0.08);
      if (controls.current) {
        controls.current.target.lerp(desired.current.look, 0.08);
        controls.current.update();
      }
      if (camera.position.distanceTo(desired.current.cam) < 0.08) desired.current = null;
    }
  });
  return null;
}

// ---------------- Grid (tactical) ----------------
function TacticalGrid() {
  return <gridHelper args={[36, 24, "#1a3a30", "#0f261f"]} position={[0, -0.01, 0]} />;
}

// ---------------- Scene ----------------
function VariantCamera({ variant, controls }: { variant: Variant; controls: React.MutableRefObject<any> }) {
  const { camera } = useThree();
  useEffect(() => {
    const c = VARIANTS[variant].camera;
    camera.position.set(c[0], c[1], c[2]);
    if (controls.current) { controls.current.target.set(0, 0, 0); controls.current.update(); }
  }, [variant, camera, controls]);
  return null;
}

function Scene({ variant, onSelect, selectedId, target, resetNonce }: {
  variant: Variant;
  onSelect: (m: Manifest, pos: THREE.Vector3) => void;
  selectedId: string | null;
  target: THREE.Vector3 | null;
  resetNonce: number;
}) {
  const v = VARIANTS[variant];
  const controls = useRef<any>(null);
  const couriers = useMemo(() => courierNodes(), []);

  return (
    <>
      <color attach="background" args={[v.bg]} />
      <ambientLight intensity={v.ambient} />
      <Stars radius={80} depth={40} count={Math.round(1800 * v.starDensity)} factor={3} saturation={0} fade speed={0.4} />

      <Sun color={v.sunColor} intensity={v.sunIntensity} />
      {v.grid && <TacticalGrid />}

      {orbitRadii.map((r, i) => <OrbitRing key={i} radius={r} color={v.ringColor} opacity={v.ringOpacity} />)}
      {spaceports.filter((s) => s.id !== "sp-lun").map((s) => <Planet key={s.id} id={s.id} emissive={v.planetEmissive} />)}

      {couriers.map((c) => (
        <TrajectoryArc key={"t" + c.manifest.id} from={c.manifest.origin} to={c.manifest.destination} progress={c.manifest.progress} delayed={c.delayed} />
      ))}
      {couriers.map((c) => (
        <Courier key={c.manifest.id} node={c} selected={selectedId === c.manifest.id} onSelect={onSelect} />
      ))}

      <VariantCamera variant={variant} controls={controls} />
      <CameraRig target={target} controls={controls} resetNonce={resetNonce} resetCam={v.camera} />
      <OrbitControls
        ref={controls}
        enablePan={false}
        minDistance={4}
        maxDistance={40}
        autoRotate={variant === 2 && !selectedId}
        autoRotateSpeed={0.12}
        maxPolarAngle={Math.PI * 0.85}
        dampingFactor={0.1}
      />
    </>
  );
}

// ---------------- Public component ----------------
export interface SolarSystem3DHandle { deselect: () => void; }

export const SolarSystem3D = forwardRef<SolarSystem3DHandle, {
  variant: Variant;
  onSelectManifest: (m: Manifest) => void;
}>(function SolarSystem3D({ variant, onSelectManifest }, ref) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [target, setTarget] = useState<THREE.Vector3 | null>(null);
  const [resetNonce, setResetNonce] = useState(0);
  const v = VARIANTS[variant];

  const handleSelect = (m: Manifest, pos: THREE.Vector3) => {
    setSelectedId(m.id);
    setTarget(pos.clone());
    onSelectManifest(m);
  };

  const deselect = () => {
    if (!selectedId) return;
    setSelectedId(null);
    setTarget(null);
    setResetNonce((n) => n + 1); // fly camera back to overview
  };

  useImperativeHandle(ref, () => ({ deselect }), [selectedId]);

  return (
    <div className="sys3d-root">
      <Canvas camera={{ position: v.camera, fov: 48 }} dpr={[1, 2]} gl={{ antialias: true }} onPointerMissed={deselect}>
        <Scene variant={variant} onSelect={handleSelect} selectedId={selectedId} target={target} resetNonce={resetNonce} />
      </Canvas>
      <div className="sys3d-hint">Drag to rotate · scroll to zoom · click a courier · click empty space to reset</div>
      {selectedId && (
        <button className="sys3d-reset" onClick={deselect}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8" /><path d="M3 3v5h5" /></svg>
          Reset view
        </button>
      )}
    </div>
  );
});
