"use client"

/**
 * AsciiGlobe — a network globe drawn entirely with monospace glyphs.
 *
 * The canvas is a grid of character cells. Cells inside the disc are
 * points on a unit sphere (normals precomputed per layout); each frame
 * they are rotated into world space and looked up in a real land mask
 * (Natural Earth, see ./land-mask). Land is a lit glyph ramp, ocean a
 * faint dot lattice with a graticule, the limb a thin glyph atmosphere.
 *
 * On top: great-circle routes between real cities, lifted off the
 * surface, with packets travelling along them as glyph comets that leave
 * a 0/1 trail and fire a small "handshake" ring when they land.
 *
 * Rendering is one glyph atlas + drawImage per cell, bucketed by alpha,
 * so a frame is a few thousand blits and no text shaping.
 */

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { LAND_H, LAND_W, landMask } from "./land-mask"

// ─── data ──────────────────────────────────────────────────────────────

type City = { code: string; lat: number; lon: number }

const HOME: City = { code: "BOM", lat: 19.076, lon: 72.878 }

const HUBS: City[] = [
  { code: "LHR", lat: 51.47, lon: -0.454 },
  { code: "FRA", lat: 50.11, lon: 8.682 },
  { code: "DXB", lat: 25.205, lon: 55.271 },
  { code: "NBO", lat: -1.286, lon: 36.817 },
  { code: "BLR", lat: 12.972, lon: 77.595 },
  { code: "SIN", lat: 1.352, lon: 103.82 },
  { code: "HND", lat: 35.677, lon: 139.65 },
  { code: "ICN", lat: 37.567, lon: 126.98 },
  { code: "SYD", lat: -33.869, lon: 151.21 },
  { code: "SFO", lat: 37.775, lon: -122.42 },
  { code: "JFK", lat: 40.713, lon: -74.006 },
  { code: "GRU", lat: -23.551, lon: -46.633 },
]

const CITIES = [HOME, ...HUBS]
const idx = (code: string) => CITIES.findIndex((c) => c.code === code)

/** Backbone: home to every hub, plus a few hub-to-hub links. */
const LINKS: [number, number][] = [
  ...HUBS.map((h) => [0, idx(h.code)] as [number, number]),
  [idx("LHR"), idx("JFK")],
  [idx("FRA"), idx("SIN")],
  [idx("SFO"), idx("HND")],
  [idx("SIN"), idx("SYD")],
  [idx("JFK"), idx("GRU")],
  [idx("DXB"), idx("NBO")],
  [idx("ICN"), idx("SFO")],
]

// ─── glyphs ────────────────────────────────────────────────────────────

const LAND_RAMP = ".:-=+*#"
/** "•" is drawn as a crisp round dot, not a font glyph. */
const GLYPHS = LAND_RAMP + "·01o@+•"
const G = (ch: string) => GLYPHS.indexOf(ch)
const G_DOT = G("·")
const G_ZERO = G("0")
const G_ONE = G("1")
const G_RING = G("o")
const G_HEAD = G("@")
const G_PLUS = G("+")
const G_PERIOD = G(".")
const G_BEAD = G("•")

const BUCKETS = 24
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const DEG = Math.PI / 180

// ─── math ──────────────────────────────────────────────────────────────

type V3 = [number, number, number]

const toVec = (lat: number, lon: number): V3 => {
  const la = lat * DEG
  const lo = lon * DEG
  return [Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)]
}

/** Great-circle arc a→b, lifted off the surface; flat xyz triplets. */
function buildArc(a: V3, b: V3): Float32Array {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const om = Math.acos(dot)
  const so = Math.sin(om) || 1
  const n = Math.max(24, Math.round(om / DEG / 1.1))
  const h = 0.07 + 0.3 * (om / Math.PI)
  const out = new Float32Array((n + 1) * 3)
  for (let i = 0; i <= n; i++) {
    const s = i / n
    const ka = Math.sin((1 - s) * om) / so
    const kb = Math.sin(s * om) / so
    const lift = 1 + h * Math.sin(Math.PI * s)
    out[i * 3] = (a[0] * ka + b[0] * kb) * lift
    out[i * 3 + 1] = (a[1] * ka + b[1] * kb) * lift
    out[i * 3 + 2] = (a[2] * ka + b[2] * kb) * lift
  }
  return out
}

const fmtCoord = (v: number, pos: string, neg: string) =>
  `${Math.abs(v).toFixed(2)}°${v >= 0 ? pos : neg}`

