"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

/**
 * MERCURY ORBIT — a liquid-metal core of fusing blobs, wrapped in a
 * dashed orbital ring, drawn only with type.
 *
 * A tiny WebGL fragment shader raymarches the scene into an offscreen
 * buffer a few samples per character cell. We read those samples back,
 * pick a glyph from a 70-step density ramp (plus directional strokes on
 * silhouettes), and set each glyph with fillText in alpha buckets. The
 * brightest glyphs are mirrored onto a blurred layer for bloom.
 *
 * Pointer steers the key light and tugs one blob toward it. Click/tap
 * bursts the core into flying letters with a shockwave; it re-fuses.
 */

// Sparse → dense. Classic 70-step density ramp.
const RAMP =
  " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
const RAMP_N = RAMP.length - 1
const BUCKETS = 8
const HALO_MIN = 0.22
const STAR_GLYPHS = [".", "·", "'", "+", "*"]

type Quality = { cw: number; ch: number; sx: number; sy: number; steps: number }
const QUALITY: Quality[] = [
  { cw: 8, ch: 13, sx: 2, sy: 3, steps: 72 },
  { cw: 8, ch: 13, sx: 2, sy: 2, steps: 56 },
  { cw: 9, ch: 15, sx: 1, sy: 2, steps: 44 },
  { cw: 10, ch: 17, sx: 1, sy: 1, steps: 36 },
]

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 uBuf;      // buffer size in samples
uniform vec2 uPx;       // css px per sample
uniform float uHalf;    // half of min(css w, css h)
uniform float uT;
uniform float uSteps;
uniform vec3 uL;        // key light dir
uniform vec4 uB[7];     // blobs: xyz + radius
uniform float uK;       // smooth-min blend
uniform mat3 uRingM;    // ring orientation
uniform vec4 uShock;    // xyz origin + age (s, <0 = none)
uniform float uYaw;

float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0 - h);
}

float core(vec3 p){
  float d = length(p - uB[0].xyz) - uB[0].w;
  for (int i = 1; i < 7; i++) {
    d = smin(d, length(p - uB[i].xyz) - uB[i].w, uK);
  }
  // shockwave ripple across the metal
  if (uShock.w >= 0.0) {
    float r = length(p - uShock.xyz);
    float a = uShock.w;
    d += 0.07 * sin(16.0*r - 22.0*a) * exp(-2.2*a) * exp(-1.5*abs(r - 3.0*a));
  }
  // slow liquid surface swell
  d += 0.018 * sin(5.0*p.x + uT*1.3) * sin(4.0*p.y - uT*1.1) * sin(5.0*p.z + uT*0.7);
  return d;
}

float ring(vec3 p){
  vec3 q = uRingM * p;
  vec2 t = vec2(length(q.xz) - 1.7, q.y);
  float d = length(t) - 0.065;
  // dashed: cut gaps around the circumference
  float a = atan(q.z, q.x);
  float seg = abs(fract(a * 9.549 + uT * 0.12) - 0.5) - 0.34; // 60 dashes
  float gap = seg * 0.18;
  d = max(d, -gap);
  // a little satellite riding the ring
  float sa = uT * 0.55;
  vec3 sp = vec3(cos(sa)*1.7, 0.0, sin(sa)*1.7);
  d = min(d, length(q - sp) - 0.11);
  return d;
}

vec2 map(vec3 p){
  float c = core(p);
  float r = ring(p);
  return c < r ? vec2(c, 0.0) : vec2(r, 1.0);
}

vec3 normalAt(vec3 p){
  vec2 e = vec2(0.0025, 0.0);
  return normalize(vec3(
    map(p + e.xyy).x - map(p - e.xyy).x,
    map(p + e.yxy).x - map(p - e.yxy).x,
    map(p + e.yyx).x - map(p - e.yyx).x));
}

float ao(vec3 p, vec3 n){
  float o = 0.0, s = 1.0;
  for (int i = 1; i <= 4; i++) {
    float h = 0.06 * float(i);
    o += (h - map(p + n*h).x) * s;
    s *= 0.6;
  }
  return clamp(1.0 - 2.4*o, 0.0, 1.0);
}

