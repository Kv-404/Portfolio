"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { RoleCycle } from "@/components/home/role-cycle"
import { TechText } from "@/components/ui/tech-text"
import { profile } from "@/lib/content/profile"

const headline = "Small systems a person can still read a month later."

/** Matches the old text-4xl / sm:text-5xl scale. Canvas type can't use those classes. */
function useHeadlineSize() {
  const [size, setSize] = useState(48)

  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)")
    const apply = () => setSize(query.matches ? 48 : 36)
    apply()
    query.addEventListener("change", apply)
    return () => query.removeEventListener("change", apply)
  }, [])

  return size
}

/**
 * Opening line of the right column. The name and the photo live in the
 * side column, so this does not repeat them.
 *
 * The sentence is drawn by TechText so a word can turn into a dashed
 * outline under the pointer. The same sentence stays in the DOM for the
 * heading and for anyone who doesn't get the canvas.
 */
export function Hero() {
  const fontSize = useHeadlineSize()

  return (
    <header className="max-w-xl pt-2 md:pt-6">
      <p className="text-muted-foreground font-mono text-[11px] tracking-[0.22em] uppercase">
        <RoleCycle roles={profile.roles} />
      </p>
      <h1 className="mt-4 max-w-[12ch] text-4xl font-medium text-neutral-900 sm:max-w-none sm:text-5xl dark:text-neutral-50">
        <span className="sr-only">{headline}</span>
        <TechText
          text={headline}
          decorative
          fit="content"
          fontWeight={500}
          fontSize={fontSize}
          letterSpacing={-0.025}
          reveal="letter"
          dashLength={4}
          dashGap={2}
          specks={15}
          color="currentColor"
          accentColor="currentColor"
        />
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
