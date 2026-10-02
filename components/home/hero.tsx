import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { RoleCycle } from "@/components/home/role-cycle"
import { profile } from "@/lib/content/profile"

/**
 * Opening line of the right column. The name and the photo live in the
 * side column, so this does not repeat them.
 */
export function Hero() {
  return (
    <header className="max-w-xl pt-2 md:pt-6">
      <p className="text-muted-foreground font-mono text-[11px] tracking-[0.22em] uppercase">
        <RoleCycle roles={profile.roles} />
      </p>
      <h1 className="mt-4 max-w-[12ch] text-4xl leading-[1.05] font-medium tracking-tight text-neutral-900 sm:max-w-none sm:text-5xl dark:text-neutral-50">
        Small systems a person can still read a month later.
      </h1>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-visible:ring-ring/50 inline-flex min-h-11 items-center gap-1 text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-[3px]"
        >
          GitHub
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
        <Link
          href="/contact"
          className="focus-visible:ring-ring/50 text-muted-foreground hover:text-foreground inline-flex min-h-11 items-center text-sm underline-offset-4 outline-none hover:underline focus-visible:ring-[3px]"
        >
          Get in touch
        </Link>
      </div>
    </header>
  )
}

export default Hero
