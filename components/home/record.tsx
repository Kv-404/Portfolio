import { ArrowUpRight } from "lucide-react"

import { Stagger, StaggerItem } from "@/components/motion"
import { SectionHeading } from "@/components/layout/section-heading"
import { experiences } from "@/lib/content/experience"
import { achievements } from "@/lib/content/milestones"
import { sectionIds } from "@/lib/content/site"
import { cn } from "@/lib/utils"

const EXPO = "ease-[var(--ease-out)]"

/** Hairline that draws itself left to right while the row has attention. */
function DrawLine() {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-foreground absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 transition-transform duration-700",
        EXPO,
        "group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      )}
    />
  )
}

/**
 * Poster row: a big tabular numeral, the name in display weight with a
 * short muted note, and the date set small in mono on the right.
 */
function ShippedRow({
  n,
  title,
  note,
  date,
}: {
  n: number
  title: string
  note: string
  date: string
}) {
  return (
    <StaggerItem as="li" className="group relative border-b">
      <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 py-5 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:py-6">
        <span
          aria-hidden
          className={cn(
            "display text-subtle-foreground text-2xl tabular-nums transition-colors duration-700 sm:text-[2.5rem]",
            EXPO,
            "group-hover:text-foreground"
          )}
        >
          {String(n).padStart(2, "0")}
        </span>
        <div
          className={cn(
            "min-w-0 transition-transform duration-700",
            EXPO,
            "group-hover:translate-x-2 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          )}
        >
          <h3 className="display text-xl sm:text-[1.75rem]">{title}</h3>
          <p className="text-muted-foreground mt-2 max-w-[56ch] text-[15px] leading-relaxed text-pretty">
            {note}
          </p>
          <p className="text-muted-foreground mt-3 font-mono text-[10px] tracking-[0.18em] tabular-nums uppercase sm:hidden">
            {date}
          </p>
        </div>
        <span className="text-muted-foreground hidden self-start pt-2 text-right font-mono text-[11px] tracking-[0.18em] whitespace-nowrap tabular-nums uppercase sm:block">
          {date}
        </span>
      </div>
      <DrawLine />
    </StaggerItem>
  )
}

/** What I'm doing right now: two quiet cards above the numbered list. */
function NowCard({
  role,
  company,
  location,
  period,
  href,
  current,
}: {
  role: string
  company: string
  location: string
  period: string
  href?: string
  current?: boolean
}) {
  const body = (
    <>
      <div className="text-muted-foreground flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.18em] uppercase">
        <span className="flex items-center gap-2">
          {current ? <span aria-hidden className="bg-foreground size-1.5 rounded-full" /> : null}
          {current ? "Now" : "Ongoing"}
        </span>
        <span className="tabular-nums">{period}</span>
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-lg font-semibold tracking-[-0.02em]">
        {company}
        {href ? (
          <ArrowUpRight
            aria-hidden
            className={cn(
              "size-4 -translate-x-1 opacity-0 transition-[opacity,translate] duration-700",
              EXPO,
              "group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
            )}
          />
        ) : null}
      </p>
      <p className="text-muted-foreground mt-1 text-[15px]">
        {role} · {location}
      </p>
    </>
  )

  const cls = cn(
    "group bg-card shadow-soft block h-full rounded-2xl border p-5 outline-none transition-[translate] duration-700",
    EXPO
  )

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        cls,
        "hover:-translate-y-1 focus-visible:ring-ring/50 focus-visible:ring-[3px] motion-reduce:hover:translate-y-0"
      )}
    >
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  )
}

export function Record({ index = "02" }: { index?: string }) {
  return (
    <section aria-labelledby={sectionIds.experience}>
      <SectionHeading
        id={sectionIds.experience}
        index={index}
        label="Record"
        title="Shipped, in order."
        action={
          <span className="font-mono text-[11px] tabular-nums">
            {String(achievements.length).padStart(2, "0")} entries
          </span>
        }
      />

      <Stagger as="ul" gap={0.1} className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {experiences.map((e) => (
          <StaggerItem as="li" key={e.id}>
            <NowCard
              role={e.role}
              company={e.company}
              location={e.location}
              period={`${e.period.start} – ${e.period.end ?? "Present"}`}
              href={e.website}
              current={e.isCurrent}
            />
          </StaggerItem>
        ))}
      </Stagger>

      <Stagger as="ul" gap={0.09} className="mt-12 border-t sm:mt-16">
        {achievements.map((a, i) => (
          <ShippedRow key={a.title} n={i + 1} title={a.title} note={a.description} date={a.date} />
        ))}
      </Stagger>
    </section>
  )
}

export default Record
