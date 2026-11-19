import { Reveal, TextReveal } from "@/components/motion"
import { cn } from "@/lib/utils"

/**
 * Section masthead: a mono index + label row on a hairline, then a big
 * display title that rises word by word, then optional lede + action.
 *
 *   01 — Work ─────────────────────────────── (action)
 *   Selected projects.
 */
export function SectionHeading({
  title,
  label,
  index,
  id,
  lede,
  action,
  as = "h2",
  className,
}: {
  title: string
  /** Small caps label, e.g. "Work". */
  label: string
  /** "01", "02"… */
  index?: string
  id?: string
  lede?: React.ReactNode
  action?: React.ReactNode
  as?: "h1" | "h2" | "h3"
  className?: string
}) {
  return (
    <div className={cn("mb-8 sm:mb-12", className)}>
      <Reveal
        blur={false}
        y={12}
        className="text-muted-foreground flex items-center gap-3 border-t pt-4 font-mono text-[11px] tracking-[0.18em] uppercase"
      >
        {index ? <span className="text-foreground tabular-nums">{index}</span> : null}
        <span aria-hidden className="bg-border h-px w-6" />
        <span>{label}</span>
        {action ? <span className="ml-auto normal-case tracking-normal">{action}</span> : null}
      </Reveal>
      <div id={id} className="scroll-mt-28">
        <TextReveal
          as={as}
          text={title}
          className="display mt-5 max-w-[20ch] text-[clamp(1.875rem,3.6vw,3rem)] text-balance"
        />
      </div>
      {lede ? (
        <Reveal delay={0.15} className="text-muted-foreground mt-4 max-w-[56ch] text-base leading-relaxed text-pretty">
          {lede}
        </Reveal>
      ) : null}
    </div>
  )
}

/** Small mono label used above page titles. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
      {children}
    </p>
  )
}

export default SectionHeading
