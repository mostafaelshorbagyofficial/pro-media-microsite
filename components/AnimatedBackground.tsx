"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom particles component in R3F
function ParticleDust({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 100; // Slightly reduced to keep it subtle

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;     // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z
      sp[i] = 0.03 + Math.random() * 0.06;         // Slower drift speed
    }
    return [pos, sp];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const time = state.clock.getElapsedTime();

    const targetX = mouse.current.x * 1.2;
    const targetY = mouse.current.y * 1.2;

    pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.05;
    pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.05;

    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y += speeds[i] * 0.04;
      if (y > 7.5) y = -7.5;
      posAttr.setY(i, y);

      let x = posAttr.getX(i);
      x += Math.sin(time + i) * 0.001;
      posAttr.setX(i, x);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#F43F5E"
        transparent
        opacity={0.45}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

// Glowing orbs floating in background
function GlowingOrbs() {
  const mesh1 = useRef<THREE.Mesh>(null);
  const mesh2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh1.current) {
      mesh1.current.position.x = Math.sin(time * 0.15) * 3;
      mesh1.current.position.y = Math.cos(time * 0.25) * 2;
    }
    if (mesh2.current) {
      mesh2.current.position.x = Math.cos(time * 0.1 + 1) * 4;
      mesh2.current.position.y = Math.sin(time * 0.2 - 0.5) * 2.5;
    }
  });

  return (
    <>
      <mesh ref={mesh1} position={[-2, 1, -6]}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={0.04} />
      </mesh>
      <mesh ref={mesh2} position={[2, -1, -7]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial color="#1e293b" transparent opacity={0.08} />
      </mesh>
    </>
  );
}

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", motionListener);

    const handleMouseMove = (e: MouseEvent) => {
      if (motionQuery.matches) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current = { x, y };

      // HTML parallax translation (very subtle offset: ±12px)
      setParallax({
        x: x * 12,
        y: y * 12,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      motionQuery.removeEventListener("change", motionListener);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* 1. Official Background Image (with subtle mouse parallax) */}
      <div
        className="absolute -inset-[15px] w-[calc(100%+30px)] h-[calc(100%+30px)] bg-cover bg-center bg-no-repeat pointer-events-none select-none"
        style={{
          backgroundImage: "url('/bg.png')",
          transform: prefersReducedMotion ? "none" : `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
          transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      />

      {/* 2. Very Light Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(11,15,25,0.45)_90%)] pointer-events-none" />

      {/* 3. Transparent R3F Particle/Glow Canvas (disabled on prefers-reduced-motion for zero CPU overhead) */}
      {mounted && !prefersReducedMotion && (
        <div className="absolute inset-0 opacity-80 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.0} />
            <ParticleDust mouse={mouse} />
            <GlowingOrbs />
          </Canvas>
        </div>
      )}

      {/* 4. Subtle Lens Flare Reflection Overlay */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-15 filter blur-[80px] mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(244,63,94,0.08) 0%, rgba(30,41,59,0.02) 60%, transparent 100%)",
          left: prefersReducedMotion ? "50%" : `calc(50% + ${-parallax.x * 15}px - 250px)`,
          top: prefersReducedMotion ? "50%" : `calc(50% + ${-parallax.y * 15}px - 250px)`,
          transform: prefersReducedMotion ? "translate(-50%, -50%)" : "none",
          transition: "left 0.4s ease-out, top 0.4s ease-out",
        }}
      />
    </div>
  );
}
