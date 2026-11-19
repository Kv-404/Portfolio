"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion"

import { ThemeToggle } from "@/components/common/theme-toggle"
import {
  CommandMenu,
  CommandTrigger,
  useCommandMenu,
} from "@/components/common/command-menu"
import { EASE } from "@/components/motion"
import { profile } from "@/lib/content/profile"
import { cn } from "@/lib/utils"

const links = [
  { name: "Work", href: "/#projects" },
  { name: "Record", href: "/#experience" },
  { name: "Activity", href: "/#activity" },
  { name: "Contact", href: "/contact" },
]

/** Mumbai time, ticking. Empty on the server so it never mismatches. */
function LocalTime() {
  const [now, setNow] = useState<string | null>(null)
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: profile.timezone,
      })
    setNow(fmt())
    const id = window.setInterval(() => setNow(fmt()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <span className="text-muted-foreground hidden font-mono text-[11px] tracking-wider tabular-nums uppercase lg:inline">
      Mumbai {now ?? "--:--"}
    </span>
  )
}

/**
 * Floating glass pill. Hides while scrolling down, comes back on any
 * scroll up, and the hovered link gets a soft sliding highlight.
 */
export function Navbar() {
  const pathname = usePathname()
  const { open, setOpen } = useCommandMenu()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const [menu, setMenu] = useState(false)

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > prev && y > 240 && !menu)
  })

  useEffect(() => setMenu(false), [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? -96 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav
          aria-label="Main"
          className={cn(
            "flex w-full max-w-[760px] items-center justify-between gap-2 rounded-full py-1.5 pr-1.5 pl-5 transition-[background-color,border-color,box-shadow] duration-500",
            scrolled || menu
              ? "glass shadow-soft"
              : "border border-transparent bg-transparent"
          )}
        >
          <Link
            href="/"
            className="focus-visible:ring-ring/50 rounded-full text-[15px] font-semibold tracking-tight outline-none focus-visible:ring-[3px]"
          >
            {profile.name}
            <span className="text-muted-foreground">.</span>
          </Link>

          <ul
            className="hidden items-center md:flex"
            onPointerLeave={() => setHover(null)}
          >
            {links.map((link) => {
              const active =
                link.href === pathname ||
                (link.href !== "/" && pathname.startsWith(link.href) && !link.href.includes("#"))
              return (
                <li key={link.name} className="relative">
                  {hover === link.name && (
                    <motion.span
                      layoutId="nav-hover"
                      className="bg-accent absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Link
                    href={link.href}
                    onPointerEnter={() => setHover(link.name)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-visible:ring-ring/50 relative block rounded-full px-3.5 py-1.5 text-[13px] transition-colors duration-300 outline-none focus-visible:ring-[3px]",
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <LocalTime />
            <CommandTrigger onClick={() => setOpen(true)} />
            <ThemeToggle className="size-8" />
            <button
              type="button"
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
              className="focus-visible:ring-ring/50 relative flex size-9 items-center justify-center rounded-full outline-none focus-visible:ring-[3px] md:hidden"
            >
              <span
                className={cn(
                  "bg-foreground absolute h-px w-4 transition-transform duration-500 ease-[var(--ease-out)]",
                  menu ? "rotate-45" : "-translate-y-[3px]"
                )}
              />
              <span
                className={cn(
                  "bg-foreground absolute h-px w-4 transition-transform duration-500 ease-[var(--ease-out)]",
                  menu ? "-rotate-45" : "translate-y-[3px]"
                )}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="bg-background/95 fixed inset-0 z-40 backdrop-blur-xl md:hidden"
          >
            <ul className="flex h-full flex-col justify-center gap-2 px-8">
              {links.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.05 + i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenu(false)}
                    className="display block py-1 text-5xl"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  )
}

export default Navbar
