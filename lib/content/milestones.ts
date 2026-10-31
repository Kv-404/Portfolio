export type Achievement = {
  title: string
  date: string
  description: string
}

/** Real ships, dated from the public repos. Not awards. */
export const achievements: Achievement[] = [
  {
    title: "Shipped Aayam",
    date: "Oct 2026",
    description: "A live college timetable platform synced with official spreadsheets and calendar export.",
  },
  {
    title: "Shipped Syntrix",
    date: "Jun 2026",
    description: "A modular synthesizer that runs entirely in the browser.",
  },
  {
    title: "Shipped Clock-It",
    date: "Apr 2026",
    description: "A browser clock, TypeScript for the time and GLSL for the drawing.",
  },
  {
    title: "Shipped BuzzLink",
    date: "Jun 2026",
    description: "A C++ social graph: trie, graph, search, and the queues that hold it.",
  },
  {
    title: "Shipped RenewYou",
    date: "Mar 2026",
    description: "A calm front-end, HTML, CSS, and JavaScript, published on GitHub Pages.",
  },
]
