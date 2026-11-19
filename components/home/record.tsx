import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion"
import { SectionHeading } from "@/components/layout/section-heading"
import { achievements } from "@/lib/content/milestones"
import { bio } from "@/lib/content/profile"
import { projects } from "@/lib/content/projects"
import { sectionIds } from "@/lib/content/site"
import { cn } from "@/lib/utils"

const EXPO = "ease-[var(--ease-out)]"

/** Small mono caption used for every sub-block in this section. */
function Caption({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-subtle-foreground font-mono text-[11px] tracking-[0.18em] uppercase",
        className
      )}
    >
      {children}
    </p>
  )
}

/** Renders a bio line with its `strong` fragments lifted to full ink. */
function BioLine({ text, strong = [] }: { text: string; strong?: string[] }) {
  if (!strong.length) return <>{text}</>
  const pattern = new RegExp(
    `(${strong.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`
  )
  return (
    <>
      {text.split(pattern).map((part, i) =>
        strong.includes(part) ? (
          <strong key={i} className="text-foreground font-medium">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

const now = [
  {
    verb: "Studying",
    title: "B.Tech in Computer Science",
    note: "Cybersecurity and computer networking, in Mumbai.",
    meta: "Since 2025",
  },
  {
    verb: "Building",
    title: "Aayam",
    note: "The live timetable for my college, synced from its sheets.",
    meta: "Live",
  },
  {
    verb: "Exploring",
    title: "On-device ML",
    note: "Small models that run offline on a laptop CPU.",
    meta: "Ongoing",
  },
]

const focus = [
  {
    area: "Security",
    note: "What a program stores, sends, and keeps to itself.",
    tools: ["Linux", "Cryptography", "Wireshark"],
  },
  {
    area: "Networking",
    note: "Packets, protocols, and where they quietly fail.",
    tools: ["TCP/IP", "DNS", "Wireshark"],
  },
  {
    area: "Machine learning",
    note: "Training small models myself, and saying which parts aren’t.",
    tools: ["PyTorch", "scikit-learn", "LoRA"],
  },
  {
    area: "Web",
    note: "Readable interfaces, served from the edge.",
    tools: ["TypeScript", "React", "Cloudflare Workers"],
  },
]

const selected = achievements.map((a) => {
  const project = projects.find((p) => p.slug === a.slug)
  return { ...a, label: project?.statusLabel ?? "", subheading: project?.subheading ?? a.description }
})

/** Two real ships, each opening its own case study. */
function SelectedRow({
  slug,
  title,
  subheading,
  date,
  label,
}: {
  slug: string
  title: string
  subheading: string
  date: string
  label: string
}) {
  return (
    <StaggerItem as="li" className="border-b">
      <Link
        href={`/projects/${slug}`}
        className="group focus-visible:ring-ring/50 relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 rounded-sm py-4 outline-none focus-visible:ring-[3px]"
      >
        <span
          className={cn(
            "min-w-0 transition-transform duration-700 group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0",
            EXPO
          )}
        >
          <span className="block text-[17px] font-semibold tracking-[-0.02em]">{title}</span>
          <span className="text-muted-foreground mt-0.5 block truncate text-sm">{subheading}</span>
        </span>
        <span className="text-muted-foreground group-hover:text-foreground flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] whitespace-nowrap tabular-nums uppercase transition-colors duration-500">
          <span className="hidden sm:inline">{label}</span>
          <span>{date}</span>
          <ArrowUpRight
            aria-hidden
            className={cn(
              "size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
              EXPO
            )}
          />
        </span>
        <span
          aria-hidden
          className={cn(
            "bg-foreground absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none",
            EXPO
          )}
        />
      </Link>
    </StaggerItem>
  )
}

/**
 * About / Now. Who Kv is on the left, what he's on right now and the two
 * projects worth opening on the right, then four focus areas underneath.
 */
export function Record({ index = "02" }: { index?: string }) {
  return (
    <section aria-labelledby={sectionIds.experience}>
      <SectionHeading
        id={sectionIds.experience}
        index={index}
        label="About"
        title="Learning how systems hold up."
        action={<span className="font-mono text-[11px]">Mumbai · IST</span>}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <Stagger gap={0.1} className="space-y-5 lg:col-span-6">
          {bio.map((line, i) => (
            <StaggerItem
              as="p"
              key={i}
              className={cn(
                "max-w-[52ch] text-pretty",
                i === 0
                  ? "text-foreground text-xl leading-snug font-medium tracking-[-0.02em] sm:text-[1.375rem]"
                  : "text-muted-foreground text-[15px] leading-relaxed sm:text-base"
              )}
            >
              <BioLine text={line.text} strong={line.strong} />
            </StaggerItem>
          ))}
          <StaggerItem as="p" className="text-muted-foreground max-w-[52ch] text-[15px] leading-relaxed text-pretty sm:text-base">
            Lately that has meant{" "}
            <strong className="text-foreground font-medium">machine learning</strong>: Image to
            Poem trains a mood classifier from scratch and fine-tunes a small language model,
            all running offline.
          </StaggerItem>
        </Stagger>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal blur={false} y={12}>
            <Caption className="flex items-center gap-2">
              <span aria-hidden className="relative flex size-1.5">
                <span className="bg-foreground absolute inset-0 animate-ping rounded-full opacity-40 motion-reduce:hidden" />
                <span className="bg-foreground relative size-1.5 rounded-full" />
              </span>
              Now
            </Caption>
          </Reveal>
          <Stagger as="ul" gap={0.08} className="mt-4 border-t">
            {now.map((item) => (
              <StaggerItem
                as="li"
                key={item.verb}
                className="group grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-4 border-b py-3.5 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto]"
              >
                <span className="text-subtle-foreground group-hover:text-foreground pt-[3px] font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-500">
                  {item.verb}
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold tracking-[-0.015em]">{item.title}</span>
                  <span className="text-muted-foreground mt-0.5 block text-sm leading-snug">{item.note}</span>
                </span>
                <span className="text-subtle-foreground hidden pt-[3px] font-mono text-[11px] tracking-[0.12em] tabular-nums uppercase sm:block">
                  {item.meta}
                </span>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal blur={false} y={12} className="mt-9">
            <Caption>Selected</Caption>
          </Reveal>
          <Stagger as="ul" gap={0.08} className="mt-2">
            {selected.map((s) => (
              <SelectedRow
                key={s.slug}
                slug={s.slug}
                title={s.title}
                subheading={s.subheading}
                date={s.date}
                label={s.label}
              />
            ))}
          </Stagger>
        </div>
      </div>

      <Reveal blur={false} y={12} className="mt-12 sm:mt-14">
        <Caption>Focus</Caption>
      </Reveal>
      <Stagger
        as="ul"
        gap={0.08}
        className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        {focus.map((f, i) => (
          <StaggerItem as="li" key={f.area} className="group relative border-t py-5">
            <span
              aria-hidden
              className={cn(
                "bg-foreground absolute inset-x-0 -top-px h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100 motion-reduce:transition-none",
                EXPO
              )}
            />
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[15px] font-semibold tracking-[-0.015em]">{f.area}</h3>
              <span
                aria-hidden
                className="text-subtle-foreground group-hover:text-foreground font-mono text-[11px] tabular-nums transition-colors duration-500"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm leading-snug text-pretty">{f.note}</p>
            <p className="text-subtle-foreground group-hover:text-muted-foreground mt-3 font-mono text-[11px] leading-relaxed transition-colors duration-500">
              <span className="sr-only">Tools: </span>
              {f.tools.join(" · ")}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export default Record
