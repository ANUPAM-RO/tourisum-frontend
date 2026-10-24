'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 260;
const WIDTH = 14;
const HEIGHT = 9;

function glowTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,214,170,1)');
  g.addColorStop(0.4, 'rgba(251,146,60,0.45)');
  g.addColorStop(1, 'rgba(251,146,60,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function Particles({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const points = useRef<THREE.Points>(null);
  const texture = useMemo(glowTexture, []);
  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const offsets = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * WIDTH;
      positions[i * 3 + 1] = (Math.random() - 0.5) * HEIGHT;
      positions[i * 3 + 2] = Math.random() * -4;
      speeds[i] = 0.08 + Math.random() * 0.25;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, offsets };
  }, []);

  useFrame(({ clock }, delta) => {
    const p = points.current;
    if (!p) return;
    const attr = p.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      // Rise slowly with a gentle sideways sway; wrap to the bottom once off-screen.
      arr[i * 3 + 1] += speeds[i] * delta;
      arr[i * 3] += Math.sin(t * 0.5 + offsets[i]) * 0.002;
      if (arr[i * 3 + 1] > HEIGHT / 2) arr[i * 3 + 1] = -HEIGHT / 2;
    }
    attr.needsUpdate = true;
    const k = 1 - Math.exp(-delta * 2);
    p.position.x = THREE.MathUtils.lerp(p.position.x, mouse.current.x * 0.4, k);
    p.position.y = THREE.MathUtils.lerp(p.position.y, mouse.current.y * 0.25, k);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Warm floating light particles layered over the hero slideshow. */
export default function HeroParticles() {
  const mouse = useRef({ x: 0, y: 0 });
  const [running, setRunning] = useState(true);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    // Pause when the hero is scrolled away or the tab is hidden.
    const onScroll = () => setRunning(window.scrollY < window.innerHeight && !document.hidden);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onScroll);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onScroll);
    };
  }, []);

  return (
    <Canvas
      frameloop={running ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ alpha: true, antialias: false }}
      style={{ pointerEvents: 'none' }}
    >
      <Particles mouse={mouse} />
    </Canvas>
  );
}
