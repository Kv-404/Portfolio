"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/** Small sticky contents list that tracks the section in view. */
export function ProjectToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)

  useEffect(() => {
    const els = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-20% 0px -65% 0px" }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="text-subtle-foreground mb-4 font-mono text-[10.5px] tracking-[0.18em] uppercase">
        On this page
      </p>
      <ol className="flex flex-col gap-0.5 border-l">
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "focus-visible:ring-ring/50 -ml-px block rounded-r-md border-l py-1.5 pl-4 text-[13.5px] outline-none transition-colors duration-300 focus-visible:ring-[3px]",
                  isActive
                    ? "border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground border-transparent"
                )}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default ProjectToc
