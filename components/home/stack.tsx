import { TechIcon } from "@/components/common/tech-icon"
import { SectionHeading } from "@/components/layout/section-heading"
import { stack } from "@/lib/content/stack"
import { sectionIds } from "@/lib/content/site"

/**
 * One wrapped run of chips, each carrying its brand mark. The category
 * grouping still lives in the content file and orders this list, so the
 * layers read left to right even though the labels are not drawn.
 */
export function Stack() {
  const skills = stack.flatMap((category) => category.skills)

  return (
    <section aria-labelledby={sectionIds.stack}>
      <SectionHeading id={sectionIds.stack}>Skills</SectionHeading>

      <ul className="flex max-w-xl flex-wrap gap-x-2 gap-y-2">
        {skills.map((skill) => (
          <li key={skill.title} className="flex">
            <span className="text-muted-foreground inline-flex items-center gap-1.5 py-1 pr-3 text-sm">
              <TechIcon slug={skill.icon} className="size-3.5 shrink-0" />
              {skill.title}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Stack
