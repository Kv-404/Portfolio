import Link from "next/link"

import { sectionIds } from "@/lib/content/site"

export function CTA() {
  return (
    <div id={sectionIds.contact} className="max-w-xl">
      <p className="text-muted-foreground text-base leading-relaxed">
        The work is the introduction. A note is enough after that.
      </p>
      <Link
        href="/contact"
        className="focus-visible:ring-ring/50 mt-4 inline-flex min-h-11 items-center text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-[3px]"
      >
        Write to me
      </Link>
    </div>
  )
}

export default CTA
