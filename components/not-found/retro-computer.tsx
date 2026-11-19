/**
 * A desktop computer from the late eighties, drawn in greys only.
 * Pure SVG in a 600 × 600 box; the glass is left dark so the parent can
 * lay live HTML over it (see SCREEN below for the exact rect).
 */

/** Screen rect in viewBox units, exported so the overlay lines up. */
export const SCREEN = { x: 134, y: 70, w: 332, h: 236, r: 26 } as const
export const VIEWBOX = 600

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/* Keyboard deck: a trapezoid seen from slightly above. */
const DECK = { top: 452, bottom: 520, topL: 112, topR: 488, botL: 78, botR: 522 }

function deckEdges(y: number) {
  const t = (y - DECK.top) / (DECK.bottom - DECK.top)
  return [lerp(DECK.topL, DECK.botL, t), lerp(DECK.topR, DECK.botR, t)] as const
}

/** Keys as trapezoids so they follow the deck's perspective. */
function buildKeys() {
  const rows = [
    { count: 15, spans: [] as number[] },
    { count: 14, spans: [] as number[] },
    { count: 13, spans: [] as number[] },
    // Bottom row: modifiers, a long space bar, modifiers.
    { count: 0, spans: [1.4, 1.2, 1.2, 6.5, 1.2, 1.2, 1.4] },
  ]
  const keys: string[] = []
  const rowH = 10.5
  const rowGap = 4.5
  const startY = DECK.top + 6
  const pad = 9
  const gap = 3

  rows.forEach((row, r) => {
    const y0 = startY + r * (rowH + rowGap)
    const y1 = y0 + rowH
    const [l0, r0] = deckEdges(y0)
    const [l1, r1] = deckEdges(y1)
    const units = row.spans.length ? row.spans : Array.from({ length: row.count }, () => 1)
    const total = units.reduce((a, b) => a + b, 0)
    let acc = 0
    units.forEach((u) => {
      const a = acc / total
      const b = (acc + u) / total
      acc += u
      // Interpolate along the top and bottom edges of this row.
      const x = (l: number, rr: number, f: number) => lerp(l + pad, rr - pad, f)
      const g = gap / 2
      const p = [
        [x(l0, r0, a) + g, y0],
        [x(l0, r0, b) - g, y0],
        [x(l1, r1, b) - g, y1],
        [x(l1, r1, a) + g, y1],
      ]
      keys.push(p.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" "))
    })
  })
  return keys
}

const KEYS = buildKeys()

