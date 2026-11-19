import { ArrowDown, ArrowRight } from "lucide-react"
import { Fragment } from "react"

import { Stagger, StaggerItem } from "@/components/motion"
import type { DiagramStage } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/**
 * Pipeline diagram in plain HTML. Stages run left → right on wide
 * screens and top → bottom on narrow ones; nodes inside a stage stack.
 * Filled nodes are the emphasised parts (built/trained by me, or the
 * hot path); outlined nodes are inputs, outputs or pretrained parts.
 */
export function ProjectDiagram({ stages, caption }: { stages: DiagramStage[]; caption: string }) {
  return (
    <figure className="bg-card rounded-[24px] border p-4 shadow-soft sm:p-6">
      <Stagger
        gap={0.07}
        className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:gap-1.5"
      >
        {stages.map((stage, i) => (
          <Fragment key={i}>
            {i > 0 ? (
              <StaggerItem className="text-subtle-foreground flex shrink-0 items-center justify-center" >
                <ArrowDown aria-hidden className="size-4 lg:hidden" />
                <ArrowRight aria-hidden className="hidden size-4 lg:block" />
              </StaggerItem>
            ) : null}
            <StaggerItem className="flex min-w-0 flex-1 flex-col gap-2">
              {stage.nodes.map((node) => (
                <div
                  key={node.title}
                  className={cn(
                    "flex flex-col gap-1 rounded-2xl border px-3.5 py-3",
                    node.emphasis
                      ? "bg-foreground text-background border-transparent"
                      : "bg-background"
                  )}
                >
                  <span className="text-[14px] leading-tight font-semibold tracking-[-0.01em] text-balance">
                    {node.title}
                  </span>
                  {node.detail ? (
                    <span
                      className={cn(
                        "text-[12.5px] leading-snug text-pretty",
                        node.emphasis ? "text-background/70" : "text-muted-foreground"
                      )}
                    >
                      {node.detail}
                    </span>
                  ) : null}
                  {node.tag ? (
                    <span
                      className={cn(
                        "mt-1 font-mono text-[9.5px] tracking-[0.14em] uppercase",
                        node.emphasis ? "text-background/60" : "text-subtle-foreground"
                      )}
                    >
                      {node.tag}
                    </span>
                  ) : null}
                </div>
              ))}
            </StaggerItem>
          </Fragment>
        ))}
      </Stagger>
      <figcaption className="text-muted-foreground mt-5 border-t pt-4 text-sm leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  )
}

export default ProjectDiagram
