import { ProjectCard } from "@/components/projects/project-card"
import type { Project } from "@/lib/content/projects"

/** One column until there is room for two, with space between them. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-muted-foreground py-12 text-sm">
        No projects match that search.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}

export default ProjectGrid
