import type { Metadata } from "next"

import { NotFoundScreen } from "@/components/not-found/not-found-screen"

export const metadata: Metadata = {
  title: "Not found",
  description: "This address doesn't lead anywhere. Head back to the home page.",
  robots: { index: false },
}

export default function NotFound() {
  return <NotFoundScreen />
}
