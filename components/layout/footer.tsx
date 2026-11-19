"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUp } from "lucide-react"
import { useReducedMotion } from "framer-motion"

import { profile, socialLinks } from "@/lib/content/profile"
import { footer, navLinks } from "@/lib/content/site"

const pages = [{ name: "Home", href: "/" }, ...navLinks]
const elsewhere = socialLinks.filter((link) => link.isExternal)

const linkClass =
  "link-underline text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded-sm transition-colors outline-none focus-visible:ring-[3px]"

/** Mumbai wall-clock, ticking on the minute. Blank until mounted. */
function useLocalTime(timeZone: string) {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 15_000)
    return () => window.clearInterval(id)
  }, [timeZone])
  return time
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-subtle-foreground mb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
      {children}
    </p>
  )
}

export function Footer() {
  const time = useLocalTime(profile.timezone)
  const reduce = useReducedMotion()

  return (
    <footer className="relative mt-12 overflow-hidden border-t">
      <div className="mx-auto max-w-[1200px] px-5 pt-12 pb-8 sm:px-8 sm:pt-16 lg:px-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Link
              href="/"
              className="focus-visible:ring-ring/50 rounded-sm text-xl font-semibold tracking-[-0.025em] outline-none focus-visible:ring-[3px]"
            >
              {profile.name}
            </Link>
            <p className="text-muted-foreground mt-3 max-w-[32ch] text-[15px] leading-relaxed text-pretty">
              Computer science student in Mumbai, building small systems a
              person can still read a month later.
            </p>
          </div>

          <nav aria-label="Footer pages" className="md:col-span-2">
            <ColumnTitle>Pages</ColumnTitle>
            <ul className="space-y-3 text-[15px]">
              {pages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className={linkClass}>
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Elsewhere" className="md:col-span-2">
            <ColumnTitle>Elsewhere</ColumnTitle>
            <ul className="space-y-3 text-[15px]">
              <li>
                <a href={`mailto:${profile.email}`} className={linkClass}>
                  Email
                </a>
              </li>
              {elsewhere.map((link) => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-2 flex flex-col items-start gap-6 md:col-span-3 md:items-end md:text-right">
            <div>
              <ColumnTitle>Local time</ColumnTitle>
              <p className="text-[15px] tabular-nums">
                <span className="text-foreground">{time ?? "--:--"}</span>
                <span className="text-muted-foreground"> · Mumbai, IST</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
              className="group text-muted-foreground hover:text-foreground hover:border-foreground/20 focus-visible:ring-ring/50 inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300 outline-none focus-visible:ring-[3px]"
            >
              Back to top
              <ArrowUp
                aria-hidden
                className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>

        <div className="text-subtle-foreground mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t pt-6 text-[13px]">
          <p>
            © {new Date().getFullYear()} {profile.name}. {footer.note}
          </p>
          <p className="hidden items-center gap-2 sm:flex">
            Press
            <kbd className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-mono text-[11px]">⌘K</kbd>
            to search
          </p>
        </div>
      </div>

      {/* The wordmark sits half below the fold of the page, cropped by the
          footer's own edge — a signature rather than a headline. */}
      <div aria-hidden className="pointer-events-none -mt-[1vw] h-[11vw] overflow-hidden select-none">
        <p className="display ink-fade text-center text-[20vw] leading-[0.8] opacity-[0.08] dark:opacity-[0.12]">
          {profile.name}
        </p>
      </div>
    </footer>
  )
}

export default Footer
