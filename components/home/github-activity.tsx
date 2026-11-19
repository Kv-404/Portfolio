"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { EASE, Reveal, Stagger, StaggerItem } from "@/components/motion"
import { SectionHeading } from "@/components/layout/section-heading"
import { type ContributionDay, ContributionMesh } from "@/components/ui/contribution-mesh"
import { profile } from "@/lib/content/profile"
import { sectionIds } from "@/lib/content/site"

type ApiDay = { date: string; contributionCount: number }

const fmt = new Intl.NumberFormat("en-US")

function shortDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function computeStats(days: ContributionDay[]) {
  let longest = 0
  let run = 0
  let best: ContributionDay | null = null
  let active = 0
  for (const day of days) {
    if (day.count > 0) {
      run += 1
      active += 1
      longest = Math.max(longest, run)
    } else {
      run = 0
    }
    if (!best || day.count > best.count) best = day
  }
  return { longest, best, active }
}

/** Counts up from zero the first time it is seen. */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const mv = useMotionValue(reduce ? value : 0)
  const text = useTransform(mv, (v) => fmt.format(Math.round(v)))

  useEffect(() => {
    if (reduce) {
      mv.set(value)
      return
    }
    if (!inView) return
    const controls = animate(mv, value, { duration: 1.8, ease: EASE })
    return () => controls.stop()
  }, [inView, reduce, value, mv])

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span aria-hidden>{text}</motion.span>
      <span className="sr-only">{fmt.format(value)}</span>
    </span>
  )
}

function Stat({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <StaggerItem className="border-t pt-4">
      <p className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">{label}</p>
      <p className="display mt-2 text-[clamp(1.5rem,2.6vw,2.125rem)] tabular-nums">{value}</p>
      {note ? (
        <p className="text-muted-foreground mt-2 font-mono text-[11px] tracking-wide tabular-nums">{note}</p>
      ) : null}
    </StaggerItem>
  )
}

function GitHubLink() {
  return (
    <a
      href={profile.github}
      target="_blank"
      rel="noopener noreferrer"
      className="link-underline focus-visible:ring-ring/50 rounded-sm font-mono text-[11px] tracking-[0.12em] uppercase outline-none focus-visible:ring-[3px]"
    >
      View GitHub <span aria-hidden>↗</span>
    </a>
  )
}

/**
 * Reads /api/github and draws the trailing year as a 3D mesh you can spin.
 * While it loads a placeholder pulses; if the feed is unavailable the
 * section stays quiet and points at the profile instead.
 */
export function GitHubActivity({ index = "03" }: { index?: string }) {
  const [days, setDays] = useState<ContributionDay[] | null>(null)
  const [total, setTotal] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const response = await fetch("/api/github")
        if (!response.ok) throw new Error("Request failed")
        const data = await response.json()
        if (cancelled) return
        if (data.unavailable || !Array.isArray(data.days)) throw new Error("Unavailable")
        const parsed: ContributionDay[] = data.days.map((d: ApiDay) => ({
          date: d.date,
          count: d.contributionCount ?? 0,
        }))
        setDays(parsed)
        setTotal(
          typeof data.totalContributions === "number"
            ? data.totalContributions
            : parsed.reduce((s, d) => s + d.count, 0)
        )
      } catch {
        if (!cancelled) setFailed(true)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => (days ? computeStats(days) : null), [days])

  const summary =
    days && stats
      ? `3D map of GitHub contributions over the last year: ${fmt.format(total)} contributions across ${stats.active} active days. Longest streak ${stats.longest} days.${
          stats.best ? ` Best day ${shortDate(stats.best.date)} with ${stats.best.count}.` : ""
        }`
      : ""

  return (
    <section aria-labelledby={sectionIds.activity} className="min-w-0">
      <SectionHeading
        id={sectionIds.activity}
        index={index}
        label="Activity"
        title="A year of commits."
        action={<GitHubLink />}
      />

      {failed ? (
        <Reveal className="bg-card shadow-soft rounded-2xl border px-6 py-10 text-center sm:py-12">
          <p className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
            Feed unavailable
          </p>
          <p className="mt-2 text-base font-semibold tracking-[-0.015em] sm:text-lg">
            The contribution map couldn&apos;t load right now.
          </p>
          <div className="mt-6">
            <GitHubLink />
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal className="flex flex-col gap-2">
            <p className="display text-[clamp(2.5rem,6vw,4.5rem)]">
              {days ? <CountUp value={total} /> : <span className="text-subtle-foreground">—</span>}
            </p>
            <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
              Contributions · last 12 months
            </p>
          </Reveal>

          <Reveal delay={0.1} blur={false} className="mt-8 sm:mt-10">
            {days ? (
              <ContributionMesh days={days} label={summary} />
            ) : (
              <div className="bg-muted aspect-[4/3] w-full animate-pulse rounded-2xl sm:aspect-[21/9]" />
            )}
          </Reveal>

          <Stagger className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-3 sm:gap-8">
            <Stat
              label="Total"
              value={days ? fmt.format(total) : "—"}
              note={stats ? `${stats.active} active days` : undefined}
            />
            <Stat
              label="Longest streak"
              value={stats ? `${stats.longest}d` : "—"}
              note={stats ? "consecutive days" : undefined}
            />
            <Stat
              label="Best day"
              value={stats?.best ? fmt.format(stats.best.count) : "—"}
              note={stats?.best ? shortDate(stats.best.date) : undefined}
            />
          </Stagger>
        </>
      )}
    </section>
  )
}

export default GitHubActivity
