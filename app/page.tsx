import { Hero } from "@/components/home/hero"
import { About } from "@/components/home/about"
import { ExperienceSection } from "@/components/home/experience"
import { ProjectsSection } from "@/components/home/projects-section"
import { Stack } from "@/components/home/stack"
import { GitHubActivity } from "@/components/home/github-activity"
import { Achievements } from "@/components/home/milestones"
import { CTA } from "@/components/home/cta"

export default function HomePage() {
  return (
    <main className="flex flex-col gap-20">
      <Hero />
      <About />
      <ExperienceSection />
      <GitHubActivity />
      <ProjectsSection />
      <Stack />
      <Achievements />
      <CTA />
    </main>
  )
}
