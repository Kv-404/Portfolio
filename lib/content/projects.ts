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
    slug: "aayam",
    title: "Aayam",
    subheading: "Live college timetable platform",
    description:
      "A live timetable application reading university spreadsheets in real-time, with cohort PIN access, Google OAuth faculty auth, and calendar export.",
    image: "/covers/aayam.svg",
    links: {
      website: "https://Aayam.kv404.dev",
      github: "https://github.com/Kv-404/Aayam",
    },
    technologies: ["React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Node.js"],
    status: "live",
  },
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
