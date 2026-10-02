import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Eyebrow } from "@/components/layout/section-heading"

/**
 * Masthead for the inner pages. Same quiet label as the home sections,
 * then the title, then a way back.
 */
export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string
  title: string
  action?: React.ReactNode
}) {
  return (
    <header className="mb-10">
      <Eyebrow>{eyebrow}</Eyebrow>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        {action}
      </div>
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 mt-4 inline-flex min-h-11 items-center gap-2 text-sm outline-none focus-visible:ring-[3px]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Home
      </Link>
    </header>
  )
}

export default PageHeader
