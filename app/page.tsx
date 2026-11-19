import { Hero } from "@/components/home/hero"
import { ProjectsSection } from "@/components/home/projects-section"
import { Record } from "@/components/home/record"
import { GitHubActivity } from "@/components/home/github-activity"
import { CTA } from "@/components/home/cta"

/** Hero, then four numbered sections. */
export default function HomePage() {
  return (
    <main className="flex flex-col gap-24 sm:gap-32">
      <Hero />
      <ProjectsSection index="01" />
      <Record index="02" />
      <GitHubActivity index="03" />
      <CTA index="04" />
    </main>
  )
}
