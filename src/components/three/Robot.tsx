"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * "El Camba": the Elevated Tech robot, dressed the way people dress in Santa Cruz de la Sierra.
 * Glossy white robot shell, white cotton shirt with rolled sleeves, white trousers rolled at the
 * shin, a green neckerchief, a woven "sombrero de saó", leather abarcas and a tari: the dried tutuma
 * gourd cambas carry at the waist for chicha or water.
 *
 * Everything is procedural (geometry, woven textures, rig, animation), so there are no model files
 * to download. All motion is spring-damped toward targets, so it never snaps.
 */

type Shared = { active: number; pointer: { x: number; y: number } };

/* ----------------------------------------------------------------------------------------------
 * Palette
 * -------------------------------------------------------------------------------------------- */
const C = {
  shell: "#f3f5f4",
  cloth: "#f6f3ea",
  graphite: "#262b2f",
  steel: "#8b949a",
  visor: "#040607",
  glow: "#19e36b",
  glowSoft: "#b8ffd4",
  scarf: "#05742f",
  leather: "#7a4a26",
  sole: "#2b2421",
};

/**
 * One outfit per hero slide: 0 camba (sombrero de paja, neckerchief, tari), 1 AI receptionist
 * (headset, tie, badge, chat bubble), 2 web designer (backwards cap, hoodie, jeans, floating browser),
 * 3 teacher (glasses, bow tie, sweater vest, book), 4 chef (toque, double-breasted coat, apron, spoon).
 * Parts are tagged with userData.outfits and shown/hidden when the outfit swaps mid-spin.
 */
const OUTFITS = [
  { shirt: "#f6f3ea", sleeve: "#f6f3ea", pants: "#f6f3ea" },
  { shirt: "#e4edf8", sleeve: "#e4edf8", pants: "#2b3036" },
  { shirt: "#f6f3ea", sleeve: "#1d2722", pants: "#3e5f88" },
  { shirt: "#fbfbf8", sleeve: "#fbfbf8", pants: "#a48f68" },
  { shirt: "#fdfdfb", sleeve: "#fdfdfb", pants: "#26292c" },
];
const shade = (hex: string) => "#" + new THREE.Color(hex).multiplyScalar(0.88).getHexString();
/** Swap spin length in seconds. */
const SWAP = 0.95;
const only = (...outfits: number[]) => ({ outfits });

function clothMat(color: string, bump: THREE.Texture, roughness = 0.92) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    sheen: 0.8,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.6),
    sheenRoughness: 0.55,
    bumpMap: bump,
    bumpScale: 0.6,
  });
}

/* ----------------------------------------------------------------------------------------------
 * Geometry helpers
 * -------------------------------------------------------------------------------------------- */

/** Rounded-box-like shape: a sphere pushed toward a box. Lower `e` = boxier. */
function superEllipsoid(
  rx: number,
  ry: number,
  rz: number,
  e = 0.6,
  taper?: (yn: number) => number,
  seg: [number, number] = [56, 40],
  planarUV = false,
) {
  const g = new THREE.SphereGeometry(1, seg[0], seg[1]);
  const p = g.attributes.position as THREE.BufferAttribute;
  const sp = (v: number) => Math.sign(v) * Math.pow(Math.abs(v), e);
  for (let i = 0; i < p.count; i++) {
    const x = sp(p.getX(i));
    const y = sp(p.getY(i));
    const z = sp(p.getZ(i));
    const t = taper ? taper(y) : 1;
    p.setXYZ(i, x * rx * t, y * ry, z * rz * (taper ? 0.5 + t * 0.5 : 1));
  }
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  const merged = mergeVertices(g);
  merged.computeVertexNormals();
  if (planarUV) {
    const mp = merged.attributes.position as THREE.BufferAttribute;
    const uv = new Float32Array(mp.count * 2);
    for (let i = 0; i < mp.count; i++) {
      uv[i * 2] = mp.getX(i) / (2 * rx) + 0.5;
      uv[i * 2 + 1] = mp.getY(i) / (2 * ry) + 0.5;
    }
    merged.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  }
  g.dispose();
  return merged;
}

/** Front (+z) surface depth of a superEllipsoid at (x, y). */
function surfZ(x: number, y: number, rx: number, ry: number, rz: number, e = 0.6) {
  const k = 2 / e;
  const v = 1 - Math.pow(Math.abs(x / rx), k) - Math.pow(Math.abs(y / ry), k);
  return v <= 0 ? 0 : rz * Math.pow(v, e / 2);
}

function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, color = true) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  draw(ctx);
  const t = new THREE.CanvasTexture(cv);
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

/** Tiny deterministic PRNG so textures look identical on every load. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ----------------------------------------------------------------------------------------------
 * Procedural textures
 * -------------------------------------------------------------------------------------------- */

/**
 * Paja (palm straw) plait, the way Santa Cruz hats are made: thin braided strips sewn in a spiral,
 * so on the hat they read as fine concentric rings with a herringbone texture. Pale, sun-bleached
 * cream, not golden wicker. Rows run along the texture's x axis; on the lathe-built hat that turns
 * into rings around the crown and brim.
 */
function plaitTextures() {
  const W = 512;
  const H = 512;
  const row = 32;
  const r = rng(7);
  const tones = ["#efdfb2", "#e7d29e", "#dfc68c", "#f2e5bf", "#d9bd7f", "#eadaa8"];
  const draw = (ctx: CanvasRenderingContext2D, bump: boolean) => {
    ctx.fillStyle = bump ? "#3a3a3a" : "#bfa56a";
    ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += row) {
      // each row is one braided strip: two lanes of short diagonal "stitches" (herringbone)
      const base = tones[Math.floor(r() * tones.length)];
      if (!bump) {
        ctx.fillStyle = base;
        ctx.fillRect(0, y + 2, W, row - 4);
      }
      const step = 10;
      for (let lane = 0; lane < 2; lane++) {
        const y0 = y + 3 + lane * ((row - 6) / 2);
        const h = (row - 6) / 2;
        for (let x = -step; x < W + step; x += step) {
          const dir = lane === 0 ? 1 : -1;
          if (bump) {
            const g = ctx.createLinearGradient(x, y0, x + step, y0 + h);
            g.addColorStop(0, "#5a5a5a");
            g.addColorStop(0.5, "#f0f0f0");
            g.addColorStop(1, "#5a5a5a");
            ctx.fillStyle = g;
          } else {
            const t = tones[Math.floor(r() * tones.length)];
            ctx.fillStyle = t;
          }
          ctx.beginPath();
          ctx.moveTo(x, y0 + (dir > 0 ? h : 0));
          ctx.lineTo(x + step * 0.55, y0 + (dir > 0 ? h : 0));
          ctx.lineTo(x + step * 1.25, y0 + (dir > 0 ? 0 : h));
          ctx.lineTo(x + step * 0.7, y0 + (dir > 0 ? 0 : h));
          ctx.closePath();
          ctx.fill();
          if (!bump) {
            ctx.strokeStyle = "rgba(150,120,60,0.28)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      // seam between strips
      ctx.fillStyle = bump ? "#111" : "rgba(140,110,55,0.55)";
      ctx.fillRect(0, y, W, 2);
      if (!bump) {
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(0, y + 2, W, 1);
      }
    }
    if (!bump) {
      // a few loose fibre highlights so it doesn't look printed
      for (let i = 0; i < 220; i++) {
        ctx.strokeStyle = `rgba(255,252,240,${0.15 + r() * 0.25})`;
        ctx.lineWidth = 0.7;
        const x = r() * W;
        const y = r() * H;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 6 + r() * 8, y + (r() - 0.5) * 2);
        ctx.stroke();
      }
    }
  };
  return {
    map: canvasTex(W, H, (c) => draw(c, false)),
    bump: canvasTex(W, H, (c) => draw(c, true), false),
  };
}

/** Fine cotton weave used as a bump map on the shirt and trousers. */
function clothBump() {
  return canvasTex(
    256,
    256,
    (ctx) => {
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, 256, 256);
      const r = rng(3);
      for (let y = 0; y < 256; y += 2) {
        ctx.fillStyle = `rgba(255,255,255,${0.08 + r() * 0.1})`;
        ctx.fillRect(0, y, 256, 1);
      }
      for (let x = 0; x < 256; x += 2) {
        ctx.fillStyle = `rgba(0,0,0,${0.06 + r() * 0.08})`;
        ctx.fillRect(x, 0, 1, 256);
      }
    },
    false,
  );
}

