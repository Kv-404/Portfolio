import { cn } from "@/lib/utils"

/**
 * Section titles are set large and light, sitting on a full-bleed
 * hairline. The heading level is caller-controlled so page hierarchy
 * stays correct.
 */
export function SectionHeading({
  children,
  id,
  as: Tag = "h2",
  className,
  action,
}: {
  children: React.ReactNode
  id?: string
  as?: "h1" | "h2" | "h3"
  className?: string
  action?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "mb-5 flex w-full items-center justify-between gap-4",
        className
      )}
    >
      <Tag
        id={id}
        className="text-muted-foreground scroll-mt-24 font-mono text-[11px] font-medium tracking-[0.22em] uppercase"
      >
        {children}
      </Tag>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

/** Small uppercase-adjacent label used above page titles. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <p className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.22em] uppercase">
        {children}
      </p>
    </div>
  )
}

export default SectionHeading
