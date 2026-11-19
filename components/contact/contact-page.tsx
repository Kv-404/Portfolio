"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Check, Copy } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { EASE, Reveal, Stagger, StaggerItem } from "@/components/motion"
import { profile, socialLinks } from "@/lib/content/profile"
import { cn } from "@/lib/utils"

const EXPO = "ease-[var(--ease-out)]"
const elsewhere = socialLinks.filter((link) => link.isExternal)

/** The visible handle for each channel, derived from its URL. */
function handleFor(href: string, icon: string) {
  if (icon === "x") return profile.xHandle
  try {
    const url = new URL(href)
    const last = url.pathname.split("/").filter(Boolean).pop()
    return last ? `@${last}` : url.hostname
  } catch {
    return href
  }
}

const notes = [
  { term: "Based in", detail: `${profile.location}` },
  { term: "Timezone", detail: "IST · UTC+5:30" },
  { term: "Replies", detail: "Within a few days." },
]

const button =
  "group focus-visible:ring-ring/50 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium outline-none transition-[background-color,color,border-color,transform] duration-300 focus-visible:ring-[3px] active:scale-[0.98]"

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const [announce, setAnnounce] = useState("")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const reduce = useReducedMotion()

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      try {
        await navigator.clipboard.writeText(value)
      } catch {
        // Older browsers / denied permission: fall back to a hidden textarea.
        const ta = document.createElement("textarea")
        ta.value = value
        ta.setAttribute("readonly", "")
        ta.style.position = "fixed"
        ta.style.opacity = "0"
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand("copy")
        ta.remove()
        if (!ok) throw new Error("copy failed")
      }
      setCopied(true)
      setAnnounce(`Copied ${value} to the clipboard`)
    } catch {
      setAnnounce("Couldn’t copy. Select the address and copy it instead.")
    }
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setCopied(false)
      setAnnounce("")
    }, 2200)
  }

  const swap = reduce
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 8, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -8, filter: "blur(4px)" },
      }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        className={cn(button, "bg-foreground text-background hover:bg-foreground/85 min-w-[7.5rem]")}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "done" : "copy"}
            {...swap}
            transition={{ duration: 0.45, ease: EASE }}
            className="inline-flex items-center gap-2"
          >
            {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {announce}
      </span>
    </>
  )
}

/** Header, one big email line with its two actions, then the other channels. */
export function ContactPage() {
  const email = profile.email
  const mailto = `mailto:${email}`
  const [user, domain] = email.split("@")

  return (
    <main className="pb-24 sm:pb-32">
      <PageHeader
        eyebrow="Contact"
        title="Say hello."
        lede="Write about something I built, something you want built, or a role you think fits. Email is the surest way to reach me, and every note is read by me."
      />

      <section aria-labelledby="email-label" className="border-t pt-8 sm:pt-10">
        <Reveal blur={false} y={12}>
          <p
            id="email-label"
            className="text-subtle-foreground font-mono text-[11px] tracking-[0.18em] uppercase"
          >
            Email
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-4">
          <a
            href={mailto}
            className="group focus-visible:ring-ring/50 relative inline-block max-w-full rounded-md outline-none focus-visible:ring-[3px]"
          >
            <span className="display block text-[clamp(1.5rem,6.4vw,4rem)] leading-[1.05] break-words">
              {user}
              <span className="text-subtle-foreground group-hover:text-foreground transition-colors duration-500">
                @{domain}
              </span>
            </span>
            <span
              aria-hidden
              className={cn(
                "bg-foreground absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none",
                EXPO
              )}
            />
          </a>
        </Reveal>

        <Reveal delay={0.2} y={12} blur={false} className="mt-8 flex flex-wrap items-center gap-3">
          <CopyButton value={email} />
          <a
            href={mailto}
            className={cn(button, "hover:border-foreground/30 hover:bg-accent border")}
          >
            Open mail app
            <ArrowUpRight
              aria-hidden
              className={cn(
                "size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                EXPO
              )}
            />
          </a>
        </Reveal>
      </section>

      <div className="mt-16 grid grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-10">
        <section aria-labelledby="elsewhere-label" className="lg:col-span-7">
          <Reveal blur={false} y={12}>
            <h2
              id="elsewhere-label"
              className="text-subtle-foreground font-mono text-[11px] tracking-[0.18em] uppercase"
            >
              Elsewhere
            </h2>
          </Reveal>
          <Stagger as="ul" gap={0.07} className="mt-4 grid grid-cols-1 border-t sm:grid-cols-2 sm:gap-x-8">
            {elsewhere.map((link) => (
              <StaggerItem as="li" key={link.name} className="border-b">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group focus-visible:ring-ring/50 relative flex items-center justify-between gap-4 rounded-sm py-4 outline-none focus-visible:ring-[3px]"
                >
                  <span
                    className={cn(
                      "min-w-0 transition-transform duration-700 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0",
                      EXPO
                    )}
                  >
                    <span className="block text-[15px] font-semibold tracking-[-0.015em]">{link.name}</span>
                    <span className="text-muted-foreground block truncate font-mono text-[12px]">
                      {handleFor(link.href, link.icon)}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className={cn(
                      "text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-[transform,color] duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                      EXPO
                    )}
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                  <span
                    aria-hidden
                    className={cn(
                      "bg-foreground absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none",
                      EXPO
                    )}
                  />
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <aside aria-label="Good to know" className="lg:col-span-4 lg:col-start-9">
          <Reveal blur={false} y={12}>
            <p className="text-subtle-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
              Good to know
            </p>
          </Reveal>
          <Stagger gap={0.07} className="mt-4 border-t">
            <dl>
              {notes.map((n) => (
                <StaggerItem key={n.term} className="flex items-baseline justify-between gap-4 border-b py-4">
                  <dt className="text-muted-foreground text-sm">{n.term}</dt>
                  <dd className="text-right text-[15px]">{n.detail}</dd>
                </StaggerItem>
              ))}
            </dl>
          </Stagger>
        </aside>
      </div>
    </main>
  )
}

export default ContactPage
