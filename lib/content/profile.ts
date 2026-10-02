export const profile = {
  name: "Kv",
  handle: "Kv-404",
  wordmark: "KV",
  title: "CSE student",
  /** Rotated by the hero typewriter. */
  roles: ["CSE student", "Cybersecurity", "Small systems"],
  meta: "Mumbai, IND",
  location: "Mumbai, India",
  region: "Maharashtra",
  timezone: "Asia/Kolkata",
  /** Mark first; the hero switch flips this with the photo. */
  avatar: "/kv-mark.svg",
  avatarPhoto: "/kv.jpg",
  github: "https://github.com/Kv-404",
  linkedin: "https://www.linkedin.com/in/kv404",
  x: "https://x.com/Kv404_",
  xHandle: "@Kv404_",
  bluesky: "https://bsky.app/profile/kv404.dev",
  instagram: "https://www.instagram.com/theycallmekv__/",
  website: "https://kv404.dev",
  availability: "CSE student in Mumbai",
} as const

/**
 * The About list. `strong` fragments are rendered as emphasised,
 * underlined spans - the same treatment the headline keywords get.
 */
export const bio: { text: string; strong?: string[] }[] = [
  {
    text: "I’m Kv, a computer science student in Mumbai. I build small systems a person can still read a month later.",
  },
  {
    text: "The degree is cybersecurity and computer networking, studied on purpose. A program should say what it keeps: what it stores, what it sends, and what it can finish without calling home.",
    strong: ["cybersecurity and computer networking"],
  },
  {
    text: "Java, Python, and C++ settle the structure. JavaScript and TypeScript take over once the work lives in a browser, with React and Node.js on either side of it.",
    strong: ["Java, Python, and C++", "JavaScript and TypeScript"],
  },
]

export type SocialLink = {
  name: string
  href: string
  /** External links open in a new tab and get rel=noopener. */
  isExternal: boolean
  icon: "resume" | "mail" | "github" | "linkedin" | "x" | "send" | "bluesky" | "instagram"
}

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    href: profile.github,
    isExternal: true,
    icon: "github",
  },
  {
    name: "LinkedIn",
    href: profile.linkedin,
    isExternal: true,
    icon: "linkedin",
  },
  {
    name: "X",
    href: profile.x,
    isExternal: true,
    icon: "x",
  },
  {
    name: "Bluesky",
    href: profile.bluesky,
    isExternal: true,
    icon: "bluesky",
  },
  {
    name: "Instagram",
    href: profile.instagram,
    isExternal: true,
    icon: "instagram",
  },
  { name: "Contact", href: "/contact", isExternal: false, icon: "send" },
]
