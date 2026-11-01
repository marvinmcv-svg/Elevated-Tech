"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * "El Camba": the Elevated Tech robot, dressed the way people dress in Santa Cruz de la Sierra.
 * Glossy white robot shell, white cotton shirt with rolled sleeves, white trousers rolled at the
 * shin, a green neckerchief, a woven "sombrero de saó", leather abarcas and a woven tari bag.
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

/** Braided palm ("saó") weave: diagonal over-under strips with natural colour variation. */
function strawTextures() {
  const N = 512;
  const cell = 32;
  const r = rng(7);
  const tones = ["#e4c47e", "#d8b467", "#cfa758", "#e9cf92", "#c79c4d"];
  const draw = (ctx: CanvasRenderingContext2D, bump: boolean) => {
    ctx.fillStyle = bump ? "#555" : "#b98d45";
    ctx.fillRect(0, 0, N, N);
    ctx.save();
    ctx.translate(N / 2, N / 2);
    ctx.rotate(Math.PI / 4);
    ctx.translate(-N, -N);
    const n = Math.ceil((N * 2) / cell);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const horizontal = (i + j) % 2 === 0;
        const x = i * cell;
        const y = j * cell;
        const pad = 2;
        if (bump) {
          const g = horizontal
            ? ctx.createLinearGradient(x, y, x, y + cell)
            : ctx.createLinearGradient(x, y, x + cell, y);
          g.addColorStop(0, "#444");
          g.addColorStop(0.5, "#eee");
          g.addColorStop(1, "#444");
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = tones[Math.floor(r() * tones.length)];
        }
        ctx.fillRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2);
        if (!bump) {
          // fibres
          ctx.strokeStyle = "rgba(120,80,30,0.22)";
          ctx.lineWidth = 1;
          for (let f = 0; f < 4; f++) {
            ctx.beginPath();
            const o = pad + 3 + f * ((cell - pad * 2 - 6) / 3);
            if (horizontal) {
              ctx.moveTo(x + pad, y + o);
              ctx.lineTo(x + cell - pad, y + o + (r() - 0.5) * 2);
            } else {
              ctx.moveTo(x + o, y + pad);
              ctx.lineTo(x + o + (r() - 0.5) * 2, y + cell - pad);
            }
            ctx.stroke();
          }
          // under-strip shading at the ends
          const sh = horizontal
            ? ctx.createLinearGradient(x, y, x + cell, y)
            : ctx.createLinearGradient(x, y, x, y + cell);
          sh.addColorStop(0, "rgba(90,55,15,0.35)");
          sh.addColorStop(0.18, "rgba(90,55,15,0)");
          sh.addColorStop(0.82, "rgba(90,55,15,0)");
          sh.addColorStop(1, "rgba(90,55,15,0.35)");
          ctx.fillStyle = sh;
          ctx.fillRect(x + pad, y + pad, cell - pad * 2, cell - pad * 2);
        }
      }
    }
    ctx.restore();
  };
  return {
    map: canvasTex(N, N, (c) => draw(c, false)),
    bump: canvasTex(N, N, (c) => draw(c, true), false),
  };
}

/** Black-and-straw zig-zag hat band, like the braided bands on camba hats. */
function bandTexture() {
  return canvasTex(512, 64, (ctx) => {
    ctx.fillStyle = "#d8b467";
    ctx.fillRect(0, 0, 512, 64);
    ctx.fillStyle = "#16120e";
    ctx.fillRect(0, 0, 512, 8);
    ctx.fillRect(0, 56, 512, 8);
    ctx.beginPath();
    const step = 32;
    ctx.moveTo(0, 50);
    for (let x = 0; x <= 512; x += step) {
      ctx.lineTo(x + step / 2, 14);
      ctx.lineTo(x + step, 50);
    }
    ctx.lineTo(512, 50);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#d8b467";
    for (let x = 0; x <= 512; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + step / 2 - 5, 38);
      ctx.lineTo(x + step / 2, 26);
      ctx.lineTo(x + step / 2 + 5, 38);
      ctx.closePath();
      ctx.fill();
    }
  });
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