/** Tari: a dried, varnished tutuma gourd with a pyrographed band, like the ones sold in the markets. */
function gourdTexture() {
  return canvasTex(512, 256, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#5a3417");
    g.addColorStop(0.35, "#8a5527");
    g.addColorStop(0.6, "#9b6430");
    g.addColorStop(1, "#5e3618");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 256);
    const r = rng(11);
    // natural mottling
    for (let i = 0; i < 260; i++) {
      const x = r() * 512;
      const y = r() * 256;
      const rad = 4 + r() * 22;
      const sp = ctx.createRadialGradient(x, y, 0, x, y, rad);
      const dark = r() > 0.45;
      sp.addColorStop(0, dark ? "rgba(60,30,10,0.28)" : "rgba(190,130,70,0.22)");
      sp.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sp;
      ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // burned (pyrographed) zig-zag band around the belly
    ctx.strokeStyle = "rgba(35,16,6,0.85)";
    ctx.lineWidth = 3;
    for (const y0 of [118, 150]) {
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(512, y0);
      ctx.stroke();
    }
    ctx.beginPath();
    for (let x = 0; x <= 512; x += 32) {
      ctx.lineTo(x, 146);
      ctx.lineTo(x + 16, 122);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(35,16,6,0.8)";
    for (let x = 16; x < 512; x += 32) {
      ctx.beginPath();
      ctx.arc(x, 140, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function shadowTexture() {
  return canvasTex(
    256,
    256,
    (ctx) => {
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.45, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    },
    false,
  );
}

/* ----------------------------------------------------------------------------------------------
 * Face screen: the eyes are drawn on a small canvas every frame (look, blink, happy squint).
 * -------------------------------------------------------------------------------------------- */
class FaceScreen {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 512;
    this.canvas.height = 256;
    this.ctx = this.canvas.getContext("2d")!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
  }
  draw(lookX: number, lookY: number, open: number, happy: number, glow: number) {
    const { ctx } = this;
    const W = 512;
    const H = 256;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2 + lookX * 34;
    const cy = H / 2 + lookY * 18;
    const gap = 112;
    const R = 50;
    ctx.lineCap = "round";
    for (const side of [-1, 1]) {
      const x = cx + side * gap;
      ctx.save();
      ctx.shadowColor = `rgba(25,227,107,${0.75 * glow})`;
      ctx.shadowBlur = 34;
      ctx.strokeStyle = "#5dffa0";
      ctx.lineWidth = 15;
      // Ring eye (blink squashes it vertically)
      const ringAmt = 1 - happy;
      if (ringAmt > 0.02) {
        ctx.globalAlpha = ringAmt;
        ctx.beginPath();
        ctx.ellipse(x, cy, R, Math.max(2, R * open), 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Happy "^" arc
      if (happy > 0.02) {
        ctx.globalAlpha = happy;
        ctx.beginPath();
        ctx.arc(x, cy + R * 0.55, R * 0.9, Math.PI * 1.12, Math.PI * 1.88);
        ctx.stroke();
      }
      ctx.restore();
    }
    // Scan lines, like the reference screen eyes
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 2);
    ctx.globalCompositeOperation = "source-over";
    this.texture.needsUpdate = true;
  }
  dispose() {
    this.texture.dispose();
  }
}

/* ----------------------------------------------------------------------------------------------
 * Motion helpers
 * -------------------------------------------------------------------------------------------- */
const damp = (cur: number, target: number, lambda: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt));
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Gesture = "wave" | "present" | "tip" | "thumbs" | "takirari";
const GESTURE_FOR_SLIDE: Gesture[] = ["wave", "present", "thumbs", "present", "tip"];
const GESTURE_LEN: Record<Gesture, number> = { wave: 2.8, present: 2.4, tip: 2.6, thumbs: 2.4, takirari: 6.8 };
/** Takirari tempo: steps per second. */
const BEAT = 2.1;

/* ----------------------------------------------------------------------------------------------
 * The robot
 * -------------------------------------------------------------------------------------------- */
/**
 * `still` freezes him in a neutral pose wearing the outfit for `shared.active` (used to render the
 * poster images in public/robot/ for devices that don't get the 3D scene).
 */
export function Robot({ shared, still = false }: { shared: Shared; still?: boolean }) {
  // Rig refs
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const chest = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const hat = useRef<THREE.Group>(null);
  const shoulderR = useRef<THREE.Group>(null);
  const elbowR = useRef<THREE.Group>(null);
  const handR = useRef<THREE.Group>(null);
  const shoulderL = useRef<THREE.Group>(null);
  const elbowL = useRef<THREE.Group>(null);
  const handL = useRef<THREE.Group>(null);
  const kneeL = useRef<THREE.Group>(null);
  const kneeR = useRef<THREE.Group>(null);
  const hipL = useRef<THREE.Group>(null);
  const hipR = useRef<THREE.Group>(null);
  const scarfTip = useRef<THREE.Group>(null);
  const tari = useRef<THREE.Group>(null);
  const antennaTip = useRef<THREE.Mesh>(null);
  const earGlowL = useRef<THREE.MeshStandardMaterial>(null);
  const fingersR = useRef<Array<THREE.Group | null>>([]);
  const thumbR = useRef<THREE.Group>(null);
  const hanky = useRef<THREE.Group>(null);
  const bubble = useRef<THREE.Group>(null);
  const bubbleDots = useRef<Array<THREE.Mesh | null>>([]);
  const browser = useRef<THREE.Group>(null);
  const browserCursor = useRef<THREE.Group>(null);

  /* ---------- materials & textures ---------- */
  const mats = useMemo(() => {
    const straw = plaitTextures();
    straw.map.repeat.set(3, 1.5);
    straw.bump.repeat.set(3, 1.5);
    const strawBrim = { map: straw.map.clone(), bump: straw.bump.clone() };
    strawBrim.map.repeat.set(5, 2.6);
    strawBrim.bump.repeat.set(5, 2.6);
    strawBrim.map.needsUpdate = strawBrim.bump.needsUpdate = true;
    const cb = clothBump();
    cb.repeat.set(6, 6);
    const gourd = gourdTexture();

    return {
      shell: new THREE.MeshPhysicalMaterial({
        color: C.shell,
        roughness: 0.32,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.14,
      }),
      graphite: new THREE.MeshStandardMaterial({ color: C.graphite, roughness: 0.38, metalness: 0.65 }),
      steel: new THREE.MeshStandardMaterial({ color: C.steel, roughness: 0.28, metalness: 0.9 }),
      visor: new THREE.MeshPhysicalMaterial({
        color: C.visor,
        roughness: 0.06,
        metalness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: C.glow,
        emissive: new THREE.Color(C.glow),
        emissiveIntensity: 0.9,
        roughness: 0.3,
      }),
      scarf: new THREE.MeshPhysicalMaterial({
        color: C.scarf,
        roughness: 0.62,
        sheen: 0.35,
        sheenColor: new THREE.Color("#2fd27a"),
        sheenRoughness: 0.45,
        bumpMap: cb,
        bumpScale: 0.4,
        side: THREE.DoubleSide,
      }),
      straw: new THREE.MeshPhysicalMaterial({
        map: straw.map,
        bumpMap: straw.bump,
        bumpScale: 2,
        roughness: 0.72,
        sheen: 0.5,
        sheenColor: new THREE.Color("#fff6dc"),
        sheenRoughness: 0.5,
        side: THREE.DoubleSide,
      }),
      strawBrim: new THREE.MeshPhysicalMaterial({
        map: strawBrim.map,
        bumpMap: strawBrim.bump,
        bumpScale: 2,
        roughness: 0.72,
        sheen: 0.5,
        sheenColor: new THREE.Color("#fff6dc"),
        sheenRoughness: 0.5,
        side: THREE.DoubleSide,
      }),
      band: new THREE.MeshPhysicalMaterial({
        color: "#141414",
        roughness: 0.42,
        sheen: 0.8,
        sheenColor: new THREE.Color("#5a5a5a"),
        sheenRoughness: 0.35,
      }),
      // Outfit-dependent cloth: colours are swapped when the outfit changes (see OUTFITS)
      shirt: clothMat(OUTFITS[0].shirt, cb),
      shirtShade: clothMat(shade(OUTFITS[0].shirt), cb),
      sleeve: clothMat(OUTFITS[0].sleeve, cb),
      sleeveShade: clothMat(shade(OUTFITS[0].sleeve), cb),
      pants: clothMat(OUTFITS[0].pants, cb),
      pantsShade: clothMat(shade(OUTFITS[0].pants), cb),
      coat: clothMat("#fdfdfb", cb),
      hoodie: clothMat("#1d2722", cb),
      hoodieShade: clothMat("#151c18", cb),
      vest: clothMat("#22324a", cb, 0.9),
      apron: Object.assign(clothMat("#2c3833", cb), { side: THREE.DoubleSide }),
      white: clothMat("#fbfbf8", cb),
      tie: new THREE.MeshPhysicalMaterial({ color: "#078a3e", roughness: 0.4, sheen: 0.8, sheenColor: new THREE.Color("#3cff8f"), side: THREE.DoubleSide }),
      bowtie: new THREE.MeshPhysicalMaterial({ color: "#c22b38", roughness: 0.45, sheen: 0.6, sheenColor: new THREE.Color("#ff8a95") }),
      cap: new THREE.MeshPhysicalMaterial({ color: "#0b9e4a", roughness: 0.6, sheen: 0.25, sheenColor: new THREE.Color("#5fe39a"), side: THREE.DoubleSide }),
      frame: new THREE.MeshPhysicalMaterial({ color: "#16110d", roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 }),
      wood: new THREE.MeshStandardMaterial({ color: "#b67d48", roughness: 0.6 }),
      bookCover: new THREE.MeshPhysicalMaterial({ color: "#7d1f2b", roughness: 0.5, clearcoat: 0.4 }),
      paper: new THREE.MeshStandardMaterial({ color: "#f7f3e8", roughness: 0.9 }),
      screen: new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08, transparent: true, opacity: 0.94 }),
      line: new THREE.MeshBasicMaterial({ color: "#d6ddd9" }),
      glowBasic: new THREE.MeshBasicMaterial({ color: C.glow, toneMapped: false }),
      leather: new THREE.MeshStandardMaterial({ color: C.leather, roughness: 0.55, metalness: 0.05 }),
      sole: new THREE.MeshStandardMaterial({ color: C.sole, roughness: 0.85 }),
      gourd: new THREE.MeshPhysicalMaterial({ map: gourd, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25 }),
      cork: new THREE.MeshStandardMaterial({ color: "#b98a57", roughness: 0.95 }),
      cord: new THREE.MeshStandardMaterial({ color: "#4a2c15", roughness: 0.8 }),
      button: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.25 }),
      shadow: new THREE.MeshBasicMaterial({
        color: "#0a2016",
        alphaMap: shadowTexture(),
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      }),
    };
  }, []);

  const face = useMemo(() => new FaceScreen(), []);
  const faceMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: face.texture,
        transparent: true,
        toneMapped: false,
        depthWrite: false,
      }),
    [face],
  );

  /* ---------- geometry ---------- */
  const geo = useMemo(() => {
    const HEAD: [number, number, number, number] = [0.8, 0.62, 0.66, 0.5];
    const TORSO: [number, number, number, number] = [0.5, 0.5, 0.36, 0.62];
    const torsoTaper = (yn: number) => 0.88 + 0.12 * ((yn + 1) / 2);

    // Sombrero de paja: a creased crown (centre dent front-to-back, pinched at the front) on a
    // flat, wide brim that dips a little at the front and lifts at the back. Lathe-built so the
    // plait texture wraps it in concentric rings, like the spiral-sewn braid of a real hat.
    const crown = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.0, 0.5),
        new THREE.Vector2(0.14, 0.505),
        new THREE.Vector2(0.3, 0.5),
        new THREE.Vector2(0.42, 0.47),
        new THREE.Vector2(0.5, 0.4),
        new THREE.Vector2(0.55, 0.28),
        new THREE.Vector2(0.58, 0.14),
        new THREE.Vector2(0.6, 0.0),
      ],
      96,
    );
    {
      const p = crown.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        let x = p.getX(i);
        let y = p.getY(i);
        const z = p.getZ(i);
        const top = smooth(0.26, 0.5, y);
        // centre crease running front to back
        y -= 0.12 * Math.exp(-Math.pow(x / 0.16, 2)) * top * (1 - 0.35 * Math.pow(Math.abs(z) / 0.5, 2));
        // pinches either side of the front
        const front = Math.max(0, z / 0.5);
        x *= 1 - 0.16 * top * front * front;
        p.setXYZ(i, x, y, z);
      }
      crown.computeVertexNormals();
    }
    const brimPts: THREE.Vector2[] = [];
    const inner = 0.58;
    const outer = 1.18;
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      brimPts.push(new THREE.Vector2(inner + (outer - inner) * t, -0.01 + Math.pow(t, 5) * 0.035));
    }
    brimPts.push(new THREE.Vector2(outer + 0.018, 0.022));
    brimPts.push(new THREE.Vector2(outer + 0.01, 0.0));
    for (let i = steps; i >= 0; i--) {
      const t = i / steps;
      brimPts.push(new THREE.Vector2(inner + (outer - inner) * t, -0.035 + Math.pow(t, 5) * 0.035));
    }
    const brim = new THREE.LatheGeometry(brimPts, 128);
    {
      const p = brim.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        const z = p.getZ(i);
        const r = Math.hypot(x, z);
        const t = Math.max(0, (r - inner) / (outer - inner));
        // snap-brim: down at the front, up at the back, a soft lift at the sides
        const dy = (-z / r) * 0.09 * t * t + Math.pow(x / r, 2) * 0.04 * t * t;
        p.setY(i, p.getY(i) + dy);
      }
      brim.computeVertexNormals();
    }

    // Chef's toque: pleated tube + puffed top
    const toqueBody = new THREE.CylinderGeometry(0.86, 0.8, 0.5, 96, 6, true);
    {
      const p = toqueBody.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        const z = p.getZ(i);
        const a = Math.atan2(z, x);
        const k = 1 + 0.035 * Math.cos(a * 18);
        p.setX(i, x * k);
        p.setZ(i, z * k);
      }
      toqueBody.computeVertexNormals();
    }
    const toqueTop = superEllipsoid(0.95, 0.34, 0.95, 0.75, undefined, [72, 32]);
    {
      const p = toqueTop.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i);
        const y = p.getY(i);
        const z = p.getZ(i);
        const a = Math.atan2(z, x);
        const r = Math.hypot(x, z) / 0.95;
        const k = 1 + 0.05 * Math.cos(a * 9) * r;
        p.setXYZ(i, x * k, y + 0.04 * Math.cos(a * 9) * r * Math.max(0, y), z * k);
      }
      toqueTop.computeVertexNormals();
    }

    // Neckerchief: triangle draped on the chest, made from a bent plane
    // A plane reshaped into a triangle that narrows to a point, bulging over the chest.
    const tri = new THREE.PlaneGeometry(0.6, 0.42, 14, 10);
    {
      const p = tri.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const u = p.getX(i) / 0.3; // -1..1
        const t = (0.21 - p.getY(i)) / 0.42; // 0 top .. 1 tip
        const x = u * 0.3 * (1 - t);
        const z = Math.cos(u * Math.PI * 0.5) * 0.035 * (1 - t) + t * 0.1 + 0.01;
        p.setXYZ(i, x, -t * 0.42, z);
      }
      tri.computeVertexNormals();
    }

    const TY = 0.3; // torso centre y in chest space
    const surfZTorso = (x: number, y: number) => {
      const yn = Math.max(-1, Math.min(1, (y - TY) / TORSO[1]));
      const k = torsoTaper(yn);
      return surfZ(x, y - TY, TORSO[0] * k, TORSO[1], TORSO[2] * (0.5 + k * 0.5), TORSO[3]);
    };
    /** A flat patch that hugs the shirt front: shape(u, t) → [x, y] with u in -1..1, t in 0..1. */
    const patch = (shape: (u: number, t: number) => [number, number], off: number, sx = 1, sz = 1, seg: [number, number] = [8, 20]) => {
      const g = new THREE.PlaneGeometry(1, 1, seg[0], seg[1]);
      const p = g.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const u = p.getX(i) * 2;
        const t = 0.5 - p.getY(i);
        const [x, y] = shape(u, t);
        p.setXYZ(i, x, y, surfZTorso(x / sx, y) * sz + off);
      }
      g.computeVertexNormals();
      return g;
    };
    // Tie: narrow under the knot, widening, then the pointed tip
    const tie = patch((u, t) => {
      let w = 0.03 + 0.05 * t;
      if (t > 0.86) w *= Math.max(0, (1 - t) / 0.14);
      return [u * w, 0.72 - t * 0.6];
    }, 0.014);
    // V-neck of the sweater vest, showing the shirt underneath
    const vneck = patch((u, t) => [u * 0.17 * (1 - t), 0.8 - t * 0.32], 0.012, 1.05, 1.08);
    // Hoodie kangaroo pocket
    const kanga = patch((u, t) => [u * (0.2 + t * 0.06), 0.24 - t * 0.2], 0.012, 1.05, 1.08, [8, 6]);
    // Apron hanging from the waist over the trousers
    const apron = new THREE.PlaneGeometry(1, 1, 16, 10);
    {
      const p = apron.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < p.count; i++) {
        const u = p.getX(i) * 2;
        const t = 0.5 - p.getY(i);
        p.setXYZ(i, u * 0.4 * (1 + 0.12 * t), -0.04 - t * 0.98, 0.35 - 0.07 * t + 0.05 * Math.cos((u * Math.PI) / 2));
      }
      apron.computeVertexNormals();
    }

    // Tari gourd: round belly, waist, small upper bulb and a narrow mouth (lathe profile)
    const gourdPts: THREE.Vector2[] = [];
    const sphereR = (y: number, c: number, R: number) => {
      const d = R * R - (y - c) * (y - c);
      return d > 0 ? Math.sqrt(d) : 0;
    };
    for (let i = 0; i <= 56; i++) {
      const y = -0.2 + (i / 56) * 0.42; // -0.2 .. 0.22
      const belly = sphereR(y, -0.075, 0.125);
      const bulb = sphereR(y, 0.095, 0.058);
      const neck = y > 0.12 ? 0.03 : 0;
      const waist = y > -0.02 && y < 0.07 ? 0.042 : 0;
      gourdPts.push(new THREE.Vector2(Math.max(0.002, belly, bulb, neck, waist), y));
    }
    const gourd = new THREE.LatheGeometry(gourdPts, 40);
    gourd.computeVertexNormals();

    // Cord that ties the tari to the belt
    const cordCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.3, -0.02, 0.31),
      new THREE.Vector3(0.36, -0.08, 0.33),
      new THREE.Vector3(0.4, -0.13, 0.32),
      new THREE.Vector3(0.42, -0.16, 0.3),
    ]);
    const cord = new THREE.TubeGeometry(cordCurve, 24, 0.012, 6, false);

    return {
      HEAD,
      TORSO,
      head: superEllipsoid(HEAD[0], HEAD[1], HEAD[2], HEAD[3]),
      bezel: superEllipsoid(0.66, 0.41, 0.2, 0.42),
      visor: superEllipsoid(0.62, 0.37, 0.2, 0.4),
      torso: superEllipsoid(TORSO[0], TORSO[1], TORSO[2], TORSO[3], torsoTaper),
      pelvis: superEllipsoid(0.41, 0.2, 0.27, 0.6),
      belt: superEllipsoid(0.455, 0.05, 0.33, 0.55, undefined, [56, 12]),
      foot: superEllipsoid(0.16, 0.09, 0.27, 0.55),
      sole: superEllipsoid(0.185, 0.035, 0.31, 0.35, undefined, [40, 12]),
      palm: superEllipsoid(0.085, 0.09, 0.05, 0.55, undefined, [24, 16]),
      gourd,
      cord,
      pocket: superEllipsoid(0.11, 0.12, 0.01, 0.25, undefined, [24, 12]),
      crown,
      brim,
      toqueBody,
      toqueTop,
      tri,
      tie,
      vneck,
      kanga,
      apron,
      mic: new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.95, -0.06, 0.06),
          new THREE.Vector3(-0.9, -0.3, 0.4),
          new THREE.Vector3(-0.58, -0.46, 0.68),
          new THREE.Vector3(-0.3, -0.47, 0.76),
        ]),
        32,
        0.018,
        8,
        false,
      ),
      temples: [-1, 1].map(
        (side) =>
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(side * 0.35, 0.0, 0.75),
              new THREE.Vector3(side * 0.6, 0.0, 0.71),
              new THREE.Vector3(side * 0.76, 0.0, 0.5),
              new THREE.Vector3(side * 0.84, 0.0, 0.2),
            ]),
            24,
            0.016,
            8,
            false,
          ),
      ),
      bubble: superEllipsoid(0.34, 0.22, 0.07, 0.35, undefined, [40, 24]),
      browser: superEllipsoid(0.52, 0.36, 0.03, 0.22, undefined, [40, 24]),
      spoonBowl: superEllipsoid(0.07, 0.1, 0.025, 0.8, undefined, [20, 14]),
      surfZTorso,
      TY,
    };
  }, []);

  useEffect(
    () => () => {
      face.dispose();
      faceMat.dispose();
      Object.values(mats).forEach((m) => m.dispose());
      Object.values(geo).forEach((g) => {
        if (g instanceof THREE.BufferGeometry) g.dispose();
        if (Array.isArray(g)) g.forEach((x) => (x as THREE.BufferGeometry).dispose());
      });
    },
    [face, faceMat, mats, geo],
  );

  /* ---------- animation state ---------- */
  const st = useRef({
    t: 0,
    lastSlide: -1,
    gesture: "wave" as Gesture,
    gT: 0, // seconds into current gesture
    nextBlink: 2.2,
    blinkT: 1,
    look: { x: 0, y: 0 },
    eye: { x: 0, y: 0, happy: 0 },
    j: {} as Record<string, number>,
    nextDance: 14 + Math.random() * 8, // first takirari after ~15–22 s, then every 25–40 s
    pendingDance: false,
    outfit: -1,
    targetOutfit: 0,
    swapT: SWAP,
    parts: null as THREE.Object3D[] | null,
  });

  const applyOutfit = (n: number) => {
    const s = st.current;
    s.outfit = n;
    if (!s.parts && root.current) {
      const found: THREE.Object3D[] = [];
      root.current.traverse((o) => {
        if (Array.isArray(o.userData.outfits)) found.push(o);
      });
      s.parts = found;
    }
    s.parts?.forEach((o) => {
      o.visible = (o.userData.outfits as number[]).includes(n);
    });
    const o = OUTFITS[n] ?? OUTFITS[0];
    const paint = (m: THREE.MeshPhysicalMaterial, hex: string) => {
      m.color.set(hex);
      m.sheenColor.set(hex).lerp(new THREE.Color("#ffffff"), 0.6);
    };
    paint(mats.shirt, o.shirt);
    paint(mats.shirtShade, shade(o.shirt));
    paint(mats.sleeve, o.sleeve);
    paint(mats.sleeveShade, shade(o.sleeve));
    paint(mats.pants, o.pants);
    paint(mats.pantsShade, shade(o.pants));
  };

  const dance = () => {
    st.current.pendingDance = true;
  };

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const s = st.current;
    s.t += dt;
    const t = s.t;

    s.gT += dt;
    const dancing = s.gesture === "takirari" && s.gT < GESTURE_LEN.takirari;
    // New slide → spin into the new outfit, then the slide's gesture
    // (a takirari in progress is never cut short)
    if (shared.active !== s.lastSlide) {
      const first = s.lastSlide === -1;
      s.lastSlide = shared.active;
      s.targetOutfit = shared.active;
      if (first || still) {
        applyOutfit(s.targetOutfit);
        s.swapT = SWAP;
      } else {
        s.swapT = 0;
      }
      if (!dancing) {
        s.gesture = GESTURE_FOR_SLIDE[shared.active] ?? "present";
        s.gT = first ? 0 : -SWAP * 0.75;
      }
    }
    if (still) {
      s.gT = 99;
      s.nextDance = 99;
      s.pendingDance = false;
    }
    // Outfit swap: a quick hop-and-spin; the clothes change while he faces away
    s.swapT += dt;
    let spin = 0;
    let hop = 0;
    if (s.swapT < SWAP) {
      const p = s.swapT / SWAP;
      spin = (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2) * Math.PI * 2;
      hop = Math.sin(p * Math.PI) * 0.16;
      if (p >= 0.5 && s.outfit !== s.targetOutfit) applyOutfit(s.targetOutfit);
    } else if (s.outfit !== s.targetOutfit) {
      applyOutfit(s.targetOutfit);
    }
    // Every now and then (or when clicked) he breaks into a takirari
    s.nextDance -= dt;
    if (s.nextDance <= 0) {
      s.pendingDance = true;
      s.nextDance = 25 + Math.random() * 15;
    }
    if (s.pendingDance && (s.gT > GESTURE_LEN[s.gesture] - 0.4 || s.gesture !== "takirari")) {
      s.pendingDance = false;
      if (!dancing) {
        s.gesture = "takirari";
        s.gT = 0;
      }
    }
    const G = s.gesture;
    const len = GESTURE_LEN[G];
    // envelope: ease in over 0.55s, hold, ease out over the last 0.7s
    const env = smooth(0, 0.55, s.gT) * (1 - smooth(len - 0.7, len, s.gT));
    const inGesture = s.gT < len;

    // Breathing + idle sway
    const breath = Math.sin(t * 1.6);
    const sway = Math.sin(t * 0.55);

    // Pointer look (head turns, eyes lead a little)
    const px = still ? 0 : THREE.MathUtils.clamp(shared.pointer.x, -1, 1);
    const py = still ? 0.1 : THREE.MathUtils.clamp(shared.pointer.y, -1, 1);
    s.look.x = damp(s.look.x, px, 3.2, dt);
    s.look.y = damp(s.look.y, py, 3.2, dt);
    s.eye.x = damp(s.eye.x, px, 9, dt);
    s.eye.y = damp(s.eye.y, py, 9, dt);

    // ---- joint targets ----
    const J: Record<string, number> = {
      rootY: breath * 0.012,
      torsoZ: sway * 0.025,
      torsoY: sway * 0.04 + s.look.x * 0.08,
      chestX: breath * 0.012,
      headY: s.look.x * 0.42,
      headX: s.look.y * 0.22 + Math.sin(t * 0.9) * 0.015,
      headZ: -sway * 0.04,
      // arms hang in a relaxed A-pose and swing very slightly
      shRz: -0.16 - breath * 0.012,
      shRx: Math.sin(t * 0.55 + 1) * 0.04,
      shRy: 0,
      elR: -0.28,
      elRz: 0,
      hRz: 0,
      shLz: 0.16 + breath * 0.012,
      shLx: Math.sin(t * 0.55) * 0.04,
      shLy: 0,
      elL: -0.28,
      elLz: 0,
      curl: 0,
      thumbUp: 0,
      hanky: 0,
      rootX: 0,
      rootRY: 0,
      bounce: 0,
      hipLx: 0,
      hipRx: 0,
      kneeL: 0,
      kneeR: 0,
      hatY: 0,
      hatTilt: 0,
      hipL: -sway * 0.02,
      hipR: -sway * 0.02,
      knee: 0.04 + breath * 0.01,
      happy: 0,
    };

    if (inGesture && env > 0) {
      if (G === "wave") {
        // Robot's right arm (-x) up, forearm waving side to side
        const w = Math.sin(s.gT * 9) * 0.38;
        J.shRz = THREE.MathUtils.lerp(J.shRz, -2.45, env);
        J.shRx = THREE.MathUtils.lerp(J.shRx, -0.25, env);
        J.elR = THREE.MathUtils.lerp(J.elR, -0.15, env);
        J.elRz = THREE.MathUtils.lerp(0, w - 0.2, env);
        J.hRz = THREE.MathUtils.lerp(0, w * 0.4, env);
        J.headZ += 0.12 * env;
        J.torsoZ += 0.05 * env;
        J.happy = env;
      } else if (G === "present") {
        // Open-palm gesture toward the copy on the left of the screen
        J.shRz = THREE.MathUtils.lerp(J.shRz, -1.05, env);
        J.shRx = THREE.MathUtils.lerp(J.shRx, -0.55, env);
        J.shRy = THREE.MathUtils.lerp(0, -0.35, env);
        J.elR = THREE.MathUtils.lerp(J.elR, -0.75, env);
        J.hRz = THREE.MathUtils.lerp(0, -0.35, env);
        J.headY = THREE.MathUtils.lerp(J.headY, -0.38, env * 0.85);
        J.torsoY += -0.12 * env;
      } else if (G === "tip") {
        // Lift the hat by the brim and nod
        const nod = Math.sin(smooth(0.5, len - 0.6, s.gT) * Math.PI);
        J.shLz = THREE.MathUtils.lerp(J.shLz, 2.35, env);
        J.shLx = THREE.MathUtils.lerp(J.shLx, -0.5, env);
        J.shLy = THREE.MathUtils.lerp(0, 0.35, env);
        J.elL = THREE.MathUtils.lerp(J.elL, -0.35, env);
        J.elLz = THREE.MathUtils.lerp(0, 0.72, env);
        J.hatY = 0.16 * env;
        J.hatTilt = -0.22 * env;
        J.headX += nod * 0.22;
        J.happy = env;
      } else if (G === "thumbs") {
        // Forearm up, fist closed, thumb up, little confident nod
        const nod = Math.sin(smooth(0.4, len - 0.5, s.gT) * Math.PI);
        J.shRz = THREE.MathUtils.lerp(J.shRz, -0.3, env);
        J.shRx = THREE.MathUtils.lerp(J.shRx, -0.45, env);
        J.shRy = THREE.MathUtils.lerp(0, 0.25, env);
        J.elR = THREE.MathUtils.lerp(J.elR, -2.05, env);
        J.hRz = THREE.MathUtils.lerp(0, 0.15, env);
        J.curl = env;
        J.thumbUp = env;
        J.headX += nod * 0.12;
        J.headZ += 0.1 * env;
        J.torsoZ += 0.04 * env;
        J.happy = env;
      } else if (G === "takirari") {
        // Bouncy alternating steps, hips swaying side to side, pañuelo twirling overhead,
        // the other hand on the hip. Happy eyes the whole time.
        const b = s.gT * BEAT * Math.PI; // one step per half cycle
        const step = Math.sin(b); // + → left leg up, − → right leg up
        const up = Math.abs(step);
        J.bounce = up * 0.07 * env;
        J.rootX = Math.sin(b * 0.5) * 0.14 * env;
        J.rootRY = Math.sin(b * 0.5) * 0.22 * env;
        J.torsoZ = -step * 0.1 * env + J.torsoZ * (1 - env);
        J.torsoY += Math.sin(b * 0.5) * 0.12 * env;
        J.hipLx = -Math.max(0, step) * 0.5 * env;
        J.hipRx = -Math.max(0, -step) * 0.5 * env;
        J.kneeL = Math.max(0, step) * 0.95 * env;
        J.kneeR = Math.max(0, -step) * 0.95 * env;
        J.hipL += step * 0.05 * env;
        J.hipR += step * 0.05 * env;
        // right hand up, twirling the pañuelo
        J.shRz = THREE.MathUtils.lerp(J.shRz, -2.3 + Math.sin(b) * 0.15, env);
        J.shRx = THREE.MathUtils.lerp(J.shRx, -0.2, env);
        J.elR = THREE.MathUtils.lerp(J.elR, -0.35, env);
        J.elRz = THREE.MathUtils.lerp(0, Math.sin(b * 2) * 0.45, env);
        J.hRz = THREE.MathUtils.lerp(0, Math.cos(b * 2) * 0.5, env);
        J.hanky = env;
        // left hand on the hip
        J.shLz = THREE.MathUtils.lerp(J.shLz, 0.75, env);
        J.shLx = THREE.MathUtils.lerp(J.shLx, 0.15, env);
        J.elL = THREE.MathUtils.lerp(J.elL, -0.2, env);
        J.elLz = THREE.MathUtils.lerp(0, -1.7, env);
        J.headX += Math.sin(b * 2) * 0.05 * env;
        J.headZ = THREE.MathUtils.lerp(J.headZ, step * 0.12, env);
        J.hatTilt = step * 0.05 * env;
        J.happy = env;
      }
    }

    // ---- apply with springs (smooth, never snaps) ----
    const k = 7.5;
    const cur = s.j;
    const fast = G === "takirari" ? 16 : 14;
    for (const key in J) {
      const lam = key === "elRz" || key === "hRz" ? fast : G === "takirari" ? 11 : k;
      cur[key] = damp(cur[key] ?? J[key], J[key], lam, dt);
    }

    if (root.current) {
      root.current.position.set(cur.rootX, cur.rootY + cur.bounce + hop, 0);
      root.current.rotation.y = cur.rootRY + spin;
    }
    fingersR.current.forEach((f, i) => {
      if (f) f.rotation.set(0.35 + cur.curl * 1.9, 0, (i - 1) * -0.08);
    });
    if (thumbR.current) {
      thumbR.current.rotation.set(0.6 - cur.thumbUp * 0.75, 0, -0.7 + cur.thumbUp * 0.75);
      thumbR.current.scale.set(1 + cur.thumbUp * 0.3, 1 + cur.thumbUp * 0.4, 1 + cur.thumbUp * 0.3);
    }
    // Floating props: chat bubble (AI) and browser window (web) bob beside him
    if (bubble.current) {
      bubble.current.position.y = 2.55 + Math.sin(t * 1.4) * 0.06;
      bubble.current.rotation.z = Math.sin(t * 1.1) * 0.04;
    }
    bubbleDots.current.forEach((d, i) => {
      if (d) d.position.y = Math.max(0, Math.sin(t * 6 - i * 0.9)) * 0.05;
    });
    if (browser.current) {
      browser.current.position.y = 1.75 + Math.sin(t * 1.2 + 1) * 0.07;
      browser.current.rotation.y = -0.42 + Math.sin(t * 0.7) * 0.05;
    }
    if (browserCursor.current) {
      const c = (t * 0.5) % 1;
      browserCursor.current.position.set(-0.15 + smooth(0, 0.5, c) * 0.32, 0.05 - smooth(0, 0.5, c) * 0.2, 0.06);
      browserCursor.current.scale.setScalar(c > 0.55 && c < 0.65 ? 0.8 : 1);
    }
    if (hanky.current) {
      const h = cur.hanky;
      hanky.current.scale.setScalar(h < 0.02 ? 0 : h);
      hanky.current.rotation.set(Math.sin(t * 9) * 0.35, Math.sin(t * 6.5) * 0.6, Math.cos(t * 8) * 0.3);
    }
    if (torso.current) torso.current.rotation.set(0, cur.torsoY, cur.torsoZ);
    if (chest.current) {
      chest.current.rotation.x = cur.chestX;
      chest.current.scale.set(1 + breath * 0.006, 1 + breath * 0.008, 1 + breath * 0.01);
    }
    if (head.current) head.current.rotation.set(cur.headX, cur.headY, cur.headZ);
    if (hat.current) {
      hat.current.position.y = 0.56 + cur.hatY;
      hat.current.rotation.set(0.05 + cur.hatTilt * 0.3, 0, -0.06 + cur.hatTilt);
    }
    if (shoulderR.current) shoulderR.current.rotation.set(cur.shRx, cur.shRy, cur.shRz);
    if (elbowR.current) elbowR.current.rotation.set(cur.elR, 0, cur.elRz);
    if (handR.current) handR.current.rotation.set(0, 0, cur.hRz);
    if (shoulderL.current) shoulderL.current.rotation.set(cur.shLx, cur.shLy, cur.shLz);
    if (elbowL.current) elbowL.current.rotation.set(cur.elL, 0, cur.elLz);
    if (handL.current) handL.current.rotation.set(0, 0, 0);
    if (hipL.current) hipL.current.rotation.set(-cur.knee * 0.5 + cur.hipLx, 0, cur.hipL + 0.02);
    if (hipR.current) hipR.current.rotation.set(-cur.knee * 0.5 + cur.hipRx, 0, cur.hipR - 0.02);
    if (kneeL.current) kneeL.current.rotation.x = cur.knee + cur.kneeL;
    if (kneeR.current) kneeR.current.rotation.x = cur.knee + cur.kneeR;
    if (scarfTip.current) {
      scarfTip.current.rotation.x = -0.06 + Math.sin(t * 1.3) * 0.03 - cur.chestX;
      scarfTip.current.rotation.z = Math.sin(t * 0.9) * 0.05 - cur.torsoZ * 0.8;
    }
    if (tari.current) {
      // swings like a pendulum, more when he dances
      tari.current.rotation.z = -cur.torsoZ * 1.6 - cur.rootX * 1.2 + Math.sin(t * 0.7) * 0.03;
      tari.current.rotation.x = Math.sin(t * 0.8 + 1) * 0.03 - cur.bounce * 2;
    }

    // Glow pulse
    const pulse = 0.75 + Math.sin(t * 2.2) * 0.25;
    if (earGlowL.current) earGlowL.current.emissiveIntensity = 0.6 + pulse * 0.6;
    if (antennaTip.current) {
      const m = antennaTip.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.6 + (Math.sin(t * 3.1) * 0.5 + 0.5) * 1.4;
    }

    // Blink
    s.nextBlink -= dt;
    if (s.nextBlink <= 0) {
      s.blinkT = 0;
      s.nextBlink = 2.4 + Math.random() * 3.2;
    }
    s.blinkT = Math.min(1, s.blinkT + dt / 0.18);
    const open = s.blinkT < 1 ? Math.abs(Math.cos(s.blinkT * Math.PI)) : 1;
    s.eye.happy = damp(s.eye.happy, cur.happy, 8, dt);
    face.draw(s.eye.x - cur.headY * 0.4, s.eye.y * 0.8, open, s.eye.happy, pulse);

    void state;
  });

  /* ---------- layout constants (chest-space, y up, robot faces +z) ---------- */
  const { HEAD, TY } = geo;
  const headY = 1.6;
  const shoulderX = 0.56;
  const shoulderY = 0.66;
  const hipX = 0.2;
  const hipY = -0.22;

  // Positions on the shirt front
  const buttonYs = [0.27, 0.08];
  const btnZ = (y: number) => geo.surfZTorso(0, y) + 0.006;
  const pocketZ = geo.surfZTorso(0.22, 0.44);

  return (
    <group
      ref={root}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        dance();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      {/* AI receptionist: chat bubble with typing dots */}
      <group ref={bubble} position={[1.25, 2.55, 0.25]} userData={only(1)}>
        <mesh geometry={geo.bubble} material={mats.screen} />
        <mesh position={[-0.2, -0.24, 0]} rotation={[0, 0, -0.6]} material={mats.screen}>
          <coneGeometry args={[0.07, 0.14, 12]} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <group key={i} position={[(i - 1) * 0.13, 0, 0.07]}>
            <mesh
              ref={(el) => {
                bubbleDots.current[i] = el;
              }}
              material={mats.glowBasic}
            >
              <sphereGeometry args={[0.042, 16, 12]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Web designer: floating browser window with a cursor clicking the call to action */}
      <group ref={browser} position={[1.45, 1.75, 0.15]} rotation={[0, -0.42, 0]} userData={only(2)}>
        <mesh geometry={geo.browser} material={mats.screen} />
        <mesh position={[0, 0.3, 0.031]} material={mats.line}>
          <boxGeometry args={[1.02, 0.1, 0.004]} />
        </mesh>
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <mesh key={c} position={[-0.44 + i * 0.06, 0.3, 0.036]}>
            <circleGeometry args={[0.018, 16]} />
            <meshBasicMaterial color={c} />
          </mesh>
        ))}
        <mesh position={[-0.17, 0.14, 0.033]} material={mats.graphite}>
          <boxGeometry args={[0.56, 0.06, 0.004]} />
        </mesh>
        <mesh position={[-0.24, 0.05, 0.033]} material={mats.line}>
          <boxGeometry args={[0.42, 0.03, 0.004]} />
        </mesh>
        <mesh position={[-0.33, -0.05, 0.034]} material={mats.glowBasic}>
          <boxGeometry args={[0.22, 0.075, 0.004]} />
        </mesh>
        {[-1, 0, 1].map((i) => (
          <mesh key={i} position={[i * 0.32, -0.22, 0.033]} material={mats.line}>
            <boxGeometry args={[0.28, 0.15, 0.004]} />
          </mesh>
        ))}
        <group ref={browserCursor} position={[0, 0, 0.06]}>
          <mesh rotation={[0, 0, 0.5]} position={[0, -0.03, 0]} material={mats.graphite}>
            <coneGeometry args={[0.03, 0.08, 3]} />
          </mesh>
        </group>
      </group>

      {/* soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.13, 0.05]} material={mats.shadow}>
        <planeGeometry args={[2.4, 1.3]} />
      </mesh>

      {/* -------------------- LEGS -------------------- */}
      {[-1, 1].map((side) => (
        <group key={side} ref={side < 0 ? hipR : hipL} position={[side * hipX, hipY, 0]}>
          {/* trouser leg, rolled up just below the knee */}
          <mesh position={[0, -0.5, 0]} material={mats.pants}>
            <cylinderGeometry args={[0.2, 0.175, 1.0, 32, 1, true]} />
          </mesh>
          <mesh position={[0, -0.15, 0]} material={mats.pants}>
            <sphereGeometry args={[0.2, 32, 16]} />
          </mesh>
          {/* crease down the front */}
          <mesh position={[0, -0.55, 0.188]} rotation={[0.025, 0, 0]} material={mats.pantsShade}>
            <boxGeometry args={[0.012, 0.8, 0.01]} />
          </mesh>
          <group ref={side < 0 ? kneeR : kneeL} position={[0, -0.92, 0]}>
            {/* rolled cuff */}
            <mesh position={[0, -0.12, 0]} material={mats.pants}>
              <cylinderGeometry args={[0.178, 0.172, 0.24, 32, 1, true]} />
            </mesh>
            <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.pantsShade}>
              <torusGeometry args={[0.18, 0.026, 12, 40]} />
            </mesh>
            <mesh position={[0, -0.21, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.pantsShade}>
              <torusGeometry args={[0.178, 0.034, 12, 40]} />
            </mesh>
            <mesh position={[0, -0.23, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.graphite}>
              <circleGeometry args={[0.17, 32]} />
            </mesh>
            {/* robot shin */}
            <mesh position={[0, -0.42, 0]} material={mats.shell}>
              <cylinderGeometry args={[0.115, 0.085, 0.42, 32]} />
            </mesh>
            <mesh position={[0, -0.38, 0.1]} material={mats.accent}>
              <boxGeometry args={[0.03, 0.18, 0.02]} />
            </mesh>
            {/* ankle */}
            <mesh position={[0, -0.68, 0]} material={mats.graphite}>
              <sphereGeometry args={[0.085, 24, 16]} />
            </mesh>
            <mesh position={[0, -0.64, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.accent}>
              <torusGeometry args={[0.088, 0.012, 8, 32]} />
            </mesh>
            {/* foot + abarca */}
            <group position={[0, -0.82, 0.07]}>
              <mesh material={mats.shell} geometry={geo.foot} position={[0, 0.02, 0]} />
              <mesh material={mats.graphite} position={[0, -0.0, 0.16]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.25, 0.012, 0.012]} />
              </mesh>
              {/* tyre-rubber sole */}
              <mesh material={mats.sole} geometry={geo.sole} position={[0, -0.075, 0]} />
              {/* leather straps over the toes, criss-cross over the instep, and the heel strap */}
              <mesh material={mats.leather} position={[0, -0.04, 0.17]} rotation={[0, 0, 0]} scale={[1, 1.05, 0.55]}>
                <torusGeometry args={[0.165, 0.022, 10, 32, Math.PI]} />
              </mesh>
              <mesh material={mats.leather} position={[0, -0.04, 0.04]} rotation={[0.35, 0, 0]} scale={[1, 1.15, 0.7]}>
                <torusGeometry args={[0.168, 0.022, 10, 32, Math.PI]} />
              </mesh>
              <mesh material={mats.leather} position={[0, 0.06, -0.06]} rotation={[-0.25, 0, 0]}>
                <torusGeometry args={[0.13, 0.02, 10, 32, Math.PI * 1]} />
              </mesh>
              <mesh material={mats.leather} position={[0, -0.03, -0.16]} rotation={[Math.PI / 2 - 0.2, 0, 0]} scale={[1, 0.75, 1]}>
                <torusGeometry args={[0.15, 0.02, 10, 32, Math.PI]} />
              </mesh>
              {/* buckle */}
              <mesh material={mats.steel} position={[side * 0.16, 0.06, -0.08]}>
                <boxGeometry args={[0.02, 0.05, 0.05]} />
              </mesh>
            </group>
          </group>
        </group>
      ))}

      {/* -------------------- TORSO -------------------- */}
      <group ref={torso}>
        {/* trousers top / seat */}
        <mesh position={[0, -0.18, 0]} material={mats.pants} geometry={geo.pelvis} />
        {/* belt */}
        <mesh position={[0, -0.02, 0]} material={mats.pantsShade} geometry={geo.belt} />
        <mesh position={[0, -0.02, 0.335]} material={mats.steel}>
          <boxGeometry args={[0.1, 0.075, 0.02]} />
        </mesh>
        <mesh position={[0, -0.02, 0.34]} material={mats.pantsShade}>
          <boxGeometry args={[0.06, 0.04, 0.02]} />
        </mesh>
        {/* chef's apron */}
        <group userData={only(4)}>
          <mesh geometry={geo.apron} material={mats.apron} />
          <mesh position={[0, -0.02, 0]} scale={[1.03, 1.15, 1.03]} material={mats.apron} geometry={geo.belt} />
        </group>

        <group ref={chest}>
          {/* shirt body */}
          <mesh position={[0, TY, 0]} material={mats.shirt} geometry={geo.torso} />
          {/* placket, buttons and chest pocket (hidden under vest / hoodie / chef coat) */}
          <group userData={only(0, 1)}>
          <mesh position={[0, 0.2, btnZ(0.2) - 0.006]} material={mats.shirtShade}>
            <boxGeometry args={[0.06, 0.42, 0.008]} />
          </mesh>
          {buttonYs.map((y) => (
            <mesh key={y} position={[0, y, btnZ(y) + 0.004]} rotation={[Math.PI / 2, 0, 0]} material={mats.button}>
              <cylinderGeometry args={[0.018, 0.018, 0.012, 16]} />
            </mesh>
          ))}
          {/* chest pocket */}
          <group position={[0.22, 0.44, pocketZ - 0.002]} rotation={[-0.15, 0.32, 0]}>
            <mesh material={mats.shirtShade} geometry={geo.pocket} />
            <mesh position={[0, 0.1, 0.012]} material={mats.shirt}>
              <boxGeometry args={[0.23, 0.05, 0.012]} />
            </mesh>
          </group>
          </group>
          {/* collar */}
          <group userData={only(0, 1, 3)}>
            {[-1, 1].map((side) => (
              <mesh
                key={side}
                position={[side * 0.15, 0.78, 0.2]}
                rotation={[-0.75, side * 0.45, side * -0.5]}
                material={mats.shirt}
              >
                <boxGeometry args={[0.2, 0.15, 0.018]} />
              </mesh>
            ))}
          </group>

          {/* -------- AI receptionist: green tie + name badge -------- */}
          <group userData={only(1)}>
            <mesh geometry={geo.tie} material={mats.tie} />
            <mesh position={[0, 0.75, geo.surfZTorso(0, 0.75) + 0.035]} material={mats.tie} scale={[1, 0.85, 0.7]}>
              <sphereGeometry args={[0.052, 20, 14]} />
            </mesh>
            <group position={[0.235, 0.47, pocketZ + 0.03]} rotation={[-0.15, 0.32, 0]}>
              <mesh material={mats.white}>
                <boxGeometry args={[0.18, 0.11, 0.012]} />
              </mesh>
              <mesh position={[0, 0.034, 0.007]} material={mats.accent}>
                <boxGeometry args={[0.18, 0.03, 0.004]} />
              </mesh>
              <mesh position={[-0.025, -0.015, 0.007]} material={mats.graphite}>
                <boxGeometry args={[0.09, 0.014, 0.003]} />
              </mesh>
              <mesh position={[-0.04, -0.037, 0.007]} material={mats.steel}>
                <boxGeometry args={[0.06, 0.01, 0.003]} />
              </mesh>
            </group>
          </group>

          {/* -------- Web designer: hoodie with kangaroo pocket + drawstrings -------- */}
          <group userData={only(2)}>
            <mesh position={[0, TY, 0]} scale={[1.05, 1.0, 1.08]} material={mats.hoodie} geometry={geo.torso} />
            <mesh geometry={geo.kanga} material={mats.hoodieShade} />
            <mesh position={[0, 0.84, -0.08]} rotation={[Math.PI / 2 + 0.6, 0, 0]} material={mats.hoodie} scale={[1.12, 1, 1]}>
              <torusGeometry args={[0.23, 0.1, 16, 40]} />
            </mesh>
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 0.09, 0.66, geo.surfZTorso(side * 0.086, 0.7) * 1.08 + 0.02]}>
                <mesh material={mats.white}>
                  <cylinderGeometry args={[0.009, 0.009, 0.22, 8]} />
                </mesh>
                <mesh position={[0, -0.12, 0]} material={mats.accent}>
                  <cylinderGeometry args={[0.014, 0.014, 0.04, 10]} />
                </mesh>
              </group>
            ))}
          </group>

          {/* -------- Teacher: sweater vest, V-neck, bow tie -------- */}
          <group userData={only(3)}>
            <mesh position={[0, TY + 0.02, 0]} scale={[1.045, 0.97, 1.075]} material={mats.vest} geometry={geo.torso} />
            <mesh geometry={geo.vneck} material={mats.shirt} />
            <group position={[0, 0.76, geo.surfZTorso(0, 0.76) + 0.075]}>
              {[-1, 1].map((side) => (
                <mesh key={side} position={[side * 0.062, 0, 0]} rotation={[0, 0, side * (Math.PI / 2)]} material={mats.bowtie} scale={[1, 1, 0.5]}>
                  <coneGeometry args={[0.058, 0.12, 4]} />
                </mesh>
              ))}
              <mesh material={mats.bowtie}>
                <sphereGeometry args={[0.032, 16, 12]} />
              </mesh>
            </group>
          </group>

          {/* -------- Chef: double-breasted coat with mandarin collar -------- */}
          <group userData={only(4)}>
            <mesh position={[0, TY, 0]} scale={[1.05, 1.0, 1.08]} material={mats.coat} geometry={geo.torso} />
            <mesh position={[0, 0.82, 0]} material={mats.coat}>
              <cylinderGeometry args={[0.22, 0.28, 0.13, 40, 1, true]} />
            </mesh>
            {[-1, 1].flatMap((side) =>
              [0.62, 0.43, 0.24].map((y) => (
                <mesh
                  key={`${side}${y}`}
                  position={[side * 0.13, y, geo.surfZTorso((side * 0.13) / 1.05, y) * 1.08 + 0.008]}
                  rotation={[Math.PI / 2, 0, 0]}
                  material={mats.graphite}
                >
                  <cylinderGeometry args={[0.022, 0.022, 0.014, 16]} />
                </mesh>
              )),
            )}
          </group>

          {/* neck */}
          <group position={[0, 0.92, 0]}>
            <mesh material={mats.graphite}>
              <cylinderGeometry args={[0.13, 0.16, 0.26, 32]} />
            </mesh>
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[0, 0.0 + i * 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.graphite}>
                <torusGeometry args={[0.145, 0.016, 8, 32]} />
              </mesh>
            ))}
          </group>

          {/* green neckerchief: rolled band around the neck, knot, triangle and two tails */}
          <group position={[0, 0.84, 0]} userData={only(0)}>
            <mesh rotation={[Math.PI / 2 + 0.22, 0, 0]} material={mats.scarf} scale={[1.05, 0.92, 1]}>
              <torusGeometry args={[0.21, 0.055, 16, 48]} />
            </mesh>
            <mesh position={[0, -0.06, 0.25]} material={mats.scarf} scale={[1.15, 0.95, 0.85]}>
              <sphereGeometry args={[0.07, 24, 16]} />
            </mesh>
            <group ref={scarfTip} position={[0, -0.05, 0.27]}>
              <mesh geometry={geo.tri} material={mats.scarf} scale={[1.05, 1.0, 1]} />
              {/* knot tails */}
              {[-1, 1].map((side) => (
                <mesh
                  key={side}
                  position={[side * 0.08, -0.08, 0.08]}
                  rotation={[0.25, 0, side * 0.55]}
                  material={mats.scarf}
                  scale={[0.8, 0.8, 0.45]}
                >
                  <coneGeometry args={[0.05, 0.17, 12]} />
                </mesh>
              ))}
            </group>
          </group>


          {/* -------------------- ARMS -------------------- */}
          {[-1, 1].map((side) => (
            <group
              key={side}
              ref={side < 0 ? shoulderR : shoulderL}
              position={[side * shoulderX, shoulderY, 0]}
            >
              {/* shoulder + short rolled sleeve */}
              <mesh material={mats.sleeve} position={[0, -0.02, 0]}>
                <sphereGeometry args={[0.165, 32, 20]} />
              </mesh>
              <mesh material={mats.sleeve} position={[0, -0.25, 0]}>
                <cylinderGeometry args={[0.16, 0.14, 0.46, 32, 1, true]} />
              </mesh>
              <mesh material={mats.sleeveShade} position={[0, -0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.142, 0.032, 12, 36]} />
              </mesh>
              <mesh material={mats.graphite} position={[0, -0.49, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.13, 28]} />
              </mesh>
              {/* elbow */}
              <group ref={side < 0 ? elbowR : elbowL} position={[0, -0.56, 0]}>
                <mesh material={mats.graphite}>
                  <sphereGeometry args={[0.085, 24, 16]} />
                </mesh>
                {/* forearm shell */}
                <mesh material={mats.shell} position={[0, -0.22, 0]}>
                  <cylinderGeometry args={[0.105, 0.085, 0.34, 32]} />
                </mesh>
                <mesh material={mats.shell} position={[0, -0.05, 0]}>
                  <sphereGeometry args={[0.105, 24, 16]} />
                </mesh>
                <mesh material={mats.accent} position={[side * 0.0, -0.2, 0.095]}>
                  <boxGeometry args={[0.025, 0.12, 0.015]} />
                </mesh>
                {/* wrist + hand */}
                <group ref={side < 0 ? handR : handL} position={[0, -0.42, 0]} scale={1.45}>
                  <mesh material={mats.graphite}>
                    <cylinderGeometry args={[0.06, 0.065, 0.06, 20]} />
                  </mesh>
                  <mesh material={mats.steel} geometry={geo.palm} position={[0, -0.1, 0]} />
                  {/* three fingers + thumb, slightly curled */}
                  {[-1, 0, 1].map((f) => (
                    <group
                      key={f}
                      ref={(el) => {
                        if (side < 0) fingersR.current[f + 1] = el;
                      }}
                      position={[side * 0.0 + f * 0.05, -0.18, 0.0]}
                      rotation={[0.35, 0, f * -0.08]}
                    >
                      <mesh material={mats.graphite} position={[0, -0.04, 0]}>
                        <capsuleGeometry args={[0.017, 0.06, 4, 10]} />
                      </mesh>
                      <mesh material={mats.steel} position={[0, -0.1, 0.012]} rotation={[0.35, 0, 0]}>
                        <capsuleGeometry args={[0.015, 0.045, 4, 10]} />
                      </mesh>
                    </group>
                  ))}
                  <group ref={side < 0 ? thumbR : undefined} position={[side * -0.07, -0.11, 0.035]} rotation={[0.6, 0, side * 0.7]}>
                    <mesh material={mats.graphite} position={[0, -0.04, 0]}>
                      <capsuleGeometry args={[0.018, 0.06, 4, 10]} />
                    </mesh>
                  </group>
                  {side < 0 && (
                    <group userData={only(4)} position={[0, -0.14, 0.03]} rotation={[-Math.PI / 2 + 0.35, 0, 0]}>
                      <mesh material={mats.wood} position={[0, -0.06, 0]}>
                        <cylinderGeometry args={[0.014, 0.017, 0.34, 10]} />
                      </mesh>
                      <mesh material={mats.wood} geometry={geo.spoonBowl} position={[0, -0.28, 0]} />
                    </group>
                  )}
                  {side > 0 && (
                    <group userData={only(3)} position={[0.01, -0.2, 0.02]} rotation={[0, Math.PI / 2 - 0.5, 0.08]}>
                      <mesh material={mats.paper}>
                        <boxGeometry args={[0.2, 0.27, 0.05]} />
                      </mesh>
                      {[-1, 1].map((f) => (
                        <mesh key={f} material={mats.bookCover} position={[0.005, 0, f * 0.029]}>
                          <boxGeometry args={[0.215, 0.285, 0.009]} />
                        </mesh>
                      ))}
                      <mesh material={mats.bookCover} position={[-0.104, 0, 0]}>
                        <boxGeometry args={[0.012, 0.285, 0.066]} />
                      </mesh>
                      <mesh material={mats.accent} position={[0.01, 0.06, 0.034]}>
                        <boxGeometry args={[0.12, 0.02, 0.002]} />
                      </mesh>
                    </group>
                  )}
                  {side < 0 && (
                    <group ref={hanky} position={[0, -0.2, 0.02]} scale={0}>
                      <mesh geometry={geo.tri} material={mats.scarf} rotation={[0, 0, Math.PI]} position={[0, -0.02, 0]} scale={[0.75, 0.9, 1]} />
                    </group>
                  )}
                </group>
              </group>
            </group>
          ))}

          {/* -------------------- HEAD -------------------- */}
          <group ref={head} position={[0, headY, 0]}>
            <mesh material={mats.shell} geometry={geo.head} />
            {/* face bezel + black glass visor */}
            <mesh material={mats.steel} geometry={geo.bezel} position={[0, -0.02, HEAD[2] - 0.16]} />
            <mesh material={mats.visor} geometry={geo.visor} position={[0, -0.02, HEAD[2] - 0.14]} />
            {/* eyes (live canvas) */}
            <mesh position={[0, -0.02, HEAD[2] + 0.062]} material={faceMat}>
              <planeGeometry args={[0.92, 0.46]} />
            </mesh>
            {/* forehead light */}
            <mesh material={mats.accent} position={[0, 0.43, HEAD[2] - 0.18]} rotation={[-0.55, 0, 0]} scale={[1, 0.38, 0.6]}>
              <capsuleGeometry args={[0.04, 0.14, 4, 12]} />
            </mesh>
            {/* ear pods */}
            {[-1, 1].map((side) => (
              <group key={side} position={[side * (HEAD[0] - 0.02), -0.02, 0]} rotation={[0, 0, side * (Math.PI / 2)]}>
                <mesh material={mats.shell}>
                  <cylinderGeometry args={[0.22, 0.24, 0.12, 40]} />
                </mesh>
                <mesh position={[0, -side * 0.0 + 0.07 * -1, 0]} material={mats.shell}>
                  <cylinderGeometry args={[0.16, 0.22, 0.06, 40]} />
                </mesh>
                <mesh position={[0, -0.072, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.185, 0.022, 12, 48]} />
                  <meshStandardMaterial
                    ref={side > 0 ? earGlowL : undefined}
                    color={C.glow}
                    emissive={C.glow}
                    emissiveIntensity={1}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            ))}
            {/* AI receptionist headset */}
            <group userData={only(1)}>
              <mesh position={[0, -0.02, 0]} scale={[1, 0.86, 1]} material={mats.graphite}>
                <torusGeometry args={[0.95, 0.035, 12, 72, Math.PI]} />
              </mesh>
              {[-1, 1].map((side) => (
                <mesh key={side} position={[side * 0.95, -0.04, 0]} rotation={[0, 0, Math.PI / 2]} material={mats.graphite}>
                  <cylinderGeometry args={[0.17, 0.17, 0.09, 32]} />
                </mesh>
              ))}
              <mesh geometry={geo.mic} material={mats.graphite} />
              <mesh position={[-0.3, -0.47, 0.76]} material={mats.accent}>
                <sphereGeometry args={[0.048, 16, 12]} />
              </mesh>
            </group>
            {/* teacher's glasses */}
            <group userData={only(3)}>
              {[-1, 1].map((side) => (
                <mesh key={side} position={[side * 0.2, -0.0, 0.75]} material={mats.frame}>
                  <torusGeometry args={[0.15, 0.022, 12, 40]} />
                </mesh>
              ))}
              <mesh position={[0, 0.03, 0.75]} rotation={[0, 0, Math.PI / 2]} material={mats.frame}>
                <cylinderGeometry args={[0.014, 0.014, 0.12, 8]} />
              </mesh>
              {geo.temples.map((g, i) => (
                <mesh key={i} geometry={g} material={mats.frame} />
              ))}
            </group>

            {/* side antenna */}
            <group position={[-(HEAD[0] + 0.1), 0.02, -0.02]} rotation={[0, 0, 0.95]}>
              <mesh material={mats.steel} position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.014, 0.018, 0.4, 12]} />
              </mesh>
              <mesh ref={antennaTip} position={[0, 0.42, 0]}>
                <sphereGeometry args={[0.04, 20, 14]} />
                <meshStandardMaterial color={C.glow} emissive={C.glow} emissiveIntensity={1.2} roughness={0.2} />
              </mesh>
            </group>

            {/* -------------------- HEADWEAR (lifted together by the hat-tip gesture) -------------------- */}
            <group ref={hat} position={[0, 0.56, -0.03]} rotation={[0.05, 0, -0.06]}>
              {/* Sombrero de paja (camba) */}
              <group userData={only(0)} scale={1.13}>
                <mesh geometry={geo.crown} material={mats.straw} />
                <mesh geometry={geo.brim} material={mats.strawBrim} />
                <mesh position={[0, 0.055, 0]} material={mats.band}>
                  <cylinderGeometry args={[0.585, 0.602, 0.1, 96, 1, true]} />
                </mesh>
                {/* flat bow on the left side of the band */}
                <mesh position={[0.555, 0.06, -0.2]} rotation={[0, -0.34 + Math.PI / 2, 0]} material={mats.band}>
                  <boxGeometry args={[0.14, 0.07, 0.025]} />
                </mesh>
              </group>
              {/* Backwards cap (web designer) */}
              <group userData={only(2)} position={[0, -0.11, 0.03]} rotation={[-0.05, 1.9, 0.06]}>
                <mesh scale={[1, 0.46, 0.84]} material={mats.cap}>
                  <sphereGeometry args={[0.78, 56, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
                </mesh>
                <mesh position={[0, 0.36, 0]} material={mats.cap}>
                  <sphereGeometry args={[0.05, 16, 10]} />
                </mesh>
                <mesh position={[0, 0.02, -0.55]} rotation={[0.15, 0, 0]} material={mats.cap}>
                  <cylinderGeometry args={[0.42, 0.42, 0.025, 40, 1, false, Math.PI / 2, Math.PI]} />
                </mesh>
              </group>
              {/* Toque (chef) */}
              <group userData={only(4)} position={[0, -0.21, 0.03]} rotation={[-0.05, 0, 0.06]} scale={0.92}>
                <mesh position={[0, 0.08, 0]} scale={[1, 1, 0.84]} material={mats.coat}>
                  <cylinderGeometry args={[0.81, 0.8, 0.16, 72, 1, true]} />
                </mesh>
                <mesh position={[0, 0.41, 0]} scale={[1, 1, 0.86]} geometry={geo.toqueBody} material={mats.coat} />
                <mesh position={[0, 0.7, 0]} scale={[1, 1, 0.9]} geometry={geo.toqueTop} material={mats.coat} />
              </group>
            </group>
          </group>

          {/* -------------------- TARI (tutuma gourd at the waist) -------------------- */}
          <mesh geometry={geo.cord} material={mats.cord} userData={only(0)} />
          <group ref={tari} position={[0.42, -0.16, 0.3]} userData={only(0)}>
            <group position={[0, -0.2, 0]} rotation={[0.1, 0, 0.12]}>
              <mesh geometry={geo.gourd} material={mats.gourd} />
              {/* cord wrapped around the neck */}
              <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.cord}>
                <torusGeometry args={[0.06, 0.011, 8, 24]} />
              </mesh>
              {/* cork stopper */}
              <mesh position={[0, 0.245, 0]} material={mats.cork}>
                <cylinderGeometry args={[0.036, 0.03, 0.06, 16]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
