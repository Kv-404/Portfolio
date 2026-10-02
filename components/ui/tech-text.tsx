"use client"

import { useEffect, useRef, type CSSProperties } from "react"

import "./tech-text.css"

const LABEL_FONT =
  "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
const FALLOFF_STEPS = 8
const SPRING = 320
const DAMPING = 22

type LineStyle = "dashed" | "solid"
type Reveal = "area" | "letter" | "off"
type Fit = "contain" | "content"

type Settings = {
  text: string
  fontFamily: string
  fontWeight: number | string
  fontSize: number
  letterSpacing: number
  color: string
  accentColor: string
  reach: number
  softness: number
  dashLength: number
  dashGap: number
  strokeWidth: number
  lineStyle: LineStyle
  reveal: Reveal
  specks: number
  selection: boolean
  labels: boolean
  draggable: boolean
  sweep: boolean
  speed: number
  fit: Fit
}

type Box = { x1: number; y1: number; x2: number; y2: number }

type Sprite = {
  image: HTMLCanvasElement
  left: number
  top: number
}

type Glyph = {
  char: string
  x: number
  baseline?: number
  box: Box
  offset: { x: number; y: number }
  velocity: { x: number; y: number }
  outline: number
  index: number
  wordIndex: number
  fill: Sprite
  dashes: Sprite
}

type WordMotion = {
  offset: { x: number; y: number }
  velocity: { x: number; y: number }
  outline: number
}

type LineBound = { left: number; right: number; top: number; bottom: number }

type Word = {
  size: number
  baseline: number
  left: number
  right: number
  top: number
  bottom: number
  lineBounds?: LineBound[]
}

export type TechTextProps = {
  text?: string
  fontFamily?: string
  fontWeight?: number | string
  fontSize?: number
  letterSpacing?: number
  color?: string
  accentColor?: string
  reach?: number
  softness?: number
  dashLength?: number
  dashGap?: number
  strokeWidth?: number
  lineStyle?: LineStyle
  reveal?: Reveal
  specks?: number
  selection?: boolean
  labels?: boolean
  draggable?: boolean
  sweep?: boolean
  speed?: number
  /** contain scales one line into the box. content wraps and hugs the text. */
  fit?: Fit
  /** Hide the canvas from assistive tech when a real text node labels it. */
  decorative?: boolean
  className?: string
  style?: CSSProperties
}

const approach = (current: number, target: number, dt: number, seconds: number) =>
  current + (target - current) * (1 - Math.exp(-dt / seconds))

