import { SectionHeading } from "@/components/layout/section-heading"
import { achievements } from "@/lib/content/milestones"
import { sectionIds } from "@/lib/content/site"

function Row({
  title,
  meta,
  description,
}: {
  title: string
  meta: string
  description: string
}) {
  return (
    <li className="border-border border-t py-4 first:border-t-0 first:pt-0">
      <div className="max-w-xl">
        <div className="min-w-0 space-y-1">
          {/* No flex-wrap: it let the date drop onto its own line under a
              long title. The title wraps inside its own box instead, and
              the date holds the top right. */}
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="min-w-0 text-base leading-snug font-medium text-balance">
              {title}
            </h3>
            <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
              {meta}
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </li>
  )
}

export function Achievements() {
  return (
    <section aria-labelledby={sectionIds.achievements}>
      <SectionHeading id={sectionIds.achievements}>Shipped</SectionHeading>
      <ul className="pt-px">
        {achievements.map((item) => (
          <Row
            key={item.title}
            title={item.title}
            meta={item.date}
            description={item.description}
          />
        ))}
      </ul>
    </section>
  )
}
