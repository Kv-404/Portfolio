export type Project = {
  slug: string
  title: string
  subheading?: string
  description: string
  image: string
  /** Optional clip played on hover, with `image` as the poster frame. */
  video?: string
  links: { website?: string; github?: string }
  technologies: string[]
  status: "live" | "building"
}

/**
 * Order matters: the home page shows the first two, and the projects
 * page lists all of them.
 */
export const projects: Project[] = [
  {
    slug: "clock-it",
    title: "Clock-It",
    subheading: "A clock drawn with shaders",
    description:
      "A browser clock. TypeScript holds the time, GLSL draws it. The page is the whole product.",
    image: "/covers/clock-it.svg",
    links: {
      website: "https://clock-it-coral.vercel.app",
      github: "https://github.com/Kv-404/Clock-It",
    },
    technologies: ["TypeScript", "GLSL", "CSS"],
    status: "live",
  },
]
