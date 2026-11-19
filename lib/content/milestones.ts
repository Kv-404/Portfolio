export type Achievement = {
  title: string
  /** Detail page at /projects/[slug]. */
  slug: string
  date: string
  description: string
}

/**
 * The two showcase projects, newest first. Both have detail pages at
 * /projects/[slug]. The hero counts this list for "Projects shipped".
 */
export const achievements: Achievement[] = [
  {
    title: "Image to Poem",
    slug: "image-to-poem",
    date: "Nov 2026",
    description: "Photo in, caption, mood and an eight-line poem out. Offline, about seven seconds on a laptop.",
  },
  {
    title: "Aayam",
    slug: "aayam",
    date: "Oct 2026",
    description: "A live college timetable platform synced with official spreadsheets and calendar export.",
  },
]
