'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { MapPlace } from '@/types';
import {
  STATE_DEPTH,
  borderGeometry,
  centroidDistance,
  project,
  slugify,
  stateGeometry,
  type StateFeature,
  type StatesGeoJSON,
} from './geo';
import { pinColor } from './categoryColors';

export type MapHover =
  | { kind: 'state'; slug: string; name: string }
  | { kind: 'place'; place: MapPlace };

interface IndiaMapCanvasProps {
  geo: StatesGeoJSON;
  places: MapPlace[];
  /** Slugs of states that have at least one place to show. */
  activeStates: Set<string>;
  /** Place ids matching the current category filter (all places when no filter). */
  visiblePlaces: Set<string>;
  hovered: MapHover | null;
  running: boolean;
  reducedMotion: boolean;
  onHover: (item: MapHover | null, e?: ThreeEvent<PointerEvent>) => void;
  onSelect: (item: MapHover, e: ThreeEvent<MouseEvent>) => void;
}

const LIFT = 0.12;
const INTRO_SECONDS = 0.9;
const PIN_DELAY = 1.1;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
const easeOutBack = (t: number) => {
  const c = 1.70158;
  const x = Math.min(Math.max(t, 0), 1) - 1;
  return 1 + (c + 1) * x * x * x + c * x * x;
};

const COLORS = {
  empty: new THREE.Color('#2b2522'),
  withPlaces: new THREE.Color('#5b3520'),
  hover: new THREE.Color('#f97316'),
  border: new THREE.Color('#fdba74'),
};

/** Shared clock for the intro: starts on the first rendered frame (i.e. when the map scrolls into view). */
function useIntroTime(reducedMotion: boolean) {
  const start = useRef<number | null>(null);
  return (elapsed: number) => {
    if (reducedMotion) return Infinity;
    if (start.current === null) start.current = elapsed;
    return elapsed - start.current;
  };
}

function StateMesh({
  feature,
  delay,
  hasPlaces,
  hovered,
  reducedMotion,
  onHover,
  onSelect,
}: {
  feature: StateFeature;
  delay: number;
  hasPlaces: boolean;
  hovered: boolean;
  reducedMotion: boolean;
  onHover: IndiaMapCanvasProps['onHover'];
  onSelect: IndiaMapCanvasProps['onSelect'];
}) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const borderMaterial = useRef<THREE.LineBasicMaterial>(null);
  const lift = useRef(0);
  const introTime = useIntroTime(reducedMotion);
  const { geometry, border } = useMemo(
    () => ({ geometry: stateGeometry(feature), border: borderGeometry(feature) }),
    [feature]
  );
  useEffect(() => () => { geometry.dispose(); border.dispose(); }, [geometry, border]);

  const name = feature.properties.st_nm;
  const item: MapHover = { kind: 'state', slug: slugify(name), name };

  useFrame(({ clock }, delta) => {
    if (!group.current || !material.current || !borderMaterial.current) return;
    const p = easeOutCubic((introTime(clock.elapsedTime) - delay) / INTRO_SECONDS);
    const k = 1 - Math.exp(-delta * 10);
    lift.current = THREE.MathUtils.lerp(lift.current, hovered ? LIFT : 0, k);
    group.current.position.z = lift.current - (1 - p) * 0.8;
    material.current.opacity = p;
    borderMaterial.current.opacity = p * (hovered ? 1 : 0.6);
    material.current.color.lerp(hovered ? COLORS.hover : hasPlaces ? COLORS.withPlaces : COLORS.empty, k);
    material.current.emissiveIntensity = THREE.MathUtils.lerp(material.current.emissiveIntensity, hovered ? 0.55 : 0, k);
  });

  return (
    <group ref={group}>
      <mesh
        geometry={geometry}
        onPointerOver={(e) => { e.stopPropagation(); onHover(item, e); }}
        onPointerMove={(e) => { e.stopPropagation(); onHover(item, e); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onSelect(item, e); }}
      >
        <meshStandardMaterial
          ref={material}
          color={hasPlaces ? COLORS.withPlaces : COLORS.empty}
          emissive={COLORS.hover}
          emissiveIntensity={0}
          roughness={0.55}
          metalness={0.25}
          transparent
        />
      </mesh>
      <lineSegments geometry={border}>
        <lineBasicMaterial ref={borderMaterial} color={COLORS.border} transparent opacity={0.45} />
      </lineSegments>
    </group>
  );
}

