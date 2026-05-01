import { useEffect, useRef, useState, useMemo } from "react";
import { Color, Scene, Fog, PerspectiveCamera } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "../../data/globe.json";

const RING_PROPAGATION_SPEED = 3;
const cameraZ = 300;
const aspect = 1.2;

const defaultProps = {
  pointSize: 1,
  atmosphereColor: "#ffffff",
  showAtmosphere: true,
  atmosphereAltitude: 0.1,
  polygonColor: "rgba(255,255,255,0.7)",
  globeColor: "#1d072e",
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  autoRotate: true,
  autoRotateSpeed: 1,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  if (typeof hex !== "string") return { r: 0, g: 0, b: 0 };
  hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
}

function genRandomNumbers(min, max, count) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (!arr.includes(r)) arr.push(r);
  }
  return arr;
}

// ─── GlobeInterior ──────────────────────────────────────────────────────────

function GlobeInterior({ globeConfig, data }) {
  const globeRef = useRef(null);
  const groupRef = useRef(null);
  const { camera } = useThree();
  const [globeData, setGlobeData] = useState(null);

  const _cfg = useMemo(() => ({ ...defaultProps, ...globeConfig }), [globeConfig]);

  // ── 1. Init ThreeGlobe once ──────────────────────────────────────────────
  useEffect(() => {
    const globe = new ThreeGlobe({ waitForGlobeReady: true, animateIn: true });
    globeRef.current = globe;

    globe
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(_cfg.showAtmosphere)
      .atmosphereColor(_cfg.atmosphereColor)
      .atmosphereAltitude(_cfg.atmosphereAltitude)
      .hexPolygonColor(() => _cfg.polygonColor);

    const mat = globe.globeMaterial();
    mat.color = new Color(_cfg.globeColor);
    mat.emissive = new Color(_cfg.emissive);
    mat.emissiveIntensity = _cfg.emissiveIntensity;
    mat.shininess = _cfg.shininess;

    // pointOfView — safe: wait for globe mesh to be ready
    const tryPOV = () => {
      if (_cfg.initialPosition && typeof globe.pointOfView === "function") {
        globe.pointOfView(_cfg.initialPosition, 0);
      }
    };
    if (typeof globe.onGlobeReady === "function") {
      globe.onGlobeReady(tryPOV);
    } else {
      setTimeout(tryPOV, 500);
    }

    return () => {
      // cleanup on unmount
      globeRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 2. Attach globe mesh to R3F group ───────────────────────────────────
  useEffect(() => {
    if (groupRef.current && globeRef.current) {
      groupRef.current.add(globeRef.current);
    }
  }, []);

  // ── 3. Set camera ────────────────────────────────────────────────────────
  useEffect(() => {
    camera.position.z = cameraZ;
    // camera.aspect tidak diubah secara manual di sini,
    // agar R3F secara otomatis mengatur aspect ratio canvas yang responsif.
    camera.updateProjectionMatrix();
  }, [camera]);

  // ── 4. Arcs & Points — only runs when data changes ───────────────────────
  useEffect(() => {
    if (!globeRef.current || !data || data.length === 0) return;

    // Build points — color MUST be a plain hex string, never a function
    const rawPoints = [];
    data.forEach((arc) => {
      const color = typeof arc.color === "string" ? arc.color : "#06b6d4";
      rawPoints.push({ size: _cfg.pointSize, order: arc.order, color, lat: arc.startLat, lng: arc.startLng });
      rawPoints.push({ size: _cfg.pointSize, order: arc.order, color, lat: arc.endLat, lng: arc.endLng });
    });

    // Deduplicate by lat/lng
    const seen = new Set();
    const filteredPoints = rawPoints.filter(({ lat, lng }) => {
      const key = `${lat},${lng}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setGlobeData(filteredPoints);

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => d.startLat)
      .arcStartLng((d) => d.startLng)
      .arcEndLat((d) => d.endLat)
      .arcEndLng((d) => d.endLng)
      // ✅ arcColor must return a plain string — NOT a function of t
      .arcColor((d) => (typeof d.color === "string" ? d.color : "#06b6d4"))
      .arcAltitude((d) => d.arcAlt)
      .arcStroke(0.3)
      .arcDashLength(_cfg.arcLength)
      .arcDashInitialGap((d) => d.order)
      .arcDashGap(15)
      .arcDashAnimateTime(_cfg.arcTime);

    globeRef.current
      .pointsData(filteredPoints)
      // ✅ pointColor must return a plain string
      .pointColor((d) => (typeof d.color === "string" ? d.color : "#06b6d4"))
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 5. Rings ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!globeRef.current || !globeData || globeData.length === 0) return;

    const interval = setInterval(() => {
      if (!globeRef.current) return;

      const count = Math.max(1, Math.floor((globeData.length * 4) / 5));
      const indices = genRandomNumbers(0, globeData.length, Math.min(count, globeData.length));
      const ringPoints = globeData.filter((_, i) => indices.includes(i));

      globeRef.current
        .ringsData(ringPoints)
        // ✅ ringColor must return a plain string — NOT a (t) => ... function
        .ringColor((d) => (typeof d.color === "string" ? d.color : "#06b6d4"))
        .ringMaxRadius(_cfg.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod((_cfg.arcTime * _cfg.arcLength) / _cfg.rings);
    }, 2000);

    return () => clearInterval(interval);
  }, [globeData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <group ref={groupRef}>
      <ambientLight color={_cfg.ambientLight ?? "#ffffff"} intensity={0.8} />
      <directionalLight color={_cfg.directionalLeftLight ?? "#ffffff"} position={[0, 200, 500]} intensity={1.5} />
      <directionalLight color={_cfg.directionalTopLight ?? "#ffffff"} position={[-200, 500, 200]} intensity={1} />
      <pointLight color={_cfg.pointLight ?? "#ffffff"} position={[-200, 500, 200]} intensity={0.8} />
    </group>
  );
}

// ─── World (exported) ────────────────────────────────────────────────────────

// Create scene & camera OUTSIDE component to avoid recreation every render
const globeScene = new Scene();
globeScene.fog = new Fog(0xffffff, 400, 2000);
const globeCamera = new PerspectiveCamera(50, aspect, 180, 1800);

export function World({ globeConfig, data }) {
  return (
    <Canvas
      scene={globeScene}
      camera={globeCamera}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <GlobeInterior globeConfig={globeConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotate={globeConfig.autoRotate ?? true}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 1}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}