import type { Metadata, Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import { Pixelify_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { UiFeedbackProvider } from "@/hooks/use-ui-feedback"
import { MotionProvider } from "@/components/common/motion-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { LenisSmoothScroll } from "@/components/lenis-smooth-scroll"
import { UserCursor } from "@/components/common/user-cursor"
import { SiteShell } from "@/components/layout/site-shell"
import StructuredData from "@/components/structured-data"
import { profile } from "@/lib/content/profile"
import {
  siteUrl,
  socialPreviewDescription,
  socialPreviewImage,
  socialPreviewTitle,
} from "@/lib/content/site"

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixelify",
})

const description = socialPreviewDescription

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: socialPreviewTitle,
    template: `%s | ${profile.name}`,
  },
  description,
  keywords: [
    "Kv",
    "Kv-404",
    "CSE student",
    "Computer Science",
    "Cybersecurity",
    "Computer Networking",
    "React",
    "TypeScript",
    "Java",
    "Python",
    "C++",
    "Mumbai",
    "Portfolio",
    "Student Portfolio",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  publisher: profile.name,
  generator: "Next.js",
  applicationName: "Kv",
  referrer: "origin-when-cross-origin",
  alternates: { canonical: siteUrl },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Kv",
    title: socialPreviewTitle,
    description,
    images: [
      { ...socialPreviewImage, type: "image/png" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Kv404_",
    creator: "@Kv404_",
    title: socialPreviewTitle,
    description,
    images: [socialPreviewImage],
  },
  icons: {
    icon: "/favicon?v=3",
    shortcut: "/favicon?v=3",
    apple: "/favicon?v=3",
  },
  category: "technology",
  classification: "Portfolio Website",
  other: {
    "contact:country_name": "India",
    "contact:region": profile.region,
    "contact:locality": "Mumbai",
    "twitter:domain": "kv404.dev",
    "twitter:url": siteUrl,
    "twitter:image:alt": socialPreviewImage.alt,
    "whatsapp:image": socialPreviewImage.url,
    "whatsapp:title": socialPreviewTitle,
    "whatsapp:description": description,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistMono.variable} ${pixelifySans.variable}`}
    >
      <head>
        {/* Satoshi lives on Fontshare, not Google Fonts, so next/font
            cannot self-host it. */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="preconnect"
          href="https://cdn.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f%5B%5D=satoshi@variable&display=swap"
        />
        <StructuredData />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <MotionProvider>
              <UiFeedbackProvider>
                <LenisSmoothScroll />
                <UserCursor name="Sup" />
                <SiteShell>{children}</SiteShell>
              </UiFeedbackProvider>
            </MotionProvider>
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
