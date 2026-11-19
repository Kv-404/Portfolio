import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Reveal, TextReveal } from "@/components/motion"
import { Eyebrow } from "@/components/layout/section-heading"

/** Masthead for inner pages: back link, eyebrow, huge title, lede. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow: string
  title: string
  lede?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <header className="pt-32 pb-12 sm:pt-36 sm:pb-16">
      <Reveal blur={false} y={8}>
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 group mb-8 inline-flex items-center gap-2 rounded-full text-sm transition-colors outline-none focus-visible:ring-[3px]"
        >
          <ArrowLeft className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-x-1" aria-hidden />
          Home
        </Link>
        <Eyebrow>{eyebrow}</Eyebrow>
      </Reveal>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <TextReveal
          as="h1"
          animateOnMount
          delay={0.1}
          text={title}
          className="display max-w-[16ch] text-[clamp(2.25rem,5.5vw,4.25rem)] text-balance"
        />
        {action}
      </div>
      {lede ? (
        <Reveal delay={0.3} className="text-muted-foreground mt-5 max-w-[56ch] text-base leading-relaxed sm:text-lg">
          {lede}
        </Reveal>
      ) : null}
    </header>
  )
}

export default PageHeader
