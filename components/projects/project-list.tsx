"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { ProjectGrid } from "@/components/projects/project-grid"
import { projects } from "@/lib/content/projects"

export function ProjectList() {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return projects

    return projects.filter((project) =>
      [project.title, project.subheading ?? "", project.description, project.statusLabel, ...project.technologies]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    )
  }, [query])

  return (
    <main className="pb-32 sm:pb-44">
      <PageHeader
        eyebrow="Projects"
        title="Everything I’ve shipped."
        lede="Small systems, each one built to be read. Hover a card to bring it into colour, open it for how it works."
      />

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-t pt-5 sm:mb-14">
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase" aria-live="polite">
          <span className="text-foreground tabular-nums">{String(filtered.length).padStart(2, "0")}</span>
          {" / "}
          {String(projects.length).padStart(2, "0")} projects
        </p>
        <div className="bg-card focus-within:ring-ring/50 relative flex h-11 w-full items-center rounded-full border transition-shadow duration-500 ease-[var(--ease-out)] focus-within:ring-[3px] sm:w-72">
          <Search className="text-muted-foreground ml-4 size-4 shrink-0" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
            className="placeholder:text-subtle-foreground h-full w-full min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="hover:bg-accent text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 mr-1.5 flex size-8 shrink-0 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-[3px]"
            >
              <X className="size-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      <ProjectGrid projects={filtered} />
    </main>
  )
}

export default ProjectList
