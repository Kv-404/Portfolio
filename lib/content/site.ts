import { profile } from "./profile"

export const siteUrl = "https://kv404.dev"

export const socialPreviewTitle = "Kv | CSE student"
export const socialPreviewDescription =
  "Kv is a computer science student in Mumbai who builds small systems and studies cybersecurity and computer networking."
export const socialPreviewImage = {
  url: `${siteUrl}/og.png`,
  width: 1200,
  height: 630,
  alt: "Kv, computer science student in Mumbai",
}

export const navLinks = [
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
]

/** In-page anchors, kept in one place so the nav and the sections agree. */
export const sectionIds = {
  about: "about",
  connect: "connect",
  experience: "experience",
  projects: "projects",
  stack: "stack",
  activity: "activity",
  achievements: "achievements",
  contact: "contact",
} as const

export const skillsVenn = {
  image: "/kv.jpg",
  skills: {
    top: "Cybersecurity",
    left: "Networking",
    right: "Browser software",
    bottom: "Small systems\n& privacy",
  },
}

export const footer = {
  text: "Designed and developed by",
  developer: profile.name,
  href: profile.x,
  note: "Built in the open.",
}