/** Tari: hand-woven striped bag with a little diamond motif. */
function tariTexture() {
  return canvasTex(256, 256, (ctx) => {
    const stripes = [
      ["#f1ead8", 26],
      ["#0f9b47", 10],
      ["#7a4a26", 6],
      ["#f1ead8", 8],
      ["#c8372d", 12],
      ["#f1ead8", 8],
      ["#7a4a26", 6],
      ["#0f9b47", 10],
    ] as const;
    let y = 0;
    while (y < 256) {
      for (const [col, h] of stripes) {
        ctx.fillStyle = col;
        ctx.fillRect(0, y, 256, h);
        y += h;
      }
    }
    // diamonds on the cream bands
    ctx.fillStyle = "#c8372d";
    for (let x = 8; x < 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x + 8, 4);
      ctx.lineTo(x + 16, 13);
      ctx.lineTo(x + 8, 22);
      ctx.lineTo(x, 13);
      ctx.closePath();
      ctx.fill();
    }
    // weave grain
    for (let yy = 0; yy < 256; yy += 2) {
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, yy, 256, 1);
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

type Gesture = "wave" | "present" | "tip";
const GESTURE_FOR_SLIDE: Gesture[] = ["wave", "present", "tip", "present", "wave"];
const GESTURE_LEN: Record<Gesture, number> = { wave: 2.8, present: 2.4, tip: 2.6 };

/* ----------------------------------------------------------------------------------------------
 * The robot
 * -------------------------------------------------------------------------------------------- */
export function Robot({ shared }: { shared: Shared }) {
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

  /* ---------- materials & textures ---------- */
  const mats = useMemo(() => {
    const straw = strawTextures();
    straw.map.repeat.set(10, 3);
    straw.bump.repeat.set(10, 3);
    const strawBrim = { map: straw.map.clone(), bump: straw.bump.clone() };
    strawBrim.map.repeat.set(26, 2);
    strawBrim.bump.repeat.set(26, 2);
    strawBrim.map.needsUpdate = strawBrim.bump.needsUpdate = true;
    const band = bandTexture();
    band.repeat.set(3, 1);
    const cb = clothBump();
    cb.repeat.set(6, 6);
    const tari = tariTexture();

    return {
      shell: new THREE.MeshPhysicalMaterial({
        color: C.shell,
        roughness: 0.32,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.14,
      }),
      cloth: new THREE.MeshPhysicalMaterial({
        color: C.cloth,
        roughness: 0.92,
        sheen: 1,
        sheenColor: new THREE.Color("#ffffff"),
        sheenRoughness: 0.55,
        bumpMap: cb,
        bumpScale: 0.6,
      }),
      clothShade: new THREE.MeshPhysicalMaterial({
        color: "#e9e4d6",
        roughness: 0.95,
        sheen: 1,
        sheenColor: new THREE.Color("#ffffff"),
        sheenRoughness: 0.6,
        bumpMap: cb,
        bumpScale: 0.6,
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
      straw: new THREE.MeshStandardMaterial({
        map: straw.map,
        bumpMap: straw.bump,
        bumpScale: 2.2,
        roughness: 0.78,
        side: THREE.DoubleSide,
      }),
      strawBrim: new THREE.MeshStandardMaterial({
        map: strawBrim.map,
        bumpMap: strawBrim.bump,
        bumpScale: 2.2,
        roughness: 0.78,
        side: THREE.DoubleSide,
      }),
      band: new THREE.MeshStandardMaterial({ map: band, roughness: 0.7 }),
      leather: new THREE.MeshStandardMaterial({ color: C.leather, roughness: 0.55, metalness: 0.05 }),
      sole: new THREE.MeshStandardMaterial({ color: C.sole, roughness: 0.85 }),
      tari: new THREE.MeshStandardMaterial({ map: tari, roughness: 0.85, bumpMap: cb, bumpScale: 0.8 }),
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

    // Hat crown and brim (lathe profiles)
    const crown = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0.0, 0.56),
        new THREE.Vector2(0.18, 0.57),
        new THREE.Vector2(0.34, 0.555),
        new THREE.Vector2(0.46, 0.51),
        new THREE.Vector2(0.54, 0.42),
        new THREE.Vector2(0.58, 0.26),
        new THREE.Vector2(0.6, 0.1),
        new THREE.Vector2(0.62, 0.0),
      ],
      72,
    );
    crown.computeVertexNormals();
    const brimPts: THREE.Vector2[] = [];
    // top surface from crown out to the rolled edge, then underside back in
    const outer = 1.28;
    const steps = 18;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = 0.6 + (outer - 0.6) * t;
      const y = -0.02 - Math.sin(t * Math.PI) * 0.06 + Math.pow(t, 6) * 0.08;
      brimPts.push(new THREE.Vector2(r, y));
    }
    brimPts.push(new THREE.Vector2(outer + 0.025, 0.1));
    brimPts.push(new THREE.Vector2(outer + 0.01, 0.075));
    for (let i = steps; i >= 0; i--) {
      const t = i / steps;
      const r = 0.6 + (outer - 0.6) * t;
      const y = -0.045 - Math.sin(t * Math.PI) * 0.06 + Math.pow(t, 6) * 0.08;
      brimPts.push(new THREE.Vector2(r, y));
    }
    const brim = new THREE.LatheGeometry(brimPts, 96);
    brim.computeVertexNormals();

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

    // Tari strap: from behind the right shoulder, over it, across the chest to the left hip
    const TY = 0.3; // torso centre y in chest space
    const strapPts: THREE.Vector3[] = [];
    strapPts.push(new THREE.Vector3(-0.3, 0.55, -0.3));
    strapPts.push(new THREE.Vector3(-0.36, 0.79, -0.08));
    strapPts.push(new THREE.Vector3(-0.36, 0.8, 0.12));
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const x = -0.32 + t * 0.78;
      const y = 0.7 - t * 0.9;
      const yn = (y - TY) / TORSO[1];
      const taperK = torsoTaper(Math.max(-1, Math.min(1, yn)));
      const rx = TORSO[0] * taperK;
      const rz = TORSO[2] * (0.5 + taperK * 0.5);
      const z = surfZ(Math.min(Math.abs(x), rx * 0.97), Math.max(-TORSO[1] * 0.97, Math.min(TORSO[1] * 0.97, y - TY)), rx, TORSO[1], rz, TORSO[3]);
      strapPts.push(new THREE.Vector3(x, y, Math.max(z, 0.12) + 0.035));
    }
    strapPts.push(new THREE.Vector3(0.5, -0.36, 0.22));
    const strapCurve = new THREE.CatmullRomCurve3(strapPts, false, "centripetal");
    const strap = new THREE.TubeGeometry(strapCurve, 80, 0.022, 8, false);
    strap.scale(1, 1, 1);

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
      tari: superEllipsoid(0.2, 0.22, 0.06, 0.3, undefined, [40, 28], true),
      tariFlap: superEllipsoid(0.205, 0.08, 0.065, 0.3, undefined, [32, 12], true),
      pocket: superEllipsoid(0.11, 0.12, 0.01, 0.25, undefined, [24, 12]),
      crown,
      brim,
      tri,
      strap,
      strapCurve,
      surfZTorso: (x: number, y: number) => {
        const yn = Math.max(-1, Math.min(1, (y - TY) / TORSO[1]));
        const k = torsoTaper(yn);
        return surfZ(x, y - TY, TORSO[0] * k, TORSO[1], TORSO[2] * (0.5 + k * 0.5), TORSO[3]);
      },
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
  });

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const s = st.current;
    s.t += dt;
    const t = s.t;

    // New slide → new gesture
    if (shared.active !== s.lastSlide) {
      s.lastSlide = shared.active;
      s.gesture = GESTURE_FOR_SLIDE[shared.active] ?? "present";
      s.gT = 0;
    } else {
      s.gT += dt;
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
    const px = THREE.MathUtils.clamp(shared.pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(shared.pointer.y, -1, 1);
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
      }
    }

    // ---- apply with springs (smooth, never snaps) ----
    const k = 7.5;
    const cur = s.j;
    for (const key in J) cur[key] = damp(cur[key] ?? J[key], J[key], key === "elRz" || key === "hRz" ? 14 : k, dt);

    if (root.current) root.current.position.y = cur.rootY;
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
    if (hipL.current) hipL.current.rotation.set(-cur.knee * 0.5, 0, cur.hipL + 0.02);
    if (hipR.current) hipR.current.rotation.set(-cur.knee * 0.5, 0, cur.hipR - 0.02);
    if (kneeL.current) kneeL.current.rotation.x = cur.knee;
    if (kneeR.current) kneeR.current.rotation.x = cur.knee;
    if (scarfTip.current) {
      scarfTip.current.rotation.x = -0.06 + Math.sin(t * 1.3) * 0.03 - cur.chestX;
      scarfTip.current.rotation.z = Math.sin(t * 0.9) * 0.05 - cur.torsoZ * 0.8;
    }
    if (tari.current) {
      tari.current.rotation.z = -cur.torsoZ * 1.4 + Math.sin(t * 0.7) * 0.02;
      tari.current.rotation.x = Math.sin(t * 0.8 + 1) * 0.02;
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
    <group ref={root} position={[0, 0, 0]}>
      {/* soft contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.13, 0.05]} material={mats.shadow}>
        <planeGeometry args={[2.4, 1.3]} />
      </mesh>

      {/* -------------------- LEGS -------------------- */}
      {[-1, 1].map((side) => (
        <group key={side} ref={side < 0 ? hipR : hipL} position={[side * hipX, hipY, 0]}>
          {/* trouser leg, rolled up just below the knee */}
          <mesh position={[0, -0.5, 0]} material={mats.cloth}>
            <cylinderGeometry args={[0.2, 0.175, 1.0, 32, 1, true]} />
          </mesh>
          <mesh position={[0, -0.15, 0]} material={mats.cloth}>
            <sphereGeometry args={[0.2, 32, 16]} />
          </mesh>
          {/* crease down the front */}
          <mesh position={[0, -0.55, 0.188]} rotation={[0.025, 0, 0]} material={mats.clothShade}>
            <boxGeometry args={[0.012, 0.8, 0.01]} />
          </mesh>
          <group ref={side < 0 ? kneeR : kneeL} position={[0, -0.92, 0]}>
            {/* rolled cuff */}
            <mesh position={[0, -0.12, 0]} material={mats.cloth}>
              <cylinderGeometry args={[0.178, 0.172, 0.24, 32, 1, true]} />
            </mesh>
            <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.clothShade}>
              <torusGeometry args={[0.18, 0.026, 12, 40]} />
            </mesh>
            <mesh position={[0, -0.21, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.clothShade}>
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
        <mesh position={[0, -0.18, 0]} material={mats.cloth} geometry={geo.pelvis} />
        {/* belt */}
        <mesh position={[0, -0.02, 0]} material={mats.clothShade} geometry={geo.belt} />
        <mesh position={[0, -0.02, 0.335]} material={mats.steel}>
          <boxGeometry args={[0.1, 0.075, 0.02]} />
        </mesh>
        <mesh position={[0, -0.02, 0.34]} material={mats.clothShade}>
          <boxGeometry args={[0.06, 0.04, 0.02]} />
        </mesh>

        <group ref={chest}>
          {/* shirt body */}
          <mesh position={[0, TY, 0]} material={mats.cloth} geometry={geo.torso} />
          {/* placket + buttons */}
          <mesh position={[0, 0.2, btnZ(0.2) - 0.006]} material={mats.clothShade}>
            <boxGeometry args={[0.06, 0.42, 0.008]} />
          </mesh>
          {buttonYs.map((y) => (
            <mesh key={y} position={[0, y, btnZ(y) + 0.004]} rotation={[Math.PI / 2, 0, 0]} material={mats.button}>
              <cylinderGeometry args={[0.018, 0.018, 0.012, 16]} />
            </mesh>
          ))}
          {/* chest pocket */}
          <group position={[0.22, 0.44, pocketZ - 0.002]} rotation={[-0.15, 0.32, 0]}>
            <mesh material={mats.clothShade} geometry={geo.pocket} />
            <mesh position={[0, 0.1, 0.012]} material={mats.cloth}>
              <boxGeometry args={[0.23, 0.05, 0.012]} />
            </mesh>
          </group>
          {/* collar */}
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.15, 0.78, 0.2]}
              rotation={[-0.75, side * 0.45, side * -0.5]}
              material={mats.cloth}
            >
              <boxGeometry args={[0.2, 0.15, 0.018]} />
            </mesh>
          ))}

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
          <group position={[0, 0.84, 0]}>
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

          {/* tari strap */}
          <mesh geometry={geo.strap} material={mats.leather} />

          {/* -------------------- ARMS -------------------- */}
          {[-1, 1].map((side) => (
            <group
              key={side}
              ref={side < 0 ? shoulderR : shoulderL}
              position={[side * shoulderX, shoulderY, 0]}
            >
              {/* shoulder + short rolled sleeve */}
              <mesh material={mats.cloth} position={[0, -0.02, 0]}>
                <sphereGeometry args={[0.165, 32, 20]} />
              </mesh>
              <mesh material={mats.cloth} position={[0, -0.25, 0]}>
                <cylinderGeometry args={[0.16, 0.14, 0.46, 32, 1, true]} />
              </mesh>
              <mesh material={mats.clothShade} position={[0, -0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
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
                    <group key={f} position={[side * 0.0 + f * 0.05, -0.18, 0.0]} rotation={[0.35, 0, f * -0.08]}>
                      <mesh material={mats.graphite} position={[0, -0.04, 0]}>
                        <capsuleGeometry args={[0.017, 0.06, 4, 10]} />
                      </mesh>
                      <mesh material={mats.steel} position={[0, -0.1, 0.012]} rotation={[0.35, 0, 0]}>
                        <capsuleGeometry args={[0.015, 0.045, 4, 10]} />
                      </mesh>
                    </group>
                  ))}
                  <group position={[side * -0.07, -0.11, 0.035]} rotation={[0.6, 0, side * 0.7]}>
                    <mesh material={mats.graphite} position={[0, -0.04, 0]}>
                      <capsuleGeometry args={[0.018, 0.06, 4, 10]} />
                    </mesh>
                  </group>
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

            {/* -------------------- SOMBRERO DE SAÓ -------------------- */}
            <group ref={hat} position={[0, 0.56, -0.03]} rotation={[0.05, 0, -0.06]} scale={1.13}>
              <mesh geometry={geo.crown} material={mats.straw} />
              <mesh geometry={geo.brim} material={mats.strawBrim} />
              <mesh position={[0, 0.09, 0]} material={mats.band}>
                <cylinderGeometry args={[0.6, 0.625, 0.15, 72, 1, true]} />
              </mesh>
              {/* little tie on the band */}
              <mesh position={[0.57, 0.09, 0.22]} rotation={[0, 0.36, 0]} material={mats.band}>
                <boxGeometry args={[0.03, 0.15, 0.1]} />
              </mesh>
            </group>
          </group>

          {/* -------------------- TARI (woven shoulder bag) -------------------- */}
          <group ref={tari} position={[0.5, -0.36, 0.22]}>
            <group position={[0, -0.2, 0.02]} rotation={[0.08, 0.45, 0.06]}>
              <mesh geometry={geo.tari} material={mats.tari} />
              <mesh geometry={geo.tariFlap} position={[0, 0.15, 0.012]} material={mats.tari} />
              {/* fringe */}
              {Array.from({ length: 9 }).map((_, i) => (
                <mesh key={i} position={[-0.16 + i * 0.04, -0.25, 0]} material={i % 3 === 1 ? mats.scarf : mats.leather}>
                  <cylinderGeometry args={[0.007, 0.004, 0.08, 6]} />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
