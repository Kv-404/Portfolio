import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/layout/section-heading"
import { ProjectGrid } from "@/components/projects/project-grid"
import { projects } from "@/lib/content/projects"
import { sectionIds } from "@/lib/content/site"

export function ProjectsSection({ index = "01" }: { index?: string }) {
  return (
    <section aria-labelledby={sectionIds.projects}>
      <SectionHeading
        id={sectionIds.projects}
        index={index}
        label="Work"
        title="Selected work."
        lede="Two things I built end to end. Open one for the full story."
        action={
          <Link
            href="/projects"
            className="hover:text-foreground focus-visible:ring-ring/50 group inline-flex items-center gap-1.5 rounded-sm font-mono text-[11px] tracking-[0.18em] uppercase outline-none transition-colors focus-visible:ring-[3px]"
          >
            All projects
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5"
            />
          </Link>
        }
      />
      <ProjectGrid projects={projects.slice(0, 2)} />
    </section>
  )
}

export default ProjectsSection
