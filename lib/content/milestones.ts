export type Achievement = {
  title: string
  date: string
  description: string
}

/** Real ships, dated from the public repos. Not awards. */
export const achievements: Achievement[] = [
  {
    title: "Image to Poem",
    date: "Nov 2026",
    description: "Photo in, caption, mood and an eight-line poem out. Offline, about seven seconds on a laptop.",
  },
  {
    title: "Aayam",
    date: "Oct 2026",
    description: "A live college timetable platform synced with official spreadsheets and calendar export.",
  },
  {
    title: "Syntrix",
    date: "Jun 2026",
    description: "A modular synthesizer that runs entirely in the browser.",
  },
  {
    title: "BuzzLink",
    date: "Jun 2026",
    description: "A C++ social graph: trie, graph, search, and the queues that hold it.",
  },
  {
    title: "RenewYou",
    date: "Mar 2026",
    description: "A calm front-end, HTML, CSS, and JavaScript, published on GitHub Pages.",
  },
]
