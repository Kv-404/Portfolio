import type { Metadata } from "next"

import { ProjectList } from "@/components/projects/project-list"
import {
  siteUrl,
  socialPreviewDescription,
  socialPreviewImage,
  socialPreviewTitle,
} from "@/lib/content/site"

const description =
  "Projects built by Kv, with a full write-up of each: Aayam, a live college timetable, and Image to Poem, an offline photo-to-poem ML pipeline."

export const metadata: Metadata = {
  title: "Projects",
  description,
  alternates: { canonical: `${siteUrl}/projects` },
  openGraph: {
    title: socialPreviewTitle,
    description: socialPreviewDescription,
    url: `${siteUrl}/projects`,
    type: "website",
    images: [{ ...socialPreviewImage, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: socialPreviewTitle,
    description: socialPreviewDescription,
    images: [socialPreviewImage],
  },
}

export default function ProjectsPage() {
  return <ProjectList />
}
