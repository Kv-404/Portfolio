"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { TiltCard } from "@/components/motion"
import type { Project } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/** Small mono status pill. Filled dot for live, hollow otherwise. */
export function StatusPill({ project, className }: { project: Project; className?: string }) {
  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] leading-none tracking-[0.14em] uppercase",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          project.status === "live" ? "bg-foreground" : "border-muted-foreground border"
        )}
      />
      {project.statusLabel}
    </span>
  )
}

/**
 * Medium card: 16/10 cover (grey until hover/focus), title + status,
 * one-line subheading and a quiet tech line. The whole card links to
 * the project's detail page.
 */
export function ProjectCard({
  project,
  index = 0,
  priority = false,
}: {
  project: Project
  index?: number
  priority?: boolean
}) {
  const number = String(index + 1).padStart(2, "0")

  return (
    <div className="h-full [perspective:1600px]">
      <TiltCard max={2.5} className="group/card relative h-full">
        <Link
          href={`/projects/${project.slug}`}
          className="bg-card focus-visible:ring-ring/50 relative flex h-full flex-col overflow-hidden rounded-[24px] border p-2 shadow-soft outline-none transition-[border-color] duration-500 hover:border-foreground/20 focus-visible:ring-[3px]"
        >
          {/* Monochrome spotlight that follows the pointer. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-700 ease-[var(--ease-out)] group-hover/card:opacity-100 bg-[radial-gradient(520px_circle_at_var(--mx,50%)_var(--my,50%),rgb(255_255_255/0.06),transparent_45%)]"
          />

          <span className="bg-muted relative block aspect-[16/10] overflow-hidden rounded-[18px] [clip-path:inset(0_round_18px)]">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              priority={priority}
              sizes="(min-width: 1200px) 560px, (min-width: 768px) 46vw, calc(100vw - 2.5rem)"
              className={cn(
                "object-cover object-top grayscale transition-[scale,filter] duration-700 ease-[var(--ease-out)]",
                "group-hover/card:scale-[1.03] group-hover/card:grayscale-0 group-focus-within/card:grayscale-0",
                "motion-reduce:group-hover/card:scale-100"
              )}
            />
          </span>

          <span className="flex flex-1 flex-col gap-2.5 px-3 pt-4 pb-3 sm:px-4">
            <span className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-baseline gap-3">
                <span className="text-subtle-foreground font-mono text-[11px] tabular-nums">{number}</span>
                <span className="truncate text-xl font-semibold tracking-[-0.02em] sm:text-[22px]">
                  {project.title}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <StatusPill project={project} />
                <ArrowUpRight
                  aria-hidden
                  className="text-muted-foreground group-hover/card:text-foreground size-4 shrink-0 transition-[translate,color] duration-500 ease-[var(--ease-out)] group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                />
              </span>
            </span>
            {project.subheading ? (
              <span className="text-muted-foreground line-clamp-1 text-[15px] leading-snug">
                {project.subheading}
              </span>
            ) : null}
            <span className="text-subtle-foreground mt-auto truncate pt-1 font-mono text-[10.5px] tracking-[0.12em] uppercase">
              <span className="sr-only">Built with </span>
              {project.technologies.slice(0, 4).join(" · ")}
            </span>
          </span>
        </Link>
      </TiltCard>
    </div>
  )
}

export default ProjectCard
