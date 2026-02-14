'use client';

import * as THREE from 'three';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function generateSphere(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Random point in sphere volume
    const r = Math.cbrt(Math.random()) * radius;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
}

import { usePathname } from 'next/navigation';

function Stars({ isGG }: { isGG: boolean }) {
  const ref = useRef<any>(null);

  // Determine count once on mount
  const count = useMemo(() => {
    if (typeof window === 'undefined') return 15000;
    return window.innerWidth < 768 ? 10500 : 19500;
  }, []);

  // Generate random positions
  const [sphere] = useState(() => generateSphere(count, 20));

  // Keep original positions
  const originalPositions = useMemo(() => sphere.slice(), [sphere]);

  // Scroll/Travel state
  const targetZ = useRef(0);
  const currentZ = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      targetZ.current += e.deltaY * 0.005;
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    // 1. ZERO LAG Mouse Parallax
    ref.current.rotation.x = -state.mouse.y * 0.1;
    ref.current.rotation.y = state.mouse.x * 0.1;

    // 2. ZERO LAG Scroll Travel
    currentZ.current = targetZ.current;

    const positions = ref.current.geometry.attributes.position.array;
    const bound = 20;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const oz = originalPositions[i3 + 2];

      // Apply Scroll Travel (Z-axis)
      let z = oz + currentZ.current;

      // Infinite loop logic
      z = ((z + bound) % 40 + 40) % 40 - 20;

      positions[i3 + 2] = z;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  // Generate 4-pointed star texture
  const starTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Clear
    ctx.clearRect(0, 0, 32, 32);

    // Draw 4-pointed star
    const cx = 16, cy = 16;
    const outer = 15;
    const inner = 5;

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? outer : inner;
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  return (
    <group rotation={[0, 0, 0]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          map={starTexture}
          color={isGG ? "#111111" : "#ffffff"}
          size={typeof window !== 'undefined' && window.innerWidth < 768 ? 0.08 : (isGG ? 0.025 : 0.035)}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={1}
          alphaTest={0.5}
        />
      </Points>
    </group>
  );
}

export default function Starfield() {
  const pathname = usePathname();
  const isGG = pathname === '/gg-productions';

  return (
    <div className={`fixed inset-0 z-0 transition-colors duration-500 ${isGG ? '' : 'bg-black'}`}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Stars isGG={isGG} />
      </Canvas>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isGG
            ? 'none'
            : 'radial-gradient(circle at center, transparent 0%, rgba(0,5,10,0.8) 100%)'
        }}
      />
    </div>
  );
}