const hexToRgb = (hex: string) => {
  let h = String(hex || "").replace("#", "")
  if (h.length === 3) h = h.replace(/./g, (c) => c + c)
  const n = parseInt(h.slice(0, 6), 16)
  return Number.isNaN(n)
    ? [255, 255, 255]
    : [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const rgba = (hex: string, alpha: number) => {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const noise = (...values: number[]) => {
  let h = 2166136261
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619)
    h ^= h >>> 13
    h = Math.imul(h, 0x5bd1e995)
    h ^= h >>> 15
  }
  return (h >>> 0) / 4294967296
}

const signed = (value: number) =>
  value > 0 ? `+${value}` : value < 0 ? `−${-value}` : "0"

/** Seconds the idle sweep rests on a word before it moves to the next. */
const WORD_HOLD = 1.45

/**
 * Empty canvas around the words so a pull can travel and spring back
 * without the word being sliced off. The margins cancel this inset,
 * so the resting line stays where it was.
 */
const DRAG_ROOM_X = 48
const DRAG_ROOM_Y = 120

export function TechText({
  text = "React Bits",
  fontFamily = "",
  fontWeight = 600,
  fontSize = 150,
  letterSpacing = -0.05,
  color = "#ffffff",
  accentColor = "#ffffff",
  reach = 200,
  softness = 0.7,
  dashLength = 4,
  dashGap = 2,
  strokeWidth = 1.5,
  lineStyle = "dashed",
  reveal = "letter",
  specks = 15,
  selection = true,
  labels = true,
  draggable = true,
  sweep = true,
  speed = 1,
  fit = "contain",
  decorative = false,
  className = "",
  style,
}: TechTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hitRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const settingsRef = useRef<Settings | null>(null)
  const wakeRef = useRef<() => void>(() => {})

  useEffect(() => {
    settingsRef.current = {
      text,
      fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
      color,
      accentColor,
      reach,
      softness,
      dashLength,
      dashGap,
      strokeWidth,
      lineStyle,
      reveal,
      specks,
      selection,
      labels,
      draggable,
      sweep,
      speed,
      fit,
    }
    wakeRef.current()
  })

  useEffect(() => {
    const container = containerRef.current
    const hit = hitRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    const scratch = document.createElement("canvas")
    const scratchCtx = scratch.getContext("2d")
    const colorCanvas = document.createElement("canvas")
    colorCanvas.width = 1
    colorCanvas.height = 1
    const colorCtx = colorCanvas.getContext("2d", { willReadFrequently: true })
    if (!container || !hit || !canvas || !ctx || !scratchCtx || !colorCtx) return undefined

    const colorCache = new Map<string, string>()
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    let width = 1
    let height = 1
    let dpr = 1
    let raf = 0
    let last = performance.now()
    let visible = true
    let alive = true
    let layoutKey = ""
    let requestedFont = ""
    let word: Word | null = null
    let glyphs: Glyph[] = []
    let wordMotions: WordMotion[] = []
    let presence = 0
    let clock = 0
    let pulse = 0
    let dragging = -1
    let activePointer = -1
    // The word that was just released. The frame stays on it, with its name
    // and size, until the spring settles. Then the idle sweep takes over.
    let springing = -1
    const pointer = { x: 0, y: 0, inside: false }
    const grab = { x: 0, y: 0 }
    const lens = { x: 0, y: 0 }
    const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 }

    const refreshFonts = () => {
      layoutKey = ""
      wakeRef.current()
    }

    const family = (s: Settings) =>
      s.fontFamily || getComputedStyle(container).fontFamily || "sans-serif"
    const fontFor = (s: Settings, size: number) => `${s.fontWeight} ${size}px ${family(s)}`

    const normalizeColor = (input: string) => {
      const value =
        !input || input === "currentColor" ? getComputedStyle(container).color : input
      const cached = colorCache.get(value)
      if (cached) return cached
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) {
        colorCache.set(value, value)
        return value
      }
      colorCtx.clearRect(0, 0, 1, 1)
      colorCtx.fillStyle = "#000000"
      colorCtx.fillStyle = value
      colorCtx.fillRect(0, 0, 1, 1)
      const data = colorCtx.getImageData(0, 0, 1, 1).data
      const hex = `#${[data[0], data[1], data[2]]
        .map((channel) => channel.toString(16).padStart(2, "0"))
        .join("")}`
      colorCache.set(value, hex)
      return hex
    }

    const setFont = (
      target: CanvasRenderingContext2D,
      s: Settings,
      size: number
    ) => {
      target.font = fontFor(s, size)
      if ("letterSpacing" in target) target.letterSpacing = `${s.letterSpacing * size}px`
      target.textAlign = "left"
      target.textBaseline = "alphabetic"
    }

    const sprite = (
      s: Settings,
      view: { size: number; baseline?: number },
      glyph: { char: string; x: number; baseline?: number; box: Box },
      stroke: boolean
    ): Sprite => {
      const pad = Math.ceil(s.strokeWidth * 2 + 4)
      const left = glyph.box.x1 - pad
      const top = glyph.box.y1 - pad
      const w = glyph.box.x2 - glyph.box.x1 + pad * 2
      const h = glyph.box.y2 - glyph.box.y1 + pad * 2
      const image = document.createElement("canvas")
      image.width = Math.max(1, Math.ceil(w * dpr))
      image.height = Math.max(1, Math.ceil(h * dpr))
      const c = image.getContext("2d")
      const baseline = glyph.baseline ?? view.baseline ?? 0
      if (!c) return { image, left, top }
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr)
      setFont(c, s, view.size)
      if (stroke) {
        c.lineJoin = "round"
        c.lineWidth = s.strokeWidth * 2
        c.lineCap = "butt"
        c.strokeStyle = s.color
        if (s.lineStyle !== "solid") {
          c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)])
        }
        c.strokeText(glyph.char, glyph.x, baseline)
        c.setLineDash([])
        c.globalCompositeOperation = "destination-out"
        c.fillStyle = "#000000"
        c.fillText(glyph.char, glyph.x, baseline)
        c.globalCompositeOperation = "source-over"
      } else {
        c.fillStyle = s.color
        c.fillText(glyph.char, glyph.x, baseline)
      }
      return { image, left, top }
    }

    const placeGlyphs = (
      s: Settings,
      view: { size: number; baseline?: number },
      chars: {
        char: string
        x: number
        baseline?: number
        box: Box
        index: number
        wordIndex: number
      }[]
    ) => {
      glyphs = chars.map((base) => ({
        ...base,
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        outline: 0,
        fill: sprite(s, view, base, false),
        dashes: sprite(s, view, base, true),
      }))
      const count = chars.reduce((max, char) => Math.max(max, char.wordIndex + 1), 0)
      const previousWords = wordMotions
      wordMotions = Array.from({ length: count }, (_, i) => {
        const kept = previousWords[i]
        return kept
          ? {
              offset: { x: kept.offset.x, y: kept.offset.y },
              velocity: { x: kept.velocity.x, y: kept.velocity.y },
              outline: kept.outline,
            }
          : { offset: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, outline: 0 }
      })
      dragging = -1
      frame.index = -1
    }

    const ensureContain = (s: Settings) => {
      const probe = scratchCtx
      setFont(probe, s, s.fontSize)
      let m = probe.measureText(s.text)
      const fitScale = Math.min(
        1,
        (width * 0.9) / Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
        (height * 0.66) / Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1)
      )
      const size = s.fontSize * fitScale
      setFont(probe, s, size)
      m = probe.measureText(s.text)
      const inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
      const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
      const x = (width - inkWidth) / 2 + m.actualBoundingBoxLeft
      const baseline = (height - inkHeight) / 2 + m.actualBoundingBoxAscent
      const next: Word = {
        size,
        baseline,
        left: x - m.actualBoundingBoxLeft,
        right: x + m.actualBoundingBoxRight,
        top: baseline - m.actualBoundingBoxAscent,
        bottom: baseline + m.actualBoundingBoxDescent,
      }
      word = next

      const chars = Array.from(s.text)
      const placed: { char: string; x: number; box: Box; index: number; wordIndex: number }[] = []
      let prefix = ""
      let wordIndex = -1
      let gap = true
      chars.forEach((char, i) => {
        prefix += char
        const own = probe.measureText(char)
        const gx = x + probe.measureText(prefix).width - own.width
        if (!char.trim()) {
          gap = true
          return
        }
        if (gap) {
          wordIndex += 1
          gap = false
        }
        placed.push({
          char,
          x: gx,
          index: i,
          wordIndex,
          box: {
            x1: gx - own.actualBoundingBoxLeft,
            y1: baseline - own.actualBoundingBoxAscent,
            x2: gx + own.actualBoundingBoxRight,
            y2: baseline + own.actualBoundingBoxDescent,
          },
        })
      })
      placeGlyphs(s, next, placed)
      return next
    }

    const ensureContent = (s: Settings) => {
      const probe = scratchCtx
      const padX = 2 + DRAG_ROOM_X
      const padTop = 28 + DRAG_ROOM_Y
      const padBottom = 16 + DRAG_ROOM_Y
      const maxWidth = Math.max(8, width - padX * 2)

      const measureLines = (size: number) => {
        setFont(probe, s, size)
        const words = s.text.trim().split(/\s+/).filter(Boolean)
        const lines: string[][] = []
        let current: string[] = []
        for (const token of words) {
          const candidate = current.length ? `${current.join(" ")} ${token}` : token
          if (current.length && probe.measureText(candidate).width > maxWidth) {
            lines.push(current)
            current = [token]
          } else {
            current.push(token)
          }
        }
        if (current.length) lines.push(current)

        let maxAscent = size * 0.72
        let maxDescent = size * 0.18
        const measured = lines.map((lineWords) => {
          const lineText = lineWords.join(" ")
          const metrics = probe.measureText(lineText)
          maxAscent = Math.max(maxAscent, metrics.actualBoundingBoxAscent || size * 0.72)
          maxDescent = Math.max(maxDescent, metrics.actualBoundingBoxDescent || size * 0.18)
          return { text: lineText, width: metrics.width }
        })
        const lineStep = Math.max(size * 1.12, maxAscent + maxDescent + 26)
        const blockWidth = measured.reduce((widest, line) => Math.max(widest, line.width), 0)
        return { size, measured, maxAscent, maxDescent, lineStep, blockWidth }
      }

      let laid = measureLines(s.fontSize)
      if (laid.blockWidth > maxWidth && laid.blockWidth > 0) {
        laid = measureLines((s.fontSize * maxWidth) / laid.blockWidth)
      }

      setFont(probe, s, laid.size)
      const placed: {
        char: string
        x: number
        baseline: number
        box: Box
        index: number
        wordIndex: number
      }[] = []
      const lineBounds: LineBound[] = []
      let textIndex = 0
      let wordIndex = -1

      laid.measured.forEach((line, lineIndex) => {
        const baseline = padTop + laid.maxAscent + lineIndex * laid.lineStep
        let prefix = ""
        let minX = Infinity
        let maxX = -Infinity
        let minY = Infinity
        let maxY = -Infinity
        let gap = true
        for (const char of Array.from(line.text)) {
          prefix += char
          const own = probe.measureText(char)
          const gx = padX + probe.measureText(prefix).width - own.width
          const index = textIndex
          textIndex += 1
          if (!char.trim()) {
            gap = true
            continue
          }
          if (gap) {
            wordIndex += 1
            gap = false
          }
          const ascent = own.actualBoundingBoxAscent || laid.size * 0.72
          const descent = own.actualBoundingBoxDescent || laid.size * 0.18
          const box = {
            x1: gx - (own.actualBoundingBoxLeft || 0),
            y1: baseline - ascent,
            x2: gx + (own.actualBoundingBoxRight || own.width),
            y2: baseline + descent,
          }
          minX = Math.min(minX, box.x1)
          maxX = Math.max(maxX, box.x2)
          minY = Math.min(minY, box.y1)
          maxY = Math.max(maxY, box.y2)
          placed.push({ char, x: gx, baseline, box, index, wordIndex })
        }
        if (minX !== Infinity) {
          lineBounds.push({ left: minX, right: maxX, top: minY, bottom: maxY })
        }
      })

      const bottom =
        padTop +
        laid.maxAscent +
        laid.maxDescent +
        laid.lineStep * Math.max(0, laid.measured.length - 1)
      const next: Word = {
        size: laid.size,
        baseline: padTop + laid.maxAscent,
        left: padX,
        right: padX + laid.blockWidth,
        top: padTop,
        bottom,
        lineBounds,
      }
      word = next
      placeGlyphs(s, next, placed)

      const needed = Math.ceil(bottom + padBottom)
      if (Math.abs(container.clientHeight - needed) > 1) {
        container.style.height = `${needed}px`
      }
      container.style.marginLeft = `-${DRAG_ROOM_X}px`
      container.style.marginRight = `-${DRAG_ROOM_X}px`
      container.style.marginTop = `-${DRAG_ROOM_Y}px`
      container.style.marginBottom = `-${DRAG_ROOM_Y}px`
      container.style.width = `calc(100% + ${DRAG_ROOM_X * 2}px)`
      return next
    }

    const ensureLayout = (s: Settings) => {
      const key = [
        s.text,
        family(s),
        s.fontWeight,
        s.fontSize,
        s.letterSpacing,
        s.color,
        s.dashLength,
        s.dashGap,
        s.strokeWidth,
        s.lineStyle,
        s.fit,
        width,
        s.fit === "contain" ? height : 0,
        dpr,
      ].join("|")
      if (key === layoutKey && word) return word
      layoutKey = key
      const wanted = fontFor(s, 64)
      if (document.fonts && wanted !== requestedFont) {
        requestedFont = wanted
        document.fonts.load(wanted, s.text).then(refreshFonts, refreshFonts)
      }
      return s.fit === "content" ? ensureContent(s) : ensureContain(s)
    }

    const wordBounds = (index: number, includeOffset: boolean) => {
      let x1 = Infinity
      let y1 = Infinity
      let x2 = -Infinity
      let y2 = -Infinity
      for (const glyph of glyphs) {
        if (glyph.wordIndex !== index) continue
        const ox = includeOffset ? glyph.offset.x : 0
        const oy = includeOffset ? glyph.offset.y : 0
        x1 = Math.min(x1, glyph.box.x1 + ox)
        y1 = Math.min(y1, glyph.box.y1 + oy)
        x2 = Math.max(x2, glyph.box.x2 + ox)
        y2 = Math.max(y2, glyph.box.y2 + oy)
      }
      return { x1, y1, x2, y2 }
    }

    const syncWords = () => {
      for (const glyph of glyphs) {
        const motion = wordMotions[glyph.wordIndex]
        if (!motion) continue
        glyph.offset.x = motion.offset.x
        glyph.offset.y = motion.offset.y
        glyph.outline = motion.outline
      }
    }

    const wordAt = (x: number, y: number) => {
      if (!word || y < word.top - 28 || y > word.bottom + 28) return -1
      let best = -1
      let bestDistance = Infinity
      for (let i = 0; i < wordMotions.length; i++) {
        const box = wordBounds(i, true)
        if (!Number.isFinite(box.x1)) continue
        const dx = x < box.x1 ? box.x1 - x : x > box.x2 ? x - box.x2 : 0
        const dy = y < box.y1 ? box.y1 - y : y > box.y2 ? y - box.y2 : 0
        const d = Math.hypot(dx, dy)
        if (d < bestDistance) {
          bestDistance = d
          best = i
        }
      }
      return bestDistance < 32 ? best : -1
    }

    /** Keeps a dragged word inside the canvas, and always allows home. */
    const clampDrag = (index: number, ox: number, oy: number) => {
      const home = wordBounds(index, false)
      if (!Number.isFinite(home.x1)) return { x: ox, y: oy }
      const loX = Math.min(0, 4 - home.x1)
      const hiX = Math.max(0, width - 4 - home.x2)
      const loY = Math.min(0, 18 - home.y1)
      const hiY = Math.max(0, height - 6 - home.y2)
      return {
        x: Math.min(hiX, Math.max(loX, ox)),
        y: Math.min(hiY, Math.max(loY, oy)),
      }
    }

    const falloff = (
      target: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      strength: number,
      softnessValue: number
    ) => {
      const inner = Math.min(1, Math.max(0, 1 - softnessValue))
      const gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius)
      gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`)
      if (inner > 0.995) {
        gradient.addColorStop(0.995, `rgba(0, 0, 0, ${strength})`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        return gradient
      }
      for (let i = 0; i <= FALLOFF_STEPS; i++) {
        const t = i / FALLOFF_STEPS
        const eased = t * t * (3 - 2 * t)
        gradient.addColorStop(
          inner + (1 - inner) * t,
          `rgba(0, 0, 0, ${strength * (1 - eased)})`
        )
      }
      return gradient
    }

    const blit = (
      target: CanvasRenderingContext2D,
      art: Sprite,
      dx: number,
      dy: number,
      originX: number,
      originY: number
    ) => {
      target.drawImage(
        art.image,
        Math.round((art.left + dx) * dpr - originX),
        Math.round((art.top + dy) * dpr - originY)
      )
    }

    const drawReveal = (s: Settings) => {
      const radius = s.reach * dpr
      const cx = lens.x * dpr
      const cy = lens.y * dpr
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = falloff(ctx, cx, cy, radius, presence, s.softness)
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
      ctx.globalCompositeOperation = "source-over"

      const x0 = Math.max(0, Math.floor(cx - radius))
      const y0 = Math.max(0, Math.floor(cy - radius))
      const x1 = Math.min(canvas.width, Math.ceil(cx + radius))
      const y1 = Math.min(canvas.height, Math.ceil(cy + radius))
      if (x1 <= x0 || y1 <= y0) return
      const w = x1 - x0
      const h = y1 - y0
      if (scratch.width < w || scratch.height < h) {
        scratch.width = Math.max(scratch.width, w)
        scratch.height = Math.max(scratch.height, h)
      }
      scratchCtx.setTransform(1, 0, 0, 1, 0, 0)
      scratchCtx.globalCompositeOperation = "source-over"
      scratchCtx.clearRect(0, 0, w, h)
      for (const glyph of glyphs) blit(scratchCtx, glyph.dashes, glyph.offset.x, glyph.offset.y, x0, y0)
      scratchCtx.globalCompositeOperation = "destination-in"
      scratchCtx.fillStyle = falloff(scratchCtx, cx - x0, cy - y0, radius, 1, s.softness)
      scratchCtx.fillRect(0, 0, w, h)
      scratchCtx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = presence
      ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h)
      ctx.globalAlpha = 1
    }

    const crisp = (value: number) => (Math.round(value * dpr) + 0.5) / dpr

    const perimeterPoint = (distance: number, w: number, h: number) => {
      let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h))
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1] as const
      d -= w
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0] as const
      d -= h
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1] as const
      d -= w
      return [frame.x1, frame.y2 - d, -1, 0] as const
    }

    const drawSpecks = (s: Settings, a: number) => {
      const w = frame.x2 - frame.x1
      const h = frame.y2 - frame.y1
      if (w < 2 || h < 2) return
      const perimeter = 2 * (w + h)
      const seed = frame.index + 1
      const grid = 3

      for (let k = 0; k < s.specks; k++) {
        const period = 0.5 + noise(seed, k, 11) * 1.2
        const t = pulse / period + noise(seed, k, 17)
        const cycle = Math.floor(t)
        const life = t - cycle
        if (life > 0.7) continue
        const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h)
        const pick = noise(seed, k, cycle, 2)
        const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11
        const large = size >= 8
        const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid
        const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid
        const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid
        const tone = noise(seed, k, cycle, 3)
        const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1
        const alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink
        const left = Math.round(x - size / 2)
        const speckTop = Math.round(y - size / 2)
        if (tone < 0.26 || (large && tone < 0.78)) {
          ctx.strokeStyle = rgba(s.accentColor, alpha)
          ctx.strokeRect(left + 0.5, speckTop + 0.5, size, size)
          if (large && tone > 0.5) {
            ctx.fillStyle = rgba(s.accentColor, alpha)
            ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2)
          }
        } else {
          ctx.fillStyle = rgba(s.accentColor, alpha)
          ctx.fillRect(left, speckTop, size, size)
        }
      }

      for (let j = 0; j < 2; j++) {
        const head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter
        for (let i = 0; i < 4; i++) {
          const [x, y] = perimeterPoint(head - i * 6, w, h)
          const size = i === 0 ? 3 : 2
          ctx.fillStyle = rgba(s.accentColor, a * [0.95, 0.55, 0.32, 0.16][i])
          ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size)
        }
      }
    }

    const drawFrame = (s: Settings) => {
      const motion = wordMotions[frame.index]
      const home = motion ? wordBounds(frame.index, false) : null
      if (!motion || !home || !Number.isFinite(home.x1) || frame.alpha < 0.01) return
      const a = frame.alpha
      const x1 = crisp(frame.x1)
      const y1 = crisp(frame.y1)
      const x2 = crisp(frame.x2)
      const y2 = crisp(frame.y2)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const moved = Math.hypot(motion.offset.x, motion.offset.y)
      if (moved > 1) {
        const hx = (home.x1 + home.x2) / 2
        const hy = (home.y1 + home.y2) / 2
        ctx.beginPath()
        ctx.moveTo(hx, hy)
        ctx.lineTo(hx + motion.offset.x, hy + motion.offset.y)
        ctx.setLineDash([3, 4])
        ctx.lineWidth = 1
        ctx.strokeStyle = rgba(s.accentColor, 0.45 * a)
        ctx.stroke()
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4)
        ctx.fillStyle = rgba(s.accentColor, 0.7 * a)
        ctx.fill()
      }

      ctx.beginPath()
      ctx.rect(x1, y1, x2 - x1, y2 - y1)
      ctx.lineWidth = 1
      ctx.strokeStyle = rgba(s.accentColor, 0.5 * a)
      ctx.stroke()

      ctx.beginPath()
      for (const [cx, cy] of [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
      ] as const) {
        ctx.rect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5)
      }
      ctx.fillStyle = rgba(s.accentColor, 0.95 * a)
      ctx.fill()

      if (s.specks > 0) {
        ctx.lineWidth = 1
        drawSpecks(s, a)
      }

      if (!s.labels) return
      ctx.font = LABEL_FONT
      ctx.textAlign = "left"
      ctx.fillStyle = rgba(s.accentColor, 0.85 * a)
      const wordText = glyphs
        .filter((glyph) => glyph.wordIndex === frame.index)
        .map((glyph) => glyph.char)
        .join("")
      const wordWidth = Math.round(home.x2 - home.x1)
      const wordHeight = Math.round(home.y2 - home.y1)
      const label =
        dragging === frame.index
          ? `x ${signed(Math.round(motion.offset.x))}   y ${signed(Math.round(-motion.offset.y))}`
          : `${wordText}  ${wordWidth} × ${wordHeight}`
      const labelWidth = ctx.measureText(label).width
      let labelX = Math.round(frame.x1)
      let labelY = Math.round(frame.y1) - 7
      let baseline: CanvasTextBaseline = "bottom"
      if (labelY < 12) {
        labelY = Math.round(frame.y2) + 4
        baseline = "top"
      }
      labelX = Math.min(Math.max(2, labelX), Math.max(2, width - labelWidth - 2))
      ctx.textBaseline = baseline
      ctx.fillText(label, labelX, labelY)
    }

    const tick = (now: number) => {
      raf = 0
      const raw = settingsRef.current
      if (!raw) return
      const s: Settings = {
        ...raw,
        color: normalizeColor(raw.color),
        accentColor: normalizeColor(raw.accentColor || raw.color),
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000))
      last = now
      ensureLayout(s)

      const canSweep = s.sweep && !reducedMotion && wordMotions.length > 0
      const sweeping = canSweep && !pointer.inside && dragging < 0 && springing < 0
      if (sweeping) clock += dt * s.speed
      pulse += dt
      const sweepWord = canSweep ? Math.floor(clock / WORD_HOLD) % wordMotions.length : -1
      const active = pointer.inside || sweeping || dragging >= 0
      if (s.reveal === "area" && active) {
        let aimX = pointer.x
        let aimY = pointer.y
        if (sweepWord >= 0) {
          const box = wordBounds(sweepWord, true)
          aimX = (box.x1 + box.x2) / 2
          aimY = (box.y1 + box.y2) / 2
        }
        lens.x = approach(lens.x, aimX, dt, pointer.inside ? 0.08 : 0.22)
        lens.y = approach(lens.y, aimY, dt, pointer.inside ? 0.08 : 0.22)
      }
      presence = approach(
        presence,
        s.reveal === "area" && active && dragging < 0 ? 1 : 0,
        dt,
        0.16
      )

      let moving = false
      wordMotions.forEach((motion, i) => {
        if (i === dragging) {
          const clamped = clampDrag(i, pointer.x - grab.x, pointer.y - grab.y)
          motion.offset.x = approach(motion.offset.x, clamped.x, dt, 0.03)
          motion.offset.y = approach(motion.offset.y, clamped.y, dt, 0.03)
          motion.velocity.x = 0
          motion.velocity.y = 0
          moving = true
          return
        }
        const { offset, velocity } = motion
        if (
          Math.abs(offset.x) < 0.05 &&
          Math.abs(offset.y) < 0.05 &&
          Math.hypot(velocity.x, velocity.y) < 0.5
        ) {
          offset.x = 0
          offset.y = 0
          velocity.x = 0
          velocity.y = 0
          return
        }
        velocity.x += (-SPRING * offset.x - DAMPING * velocity.x) * dt
        velocity.y += (-SPRING * offset.y - DAMPING * velocity.y) * dt
        offset.x += velocity.x * dt
        offset.y += velocity.y * dt
        moving = true
      })
      syncWords()

      if (dragging >= 0) {
        springing = dragging
      } else if (springing >= 0) {
        const motion = wordMotions[springing]
        const settled =
          !motion ||
          (Math.abs(motion.offset.x) < 0.05 &&
            Math.abs(motion.offset.y) < 0.05 &&
            Math.hypot(motion.velocity.x, motion.velocity.y) < 0.5)
        if (settled) springing = -1
      }

      const focus =
        dragging >= 0
          ? dragging
          : springing >= 0
            ? springing
            : pointer.inside
              ? wordAt(pointer.x, pointer.y)
              : sweepWord
      if (focus >= 0 && s.selection) {
        const motion = wordMotions[focus]
        const box = wordBounds(focus, false)
        const bx1 = box.x1 + motion.offset.x - 6
        const by1 = box.y1 + motion.offset.y - 6
        const bx2 = box.x2 + motion.offset.x + 6
        const by2 = box.y2 + motion.offset.y + 6
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1
          frame.y1 = by1
          frame.x2 = bx2
          frame.y2 = by2
        }
        const glide = focus === dragging ? 0.04 : 0.2
        frame.x1 = approach(frame.x1, bx1, dt, glide)
        frame.y1 = approach(frame.y1, by1, dt, glide)
        frame.x2 = approach(frame.x2, bx2, dt, glide)
        frame.y2 = approach(frame.y2, by2, dt, glide)
        frame.index = focus
      }
      frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.16)

      wordMotions.forEach((motion, i) => {
        const target = s.reveal === "letter" && i === focus && i !== dragging ? 1 : 0
        motion.outline = approach(motion.outline, target, dt, 0.14)
        if (Math.abs(motion.outline - target) > 0.002) moving = true
        else motion.outline = target
      })
      syncWords()

      if (s.draggable) {
        hit.style.cursor = dragging >= 0 ? "grabbing" : focus >= 0 && pointer.inside ? "grab" : ""
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = "source-over"
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const glyph of glyphs) {
        const moved = Math.hypot(glyph.offset.x, glyph.offset.y)
        if (moved > 1) {
          ctx.globalAlpha = Math.min(1, moved / 24) * 0.55
          blit(ctx, glyph.dashes, 0, 0, 0, 0)
          ctx.globalAlpha = 1
        }
      }
      for (const glyph of glyphs) {
        if (glyph.outline < 0.999) {
          ctx.globalAlpha = 1 - glyph.outline
          blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0)
        }
        if (glyph.outline > 0.001) {
          ctx.globalAlpha = glyph.outline
          blit(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0)
        }
        ctx.globalAlpha = 1
      }
      if (presence > 0.001) drawReveal(s)
      drawFrame(s)

      const settling =
        moving ||
        Math.abs(presence - (s.reveal === "area" && active && dragging < 0 ? 1 : 0)) > 0.002 ||
        (frame.alpha > 0.01 && frame.alpha < 0.99)
      if ((active || settling) && visible && alive) raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (raf || !visible || !alive) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    wakeRef.current = wake

    const resize = () => {
      const contentFit = settingsRef.current?.fit === "content"
      const roomX = contentFit ? DRAG_ROOM_X : 0
      const roomY = contentFit ? DRAG_ROOM_Y : 0
      if (contentFit) {
        container.style.marginLeft = `-${roomX}px`
        container.style.marginRight = `-${roomX}px`
        container.style.marginTop = `-${roomY}px`
        container.style.marginBottom = `-${roomY}px`
        container.style.width = `calc(100% + ${roomX * 2}px)`
      }
      // A drag stretches the hit target over the whole stage. A resize in
      // the middle of that pull must not snap it back to the resting words.
      if (dragging < 0) applyHitInsets()
      const nextWidth = Math.max(1, container.clientWidth)
      const nextHeight = Math.max(1, container.clientHeight)
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2)
      const nextCanvasWidth = Math.round(nextWidth * nextDpr)
      const nextCanvasHeight = Math.round(nextHeight * nextDpr)
      const same =
        nextWidth === width &&
        nextHeight === height &&
        nextDpr === dpr &&
        canvas.width === nextCanvasWidth &&
        canvas.height === nextCanvasHeight
      width = nextWidth
      height = nextHeight
      dpr = nextDpr
      if (same) return
      canvas.width = nextCanvasWidth
      canvas.height = nextCanvasHeight
      layoutKey = ""
      wake()
    }

    const contentRoom = () => {
      const contentFit = settingsRef.current?.fit === "content"
      return {
        roomX: contentFit ? DRAG_ROOM_X : 0,
        roomY: contentFit ? DRAG_ROOM_Y : 0,
      }
    }
    const applyHitInsets = () => {
      const { roomX, roomY } = contentRoom()
      hit.style.left = `${roomX}px`
      hit.style.top = `${roomY}px`
      hit.style.right = `${roomX}px`
      hit.style.bottom = `${roomY}px`
      hit.style.touchAction = "pan-y"
    }
    // The resting hit box is only the words. The canvas around them is
    // pointer-events: none, and a captured pointerup over that hole is
    // dropped by the browser, which left the word stuck. Cover the stage
    // for the whole pull so the release still lands on this element.
    const expandHit = () => {
      hit.style.left = "0"
      hit.style.top = "0"
      hit.style.right = "0"
      hit.style.bottom = "0"
      hit.style.touchAction = "none"
    }
    const restingContains = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect()
      const { roomX, roomY } = contentRoom()
      return (
        clientX >= rect.left + roomX &&
        clientX <= rect.right - roomX &&
        clientY >= rect.top + roomY &&
        clientY <= rect.bottom - roomY
      )
    }
    const locate = (e: { clientX: number; clientY: number }) => {
      const rect = container.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
    }
    const finishDrag = (e?: { pointerId?: number; clientX: number; clientY: number }) => {
      if (dragging < 0) return
      if (
        e &&
        typeof e.pointerId === "number" &&
        activePointer >= 0 &&
        e.pointerId !== activePointer
      ) {
        return
      }
      const id = activePointer
      dragging = -1
      activePointer = -1
      if (id >= 0) {
        try {
          if (hit.hasPointerCapture?.(id)) hit.releasePointerCapture(id)
        } catch {
          // The capture is already gone. The spring still has to run.
        }
      }
      applyHitInsets()
      pointer.inside = e ? restingContains(e.clientX, e.clientY) : false
      wake()
    }
    const onHitMove = (e: PointerEvent) => {
      locate(e)
      if (dragging >= 0) {
        if (e.pointerId !== activePointer) return
        if (e.buttons === 0) {
          finishDrag(e)
          return
        }
        pointer.inside = restingContains(e.clientX, e.clientY)
      } else {
        pointer.inside = true
      }
      wake()
    }
    const onWindowMove = (e: PointerEvent) => {
      if (dragging < 0 || e.pointerId !== activePointer) return
      locate(e)
      if (e.buttons === 0) {
        finishDrag(e)
        return
      }
      pointer.inside = restingContains(e.clientX, e.clientY)
      wake()
    }
    const onLeave = () => {
      if (dragging >= 0) return
      pointer.inside = false
      wake()
    }
    const onDown = (e: PointerEvent) => {
      locate(e)
      pointer.inside = true
      const s = settingsRef.current
      if (s?.draggable && (e.pointerType !== "mouse" || e.button === 0)) {
        const index = wordAt(pointer.x, pointer.y)
        if (index >= 0) {
          dragging = index
          springing = index
          activePointer = e.pointerId
          grab.x = pointer.x - wordMotions[index].offset.x
          grab.y = pointer.y - wordMotions[index].offset.y
          expandHit()
          try {
            hit.setPointerCapture(e.pointerId)
          } catch {
            // Window listeners still see the release.
          }
        }
      }
      wake()
    }
    const onPointerUp = (e: PointerEvent) => {
      if (e.type !== "pointercancel" && e.button !== 0) return
      finishDrag(e)
    }
    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return
      finishDrag({ clientX: e.clientX, clientY: e.clientY })
    }
    const onBlur = () => finishDrag()

    hit.addEventListener("pointermove", onHitMove, { passive: true })
    hit.addEventListener("pointerenter", onHitMove, { passive: true })
    hit.addEventListener("pointerdown", onDown, { passive: true })
    hit.addEventListener("pointerup", onPointerUp, { passive: true })
    hit.addEventListener("pointercancel", onPointerUp, { passive: true })
    hit.addEventListener("pointerleave", onLeave, { passive: true })
    window.addEventListener("pointermove", onWindowMove, true)
    window.addEventListener("pointerup", onPointerUp, true)
    window.addEventListener("pointercancel", onPointerUp, true)
    window.addEventListener("mouseup", onMouseUp, true)
    window.addEventListener("blur", onBlur)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      wake()
    })
    intersectionObserver.observe(container)
    const themeObserver = new MutationObserver(() => {
      colorCache.clear()
      layoutKey = ""
      wake()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })
    if (document.fonts) document.fonts.ready.then(refreshFonts, refreshFonts)

    resize()

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      wakeRef.current = () => {}
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()
      hit.removeEventListener("pointermove", onHitMove)
      hit.removeEventListener("pointerenter", onHitMove)
      hit.removeEventListener("pointerdown", onDown)
      hit.removeEventListener("pointerup", onPointerUp)
      hit.removeEventListener("pointercancel", onPointerUp)
      hit.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("pointermove", onWindowMove, true)
      window.removeEventListener("pointerup", onPointerUp, true)
      window.removeEventListener("pointercancel", onPointerUp, true)
      window.removeEventListener("mouseup", onMouseUp, true)
      window.removeEventListener("blur", onBlur)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`tech-text ${className}`.trim()}
      style={style}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : text}
      aria-hidden={decorative ? true : undefined}
    >
      <canvas ref={canvasRef} className="tech-text-canvas" />
      <div ref={hitRef} className="tech-text-hit" />
    </div>
  )
}

export default TechText
