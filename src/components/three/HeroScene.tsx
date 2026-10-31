"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hero 3D scene: a living, noise-displaced "core" with contour lines, orbit rings and a
 * particle shell. Its shape and energy morph with the active hero slide.
 *
 * TODO(launch): 3D ROBOT. When Marvin's robot is ready, render it in place of <Core />
 * (e.g. a GLTF via useGLTF from @react-three/drei, or his own component). Keep <Rings /> and
 * <Particles /> around it so the motion language stays the same.
 */

// Per-slide personality: [amplitude, frequency, speed, hueShift]
const MOODS: Array<[number, number, number, number]> = [
  [0.32, 1.25, 0.35, 0.0], // Hook: confident, steady
  [0.48, 2.1, 0.6, 0.04], // AI: energetic, busy
  [0.22, 0.9, 0.3, -0.03], // Websites: clean, smooth
  [0.3, 1.6, 0.4, 0.06], // Schools: structured
  [0.4, 1.1, 0.45, -0.05], // Restaurants: warm, round
];

const noise = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying float vNoise;
varying vec3 vViewPos;
varying vec3 vNormalV;
varying vec3 vObj;
${noise}
void main() {
  float n = snoise(position * uFreq + vec3(0.0, uTime * 0.6, uTime * 0.3));
  float n2 = snoise(position * uFreq * 2.3 - uTime * 0.4) * 0.35;
  float d = (n + n2) * uAmp;
  vNoise = n + n2;
  vec3 displaced = position + normal * d;
  vObj = displaced;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vViewPos = -mv.xyz;
  vNormalV = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uHue;
varying float vNoise;
varying vec3 vViewPos;
varying vec3 vNormalV;
varying vec3 vObj;

vec3 hueShift(vec3 c, float h) {
  const vec3 k = vec3(0.57735);
  float ca = cos(h * 6.2831);
  return c * ca + cross(k, c) * sin(h * 6.2831) + k * dot(k, c) * (1.0 - ca);
}

void main() {
  // True surface normal of the displaced mesh from screen-space derivatives
  vec3 N = normalize(cross(dFdx(-vViewPos), dFdy(-vViewPos)));
  vec3 V = normalize(vViewPos);
  vec3 L = normalize(vec3(-0.4, 0.8, 0.6));

  float diff = clamp(dot(N, L), 0.0, 1.0);
  float fres = pow(1.0 - clamp(dot(normalize(vNormalV), V), 0.0, 1.0), 2.2);
  float spec = pow(clamp(dot(reflect(-L, N), V), 0.0, 1.0), 28.0);

  vec3 deep = vec3(0.016, 0.34, 0.165);
  vec3 bright = vec3(0.098, 0.89, 0.42);
  vec3 mint = vec3(0.70, 1.0, 0.82);

  vec3 col = mix(deep, bright, smoothstep(-0.6, 0.9, vNoise) * 0.75 + diff * 0.45);
  col = mix(col, mint, fres * 0.7);
  col += spec * 0.55;

  // Topographic contour lines — the "tech" signature
  float bands = abs(fract(vNoise * 5.0 - uTime * 0.12) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.045, bands);
  col = mix(col, vec3(0.02, 0.12, 0.06), line * 0.45);

  col = hueShift(col, uHue);
  gl_FragColor = vec4(col, 1.0);
}
`;

type Shared = { active: number; pointer: { x: number; y: number } };

function Core({ shared }: { shared: Shared }) {
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmp: { value: MOODS[0][0] }, uFreq: { value: MOODS[0][1] }, uHue: { value: 0 } }),
    [],
  );
  const pulse = useRef({ last: 0, t: 1 });

  useFrame((state, delta) => {
    const [amp, freq, speed, hue] = MOODS[shared.active] ?? MOODS[0];
    if (pulse.current.last !== shared.active) {
      pulse.current = { last: shared.active, t: 0 };
    }
    pulse.current.t = Math.min(1, pulse.current.t + delta * 1.4);
    const k = 1 - Math.pow(0.04, delta);
    uniforms.uTime.value += delta * speed * 1.6;
    uniforms.uAmp.value += (amp - uniforms.uAmp.value) * k;
    uniforms.uFreq.value += (freq - uniforms.uFreq.value) * k;
    uniforms.uHue.value += (hue - uniforms.uHue.value) * k;
    if (mesh.current) {
      // little "breath" on slide change
      const p = pulse.current.t;
      const s = 1 + Math.sin(p * Math.PI) * 0.06;
      mesh.current.scale.setScalar(s);
      mesh.current.rotation.y += delta * 0.12;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 64]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
}

function Rings({ shared }: { shared: Shared }) {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const c = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    const speed = (MOODS[shared.active] ?? MOODS[0])[2];
    if (a.current) a.current.rotation.z += delta * 0.25 * (speed + 0.5);
    if (b.current) b.current.rotation.z -= delta * 0.18 * (speed + 0.5);
    if (c.current) c.current.rotation.z += delta * 0.1;
  });
  return (
    <group>
      <mesh ref={a} rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[2.05, 0.006, 8, 220]} />
        <meshBasicMaterial color="#067a37" transparent opacity={0.55} />
      </mesh>
      <mesh ref={b} rotation={[1.75, -0.5, 0]}>
        <torusGeometry args={[2.4, 0.004, 8, 220]} />
        <meshBasicMaterial color="#19e36b" transparent opacity={0.7} />
      </mesh>
      <mesh ref={c} rotation={[0.4, 1.1, 0]}>
        <torusGeometry args={[2.75, 0.003, 8, 220]} />
        <meshBasicMaterial color="#0a0f0c" transparent opacity={0.18} />
      </mesh>
      {/* Satellites riding the rings */}
      <Satellite radius={2.05} tilt={[1.2, 0.3, 0]} speed={0.6} color="#19e36b" size={0.07} />
      <Satellite radius={2.4} tilt={[1.75, -0.5, 0]} speed={-0.4} color="#0a0f0c" size={0.05} />
    </group>
  );
}

function Satellite({ radius, tilt, speed, color, size }: { radius: number; tilt: [number, number, number]; speed: number; color: string; size: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    ref.current?.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0);
  });
  return (
    <group rotation={tilt}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
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
    g.rotation.y += (shared.pointer.x * 0.35 - g.rotation.y) * k;
    g.rotation.x += (-shared.pointer.y * 0.25 - g.rotation.x) * k;
  });
  return <group ref={group}>{children}</group>;
}

export default function HeroScene({ shared, running }: { shared: Shared; running: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={running ? "always" : "never"}
      aria-hidden="true"
    >
      <Rig shared={shared}>
        <Core shared={shared} />
        <Rings shared={shared} />
        <Particles />
      </Rig>
    </Canvas>
  );
}
