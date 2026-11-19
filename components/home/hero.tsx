"use client"

import Link from "next/link"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

import { AsciiHero } from "@/components/ascii/ascii-hero"
import { EASE, Magnetic, TextReveal } from "@/components/motion"
import { achievements } from "@/lib/content/milestones"
import { bio } from "@/lib/content/profile"

const pad = (n: number) => String(n).padStart(2, "0")

/** Year of the most recent ship, e.g. "Nov 2026" → "2026". */
const latestYear =
  achievements[0]?.date.split(" ").pop() ?? String(new Date().getFullYear())

const facts = [
  { label: "Based", value: "Mumbai" },
  { label: "Projects shipped", value: pad(achievements.length) },
  { label: "Studying", value: "CSE" },
  { label: "Year", value: latestYear },
]

const LINE_ONE = "Small systems,"
const LINE_TWO = "built to be read."

/**
 * Opening screen. A mono dateline, a two-line display headline that rises
 * out of a mask, a short lede, two actions and an editorial row of facts.
 * As the visitor scrolls away the whole block eases back: it scales down a
 * touch, lags behind the page and fades, like a product page handing off
 * to the next scene.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.4,
  })
  const opacity = useTransform(progress, [0, 0.75], [1, 0])
  const scale = useTransform(progress, [0, 1], [1, 0.92])
  const y = useTransform(progress, [0, 1], [0, 140])

  return (
    <section
      ref={ref}
      aria-label="Introduction"
      className="relative flex min-h-[80svh] flex-col pt-28 pb-6 sm:pt-32"
    >
      <motion.div
        style={reduce ? undefined : { opacity, scale, y }}
        className="flex flex-1 origin-top flex-col will-change-transform"
      >
        <div className="grid items-center gap-8 pb-10 sm:pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-10">
          <div className="min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="text-muted-foreground flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase"
            >
              <span aria-hidden className="relative flex size-1.5">
                <span className="bg-foreground absolute inset-0 animate-ping rounded-full opacity-40 [animation-duration:2.4s]" />
                <span className="bg-foreground relative size-1.5 rounded-full" />
              </span>
              <span>Kv — CSE student, Mumbai</span>
            </motion.p>

            <h1 className="display mt-6 text-[clamp(2.5rem,8vw,3.5rem)] text-balance sm:mt-7 sm:text-[clamp(2.5rem,5.2vw,4.5rem)]">
              <span className="sr-only">
                {LINE_ONE} {LINE_TWO}
              </span>
              <span aria-hidden className="block">
                <TextReveal as="span" animateOnMount delay={0.15} text={LINE_ONE} className="block" />
                <TextReveal
                  as="span"
                  animateOnMount
                  delay={0.35}
                  text={LINE_TWO}
                  className="text-subtle-foreground block"
                />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
              className="text-muted-foreground mt-5 max-w-[46ch] text-base leading-relaxed text-pretty sm:mt-6 sm:text-lg"
            >
              {bio[0]?.text}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.85 }}
              className="mt-8 flex flex-wrap items-center gap-2.5"
            >
              <Magnetic strength={0.2}>
                <Link
                  href="#projects"
                  className="bg-foreground text-background focus-visible:ring-ring/50 group inline-flex h-11 items-center gap-1.5 rounded-full pr-4 pl-5 text-sm font-medium outline-none transition-transform duration-500 ease-[var(--ease-out)] focus-visible:ring-[3px] active:scale-[0.97]"
                >
                  View work
                  <ArrowRight
                    aria-hidden
                    className="size-3.5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5"
                  />
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link
                  href="/contact"
                  className="hover:bg-accent focus-visible:ring-ring/50 inline-flex h-11 items-center rounded-full border px-5 text-sm font-medium outline-none transition-[background-color,transform] duration-500 ease-[var(--ease-out)] focus-visible:ring-[3px] active:scale-[0.97]"
                >
                  Get in touch
                </Link>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
            className="mx-auto w-full max-w-[460px]"
          >
            <AsciiHero className="h-[260px] w-full sm:h-[360px] lg:aspect-square lg:h-auto" />
          </motion.div>
        </div>

        <motion.dl
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 1 } },
          }}
          className="mt-auto grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-5 sm:grid-cols-4 sm:pt-6"
        >
          {facts.map((fact) => (
            <motion.div
              key={fact.label}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
              }}
              className="min-w-0"
            >
              <dt className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
                {fact.label}
              </dt>
              <dd className="display mt-2 truncate text-2xl tabular-nums sm:text-3xl">
                {fact.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        className="text-subtle-foreground mt-8 flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.2em] uppercase"
      >
        <span>Scroll</span>
        <span className="bg-border relative h-6 w-px overflow-hidden">
          <motion.span
            className="bg-foreground absolute inset-x-0 top-0 h-1/2"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, ease: EASE, repeat: Infinity, repeatDelay: 0.4 }}
          />
        </span>
      </motion.div>
    </section>
  )
}

export default Hero