const MARKER_W = 128;
const MARKER_H = 168;
const markerTextures = new Map<string, THREE.CanvasTexture>();

/** Teardrop map-marker icon (gradient body, white ring and centre, soft shadow), cached per colour. */
function markerTexture(color: string) {
  const cached = markerTextures.get(color);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = MARKER_W;
  canvas.height = MARKER_H;
  const ctx = canvas.getContext('2d')!;
  const cx = MARKER_W / 2;
  const cy = 58;
  const r = 44;
  const tip = MARKER_H - 10;

  const body = new Path2D();
  body.moveTo(cx, tip);
  body.bezierCurveTo(cx - 6, tip - 34, cx - r, cy + 34, cx - r, cy);
  body.arc(cx, cy, r, Math.PI, 0);
  body.bezierCurveTo(cx + r, cy + 34, cx + 6, tip - 34, cx, tip);
  body.closePath();

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  const fill = ctx.createLinearGradient(0, cy - r, 0, tip);
  fill.addColorStop(0, new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.12).getStyle());
  fill.addColorStop(1, new THREE.Color(color).multiplyScalar(0.8).getStyle());
  ctx.fillStyle = fill;
  ctx.fill(body);
  ctx.restore();

  ctx.lineWidth = 3.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.stroke(body);

  ctx.beginPath();
  ctx.arc(cx, cy, 17, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  markerTextures.set(color, texture);
  return texture;
}

const PIN_HEIGHT = 0.135;
const PIN_SIZE: [number, number, number] = [(PIN_HEIGHT * MARKER_W) / MARKER_H, PIN_HEIGHT, 1];
const pinDot = new THREE.CircleGeometry(0.012, 24);
const pinRing = new THREE.RingGeometry(0.016, 0.022, 32);

function Pin({
  place,
  index,
  lifted,
  visible,
  hovered,
  reducedMotion,
  onHover,
  onSelect,
}: {
  place: MapPlace;
  index: number;
  lifted: boolean;
  visible: boolean;
  hovered: boolean;
  reducedMotion: boolean;
  onHover: IndiaMapCanvasProps['onHover'];
  onSelect: IndiaMapCanvasProps['onSelect'];
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const marker = useRef<THREE.Sprite>(null);
  const introTime = useIntroTime(reducedMotion);
  const [x, y] = project(place.location.longitude, place.location.latitude);
  const color = pinColor(place.category);
  const texture = useMemo(() => markerTexture(color), [color]);
  const phase = index * 0.37;
  const item: MapHover = { kind: 'place', place };

  useFrame(({ clock }, delta) => {
    if (!group.current || !ring.current || !marker.current) return;
    const t = clock.elapsedTime;
    const appear = easeOutBack((introTime(t) - PIN_DELAY - index * 0.012) / 0.5);
    const k = 1 - Math.exp(-delta * 10);
    const target = visible ? appear * (hovered ? 1.55 : 1) : 0;
    const s = THREE.MathUtils.lerp(group.current.scale.x, target, k);
    group.current.scale.setScalar(Math.max(s, 0.0001));
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, STATE_DEPTH + (lifted ? LIFT : 0), k);
    // The hovered marker bobs gently above its spot.
    const bob = hovered && !reducedMotion ? Math.abs(Math.sin(t * 4)) * 0.02 : 0;
    marker.current.position.z = THREE.MathUtils.lerp(marker.current.position.z, 0.004 + bob, k);
    if (!reducedMotion) {
      const pulse = (t * 0.6 + phase) % 1;
      ring.current.scale.setScalar(1 + pulse * 1.8);
      (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - pulse) * 0.6;
    }
  });

  return (
    <group ref={group} position={[x, y, STATE_DEPTH]} scale={0.0001}>
      <mesh ref={ring} geometry={pinRing} position={[0, 0, 0.003]}>
        <meshBasicMaterial color={color} transparent opacity={0.5} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={pinDot} position={[0, 0, 0.003]}>
        <meshBasicMaterial color={color} transparent opacity={0.9} depthWrite={false} />
      </mesh>
      <sprite
        ref={marker}
        center={[0.5, 0]}
        scale={PIN_SIZE}
        position={[0, 0, 0.004]}
        renderOrder={hovered ? 3 : 2}
        onPointerOver={(e) => { e.stopPropagation(); if (visible) onHover(item, e); }}
        onPointerMove={(e) => { e.stopPropagation(); if (visible) onHover(item, e); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); if (visible) onSelect(item, e); }}
      >
        <spriteMaterial map={texture} transparent depthWrite={false} />
      </sprite>
    </group>
  );
}