export function RetroComputer({
  className,
  ledClassName,
}: {
  className?: string
  ledClassName?: string
}) {
  const s = SCREEN
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className={className}
      aria-hidden
      focusable="false"
      fill="none"
    >
      <defs>
        <linearGradient id="nf-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2e2e2" />
          <stop offset="0.55" stopColor="#cdcdcd" />
          <stop offset="1" stopColor="#a9a9a9" />
        </linearGradient>
        <linearGradient id="nf-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.18" />
          <stop offset="0.08" stopColor="#000" stopOpacity="0" />
          <stop offset="0.92" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="nf-bezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8e8e8e" />
          <stop offset="1" stopColor="#b9b9b9" />
        </linearGradient>
        <radialGradient id="nf-glass" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0" stopColor="#1d1d1d" />
          <stop offset="0.7" stopColor="#0b0b0b" />
          <stop offset="1" stopColor="#030303" />
        </radialGradient>
        <linearGradient id="nf-glare" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nf-deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9c9c9" />
          <stop offset="1" stopColor="#b2b2b2" />
        </linearGradient>
        <linearGradient id="nf-key" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ececec" />
          <stop offset="1" stopColor="#d0d0d0" />
        </linearGradient>
        <linearGradient id="nf-desk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Desk line */}
      <rect x="20" y="556" width="560" height="1" fill="url(#nf-desk)" />

      {/* Cables tuck behind the body, so they're drawn first. */}
      <path
        d="M470 452 C478 428 548 440 546 404 C544 382 524 374 506 366"
        stroke="#5e5e5e"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M554 482 C554 466 536 462 524 470" stroke="#5e5e5e" strokeWidth="2.5" strokeLinecap="round" />

      {/* ── Monitor ─────────────────────────────── */}
      {/* Stand */}
      <path d="M252 378 H348 L372 412 H228 Z" fill="#9d9d9d" />
      <path d="M252 378 H348 L352 384 H248 Z" fill="#000" opacity="0.18" />
      <rect x="196" y="408" width="208" height="18" rx="9" fill="url(#nf-body)" />
      <rect x="196" y="420" width="208" height="6" rx="3" fill="#000" opacity="0.15" />

      {/* Case */}
      <rect x="90" y="28" width="420" height="356" rx="34" fill="url(#nf-body)" />
      <rect x="90" y="28" width="420" height="356" rx="34" fill="url(#nf-side)" />
      <rect x="90.5" y="28.5" width="419" height="355" rx="33.5" stroke="#fff" strokeOpacity="0.45" />
      <rect x="90" y="370" width="420" height="14" rx="7" fill="#000" opacity="0.12" />

      {/* Recessed bezel */}
      <rect x="116" y="52" width="368" height="272" rx="30" fill="url(#nf-bezel)" />
      <rect x="116.5" y="52.5" width="367" height="271" rx="29.5" stroke="#000" strokeOpacity="0.2" />

      {/* Glass */}
      <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} fill="url(#nf-glass)" />
      <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} stroke="#000" strokeWidth="3" />

      {/* Chin: vents, drive slot, LED, badge */}
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={132 + i * 9} y="338" width="3.5" height="20" rx="1.75" fill="#000" opacity="0.28" />
      ))}
      <rect x="250" y="342" width="104" height="11" rx="5.5" fill="#8a8a8a" />
      <rect x="258" y="346" width="88" height="3" rx="1.5" fill="#2e2e2e" />
      <rect x="362" y="344" width="10" height="7" rx="2" fill="#9a9a9a" />
      <circle cx="396" cy="347.5" r="3.2" fill="#f5f5f7" className={ledClassName} />
      <rect x="410" y="340" width="70" height="15" rx="4" fill="#bdbdbd" />
      <text
        x="445"
        y="350.6"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="7.5"
        letterSpacing="1.4"
        fill="#6a6a6a"
      >
        KV–404
      </text>

      {/* ── Keyboard ────────────────────────────── */}
      <path
        d={`M${DECK.topL + 6} ${DECK.top} H${DECK.topR - 6} Q${DECK.topR} ${DECK.top} ${DECK.topR + 2} ${DECK.top + 5} L${DECK.botR} ${DECK.bottom} H${DECK.botL} L${DECK.topL - 2} ${DECK.top + 5} Q${DECK.topL} ${DECK.top} ${DECK.topL + 6} ${DECK.top} Z`}
        fill="url(#nf-deck)"
      />
      {/* Front lip gives the slab its thickness. */}
      <path
        d={`M${DECK.botL} ${DECK.bottom} H${DECK.botR} V${DECK.bottom + 10} Q${DECK.botR} ${DECK.bottom + 15} ${DECK.botR - 6} ${DECK.bottom + 15} H${DECK.botL + 6} Q${DECK.botL} ${DECK.bottom + 15} ${DECK.botL} ${DECK.bottom + 10} Z`}
        fill="#8f8f8f"
      />
      <rect x={DECK.botL} y={DECK.bottom} width={DECK.botR - DECK.botL} height="1" fill="#fff" opacity="0.35" />
      {KEYS.map((pts, i) => (
        <g key={i}>
          <polygon points={pts} fill="#7d7d7d" transform="translate(0 1.8)" />
          <polygon points={pts} fill="url(#nf-key)" />
        </g>
      ))}

      {/* Mouse */}
      <rect x="538" y="480" width="32" height="46" rx="15" fill="url(#nf-body)" />
      <rect x="538" y="519" width="32" height="7" rx="3.5" fill="#000" opacity="0.15" />
      <path d="M538 496 H570" stroke="#000" strokeOpacity="0.2" />
      <path d="M554 480 V496" stroke="#000" strokeOpacity="0.2" />

      {/* Glass glare sits on top of everything the overlay won't cover. */}
      <rect
        x={s.x}
        y={s.y}
        width={s.w}
        height={s.h}
        rx={s.r}
        fill="url(#nf-glare)"
        style={{ mixBlendMode: "screen" }}
        pointerEvents="none"
      />
    </svg>
  )
}

export default RetroComputer
