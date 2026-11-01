"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Robot } from "./Robot";

/**
 * Hero 3D scene: "El Camba", the Elevated Tech robot in Santa Cruz dress (see Robot.tsx),
 * with orbit rings and a particle shell around him. He reacts to the active hero slide
 * (wave, present, hat tip) and follows the pointer with his head and eyes.
 */

// Per-slide ring speed
const MOODS: number[] = [0.35, 0.6, 0.3, 0.4, 0.45];

type Shared = { active: number; pointer: { x: number; y: number } };

function LookAt({ y }: { y: number }) {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.lookAt(0, y, 0);
  }, [camera, y]);
  return null;
}

/** Soft studio reflections so the glossy shell and visor read as real materials. */
function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.85;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return (
    <>
      <hemisphereLight args={["#ffffff", "#cfe9da", 0.55]} />
      <directionalLight position={[-3, 5, 4]} intensity={1.6} color="#fffaf0" />
      <directionalLight position={[4, 2, 3]} intensity={0.5} color="#ffffff" />
      {/* brand-green rim from behind */}
      <directionalLight position={[2.5, 3, -4]} intensity={1.6} color="#19e36b" />
      <directionalLight position={[-3, 1, -3]} intensity={0.6} color="#8af5b5" />
    </>
  );
}

function Rings({ shared }: { shared: Shared }) {
  const a = useRef<THREE.Group>(null);
  const b = useRef<THREE.Group>(null);
  const c = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const speed = MOODS[shared.active] ?? MOODS[0];
    if (a.current) a.current.rotation.z += delta * 0.25 * (speed + 0.5);
    if (b.current) b.current.rotation.z -= delta * 0.18 * (speed + 0.5);
    if (c.current) c.current.rotation.z += delta * 0.1;
  });
  return (
    <group>
      {/* soft glow disc */}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[2.6, 64]} />
        <meshBasicMaterial color="#19e36b" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <group ref={a}>
        <mesh>
          <torusGeometry args={[2.05, 0.014, 8, 220]} />
          <meshBasicMaterial color="#067a37" transparent opacity={0.7} />
        </mesh>
        <Satellite radius={2.05} color="#19e36b" size={0.09} angle={0.4} />
      </group>
      <group ref={b} rotation={[0.05, -0.04, 0]}>
        <mesh>
          <torusGeometry args={[2.55, 0.01, 8, 220]} />
          <meshBasicMaterial color="#19e36b" transparent opacity={0.8} />
        </mesh>
        <Satellite radius={2.55} color="#0a0f0c" size={0.065} angle={2.6} />
      </group>
      <group ref={c} rotation={[-0.04, 0.06, 0]}>
        <mesh>
          <torusGeometry args={[3.1, 0.006, 8, 220]} />
          <meshBasicMaterial color="#0a0f0c" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function Satellite({ radius, color, size, angle }: { radius: number; color: string; size: number; angle: number }) {
  return (
    <mesh position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function Particles({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere shell with a little jitter
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * 2.399963229728653;
      const rad = 3.1 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 0.6;
      arr[i * 3] = Math.cos(theta) * r * rad;
      arr[i * 3 + 1] = y * rad;
      arr[i * 3 + 2] = Math.sin(theta) * r * rad;
    }
    return arr;
  }, [count]);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y -= delta * 0.03;
      ref.current.rotation.x += delta * 0.01;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#067a37" size={0.022} sizeAttenuation transparent opacity={0.6} depthWrite={false} />
    </points>
  );
}

function Rig({ shared, children }: { shared: Shared; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.pow(0.02, delta);
    g.rotation.y += (shared.pointer.x * 0.22 - g.rotation.y) * k;
    g.rotation.x += (-shared.pointer.y * 0.08 - g.rotation.x) * k;
  });
  return <group ref={group}>{children}</group>;
}

export default function HeroScene({ shared, running }: { shared: Shared; running: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 2.1, 9.6], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={running ? "always" : "never"}
      aria-hidden="true"
    >
      <Studio />
      <LookAt y={0.3} />
      <Rig shared={shared}>
        <group position={[0, -0.05, 0]}>
          <Robot shared={shared} />
        </group>
        {/* holographic pedestal: the orbit rings lie flat around his feet */}
        <group position={[0, -2.2, 0]} rotation={[-Math.PI / 2 + 0.06, 0, 0]} scale={0.62}>
          <Rings shared={shared} />
        </group>
        <Particles />
      </Rig>
    </Canvas>
  );
}
