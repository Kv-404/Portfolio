"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, useReducedMotion } from "framer-motion"

import { EASE } from "@/components/motion"
import { cn } from "@/lib/utils"

import styles from "./crt.module.css"
import { RetroComputer, SCREEN, VIEWBOX } from "./retro-computer"

/* 13 × 8 pixel face. X = lit. */
const FACE = [
  ".............",
  "..XX.....XX..",
  "..XX.....XX..",
  ".............",
  ".............",
  "....XXXXX....",
  "...X.....X...",
  "..X.......X..",
]
const FACE_COLS = FACE[0].length

const pct = (n: number) => `${(n / VIEWBOX) * 100}%`

/** Keys that shouldn't count as "any key": navigation and modifiers. */
const IGNORED = new Set([
  "Tab",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
  "Fn",
  "Escape",
  "ContextMenu",
])

const label = "font-mono text-[10px] tracking-[0.18em] uppercase sm:text-[11px]"

export function NotFoundScreen() {
  const router = useRouter()
  const pathname = usePathname()
  const reduce = useReducedMotion()
  const [width, setWidth] = useState<number | null>(null)

  // Live resolution readout.
  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Any key goes home. Modifier chords (⌘K, browser shortcuts) and Tab
  // are left alone so the page stays keyboard-navigable.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      if (IGNORED.has(event.key)) return
      const target = event.target as HTMLElement | null
      if (target?.closest("input, textarea, [contenteditable='true'], [role='dialog']")) return
      router.push("/")
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [router])

  // The frame covers the viewport; keep the page behind it still.
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = "hidden"
    return () => {
      html.style.overflow = prev
    }
  }, [])

  return (
    <div data-lenis-prevent className="bg-background fixed inset-0 z-[60] p-2">
      <div
        className={cn(
          styles.frame,
          "relative isolate flex h-full w-full flex-col overflow-hidden rounded-[28px]"
        )}
      >
        <h1 className="sr-only">Page not found (error 404)</h1>

        {/* Top labels */}
        <div className="relative z-10 grid grid-cols-2 items-start gap-4 p-5 text-white/50 sm:grid-cols-3 sm:p-7">
          <p className={label}>
            / 404 page<span className="hidden sm:inline">&nbsp;&nbsp;&nbsp;&nbsp;// static fragment</span>
          </p>
          <p className={cn(label, "hidden text-center sm:block")}>
            A machine still waiting for this address
          </p>
          <p className={cn(label, "text-right tabular-nums")}>
            / res: // {width ?? "----"} px
          </p>
        </div>

        {/* The computer */}
        <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="w-[min(88vw,64dvh,620px)]"
          >
            <div className={cn("relative aspect-square w-full", styles.float)}>
              <RetroComputer className="absolute inset-0 h-full w-full" ledClassName={styles.led} />

              {/* Live screen, laid exactly over the SVG glass. */}
              <button
                type="button"
                onClick={() => router.push("/")}
                aria-label="Go to the home page"
                className="group focus-visible:ring-[3px] focus-visible:ring-white/60 absolute cursor-pointer overflow-hidden outline-none [container-type:inline-size]"
                style={{
                  left: pct(SCREEN.x),
                  top: pct(SCREEN.y),
                  width: pct(SCREEN.w),
                  height: pct(SCREEN.h),
                  borderRadius: `${(SCREEN.r / SCREEN.w) * 100}% / ${(SCREEN.r / SCREEN.h) * 100}%`,
                }}
              >
                <motion.div
                  initial={reduce ? false : { scaleY: 0.004, scaleX: 0, opacity: 0 }}
                  animate={{ scaleY: [0.004, 0.004, 1], scaleX: [0, 1, 1], opacity: [0, 1, 1] }}
                  transition={{ duration: 0.9, times: [0, 0.35, 1], ease: EASE, delay: 0.6 }}
                  className={cn(
                    styles.screenGlow,
                    "absolute inset-0 flex flex-col items-center justify-center gap-[6cqw] px-[8cqw] text-[#e9e9ea]"
                  )}
                >
                  <div
                    className="grid w-[30cqw] gap-[0.6cqw] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                    style={{ gridTemplateColumns: `repeat(${FACE_COLS}, minmax(0, 1fr))` }}
                  >
                    {FACE.flatMap((row, r) =>
                      row.split("").map((c, i) => (
                        <span
                          key={`${r}-${i}`}
                          className={cn("aspect-square", c === "X" ? "bg-[#e9e9ea]" : "bg-transparent")}
                        />
                      ))
                    )}
                  </div>

                  <div className="w-full space-y-[1.6cqw] text-left font-mono text-[3.5cqw] leading-tight tracking-[0.04em] uppercase">
                    <p>ERR 404 — page not found</p>
                    <p className="text-white/45">This address points at nothing.</p>
                    <p className="flex items-center">
                      <span className="text-white/45">&gt;&nbsp;</span>
                      Press any key to go home
                      <span
                        aria-hidden
                        className={cn(styles.cursor, "ml-[1cqw] inline-block h-[4cqw] w-[2cqw] bg-[#e9e9ea]")}
                      />
                    </p>
                  </div>
                </motion.div>

                {/* Glass texture */}
                <span aria-hidden className={cn(styles.screenLines, "pointer-events-none absolute inset-0")} />
                <span aria-hidden className={cn(styles.rollBar, "pointer-events-none absolute inset-x-0 top-0")} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom labels */}
        <div className="relative z-10 grid grid-cols-2 items-end gap-4 p-5 text-white/50 sm:grid-cols-3 sm:p-7">
          <Link
            href="/"
            className={cn(
              label,
              "group justify-self-start rounded-full py-1 text-white/80 transition-colors outline-none hover:text-white focus-visible:ring-[3px] focus-visible:ring-white/50"
            )}
          >
            <span className="inline-block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-x-1">
              ←
            </span>{" "}
            Back home
          </Link>
          <p className={cn(label, "hidden truncate text-center sm:block")}>
            path // {pathname ?? "/"}
          </p>
          <p className={cn(label, "text-right")}>
            <span className="hidden sm:inline">Press any key</span>
            <span className="sm:hidden">Tap the screen</span>
          </p>
        </div>

        {/* Whole-frame CRT texture */}
        <span aria-hidden className={cn(styles.scanlines, "pointer-events-none absolute inset-0 z-20")} />
        <span aria-hidden className={cn(styles.vignette, "pointer-events-none absolute inset-0 z-20")} />
        <span aria-hidden className="grain pointer-events-none absolute inset-0 z-20" />
      </div>
    </div>
  )
}

export default NotFoundScreen
