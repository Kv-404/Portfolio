import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"

import { Reveal, Stagger, StaggerItem, TextReveal } from "@/components/motion"
import { StatusPill } from "@/components/projects/project-card"
import { ProjectDiagram } from "@/components/projects/project-diagram"
import { ProjectGallery } from "@/components/projects/project-gallery"
import { ProjectToc } from "@/components/projects/project-toc"
import { getProject, projects, type Project } from "@/lib/content/projects"
import { siteUrl } from "@/lib/content/site"
import { cn } from "@/lib/utils"

type Params = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}

  const url = `${siteUrl}/projects/${project.slug}`
  const title = `${project.title} — ${project.subheading ?? "Project"}`
  const image = {
    url: `${siteUrl}${project.cover.src}`,
    width: project.cover.width,
    height: project.cover.height,
    alt: project.cover.alt,
  }

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: project.description,
      url,
      type: "article",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      images: [image.url],
    },
  }
}

const toc = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "The problem" },
  { id: "how-it-works", label: "How it works" },
  { id: "features", label: "Key features" },
  { id: "stack", label: "Tech stack" },
  { id: "results", label: "Numbers" },
  { id: "gallery", label: "Screenshots" },
  { id: "learnings", label: "What I learned" },
]

function ExternalButton({
  href,
  children,
  primary = false,
}: {
  href: string
  children: React.ReactNode
  primary?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/btn focus-visible:ring-ring/50 inline-flex h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium outline-none transition-[background-color,border-color,color] duration-300 focus-visible:ring-[3px]",
        primary
          ? "bg-foreground text-background hover:bg-foreground/85"
          : "bg-card hover:border-foreground/30 border"
      )}
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string
  index: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t pt-6 sm:pt-8">
      <Reveal blur={false} y={14} className="mb-6 flex items-baseline gap-4 sm:mb-8">
        <span className="text-subtle-foreground font-mono text-[11px] tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-[-0.03em] sm:text-[28px]">
          {title}
        </h2>
      </Reveal>
      {children}
    </section>
  )
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <Reveal blur={false} y={18} className="flex max-w-[65ch] flex-col gap-5">
      {paragraphs.map((p) => (
        <p key={p} className="text-muted-foreground text-[17px] leading-[1.7] text-pretty">
          {p}
        </p>
      ))}
    </Reveal>
  )
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const index = projects.indexOf(project)
  const next: Project | undefined =
    projects.length > 1 ? projects[(index + 1) % projects.length] : undefined
  const { website, github } = project.links

  return (
    <main className="pb-28 sm:pb-40">
      {/* Header */}
      <header className="pt-32 pb-10 sm:pt-40 sm:pb-14">
        <Reveal blur={false} y={8}>
          <Link
            href="/projects"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 group mb-8 inline-flex items-center gap-2 rounded-full text-sm transition-colors outline-none focus-visible:ring-[3px]"
          >
            <ArrowLeft
              aria-hidden
              className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-x-1"
            />
            All projects
          </Link>
          <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
            Project {String(index + 1).padStart(2, "0")} · {project.year}
          </p>
        </Reveal>

        <TextReveal
          as="h1"
          animateOnMount
          delay={0.1}
          text={project.title}
          className="display mt-4 text-[clamp(2.5rem,6.5vw,4.75rem)] text-balance"
        />
        {project.subheading ? (
          <Reveal delay={0.25} className="text-muted-foreground mt-4 max-w-[40ch] text-lg leading-snug text-pretty sm:text-2xl">
            {project.subheading}
          </Reveal>
        ) : null}

        <Reveal delay={0.35} className="mt-8 flex flex-wrap items-center gap-3">
          {website ? (
            <ExternalButton href={website} primary>
              Visit live
            </ExternalButton>
          ) : null}
          {github ? (
            <ExternalButton href={github} primary={!website}>
              View source
            </ExternalButton>
          ) : null}
          {!website ? (
            <span className="text-muted-foreground text-sm">Not hosted — runs locally from source.</span>
          ) : null}
        </Reveal>

        <Reveal delay={0.45} blur={false} y={12}>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y py-5 sm:grid-cols-4">
            {[
              { term: "Year", value: project.year },
              { term: "Role", value: project.role },
              { term: "Status", value: <StatusPill project={project} /> },
              { term: "Stack", value: project.technologies.slice(0, 3).join(", ") },
            ].map((item) => (
              <div key={item.term} className="flex min-w-0 flex-col gap-1.5">
                <dt className="text-subtle-foreground font-mono text-[10.5px] tracking-[0.16em] uppercase">
                  {item.term}
                </dt>
                <dd className="text-[15px] leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </header>

      {/* Cover */}
      <Reveal y={36} amount={0.05}>
        <div className="bg-card rounded-[24px] border p-1.5 shadow-soft sm:rounded-[28px] sm:p-2">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            priority
            sizes="(min-width: 1200px) 1120px, calc(100vw - 2.5rem)"
            className="h-auto w-full rounded-[18px] sm:rounded-[22px]"
          />
        </div>
      </Reveal>

      {/* Body */}
      <div className="mt-16 grid gap-12 sm:mt-24 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <ProjectToc items={toc} />
        </aside>

        <div className="flex min-w-0 flex-col gap-16 sm:gap-24">
          <Section id="overview" index={1} title="Overview">
            <Prose paragraphs={project.overview} />
          </Section>

          <Section id="problem" index={2} title="The problem">
            <Prose paragraphs={project.problem} />
          </Section>

          <Section id="how-it-works" index={3} title="How it works">
            {project.howItWorks.intro ? <Prose paragraphs={[project.howItWorks.intro]} /> : null}
            {project.howItWorks.diagram ? (
              <Reveal blur={false} y={24} amount={0.1} className="mt-10">
                <ProjectDiagram
                  stages={project.howItWorks.diagram.stages}
                  caption={project.howItWorks.diagram.caption}
                />
              </Reveal>
            ) : null}
            <Stagger as="ul" gap={0.06} className="mt-10 flex max-w-[70ch] flex-col">
              {project.howItWorks.steps.map((step, i) => (
                <StaggerItem
                  as="li"
                  key={step.title}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-t py-6 first:border-t-0 first:pt-0"
                >
                  <span className="text-foreground font-mono text-[12px] tabular-nums pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{step.title}</h3>
                    <p className="text-muted-foreground text-[16px] leading-[1.7] text-pretty">{step.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </Section>

          <Section id="features" index={4} title="Key features">
            <Stagger as="ul" gap={0.06} className="grid gap-4 sm:grid-cols-2">
              {project.features.map((feature) => (
                <StaggerItem
                  as="li"
                  key={feature.title}
                  className="bg-card flex flex-col gap-2 rounded-[20px] border p-5 shadow-soft"
                >
                  <h3 className="text-[16px] font-semibold tracking-[-0.01em]">{feature.title}</h3>
                  <p className="text-muted-foreground text-[15px] leading-relaxed text-pretty">{feature.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </Section>

          <Section id="stack" index={5} title="Tech stack">
            <Reveal blur={false} y={18}>
              <dl className="flex flex-col">
                {project.stack.map((group) => (
                  <div
                    key={group.group}
                    className="grid gap-2 border-t py-4 first:border-t-0 first:pt-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-6"
                  >
                    <dt className="text-subtle-foreground pt-1.5 font-mono text-[10.5px] tracking-[0.16em] uppercase">
                      {group.group}
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span key={item} className="bg-card rounded-full border px-3 py-1 text-[14px]">
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Section>

          <Section id="results" index={6} title="Numbers">
            <Stagger as="ul" gap={0.05} className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border bg-border md:grid-cols-3">
              {project.results.stats.map((stat) => (
                <StaggerItem as="li" key={stat.label} className="bg-card flex flex-col gap-2 p-5 sm:p-6">
                  <span className="text-[clamp(1.4rem,3.2vw,2rem)] leading-none font-semibold tracking-[-0.03em] tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground text-[13.5px] leading-snug text-pretty">{stat.label}</span>
                </StaggerItem>
              ))}
            </Stagger>
            {project.results.notes?.length ? (
              <Reveal blur={false} y={16} className="mt-8 max-w-[65ch]">
                <ul className="flex flex-col gap-3">
                  {project.results.notes.map((note) => (
                    <li key={note} className="text-muted-foreground flex gap-3 text-[16px] leading-[1.7]">
                      <span aria-hidden className="bg-foreground mt-[0.75em] h-px w-3 shrink-0" />
                      <span className="text-pretty">{note}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </Section>

          <Section id="gallery" index={7} title="Screenshots">
            <ProjectGallery images={project.gallery} />
          </Section>

          <Section id="learnings" index={8} title="What I learned">
            <Stagger as="ul" gap={0.06} className="flex max-w-[65ch] flex-col gap-5">
              {project.learnings.map((learning, i) => (
                <StaggerItem as="li" key={learning} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4">
                  <span className="text-subtle-foreground pt-1 font-mono text-[12px] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[17px] leading-[1.7] text-pretty">{learning}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </Section>

          {/* Footer nav */}
          <nav aria-label="More projects" className="flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/projects"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 group inline-flex items-center gap-2 rounded-full text-sm transition-colors outline-none focus-visible:ring-[3px]"
            >
              <ArrowLeft
                aria-hidden
                className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-x-1"
              />
              All projects
            </Link>
            {next && next.slug !== project.slug ? (
              <Link
                href={`/projects/${next.slug}`}
                className="bg-card hover:border-foreground/30 focus-visible:ring-ring/50 group flex items-center justify-between gap-6 rounded-[20px] border px-5 py-4 shadow-soft outline-none transition-colors focus-visible:ring-[3px] sm:min-w-[320px]"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-subtle-foreground font-mono text-[10.5px] tracking-[0.16em] uppercase">
                    Next project
                  </span>
                  <span className="truncate text-lg font-semibold tracking-[-0.02em]">{next.title}</span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-4 shrink-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1"
                />
              </Link>
            ) : null}
          </nav>
        </div>
      </div>
    </main>
  )
}
