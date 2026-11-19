import { Stagger, StaggerItem } from "@/components/motion"
import { ProjectCard } from "@/components/projects/project-card"
import type { Project } from "@/lib/content/projects"

/** Two-column grid of medium cards, rising in one after another. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground border-t py-16 text-lg">
        Nothing matches that search.
      </p>
    )
  }

  return (
    <Stagger as="ul" gap={0.1} className="grid gap-5 md:grid-cols-2 md:gap-6">
      {projects.map((project, i) => (
        <StaggerItem as="li" key={project.slug} className="min-w-0">
          <ProjectCard project={project} index={i} priority={i < 2} />
        </StaggerItem>
      ))}
    </Stagger>
  )
}

export default ProjectGrid