// ─── component ─────────────────────────────────────────────────────────

type Route = { a: number; arc: Float32Array; temp: boolean; life: number; glow: number }
type Packet = { r: number; t: number; speed: number; rev: boolean; delay: number; ring?: boolean }
type Ring = { v: V3; age: number; strong: boolean }

const START_LON = 40
const BASE_PITCH = 0.2
const AUTO_SPEED = 0.05 // rad/s

export function AsciiGlobe({
  className,
  hud = true,
}: {
  className?: string
  hud?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hudRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const mask = landMask()
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const cityVec = CITIES.map((c) => toVec(c.lat, c.lon))
    const routes: Route[] = LINKS.map(([a, b]) => ({
      a,
      arc: buildArc(cityVec[a], cityVec[b]),
      temp: false,
      life: 1,
      glow: 0,
    }))
    const packets: Packet[] = []
    const rings: Ring[] = []
    let delivered = 0

    // ── view state
    let yaw = -START_LON * DEG
    let pitch = BASE_PITCH
    let spin = 0 // inertial angular velocity from dragging
    let hoverX = 0
    let hoverY = 0
    let tiltX = 0
    let tiltY = 0
    let resetting = false

    // ── layout state
    let S = 0
    let R = 0
    let dpr = 1
    let cw = 6
    let ch = 10
    let cols = 0
    let rows = 0
    let ox = 0
    let oy = 0
    let fontPx = 10
    let family = "ui-monospace, monospace"
    let ink = "#f5f5f7"
    let dark = true
    let atlas: HTMLCanvasElement = document.createElement("canvas")
    let slotW = 1
    let slotH = 1

    // per-cell data
    let cellA = new Float32Array(0)
    let cellG = new Uint8Array(0)
    let disc = new Int32Array(0) // cell indices inside the sphere
    let dN = new Float32Array(0) // their view normals, xyz
    let dLight = new Float32Array(0)
    let dRim = new Float32Array(0)
    let dThr = new Float32Array(0) // graticule tolerance (deg)
    let dDith = new Float32Array(0) // Bayer offset, -0.5..0.5
    let limb = new Int32Array(0)
    let limbA = new Float32Array(0)
    let bucket: Int32Array[] = []
    let bucketN = new Int32Array(BUCKETS)

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement)
      ink = cs.getPropertyValue("--foreground").trim() || "#f5f5f7"
      dark = document.documentElement.classList.contains("dark")
      family = getComputedStyle(canvas).fontFamily || family
    }

    const buildAtlas = () => {
      slotW = Math.ceil(cw * dpr)
      slotH = Math.ceil(ch * dpr)
      atlas = document.createElement("canvas")
      atlas.width = slotW * GLYPHS.length
      atlas.height = slotH
      const a = atlas.getContext("2d")!
      a.fillStyle = ink
      a.textAlign = "center"
      a.textBaseline = "middle"
      for (let i = 0; i < GLYPHS.length; i++) {
        const g = GLYPHS[i]
        // head and ring glyphs a touch bolder
        const weight = g === "@" || g === "o" ? 600 : 500
        a.font = `${weight} ${fontPx * dpr}px ${family}`
        if (g === "•") {
          a.beginPath()
          a.arc(i * slotW + slotW / 2, slotH / 2, Math.max(1.1, fontPx * 0.17) * dpr, 0, Math.PI * 2)
          a.fill()
        } else {
          a.fillText(g, i * slotW + slotW / 2, slotH / 2 + dpr * 0.5)
        }
      }
    }

    const layout = () => {
      S = Math.max(80, Math.min(wrap.clientWidth, wrap.clientHeight))
      R = S * 0.41
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(S * dpr)
      canvas.height = Math.round(S * dpr)
      canvas.style.width = `${S}px`
      canvas.style.height = `${S}px`

      fontPx = Math.max(6.5, Math.min(10.5, S / 76))
      cw = fontPx * 0.66
      ch = fontPx * 1.08
      cols = Math.floor(S / cw)
      rows = Math.floor(S / ch)
      ox = (S - cols * cw) / 2
      oy = (S - rows * ch) / 2
      const n = cols * rows
      cellA = new Float32Array(n)
      cellG = new Uint8Array(n)
      bucket = Array.from({ length: BUCKETS }, () => new Int32Array(n))
      bucketN = new Int32Array(BUCKETS)

      // light from upper-left, slightly in front
      const L: V3 = [-0.3, 0.36, 0.88]
      const ll = Math.hypot(L[0], L[1], L[2])
      L[0] /= ll
      L[1] /= ll
      L[2] /= ll

      const dIdx: number[] = []
      const dn: number[] = []
      const dl: number[] = []
      const dr: number[] = []
      const dt: number[] = []
      const dd: number[] = []
      const lIdx: number[] = []
      const lA: number[] = []
      const cellDeg = (Math.max(cw, ch) / R / DEG) * 0.5
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = (ox + (i + 0.5) * cw - S / 2) / R
          const y = -(oy + (j + 0.5) * ch - S / 2) / R
          const r2 = x * x + y * y
          if (r2 < 1) {
            const z = Math.sqrt(1 - r2)
            dIdx.push(j * cols + i)
            dn.push(x, y, z)
            dl.push(Math.max(0, x * L[0] + y * L[1] + z * L[2]))
            dr.push(Math.pow(1 - z, 2.2))
            dt.push(cellDeg / Math.max(z, 0.25))
            dd.push(BAYER[(j & 3) * 4 + (i & 3)] / 16 - 0.47)
          } else {
            const r = Math.sqrt(r2)
            if (r < 1.14) {
              const k = 1 - (r - 1) / 0.14
              // brighter on the lit side of the limb
              const side = 0.55 + 0.45 * Math.max(0, (x * L[0] + y * L[1]) / r)
              lIdx.push(j * cols + i)
              lA.push(k * k * side)
            }
          }
        }
      }
      disc = Int32Array.from(dIdx)
      dN = Float32Array.from(dn)
      dLight = Float32Array.from(dl)
      dRim = Float32Array.from(dr)
      dThr = Float32Array.from(dt)
      dDith = Float32Array.from(dd)
      limb = Int32Array.from(lIdx)
      limbA = Float32Array.from(lA)
      buildAtlas()
    }

    // ── rotation (world → view): Rx(pitch) · Ry(yaw)
    let m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1
    const setMatrix = (yw: number, pt: number) => {
      const cy = Math.cos(yw), sy = Math.sin(yw)
      const cp = Math.cos(pt), sp = Math.sin(pt)
      // Ry: x' = x cy + z sy ; z' = -x sy + z cy
      // Rx: y'' = y cp - z' sp ; z'' = y sp + z' cp
      m00 = cy; m01 = 0; m02 = sy
      m10 = sy * sp; m11 = cp; m12 = -cy * sp
      m20 = -sy * cp; m21 = sp; m22 = cy * cp
    }

    /** Put a glyph into the cell under view-space point (x, y). */
    const put = (x: number, y: number, g: number, a: number, force = false) => {
      const px = S / 2 + x * R
      const py = S / 2 - y * R
      const i = Math.floor((px - ox) / cw)
      const j = Math.floor((py - oy) / ch)
      if (i < 0 || j < 0 || i >= cols || j >= rows) return
      const k = j * cols + i
      if (a > cellA[k] || (force && a > 0.12)) {
        cellA[k] = a
        cellG[k] = g
      }
    }

    /** World point → view; returns visibility factor (0 hidden). */
    const view = (wx: number, wy: number, wz: number, out: number[]) => {
      const x = m00 * wx + m01 * wy + m02 * wz
      const y = m10 * wx + m11 * wy + m12 * wz
      const z = m20 * wx + m21 * wy + m22 * wz
      out[0] = x
      out[1] = y
      out[2] = z
      if (z < 0 && x * x + y * y < 1) return 0 // behind the globe
      return z >= 0 ? 1 : 0.35
    }
    const tmp = [0, 0, 0]

    // ── packets
    const spawn = (r: number, delay = 0, rev = false) => {
      packets.push({ r, t: 0, speed: 0.32 + Math.random() * 0.22, rev, delay })
    }
    let spawnClock = 0

    // ── frame
    let time = 0
    const frame = (dt: number) => {
      time += dt

      // rotation
      if (resetting) {
        const target = -START_LON * DEG
        let d = target - yaw
        d = Math.atan2(Math.sin(d), Math.cos(d))
        yaw += d * Math.min(1, dt * 4)
        if (Math.abs(d) < 0.002) resetting = false
      } else if (!dragging) {
        yaw -= (reduce ? 0 : AUTO_SPEED) * dt
        yaw += spin * dt
        spin *= Math.exp(-dt * 2.2)
      }
      tiltX += (hoverX - tiltX) * Math.min(1, dt * 3)
      tiltY += (hoverY - tiltY) * Math.min(1, dt * 3)
      pitch = BASE_PITCH - tiltY * 0.12
      setMatrix(yaw + tiltX * 0.12, pitch)

      cellA.fill(0)

      // sphere
      const n = disc.length
      for (let d = 0; d < n; d++) {
        const nx = dN[d * 3], ny = dN[d * 3 + 1], nz = dN[d * 3 + 2]
        // view → world is the transpose
        const wx = m00 * nx + m10 * ny + m20 * nz
        const wy = m01 * nx + m11 * ny + m21 * nz
        const wz = m02 * nx + m12 * ny + m22 * nz
        const lat = Math.asin(wy > 1 ? 1 : wy < -1 ? -1 : wy) / DEG
        const lon = Math.atan2(wx, wz) / DEG
        let mx = Math.floor(lon + 180)
        if (mx >= LAND_W) mx -= LAND_W
        let my = Math.floor(90 - lat)
        if (my >= LAND_H) my = LAND_H - 1
        const land = mask[my * LAND_W + mx]
        const lit = dLight[d]
        const rim = dRim[d]
        const k = disc[d]
        if (land) {
          const I = Math.min(1, 0.22 + Math.pow(lit, 1.3) * 0.78)
          const coast = land === 2 ? 0.12 : 0
          // ordered dither breaks the glyph thresholds into texture
          const step = I * (LAND_RAMP.length - 1) + dDith[d] * 0.9
          cellG[k] = Math.max(1, Math.min(LAND_RAMP.length - 1, Math.round(step)))
          cellA[k] = Math.min(0.8, 0.22 + 0.52 * I + coast)
        } else {
          const thr = dThr[d]
          const gLat = Math.abs(lat - Math.round(lat / 20) * 20) < thr
          const gLon =
            Math.abs(lon - Math.round(lon / 20) * 20) < (thr * 0.6) / Math.max(0.2, Math.cos(lat * DEG))
          const shade = 0.25 + 0.75 * lit + rim * 0.6
          if (gLat || gLon) {
            cellG[k] = G_DOT
            cellA[k] = 0.1 + 0.16 * shade
          } else if ((k + (k / cols) | 0) % 2 === 0) {
            cellG[k] = G_DOT
            cellA[k] = 0.035 + 0.08 * shade
          }
        }
      }

      // atmosphere
      for (let l = 0; l < limb.length; l++) {
        const k = limb[l]
        cellG[k] = l % 3 === 0 ? G_PERIOD : G_DOT
        cellA[k] = 0.06 + 0.34 * limbA[l]
      }

      // routes (dotted, dim)
      for (let r = 0; r < routes.length; r++) {
        const route = routes[r]
        const arc = route.arc
        const pts = arc.length / 3
        route.glow = Math.max(0, route.glow - dt * 0.8)
        const base = route.temp ? route.life : 0.38 + 0.5 * route.glow
        for (let p = 2; p < pts - 2; p += 2) {
          const vis = view(arc[p * 3], arc[p * 3 + 1], arc[p * 3 + 2], tmp)
          if (!vis) continue
          // ends fade into the surface; the apex is the brightest
          const s = p / (pts - 1)
          const shape = 0.45 + 0.55 * Math.sin(Math.PI * s)
          put(tmp[0], tmp[1], G_BEAD, base * shape * vis * (0.55 + 0.45 * Math.max(0, tmp[2])), true)
        }
      }

      // packets
      for (let q = packets.length - 1; q >= 0; q--) {
        const pk = packets[q]
        if (pk.delay > 0) {
          pk.delay -= dt
          continue
        }
        const arc = routes[pk.r].arc
        const pts = arc.length / 3
        pk.t += (pk.speed * dt * 40) / pts
        if (pk.t >= 1) {
          const e = pk.rev ? 0 : pts - 1
          const v: V3 = [arc[e * 3], arc[e * 3 + 1], arc[e * 3 + 2]]
          if (pk.ring !== false) rings.push({ v, age: 0, strong: routes[pk.r].temp })
          packets.splice(q, 1)
          delivered++
          continue
        }
        routes[pk.r].glow = 1
        const head = pk.t * (pts - 1)
        const TRAIL = 14
        for (let s = TRAIL; s >= 0; s--) {
          const f = head - s * 0.9
          if (f < 0) continue
          const fi = Math.floor(f)
          const p = pk.rev ? pts - 1 - fi : fi
          const vis = view(arc[p * 3], arc[p * 3 + 1], arc[p * 3 + 2], tmp)
          if (!vis) continue
          if (s === 0) {
            put(tmp[0], tmp[1], G_HEAD, vis)
          } else {
            const fade = 1 - s / (TRAIL + 1)
            const bit = ((fi * 7 + q * 3) >> 1) & 1 ? G_ONE : G_ZERO
            put(tmp[0], tmp[1], s < 3 ? G_PLUS : bit, vis * fade * fade * 0.85)
          }
        }
      }

      // handshake rings
      for (let q = rings.length - 1; q >= 0; q--) {
        const rg = rings[q]
        rg.age += dt / (rg.strong ? 1.4 : 1.1)
        if (rg.age >= 1) {
          rings.splice(q, 1)
          continue
        }
        const [vx, vy, vz] = rg.v
        const len = Math.hypot(vx, vy, vz)
        const c: V3 = [vx / len, vy / len, vz / len]
        // tangent basis
        const up: V3 = Math.abs(c[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
        let t1: V3 = [up[1] * c[2] - up[2] * c[1], up[2] * c[0] - up[0] * c[2], up[0] * c[1] - up[1] * c[0]]
        const tl = Math.hypot(...t1)
        t1 = [t1[0] / tl, t1[1] / tl, t1[2] / tl]
        const t2: V3 = [c[1] * t1[2] - c[2] * t1[1], c[2] * t1[0] - c[0] * t1[2], c[0] * t1[1] - c[1] * t1[0]]
        const ease = 1 - Math.pow(1 - rg.age, 3)
        const ang = (0.6 + ease * (rg.strong ? 9 : 5.5)) * DEG
        const ca = Math.cos(ang), sa = Math.sin(ang)
        const a = (1 - rg.age) * (rg.strong ? 1 : 0.8)
        // one glyph per cell of circumference, so the ring stays a line
        const steps = Math.max(6, Math.ceil((Math.PI * 2 * Math.sin(ang) * R) / (cw * 1.15)))
        for (let s = 0; s < steps; s++) {
          const th = (s / steps) * Math.PI * 2
          const ct = Math.cos(th) * sa, st = Math.sin(th) * sa
          const px = c[0] * ca + t1[0] * ct + t2[0] * st
          const py = c[1] * ca + t1[1] * ct + t2[1] * st
          const pz = c[2] * ca + t1[2] * ct + t2[2] * st
          const vis = view(px, py, pz, tmp)
          if (!vis || tmp[2] < 0) continue
          put(tmp[0], tmp[1], G_RING, a)
        }
        const vis = view(c[0], c[1], c[2], tmp)
        if (vis && tmp[2] > 0) put(tmp[0], tmp[1], G_HEAD, a)
      }

      // cities
      const labels: { x: number; y: number; code: string; a: number; home: boolean }[] = []
      for (let c = 0; c < CITIES.length; c++) {
        const v = cityVec[c]
        view(v[0], v[1], v[2], tmp)
        if (tmp[2] < 0.05) continue
        const front = Math.min(1, tmp[2] / 0.35)
        const home = c === 0
        if (home) {
          const pulse = 0.75 + 0.25 * Math.sin(time * 4)
          put(tmp[0], tmp[1], G_HEAD, front * pulse)
        } else {
          put(tmp[0], tmp[1], G_PLUS, front * 0.95)
        }
        labels.push({ x: tmp[0], y: tmp[1], code: CITIES[c].code, a: front, home })
      }

      // ── draw
      bucketN.fill(0)
      const total = cols * rows
      for (let k = 0; k < total; k++) {
        const a = cellA[k]
        if (a < 0.02) continue
        const b = Math.min(BUCKETS - 1, Math.round(a * (BUCKETS - 1)))
        bucket[b][bucketN[b]++] = k
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const boost = dark ? 1 : 1.12
      for (let b = 1; b < BUCKETS; b++) {
        const cnt = bucketN[b]
        if (!cnt) continue
        ctx.globalAlpha = Math.min(1, (b / (BUCKETS - 1)) * boost)
        const list = bucket[b]
        for (let q = 0; q < cnt; q++) {
          const k = list[q]
          const i = k % cols
          const j = (k / cols) | 0
          ctx.drawImage(
            atlas,
            cellG[k] * slotW,
            0,
            slotW,
            slotH,
            Math.round((ox + i * cw) * dpr),
            Math.round((oy + j * ch) * dpr),
            slotW,
            slotH,
          )
        }
      }

      // labels
      ctx.globalAlpha = 1
      ctx.fillStyle = ink
      ctx.textBaseline = "middle"
      for (const lb of labels) {
        const px = (S / 2 + lb.x * R) * dpr
        const py = (S / 2 - lb.y * R) * dpr
        ctx.font = `${lb.home ? 600 : 500} ${fontPx * (lb.home ? 1.05 : 0.92) * dpr}px ${family}`
        ctx.globalAlpha = lb.a * (lb.home ? 1 : 0.42)
        ctx.fillText(lb.code, px + cw * 1.3 * dpr, py - ch * 0.9 * dpr)
      }
      ctx.globalAlpha = 1

      // traffic
      if (!reduce) {
        spawnClock -= dt
        if (spawnClock <= 0 && packets.length < 16) {
          spawnClock = 0.22 + Math.random() * 0.35
          const r = Math.floor(Math.random() * LINKS.length)
          spawn(r, 0, r < HUBS.length ? Math.random() < 0.3 : Math.random() < 0.5)
        }
        // home beacon
        if (Math.floor(time / 2.6) !== Math.floor((time - dt) / 2.6)) {
          rings.push({ v: cityVec[0], age: 0, strong: false })
        }
      }
      for (let r = routes.length - 1; r >= LINKS.length; r--) {
        const route = routes[r]
        const busy = packets.some((p) => p.r === r)
        if (!busy) {
          route.life -= dt / 1.5
          if (route.life <= 0) {
            routes.splice(r, 1)
            // reindex packets above the removed route
            for (const p of packets) if (p.r > r) p.r--
          }
        }
      }
    }

    // ── HUD
    const hudEl = hudRef.current
    const nodes = CITIES.length
    const homeText = `${HOME.code} ${fmtCoord(HOME.lat, "N", "S")} ${fmtCoord(HOME.lon, "E", "W")}`
    let lastHud = -1
    const writeHud = () => {
      if (!hudEl || delivered === lastHud) return
      lastHud = delivered
      hudEl.textContent = `${homeText} · ${nodes} nodes · ${delivered.toLocaleString("en-US")} packets`
    }

    // ── loop
    let raf = 0
    let running = false
    let last = 0
    let onScreen = true
    let hudClock = 0
    const stats = { frames: 0, ms: 0 }
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
      last = now
      const t0 = performance.now()
      frame(dt)
      stats.ms += performance.now() - t0
      stats.frames++
      hudClock += dt
      if (hudClock > 0.25) {
        hudClock = 0
        writeHud()
      }
    }
    const start = () => {
      if (running) return
      running = true
      last = 0
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const sync = () => {
      const want = onScreen && !document.hidden && (!reduce || dragging || Math.abs(spin) > 0.01 || resetting)
      if (want) start()
      else stop()
    }
    const still = () => {
      // reduced motion: a composed static frame with some traffic in flight
      if (!packets.length) {
        for (let r = 0; r < HUBS.length; r += 2) {
          spawn(r)
          packets[packets.length - 1].t = 0.25 + ((r * 0.17) % 0.6)
        }
      }
      frame(0)
      writeHud()
    }
    // ── input
    let dragging = false
    let downX = 0
    let downY = 0
    let downT = 0
    let lastX = 0
    let lastT = 0
    let moved = false

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const k = S / (r.width || S)
      return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k }
    }

    const onMove = (e: PointerEvent) => {
      const p = local(e)
      hoverX = Math.max(-1, Math.min(1, (p.x - S / 2) / R))
      hoverY = Math.max(-1, Math.min(1, -(p.y - S / 2) / R))
      if (!dragging) return
      const now = performance.now()
      const dx = e.clientX - lastX
      if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 5) moved = true
      const d = (dx / R) * 0.9
      yaw += d
      const dtm = Math.max(1, now - lastT) / 1000
      spin = spin * 0.6 + (d / dtm) * 0.4
      lastX = e.clientX
      lastT = now
      if (reduce) frame(0)
    }
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      moved = false
      resetting = false
      spin = 0
      downX = lastX = e.clientX
      downY = e.clientY
      downT = lastT = performance.now()
      wrap.setPointerCapture?.(e.pointerId)
      wrap.style.cursor = "grabbing"
      sync()
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      wrap.style.cursor = ""
      if (performance.now() - lastT > 80) spin = 0
      spin = Math.max(-4, Math.min(4, spin))
      if (!moved && performance.now() - downT < 450) fire(e)
      sync()
    }
    const onCancel = () => {
      dragging = false
      wrap.style.cursor = ""
      sync()
    }
    const onLeave = () => {
      hoverX = 0
      hoverY = 0
    }
    const onDouble = () => {
      resetting = true
      spin = 0
      sync()
    }

    /** Click on the sphere → burst of packets from home to that spot. */
    const fire = (e: PointerEvent) => {
      const p = local(e)
      const x = (p.x - S / 2) / R
      const y = -(p.y - S / 2) / R
      if (x * x + y * y >= 1) return
      const z = Math.sqrt(1 - x * x - y * y)
      setMatrix(yaw + tiltX * 0.12, pitch)
      const w: V3 = [
        m00 * x + m10 * y + m20 * z,
        m01 * x + m11 * y + m21 * z,
        m02 * x + m12 * y + m22 * z,
      ]
      const home = cityVec[0]
      // too close to home: send from the farthest-away hub instead
      const near = w[0] * home[0] + w[1] * home[1] + w[2] * home[2] > Math.cos(4 * DEG)
      let from = 0
      if (near) {
        let best = 2
        cityVec.forEach((v, i) => {
          const d = v[0] * w[0] + v[1] * w[1] + v[2] * w[2]
          if (i && d < best) {
            best = d
            from = i
          }
        })
      }
      routes.push({ a: from, arc: buildArc(cityVec[from], w), temp: true, life: 1, glow: 1 })
      while (routes.length > LINKS.length + 4) {
        routes.splice(LINKS.length, 1)
        for (let q = packets.length - 1; q >= 0; q--) {
          if (packets[q].r === LINKS.length) packets.splice(q, 1)
          else if (packets[q].r > LINKS.length) packets[q].r--
        }
      }
      const r = routes.length - 1
      for (let b = 0; b < 5; b++) {
        packets.push({ r, t: 0, speed: 0.75, rev: false, delay: b * 0.11, ring: b === 4 })
      }
      if (reduce) {
        // no motion: show the route with packets parked along it
        for (let b = 0; b < 3; b++) packets.push({ r, t: 0.3 + b * 0.2, speed: 0, rev: false, delay: 0 })
        frame(0)
      }
    }

    wrap.addEventListener("pointermove", onMove)
    wrap.addEventListener("pointerdown", onDown)
    wrap.addEventListener("pointerup", onUp)
    wrap.addEventListener("pointercancel", onCancel)
    wrap.addEventListener("pointerleave", onLeave)
    wrap.addEventListener("dblclick", onDouble)
    document.addEventListener("visibilitychange", sync)

    readTheme()
    layout()
    still()
    writeHud()

    const ro = new ResizeObserver(() => {
      const prev = S
      layout()
      if (prev !== S) frame(0)
    })
    ro.observe(wrap)

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        sync()
      },
      { rootMargin: "80px" },
    )
    io.observe(wrap)

    const mo = new MutationObserver(() => {
      readTheme()
      buildAtlas()
      if (!running) frame(0)
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    // fonts can land after first paint; rebuild the atlas once they do
    document.fonts?.ready.then(() => {
      readTheme()
      buildAtlas()
      if (!running) frame(0)
    })

    sync()

    return () => {
      stop()
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerdown", onDown)
      wrap.removeEventListener("pointerup", onUp)
      wrap.removeEventListener("pointercancel", onCancel)
      wrap.removeEventListener("pointerleave", onLeave)
      wrap.removeEventListener("dblclick", onDouble)
      document.removeEventListener("visibilitychange", sync)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label="A rotating globe drawn in text characters, with network routes from Mumbai to cities around the world and data packets moving along them. Drag to spin, click to send packets."
      className={cn("relative cursor-grab touch-pan-y select-none", className)}
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 m-auto block font-mono" />
      {hud ? (
        <p
          ref={hudRef}
          aria-hidden
          className="text-subtle-foreground pointer-events-none absolute inset-x-0 top-[92.5%] text-center font-mono text-[10px] tracking-[0.14em] whitespace-nowrap uppercase tabular-nums"
        />
      ) : null}
    </div>
  )
}

export default AsciiGlobe
