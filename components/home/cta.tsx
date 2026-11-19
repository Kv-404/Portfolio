"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

import { Reveal, TextReveal } from "@/components/motion"
import { SlideCommit } from "@/components/ui/slide-commit"
import { profile, socialLinks } from "@/lib/content/profile"
import { sectionIds } from "@/lib/content/site"

const elsewhere = socialLinks.filter((link) => link.isExternal)

const SLIDER_WIDTH = 300
const SLIDER_HEIGHT = 56

const palette = {
  dark: { trackColor: "#1c1c1e", handleColor: "#f5f5f7", successColor: "#f5f5f7" },
  light: { trackColor: "#e8e8ed", handleColor: "#1d1d1f", successColor: "#1d1d1f" },
}

/**
 * Slide-to-confirm pill that opens /contact. Themed from next-themes, so
 * until mount it renders a same-size placeholder to avoid a hydration
 * mismatch. Width tracks the container (max 300px) on narrow screens.
 */
function ConversationSlider() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [width, setWidth] = useState(SLIDER_WIDTH)
  const boxRef = useRef<HTMLDivElement>(null)
  const navTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    setMounted(true)
    const el = boxRef.current
    if (!el) return
    const measure = () => setWidth(Math.max(200, Math.min(SLIDER_WIDTH, Math.floor(el.clientWidth))))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      ro.disconnect()
      clearTimeout(navTimer.current)
    }
  }, [])

  useEffect(() => {
    router.prefetch("/contact")
  }, [router])

  const colors = resolvedTheme === "light" ? palette.light : palette.dark

  return (
    <div ref={boxRef} className="flex w-full max-w-[300px] justify-center" style={{ height: SLIDER_HEIGHT }}>
      {mounted ? (
        <SlideCommit
          label={width < 280 ? "Slide to say hello" : "Slide to start a conversation"}
          doneLabel="Opening…"
          width={width}
          height={SLIDER_HEIGHT}
          radius={28}
          holdMs={2500}
          {...colors}
          onDone={() => {
            clearTimeout(navTimer.current)
            navTimer.current = setTimeout(() => router.push("/contact"), 450)
          }}
        />
      ) : (
        <div aria-hidden className="bg-muted h-full rounded-full" style={{ width: SLIDER_WIDTH, maxWidth: "100%" }} />
      )}
    </div>
  )
}

/**
 * The closing statement. One huge sentence, one line of context, one
 * way in — everything else stays quiet so the button is the obvious move.
 */
export function CTA({ index = "04" }: { index?: string }) {
  return (
    <section aria-labelledby="contact-title" className="pb-24 sm:pb-32">
      <Reveal
        blur={false}
        y={12}
        className="text-muted-foreground flex items-center gap-3 border-t pt-4 font-mono text-[11px] tracking-[0.18em] uppercase"
      >
        <span className="text-foreground tabular-nums">{index}</span>
        <span aria-hidden className="bg-border h-px w-6" />
        <span>Contact</span>
      </Reveal>

      <div id={sectionIds.contact} className="scroll-mt-28 pt-16 text-center sm:pt-24">
        <h2 id="contact-title" className="display mx-auto text-[clamp(2.25rem,5.6vw,4.5rem)]">
          <span className="sr-only">Let’s build something worth reading.</span>
          <span aria-hidden className="block">
            <TextReveal as="span" text="Let’s build something" className="block" />
            <TextReveal
              as="span"
              delay={0.18}
              text="worth reading."
              className="text-subtle-foreground block"
            />
          </span>
        </h2>

        <Reveal delay={0.25} className="mx-auto mt-6 max-w-[44ch]">
          <p className="text-muted-foreground text-base leading-relaxed text-pretty sm:text-lg">
            An internship, a project that needs a second pair of eyes, or a
            question about something here. Every note gets read.
          </p>
        </Reveal>

        <Reveal delay={0.35} y={16} blur={false} className="mt-10 flex flex-col items-center gap-4">
          <ConversationSlider />
          <Link
            href="/contact"
            className="link-underline text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded-sm text-sm transition-colors outline-none focus-visible:ring-[3px]"
          >
            or write to me <span aria-hidden>→</span>
          </Link>
        </Reveal>

        <Reveal delay={0.45} blur={false} y={8} className="mt-12">
          <ul className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm">
            {elsewhere.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline hover:text-foreground focus-visible:ring-ring/50 rounded-sm transition-colors outline-none focus-visible:ring-[3px]"
                >
                  {link.icon === "x" ? profile.xHandle : link.name}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export default CTA
