"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export type ContributionDay = { date: string; count: number }

/**
 * GitHub's year as a little 3D city on a canvas.
 *
 * It starts as the familiar flat green grid seen from straight above.
 * As the section scrolls into the middle of the screen the camera tips
 * down and every day rises into a bar. After that you can drag to spin
 * it (with inertia) and double-click to reset. Orthographic camera,
 * painter's sort per frame, per-face lighting so spinning reads as 3D.
 */

// GitHub's own palettes, level 0 → 4.
const GREENS_DARK = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"]
const GREENS_LIGHT = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]

const INSET = 0.12
const MAX_H = 8
const MIN_H = 0.35
const FLAT_PITCH = Math.PI / 2 // straight down
const TILT_PITCH = (34 * Math.PI) / 180
const TILT_YAW = (-24 * Math.PI) / 180
const MIN_PITCH = (12 * Math.PI) / 180

type Cell = {
  x: number // world x of footprint origin
  z: number
  h: number
  level: number
  count: number
  date: string
}

type Hit = { poly: number[]; cell: Cell; tip: [number, number] }

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function shade([r, g, b]: [number, number, number], f: number) {
  return `rgb(${Math.round(Math.min(255, r * f))},${Math.round(Math.min(255, g * f))},${Math.round(Math.min(255, b * f))})`
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

function buildCells(days: ContributionDay[]) {
  const first = days[0] ? new Date(`${days[0].date}T00:00:00`).getDay() : 0
  const max = days.reduce((m, d) => Math.max(m, d.count), 0) || 1
  const raw = days.map((day, i) => {
    const slot = i + first
    return { w: Math.floor(slot / 7), d: slot % 7, day }
  })
  const weeks = (raw.at(-1)?.w ?? 52) + 1
  const cells: Cell[] = raw.map(({ w, d, day }) => {
    const level = day.count === 0 ? 0 : clamp(Math.ceil((day.count / max) * 4), 1, 4)
    return {
      x: w - weeks / 2,
      z: d - 3.5,
      h: day.count > 0 ? MIN_H + (MAX_H - MIN_H) * Math.pow(day.count / max, 0.6) : 0,
      level,
      count: day.count,
      date: day.date,
    }
  })
  return { cells, weeks }
}

function dayLabel(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function pointInPoly(px: number, py: number, poly: number[]) {
  let inside = false
  for (let i = 0, j = poly.length - 2; i < poly.length; j = i, i += 2) {
    const xi = poly[i], yi = poly[i + 1], xj = poly[j], yj = poly[j + 1]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

export function ContributionMesh({
  days,
  label,
  className,
}: {
  days: ContributionDay[]
  label: string
  className?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hover, setHover] = useState<{ cell: Cell; x: number; y: number } | null>(null)
  const [grabbing, setGrabbing] = useState(false)
  const [spun, setSpun] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const { cells } = buildCells(days)

    let palette = GREENS_DARK.map(hexToRgb)
    let floorEdge = "rgba(255,255,255,0.04)"
    const readTheme = () => {
      const dark = document.documentElement.classList.contains("dark")
      palette = (dark ? GREENS_DARK : GREENS_LIGHT).map(hexToRgb)
      floorEdge = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"
      dirty = true
    }

    let cw = 0
    let ch = 0
    let dpr = 1
    let dirty = true
    let visible = true
    let raf = 0

    // Scroll morph 0 (flat) → 1 (3D), smoothed.
    let morph = reduce ? 1 : 0
    let morphTarget = morph

    // User spin on top of the scripted camera.
    let userYaw = 0
    let userPitch = 0
    let velYaw = 0
    let velPitch = 0
    let dragging = false
    let lastX = 0
    let lastY = 0

    // Smoothed fit.
    let scale = 0
    let offX = 0
    let offY = 0

    let hits: Hit[] = []
    let pointer: { x: number; y: number } | null = null

    const resize = () => {
      const r = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cw = r.width
      ch = r.height
      canvas.width = Math.round(cw * dpr)
      canvas.height = Math.round(ch * dpr)
      canvas.style.width = `${cw}px`
      canvas.style.height = `${ch}px`
      scale = 0 // refit instantly
      dirty = true
    }

    const readScroll = () => {
      if (reduce) return
      const r = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      // Flat while its centre is low on screen; fully 3D by mid-screen.
      const centre = r.top + r.height / 2
      const start = vh * 0.88
      const end = vh * 0.5
      morphTarget = clamp((start - centre) / (start - end), 0, 1)
    }

    const draw = () => {
      const m = easeInOut(morph)
      const yaw = TILT_YAW * m + userYaw
      const pitch = clamp(FLAT_PITCH + (TILT_PITCH - FLAT_PITCH) * m + userPitch, MIN_PITCH, FLAT_PITCH)
      const hScale = m
      const cy = Math.cos(yaw), sy = Math.sin(yaw)
      const cp = Math.cos(pitch), sp = Math.sin(pitch)

      // World → (screenX, screenY, depth) before fit.
      const P = (x: number, y: number, z: number): [number, number, number] => {
        const xr = x * cy - z * sy
        const zr = x * sy + z * cy
        return [xr, zr * sp - y * cp, zr * cp + y * sp]
      }

      // Fit to the projected bounds (smoothed so spinning doesn't jump).
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
      for (const c of cells) {
        for (const [dx, dz] of [[0, 0], [1, 1]] as const) {
          const [sx, sy2] = P(c.x + dx, 0, c.z + dz)
          const [, ty] = P(c.x + dx, c.h * hScale, c.z + dz)
          minX = Math.min(minX, sx); maxX = Math.max(maxX, sx)
          minY = Math.min(minY, sy2, ty); maxY = Math.max(maxY, sy2, ty)
        }
      }
      const targetScale = Math.min((cw * 0.94) / (maxX - minX), (ch * 0.86) / (maxY - minY))
      const targetOffX = cw / 2 - ((minX + maxX) / 2) * targetScale
      const targetOffY = ch / 2 - ((minY + maxY) / 2) * targetScale
      if (scale === 0) {
        scale = targetScale; offX = targetOffX; offY = targetOffY
      } else {
        const k = 0.12
        scale += (targetScale - scale) * k
        offX += (targetOffX - offX) * k
        offY += (targetOffY - offY) * k
      }
      const settled =
        Math.abs(targetScale - scale) < 0.01 &&
        Math.abs(targetOffX - offX) < 0.2 &&
        Math.abs(targetOffY - offY) < 0.2

      const S = (x: number, y: number, z: number) => {
        const [sx, sy2] = P(x, y, z)
        return [offX + sx * scale, offY + sy2 * scale]
      }

      // Painter's order: farthest first.
      const order = cells
        .map((c) => ({ c, d: P(c.x + 0.5, 0, c.z + 0.5)[2] }))
        .sort((a, b) => a.d - b.d)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cw, ch)
      ctx.lineJoin = "round"

      // Light in world space, slightly from the front-left and above.
      const L = [-0.45, 0.75, 0.5]
      const sideLight = (nx: number, nz: number) => 0.5 + 0.38 * Math.max(0, nx * L[0] + nz * L[2])

      const newHits: Hit[] = []
      const quad = (pts: number[][], fill: string, stroke?: string) => {
        ctx.beginPath()
        ctx.moveTo(pts[0][0], pts[0][1])
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
        ctx.closePath()
        ctx.fillStyle = fill
        ctx.fill()
        if (stroke) {
          ctx.strokeStyle = stroke
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      for (const { c } of order) {
        const x0 = c.x + INSET, x1 = c.x + 1 - INSET
        const z0 = c.z + INSET, z1 = c.z + 1 - INSET
        const h = c.h * hScale
        const base = palette[c.level]
        const isHover = hover !== null && pointer !== null && hoverCell === c
        const lift = isHover ? 1.25 : 1

        if (h < 0.02) {
          const top = [S(x0, 0, z0), S(x1, 0, z0), S(x1, 0, z1), S(x0, 0, z1)]
          quad(top, shade(base, lift), c.level === 0 ? floorEdge : undefined)
          if (c.count > 0) newHits.push({ poly: top.flat(), cell: c, tip: S(c.x + 0.5, 0, c.z + 0.5) as [number, number] })
          continue
        }

        // Side faces: outward normals ±x, ±z. Visible if they face the camera.
        const faces: { n: [number, number]; pts: number[][] }[] = [
          { n: [0, 1], pts: [S(x0, 0, z1), S(x1, 0, z1), S(x1, h, z1), S(x0, h, z1)] },
          { n: [0, -1], pts: [S(x1, 0, z0), S(x0, 0, z0), S(x0, h, z0), S(x1, h, z0)] },
          { n: [1, 0], pts: [S(x1, 0, z1), S(x1, 0, z0), S(x1, h, z0), S(x1, h, z1)] },
          { n: [-1, 0], pts: [S(x0, 0, z0), S(x0, 0, z1), S(x0, h, z1), S(x0, h, z0)] },
        ]
        const hitPts: number[] = []
        for (const f of faces) {
          const nzr = f.n[0] * sy + f.n[1] * cy
          if (nzr * cp <= 0.0001) continue
          quad(f.pts, shade(base, sideLight(f.n[0], f.n[1]) * lift))
          hitPts.push(...f.pts.flat())
        }
        const top = [S(x0, h, z0), S(x1, h, z0), S(x1, h, z1), S(x0, h, z1)]
        quad(top, shade(base, 1.08 * lift))
        // Bounding polygon for hit-testing: use top + visible sides as separate tests.
        newHits.push({ poly: top.flat(), cell: c, tip: S(c.x + 0.5, h, c.z + 0.5) as [number, number] })
        for (let i = 0; i < hitPts.length; i += 8) {
          newHits.push({ poly: hitPts.slice(i, i + 8), cell: c, tip: S(c.x + 0.5, h, c.z + 0.5) as [number, number] })
        }
      }
      hits = newHits
      return settled
    }

    let hoverCell: Cell | null = null
    const pick = () => {
      if (!pointer || dragging) {
        if (hoverCell) {
          hoverCell = null
          setHover(null)
          dirty = true
        }
        return
      }
      let found: Hit | null = null
      for (let i = hits.length - 1; i >= 0; i--) {
        if (pointInPoly(pointer.x, pointer.y, hits[i].poly)) {
          found = hits[i]
          break
        }
      }
      const cell = found?.cell ?? null
      if (cell !== hoverCell) {
        hoverCell = cell
        dirty = true
      }
      setHover(found ? { cell: found.cell, x: found.tip[0], y: found.tip[1] } : null)
    }

    const loop = () => {
      readScroll()
      const dm = morphTarget - morph
      if (Math.abs(dm) > 0.0005) {
        morph += dm * 0.08
        dirty = true
      } else if (morph !== morphTarget) {
        morph = morphTarget
        dirty = true
      }

      if (!dragging && (Math.abs(velYaw) > 0.00005 || Math.abs(velPitch) > 0.00005)) {
        userYaw += velYaw
        userPitch += velPitch
        velYaw *= 0.94
        velPitch *= 0.9
        dirty = true
      }

      if (dirty) {
        dirty = !draw()
        pick()
      }
      if (visible) raf = requestAnimationFrame(loop)
    }

    // ── Pointer: drag to spin, double-click to reset ──
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      dragging = true
      setGrabbing(true)
      lastX = e.clientX
      lastY = e.clientY
      velYaw = 0
      velPitch = 0
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      pointer = local(e)
      if (dragging) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        lastX = e.clientX
        lastY = e.clientY
        velYaw = dx * 0.008
        velPitch = -dy * 0.005
        userYaw += velYaw
        userPitch += velPitch
        if (!spun && Math.abs(dx) > 2) setSpun(true)
      }
      dirty = true
    }
    const onUp = (e: PointerEvent) => {
      dragging = false
      setGrabbing(false)
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    }
    const onLeave = () => {
      pointer = null
      dirty = true
    }
    const onDouble = () => {
      // Glide back to the scripted view.
      const steps = 40
      const fromYaw = userYaw
      const fromPitch = userPitch
      let i = 0
      velYaw = velPitch = 0
      const tick = () => {
        i++
        const t = easeInOut(i / steps)
        userYaw = fromYaw * (1 - t)
        userPitch = fromPitch * (1 - t)
        dirty = true
        if (i < steps) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    readTheme()
    resize()
    readScroll()
    if (reduce) morph = morphTarget = 1

    canvas.addEventListener("pointerdown", onDown)
    canvas.addEventListener("pointermove", onMove)
    canvas.addEventListener("pointerup", onUp)
    canvas.addEventListener("pointercancel", onUp)
    canvas.addEventListener("pointerleave", onLeave)
    canvas.addEventListener("dblclick", onDouble)

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const io = new IntersectionObserver(([entry]) => {
      const was = visible
      visible = entry.isIntersecting
      if (visible && !was) {
        dirty = true
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(wrap)

    const mo = new MutationObserver(readTheme)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener("pointerdown", onDown)
      canvas.removeEventListener("pointermove", onMove)
      canvas.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("pointercancel", onUp)
      canvas.removeEventListener("pointerleave", onLeave)
      canvas.removeEventListener("dblclick", onDouble)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
    }
    // hover is read via closure only for the highlight flag; the effect must not restart on it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days])

  return (
    <div className={cn("relative", className)}>
      <div
        ref={wrapRef}
        className="relative aspect-[4/3] w-full sm:aspect-[21/9]"
        role="img"
        aria-label={label}
      >
        <canvas
          ref={canvasRef}
          className={cn(
            "absolute inset-0 touch-pan-y select-none",
            grabbing ? "cursor-grabbing" : "cursor-grab"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "glass pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-full px-3 py-1.5",
            "shadow-soft font-mono text-[11px] whitespace-nowrap tabular-nums",
            "transition-opacity duration-300 ease-[var(--ease-out)]",
            hover ? "opacity-100" : "opacity-0"
          )}
          style={hover ? { left: hover.x, top: hover.y } : { left: "50%", top: 0 }}
        >
          {hover ? (
            <>
              <span className="text-foreground">
                {hover.cell.count} {hover.cell.count === 1 ? "contribution" : "contributions"}
              </span>
              <span className="text-muted-foreground"> · {dayLabel(hover.cell.date)}</span>
            </>
          ) : (
            " "
          )}
        </div>
      </div>

      <div className="text-subtle-foreground mt-4 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.18em] uppercase">
        <span className={cn("transition-opacity duration-700", spun ? "opacity-0" : "opacity-100")}>
          Drag to spin · double-click to reset
        </span>
        <span className="flex items-center gap-1.5">
          Less
          {GREENS_DARK.map((c, i) => (
            <span
              key={c}
              className="inline-block size-2.5 rounded-[2px]"
              style={{ background: `var(--gh-${i})` }}
            />
          ))}
          More
        </span>
      </div>
    </div>
  )
}

export default ContributionMesh
