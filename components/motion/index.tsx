"use client"

/**
 * Motion kit. Every animated thing on the site comes from here so the
 * whole page moves with one voice: expo-out easing, long-ish durations,
 * transform / opacity / blur only. MotionProvider turns it all off for
 * reduced-motion users.
 */

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import { useRef } from "react"

import { cn } from "@/lib/utils"

export const EASE = [0.16, 1, 0.3, 1] as const
export const SPRING = { stiffness: 140, damping: 22, mass: 0.6 }

type Tag = "div" | "section" | "li" | "span" | "p" | "header" | "ul" | "article"

/** Fade + rise + un-blur the first time a block enters view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  blur = true,
  as = "div",
  amount = 0.2,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  blur?: boolean
  as?: Tag
  amount?: number
}) {
  const M = motion[as] as typeof motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </M>
  )
}

/** Children reveal one after another. Wrap items in <StaggerItem>. */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode
  className?: string
  gap?: number
  delay?: number
  as?: Tag
}) {
  const M = motion[as] as typeof motion.div
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </M>
  )
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode
  className?: string
  as?: Tag
}) {
  const M = motion[as] as typeof motion.div
  return (
    <M
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 1, ease: EASE },
        },
      }}
    >
      {children}
    </M>
  )
}

/**
 * Headline that rises word by word out of a mask. Pass plain text.
 * `animateOnMount` plays on load (hero) instead of on scroll.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  gap = 0.06,
  as = "h2",
  animateOnMount = false,
}: {
  text: string
  className?: string
  delay?: number
  gap?: number
  as?: "h1" | "h2" | "h3" | "p" | "span"
  animateOnMount?: boolean
}) {
  const M = motion[as] as typeof motion.h2
  const words = text.split(" ")
  const trigger = animateOnMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, amount: 0.5 } }
  return (
    <M
      className={className}
      aria-label={text}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%", rotate: 4 },
              show: {
                y: "0%",
                rotate: 0,
                transition: { duration: 1.1, ease: EASE },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </M>
  )
}

/** Pulls its child toward the cursor, springs back on leave. */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), SPRING)
  const y = useSpring(useMotionValue(0), SPRING)

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Scroll progress (0→1) of an element through the viewport. */
export function useElementProgress(
  offset: [string, string] = ["start end", "end start"]
) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    // framer's offset type is a template-literal union; strings are fine at runtime.
    offset: offset as never,
  })
  return { ref, progress: scrollYProgress }
}

/** Moves its child on Y as the block scrolls past — gentle parallax. */
export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: React.ReactNode
  className?: string
  distance?: number
}) {
  const { ref, progress } = useElementProgress()
  const raw = useTransform(progress, [0, 1], [distance, -distance])
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 })
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Tilts a card a few degrees toward the cursor and exposes --mx / --my
 * (0–100%) so a CSS spotlight can follow the pointer.
 */
export function TiltCard({
  children,
  className,
  max = 4,
}: {
  children: React.ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const rx = useSpring(useMotionValue(0), SPRING)
  const ry = useSpring(useMotionValue(0), SPRING)

  return (
    <motion.div
      ref={ref}
      className={cn("[transform-style:preserve-3d] [perspective:1200px]", className)}
      style={{ rotateX: rx, rotateY: ry }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        ry.set((px - 0.5) * max * 2)
        rx.set(-(py - 0.5) * max * 2)
        ref.current.style.setProperty("--mx", `${px * 100}%`)
        ref.current.style.setProperty("--my", `${py * 100}%`)
      }}
      onPointerLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

/** Thin bar pinned to the top that tracks page scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-foreground fixed inset-x-0 top-0 z-[70] h-px origin-left"
    />
  )
}

export type { MotionValue }