/** Soft radial glow texture used under the map and for the stars. */
function useGlowTexture(inner: string, outer: string) {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, [inner, outer]);
}

function Stars({ reducedMotion }: { reducedMotion: boolean }) {
  const points = useRef<THREE.Points>(null);
  const texture = useGlowTexture('rgba(255,237,213,1)', 'rgba(255,237,213,0)');
  const positions = useMemo(() => {
    const arr = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = -1.5 - Math.random() * 4;
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (points.current && !reducedMotion) points.current.rotation.z += delta * 0.01;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={texture} size={0.06} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.8} />
    </points>
  );
}

const CAMERA_DIR = new THREE.Vector3(0, -3.4, 4.9).normalize();
const CAMERA_TARGET = new THREE.Vector3(0, -0.22, 0);

/** Pulls the camera back on narrow (portrait) canvases so the whole country stays in frame. */
function ResponsiveCamera() {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / s.size.height);
  useEffect(() => {
    const distance = Math.max(5.96, 5.7 / aspect);
    camera.position.copy(CAMERA_DIR).multiplyScalar(distance);
    camera.lookAt(CAMERA_TARGET);
  }, [camera, aspect]);
  return null;
}

function Scene(props: IndiaMapCanvasProps) {
  const { geo, places, activeStates, visiblePlaces, hovered, reducedMotion, onHover, onSelect } = props;
  const root = useRef<THREE.Group>(null);
  const glow = useGlowTexture('rgba(249,115,22,0.35)', 'rgba(249,115,22,0)');

  // States closer to the centre rise first, so the map "blooms" outward.
  const delays = useMemo(() => {
    const d = geo.features.map(centroidDistance);
    const max = Math.max(...d);
    return d.map((v) => (v / max) * 0.8);
  }, [geo]);

  const hoveredState = hovered?.kind === 'state' ? hovered.slug : hovered?.kind === 'place' ? hovered.place.state?.slug : undefined;

  useFrame(({ pointer, clock }, delta) => {
    if (!root.current || reducedMotion) return;
    const k = 1 - Math.exp(-delta * 3);
    // Gentle tilt toward the cursor plus a slow idle float.
    root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, -pointer.y * 0.08, k);
    root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, pointer.x * 0.12, k);
    root.current.position.z = Math.sin(clock.elapsedTime * 0.6) * 0.03;
  });

  return (
    <>
      <ResponsiveCamera />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, -3, 5]} intensity={1.4} color="#fff7ed" />
      <pointLight position={[-2, 2, 2]} intensity={6} color="#fb923c" />
      <Stars reducedMotion={reducedMotion} />
      <group ref={root}>
        <mesh position={[0, 0, -0.25]}>
          <planeGeometry args={[7, 7]} />
          <meshBasicMaterial map={glow} transparent depthWrite={false} />
        </mesh>
        {geo.features.map((f, i) => {
          const slug = slugify(f.properties.st_nm);
          return (
            <StateMesh
              key={slug}
              feature={f}
              delay={delays[i]}
              hasPlaces={activeStates.has(slug)}
              hovered={hoveredState === slug}
              reducedMotion={reducedMotion}
              onHover={onHover}
              onSelect={onSelect}
            />
          );
        })}
        {places.map((p, i) => (
          <Pin
            key={p._id}
            place={p}
            index={i}
            lifted={hoveredState === p.state?.slug}
            visible={visiblePlaces.has(p._id)}
            hovered={hovered?.kind === 'place' && hovered.place._id === p._id}
            reducedMotion={reducedMotion}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </group>
    </>
  );
}

export default function IndiaMapCanvas(props: IndiaMapCanvasProps) {
  return (
    <Canvas
      frameloop={props.running ? 'always' : 'never'}
      dpr={[1, 2]}
      camera={{ fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => props.onHover(null)}
    >
      <Scene {...props} />
    </Canvas>
  );
}