// studio environment for the chrome: soft sky, hard light strips, dark floor
float env(vec3 r){
  float y = r.y;
  float e = 0.03 + 0.12*smoothstep(-0.3, 1.0, y);
  e += 1.10 * smoothstep(0.09, 0.0, abs(y - 0.22));               // low horizon strip
  e += 0.55 * smoothstep(0.05, 0.0, abs(y - 0.62));               // high strip
  e += 0.90 * smoothstep(0.12, 0.0, abs(r.x + 0.55)) * step(0.0, y + 0.2); // vertical softbox
  e += 2.2 * pow(max(dot(r, uL), 0.0), 24.0);
  e *= 1.0 - 0.9*smoothstep(0.0, -0.5, y);                        // black floor
  return e;
}

void main(){
  vec2 f = gl_FragCoord.xy - 0.5*uBuf;
  vec2 uv = f * uPx / uHalf;            // ~[-1,1] on the short side

  float cy = cos(uYaw), sy = sin(uYaw);
  vec3 ro = vec3(4.5*sy, 0.7, 4.5*cy);
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(fw*2.3 + rt*uv.x + up*uv.y);

  float t = 0.0;
  vec2 h = vec2(1.0, -1.0);
  bool hit = false;
  float halo = 0.0;
  for (int i = 0; i < 96; i++) {
    if (float(i) >= uSteps) break;
    h = map(ro + rd*t);
    halo += exp(-h.x * 7.0) * 0.045;
    if (h.x < 0.0015*t) { hit = true; break; }
    t += h.x * 0.9;
    if (t > 9.0) break;
  }

  if (!hit) {
    // atmosphere: how close the ray grazed the metal
    gl_FragColor = vec4(clamp(halo, 0.0, 1.0), 0.0, 0.0, 0.0);
    return;
  }

  vec3 p = ro + rd*t;
  vec3 n = normalAt(p);
  vec3 v = -rd;
  float occ = ao(p, n);
  float dif = max(dot(n, uL), 0.0);
  float fre = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  vec3 hv = normalize(uL + v);
  float spe = pow(max(dot(n, hv), 0.0), 64.0);

  float lum;
  if (h.y < 0.5) {
    vec3 r = reflect(rd, n);
    float wrap = clamp((dot(n, uL) + 0.35) / 1.35, 0.0, 1.0);
    float rim = fre * (0.5 + 0.5*clamp(dot(n, vec3(-uL.x, 0.4, -0.3)), 0.0, 1.0));
    float broad = pow(max(dot(n, hv), 0.0), 10.0);
    lum = 0.07 + 0.55*wrap*wrap*occ + 0.5*env(r)*(0.45 + 0.55*fre)*occ + 0.9*rim + 0.35*broad + 1.6*spe;
  } else {
    lum = 0.12 + 0.75*dif*occ + 0.6*fre + 0.6*spe;
  }
  float fog = exp(-0.18*max(t - 3.2, 0.0));
  lum *= fog;

  lum = lum / (1.0 + 0.55*lum) * 1.25; // soft shoulder
  gl_FragColor = vec4(clamp(lum, 0.0, 1.0), clamp(spe*fog, 0.0, 1.0), fog, 1.0);
}
`

function makeGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    preserveDrawingBuffer: true,
    alpha: true,
    powerPreference: "high-performance",
  })
  if (!gl) return null
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("[ascii-hero]", gl.getShaderInfoLog(s))
      return null
    }
    return s
  }
  const vs = sh(gl.VERTEX_SHADER, VERT)
  const fs = sh(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = gl.createProgram()!
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, "p")
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  const u = (n: string) => gl.getUniformLocation(prog, n)
  return {
    gl,
    uBuf: u("uBuf"),
    uPx: u("uPx"),
    uHalf: u("uHalf"),
    uT: u("uT"),
    uSteps: u("uSteps"),
    uL: u("uL"),
    uB: u("uB"),
    uK: u("uK"),
    uRingM: u("uRingM"),
    uShock: u("uShock"),
    uYaw: u("uYaw"),
  }
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  ch: string
}

export function AsciiHero({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef = useRef<HTMLCanvasElement>(null)
  const hudRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const glow = glowRef.current
    const hud = hudRef.current
    if (!wrap || !canvas || !glow || !hud) return
    const ctx = canvas.getContext("2d")
    const gctx = glow.getContext("2d")
    if (!ctx || !gctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const off = document.createElement("canvas")
    const G = makeGL(off)

    let q = 0
    let Q = QUALITY[q]
    let CW = Q.cw
    let CH = Q.ch
    let W = 0
    let H = 0
    let cols = 0
    let rows = 0
    let bw = 0
    let bh = 0
    let dpr = 1
    let pixels = new Uint8Array(0)
    let ink = "#f5f5f7"
    let dark = true
    let font = "ui-monospace, monospace"
    let raf = 0
    let running = false
    let onScreen = true
    let last = performance.now()
    let t = reduce ? 7.3 : 0
    let frameEMA = 16
    let slowFor = 0
    let hudTick = 0
    let fpsEMA = 60

    // Interaction state (targets + eased actuals)
    let px = 0.18
    let py = -0.22
    let tx = 0.18
    let ty = -0.22
    let hover = 0
    let hoverT = 0
    let shockAge = -1
    let shockX = 0
    let shockY = 0
    let shockCol = 0
    let shockRow = 0
    let burst = 0 // 0..1 envelope
    const particles: Particle[] = []

    // Per-cell scratch
    let glyph: string[] = []
    let bright = new Float32Array(0)
    const lists: number[][] = Array.from({ length: BUCKETS }, () => [])
    let stars: { i: number; ph: number; sp: number; g: string }[] = []

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement)
      ink = cs.getPropertyValue("--foreground").trim() || "#f5f5f7"
      dark = document.documentElement.classList.contains("dark")
      font = getComputedStyle(hud).fontFamily || font
      glow.style.mixBlendMode = dark ? "screen" : "multiply"
      glow.style.opacity = dark ? "0.9" : "0.35"
    }

    const layout = () => {
      const r = wrap.getBoundingClientRect()
      W = Math.max(1, r.width)
      H = Math.max(1, r.height)
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      // glow layer at half res — it gets blurred anyway
      glow.width = Math.max(1, Math.floor(W / 2))
      glow.height = Math.max(1, Math.floor(H / 2))
      glow.style.width = `${W}px`
      glow.style.height = `${H}px`

      // smaller boxes get chunkier cells so the art stays legible
      const k = W < 360 ? 0.72 : W < 480 ? 0.82 : 1
      CW = Math.round(Q.cw * k)
      CH = Math.round(Q.ch * k)
      cols = Math.max(16, Math.floor(W / CW))
      rows = Math.max(10, Math.floor(H / CH))
      bw = cols * Q.sx
      bh = rows * Q.sy
      off.width = bw
      off.height = bh
      pixels = new Uint8Array(bw * bh * 4)
      const n = cols * rows
      glyph = new Array<string>(n).fill(" ")
      bright = new Float32Array(n)

      // sparse star field behind the core
      stars = []
      const count = Math.floor(n * 0.035)
      for (let k = 0; k < count; k++) {
        stars.push({
          i: Math.floor(Math.random() * n),
          ph: Math.random() * Math.PI * 2,
          sp: 0.6 + Math.random() * 1.8,
          g: STAR_GLYPHS[Math.floor(Math.random() * STAR_GLYPHS.length)],
        })
      }
    }

    // grid offset that centers the glyph grid in the box
    const ox = () => (W - cols * CW) / 2
    const oy = () => (H - rows * CH) / 2

    const blobs = new Float32Array(28)
    const ringM = new Float32Array(9)

    const scene = (time: number) => {
      // burst envelope: snaps out, springs back
      const a = shockAge
      burst = a < 0 ? 0 : Math.exp(-2.4 * a) * (1 - Math.exp(-22 * a))
      const spread = 1 + burst * 1.5
      const shrink = 1 - burst * 0.35

      // six blobs on lissajous orbits + one that reaches for the pointer
      for (let i = 0; i < 6; i++) {
        const k = i * 1.0471975
        const s = time * (0.38 + i * 0.045)
        const r = 0.62 + 0.22 * Math.sin(time * 0.5 + i * 1.7)
        blobs[i * 4] = Math.cos(s + k) * r * spread
        blobs[i * 4 + 1] = Math.sin(s * 1.31 + k * 2.0) * 0.48 * spread
        blobs[i * 4 + 2] = Math.sin(s + k) * r * spread
        blobs[i * 4 + 3] = (0.56 + 0.1 * Math.sin(time * 0.9 + i * 2.3)) * shrink
      }
      const reach = 0.25 + hover * 0.75
      blobs[24] = px * 1.15 * reach
      blobs[25] = -py * 1.15 * reach + 0.05
      blobs[26] = 0.4 * reach
      blobs[27] = (0.34 + 0.06 * Math.sin(time * 2.1)) * shrink

      // ring wobble (rotation about x then z)
      const ax = 1.15 + 0.18 * Math.sin(time * 0.31) + py * 0.25
      const az = 0.32 + 0.12 * Math.cos(time * 0.23) - px * 0.25
      const cx = Math.cos(ax), sx = Math.sin(ax)
      const cz = Math.cos(az), sz = Math.sin(az)
      // M = Rx * Rz, column-major for GLSL
      ringM[0] = cz
      ringM[1] = cx * sz
      ringM[2] = sx * sz
      ringM[3] = -sz
      ringM[4] = cx * cz
      ringM[5] = sx * cz
      ringM[6] = 0
      ringM[7] = -sx
      ringM[8] = cx
    }

    const lightDir = (): [number, number, number] => {
      const lx = px * 2.4
      const ly = -py * 2.4 + 0.35
      const lz = 1.1
      const m = Math.hypot(lx, ly, lz)
      return [lx / m, ly / m, lz / m]
    }

    const renderGL = (time: number) => {
      if (!G) return false
      const { gl } = G
      if (gl.isContextLost()) return false
      gl.viewport(0, 0, bw, bh)
      gl.uniform2f(G.uBuf, bw, bh)
      gl.uniform2f(G.uPx, CW / Q.sx, CH / Q.sy)
      gl.uniform1f(G.uHalf, 0.5 * Math.min(W, H) * 1.0)
      gl.uniform1f(G.uT, time)
      gl.uniform1f(G.uSteps, Q.steps)
      const L = lightDir()
      gl.uniform3f(G.uL, L[0], L[1], L[2])
      gl.uniform4fv(G.uB, blobs)
      gl.uniform1f(G.uK, 0.42 + 0.12 * Math.sin(time * 0.4) - burst * 0.3)
      gl.uniformMatrix3fv(G.uRingM, false, ringM)
      gl.uniform4f(G.uShock, shockX, shockY, 0.3, shockAge)
      gl.uniform1f(G.uYaw, time * 0.11 + px * 0.35)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      gl.readPixels(0, 0, bw, bh, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      return true
    }

    // CPU fallback: a lit sphere, so there's still something if WebGL is off
    const renderCPU = () => {
      const L = lightDir()
      const half = 0.5 * Math.min(W, H)
      for (let y = 0; y < bh; y++) {
        for (let x = 0; x < bw; x++) {
          const u = ((x - bw / 2) * (CW / Q.sx)) / half / 0.8
          const v = ((y - bh / 2) * (CH / Q.sy)) / half / 0.8
          const d = u * u + v * v
          const o = (y * bw + x) * 4
          if (d > 1) {
            pixels[o + 3] = 0
            continue
          }
          const z = Math.sqrt(1 - d)
          const dif = Math.max(0, u * L[0] + v * L[1] + z * L[2])
          const spe = Math.pow(Math.max(0, z * 0.9 + dif * 0.1), 30)
          pixels[o] = Math.min(255, (0.08 + 0.7 * dif + 0.5 * spe) * 160)
          pixels[o + 1] = spe * 255
          pixels[o + 2] = 255
          pixels[o + 3] = 255
        }
      }
    }

    const resolve = () => {
      // fold the subsamples of each cell into one glyph
      const SX = Q.sx
      const SY = Q.sy
      const inv = 1 / (SX * SY)
      let glyphs = 0
      for (const l of lists) l.length = 0
      for (let row = 0; row < rows; row++) {
        // readPixels is bottom-up
        const by0 = (rows - 1 - row) * SY
        for (let col = 0; col < cols; col++) {
          const bx0 = col * SX
          let lum = 0
          let cov = 0
          let spe = 0
          let fog = 0
          let halo = 0
          let gx = 0
          let gy = 0
          for (let j = 0; j < SY; j++) {
            for (let i = 0; i < SX; i++) {
              const o = ((by0 + j) * bw + bx0 + i) * 4
              const a = pixels[o + 3] / 255
              if (a === 0) {
                halo += pixels[o] / 255
                continue
              }
              lum += pixels[o] / 255
              spe += pixels[o + 1] / 255
              fog += pixels[o + 2] / 255
              cov += a
              // coverage gradient (y flips back to screen-down)
              gx += a * (SX > 1 ? i / (SX - 1) - 0.5 : 0)
              gy -= a * (SY > 1 ? j / (SY - 1) - 0.5 : 0)
            }
          }
          const idx = row * cols + col
          cov *= inv
          if (cov <= 0.001) {
            halo *= inv
            bright[idx] = 0
            if (halo > HALO_MIN) {
              // dim haze of light ramp glyphs around the core
              const hz = Math.min(1, (halo - HALO_MIN) * 1.6)
              glyph[idx] = RAMP[1 + Math.floor(hz * 9)]
              const bk = Math.min(2, Math.floor(hz * 3))
              lists[bk].push(idx)
              glyphs++
            } else glyph[idx] = " "
            continue
          }
          lum = (lum * inv) / cov
          spe *= inv
          fog = (fog * inv) / cov

          // tone curve + contrast so midtones spread across the ramp
          let b = Math.max(0.06, Math.min(1, Math.pow(lum, 0.85) * 1.1))
          let ch: string
          if (cov < 0.6 && SX * SY > 1) {
            // silhouette: pick a stroke that follows the edge
            const ang = Math.atan2(gy, gx)
            const e = ((ang + Math.PI) / Math.PI) * 4 // 0..8
            const k = Math.round(e) % 4
            ch = k === 0 ? "|" : k === 1 ? "/" : k === 2 ? "-" : "\\"
            if (gx * gx + gy * gy < 0.01) ch = cov > 0.4 ? ":" : "."
            b *= 0.55 + 0.45 * cov
          } else {
            const ri = Math.max(1, Math.min(RAMP_N, Math.round(b * RAMP_N)))
            ch = RAMP[ri]
          }
          glyph[idx] = ch
          // brightness for alpha — never fully vanish on the shape
          const a = Math.min(1, 0.1 + Math.pow(b, 1.1) * 0.9 * (0.6 + 0.4 * fog) + spe * 0.5)
          bright[idx] = a + spe
          const bk = Math.min(BUCKETS - 1, Math.floor(a * BUCKETS))
          lists[bk].push(idx)
          glyphs++
        }
      }
      return glyphs
    }

    const draw = (dt: number) => {
      const time = t
      scene(time)
      if (!renderGL(time)) renderCPU()
      let glyphs = resolve()

      const OX = ox()
      const OY = oy()
      const cw = CW
      const chh = CH
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.font = `${chh - 1}px ${font}`
      ctx.textBaseline = "top"
      ctx.textAlign = "left"
      ctx.fillStyle = ink

      // stars + shockwave ring in the empty space
      const waveR = shockAge >= 0 ? shockAge * 34 : -999
      for (const s of stars) {
        if (glyph[s.i] !== " ") continue
        const col = s.i % cols
        const row = (s.i / cols) | 0
        let a = 0.1 + 0.22 * (0.5 + 0.5 * Math.sin(time * s.sp + s.ph))
        if (waveR > 0) {
          const d = Math.hypot(col - shockCol, (row - shockRow) * (chh / cw))
          a += 0.9 * Math.exp(-((d - waveR) ** 2) / 6) * Math.exp(-shockAge * 1.4)
        }
        ctx.globalAlpha = Math.min(1, a)
        ctx.fillText(s.g, OX + col * cw, OY + row * chh)
      }
      // the wave itself, as a faint ring of ticks
      if (waveR > 0 && shockAge < 1.6) {
        const fade = Math.exp(-shockAge * 2) * 0.55
        const steps = Math.floor(waveR * 2.2) + 12
        for (let k = 0; k < steps; k++) {
          const ang = (k / steps) * Math.PI * 2
          const col = Math.round(shockCol + Math.cos(ang) * waveR)
          const row = Math.round(shockRow + (Math.sin(ang) * waveR * cw) / chh)
          if (col < 0 || col >= cols || row < 0 || row >= rows) continue
          if (glyph[row * cols + col] !== " ") continue
          ctx.globalAlpha = fade
          ctx.fillText(k % 3 === 0 ? "+" : "·", OX + col * cw, OY + row * chh)
        }
      }

      // the shape, one alpha bucket at a time
      for (let bk = 0; bk < BUCKETS; bk++) {
        const list = lists[bk]
        if (!list.length) continue
        ctx.globalAlpha = 0.18 + ((bk + 1) / BUCKETS) * 0.82
        for (let n = 0; n < list.length; n++) {
          const idx = list[n]
          ctx.fillText(glyph[idx], OX + (idx % cols) * cw, OY + ((idx / cols) | 0) * chh)
        }
      }

      // flying letters from the burst
      if (particles.length) {
        const drag = Math.exp(-dt * 0.0022)
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]
          p.life -= dt / 1300
          if (p.life <= 0) {
            particles.splice(i, 1)
            continue
          }
          // fly out, then get pulled home
          p.vx *= drag
          p.vy *= drag
          p.x += p.vx * dt * 0.001
          p.y += p.vy * dt * 0.001
          ctx.globalAlpha = Math.min(1, p.life * 1.4)
          ctx.fillText(p.ch, p.x, p.y)
          glyphs++
        }
      }
      ctx.globalAlpha = 1

      // bloom: brightest glyphs on the blurred layer
      gctx.setTransform(0.5, 0, 0, 0.5, 0, 0)
      gctx.clearRect(0, 0, W, H)
      gctx.font = `bold ${chh}px ${font}`
      gctx.textBaseline = "top"
      gctx.fillStyle = ink
      const hi = Math.max(0, BUCKETS - 3)
      for (let bk = hi; bk < BUCKETS; bk++) {
        for (const idx of lists[bk]) {
          gctx.globalAlpha = Math.min(1, (bright[idx] - 0.6) * 1.6)
          gctx.fillText(glyph[idx], OX + (idx % cols) * cw, OY + ((idx / cols) | 0) * chh)
        }
      }
      gctx.globalAlpha = 1

      // HUD
      hudTick += dt
      if (hudTick > 220 || dt === 0) {
        hudTick = 0
        const L = lightDir()
        const lux = (0.5 + 0.5 * L[1]) * (0.6 + 0.4 * L[2])
        const fuse = 0.42 + 0.12 * Math.sin(time * 0.4) - burst * 0.3
        hud.textContent =
          `fps ${reduce ? "--" : Math.round(fpsEMA)} · glyphs ${glyphs.toLocaleString("en-US")}` +
          ` · lux ${lux.toFixed(2)} · fuse ${fuse.toFixed(2)}` +
          (burst > 0.02 ? ` · flux ${burst.toFixed(2)}` : "")
      }
    }

    const loop = (now: number) => {
      raf = 0
      if (!running) return
      const raw = now - last
      const dt = Math.min(50, raw)
      last = now
      t += dt * 0.001

      // ease toward pointer (frame-rate independent)
      const e = 1 - Math.exp(-dt * 0.004)
      px += (tx - px) * e
      py += (ty - py) * e
      hover += (hoverT - hover) * (1 - Math.exp(-dt * 0.003))
      if (shockAge >= 0) {
        shockAge += dt * 0.001
        if (shockAge > 3) shockAge = -1
      }

      const t0 = performance.now()
      draw(dt)
      const cost = performance.now() - t0

      frameEMA += (cost - frameEMA) * 0.08
      if (raw > 0) fpsEMA += (1000 / Math.max(raw, 1) - fpsEMA) * 0.06
      // adaptive quality: step down after sustained slow frames
      // judge by our own cost, not rAF spacing (background panes throttle rAF)
      if (frameEMA > 12) slowFor += dt
      else slowFor = Math.max(0, slowFor - dt * 0.5)
      if (slowFor > 900 && q < QUALITY.length - 1) {
        q++
        Q = QUALITY[q]
        slowFor = 0
        frameEMA = 10
        layout()
      }

      raf = requestAnimationFrame(loop)
    }

    const start = () => {
      if (running || reduce) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }
    const sync = () => {
      if (onScreen && document.visibilityState === "visible") start()
      else stop()
    }

    const toLocal = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e)
      const half = 0.5 * Math.min(W, H)
      tx = Math.max(-1.4, Math.min(1.4, (x - W / 2) / half))
      ty = Math.max(-1.4, Math.min(1.4, (y - H / 2) / half))
    }
    const onEnter = () => {
      hoverT = 1
    }
    const onLeave = () => {
      hoverT = 0
      tx = 0.18
      ty = -0.22
    }
    const onDown = (e: PointerEvent) => {
      const { x, y } = toLocal(e)
      const half = 0.5 * Math.min(W, H)
      shockX = ((x - W / 2) / half) * 1.6
      shockY = (-(y - H / 2) / half) * 1.6
      shockAge = 0
      shockCol = (x - ox()) / CW
      shockRow = (y - oy()) / CH
      // shatter: lift a slice of the lit cells into free-flying letters
      const lit: number[] = []
      for (let i = 0; i < glyph.length; i++) if (glyph[i] !== " ") lit.push(i)
      const take = Math.min(520, lit.length)
      const OX = ox()
      const OY = oy()
      for (let k = 0; k < take; k++) {
        const idx = lit[Math.floor(Math.random() * lit.length)]
        const cx = OX + (idx % cols) * CW
        const cy = OY + ((idx / cols) | 0) * CH
        const dx = cx - x
        const dy = cy - y
        const d = Math.hypot(dx, dy) || 1
        const sp = 260 + Math.random() * 520
        particles.push({
          x: cx,
          y: cy,
          vx: (dx / d) * sp + (Math.random() - 0.5) * 120,
          vy: (dy / d) * sp + (Math.random() - 0.5) * 120,
          life: 0.6 + Math.random() * 0.5,
          ch: RAMP[20 + Math.floor(Math.random() * (RAMP_N - 20))],
        })
      }
      if (particles.length > 1400) particles.splice(0, particles.length - 1400)
    }

    readTheme()
    layout()
    draw(0)

    if (!reduce) {
      wrap.addEventListener("pointermove", onMove, { passive: true })
      wrap.addEventListener("pointerenter", onEnter)
      wrap.addEventListener("pointerleave", onLeave)
      wrap.addEventListener("pointerdown", onDown)
      document.addEventListener("visibilitychange", sync)
    }

    const ro = new ResizeObserver(() => {
      layout()
      draw(0)
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    io.observe(wrap)

    const mo = new MutationObserver(() => {
      readTheme()
      if (!running) draw(0)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => {
      stop()
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerenter", onEnter)
      wrap.removeEventListener("pointerleave", onLeave)
      wrap.removeEventListener("pointerdown", onDown)
      document.removeEventListener("visibilitychange", sync)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      G?.gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className={cn("relative touch-manipulation overflow-hidden select-none", className)}
      role="img"
      aria-label="A liquid-metal core of merging blobs circled by a dashed orbital ring, drawn entirely in letters and symbols; it follows the pointer and bursts apart when clicked"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <canvas
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ filter: "blur(7px)" }}
      />
      <div
        ref={hudRef}
        aria-hidden
        className="text-subtle-foreground pointer-events-none absolute bottom-0 left-0 max-w-full truncate whitespace-nowrap font-mono text-[10px] leading-relaxed tracking-wider uppercase"
      />
    </div>
  )
}

export default AsciiHero
