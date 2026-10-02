export type Experience = {
  id: string
  company: string
  role: string
  location: string
  /** Rendered as "start - end"; omit `end` for an ongoing role. */
  period: { start: string; end?: string }
  logo?: string
  website?: string
  isCurrent?: boolean
}

export const experiences: Experience[] = [
  {
    id: "cse",
    company: "Computer Science",
    role: "Undergraduate",
    location: "Mumbai",
    period: { start: "2025" },
    isCurrent: true,
    website: "https://kv404.dev",
  },
  {
    id: "independent",
    company: "Independent",
    role: "Small systems",
    location: "Public on GitHub",
    period: { start: "Apr 2025" },
    website: "https://github.com/Kv-404",
  },
]
