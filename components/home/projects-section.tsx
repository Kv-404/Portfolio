import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { SectionHeading } from "@/components/layout/section-heading"
import { ProjectGrid } from "@/components/projects/project-grid"
import { projects } from "@/lib/content/projects"
import { sectionIds } from "@/lib/content/site"

export function ProjectsSection() {
  return (
    <section aria-labelledby={sectionIds.projects}>
      <SectionHeading id={sectionIds.projects}>Projects</SectionHeading>
      <ProjectGrid projects={projects.slice(0, 2)} />
      <Link
        href="/projects"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 mt-6 inline-flex min-h-11 items-center gap-1 text-sm underline-offset-4 outline-none hover:underline focus-visible:ring-[3px]"
      >
        All projects
        <ArrowUpRight className="size-4" aria-hidden />
      </Link>
    </section>
  )
}

export default ProjectsSection
