import { ArrowUpRight } from "lucide-react"

import { PageHeader } from "@/components/layout/page-header"
import { SectionHeading } from "@/components/layout/section-heading"
import { ContactForm } from "@/components/contact/contact-form"
import { GitHubIcon, XIcon } from "@/components/icons/brand"
import { profile } from "@/lib/content/profile"
import { cn } from "@/lib/utils"

const directRoutes = [
  {
    name: "GitHub",
    detail: profile.handle,
    href: profile.github,
    icon: GitHubIcon,
    primary: true,
  },
  {
    name: "DM me on X",
    detail: profile.xHandle,
    href: profile.x,
    icon: XIcon,
    primary: false,
  },
]

/**
 * The routes were flat list rows with a faint hover tint: nothing read
 * as pressable, and the call - the thing actually worth booking - was
 * weighted the same as a DM.
 *
 * They are now full-width bars in the site's two existing treatments.
 * The solid one is the only filled surface on the page, so it takes the
 * eye without any new visual language being invented for it, and the
 * bordered one reads as the alternative rather than the equal.
 */
export function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Send a note"
        action={
          <span className="border-border bg-muted/30 text-muted-foreground rounded-full border px-3 py-1 text-xs font-medium sm:text-sm">
            {profile.availability}
          </span>
        }
      />

      <SectionHeading as="h2">Fastest routes</SectionHeading>

      {/* Side by side from sm; stacked below it, where half a phone
          width cannot hold the label without truncating it away. */}
      <div className="mb-16 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
        {directRoutes.map((route) => (
          <a
            key={route.name}
            href={route.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group focus-visible:ring-ring/50 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left outline-none transition-all focus-visible:ring-[3px]",
              route.primary
                ? "bg-foreground text-background hover:opacity-90"
                : "border-border bg-background border hover:border-neutral-400 dark:hover:border-neutral-600"
            )}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md",
                route.primary
                  ? "bg-background/15"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <route.icon className="size-4" aria-hidden />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">
                {route.name}
              </span>
              <span
                className={cn(
                  "block truncate text-xs",
                  route.primary ? "text-background/70" : "text-muted-foreground"
                )}
              >
                {route.detail}
              </span>
            </span>

            <ArrowUpRight
              className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </a>
        ))}
      </div>

      <SectionHeading as="h2">Send a message</SectionHeading>
      <div className="max-w-xl">
        <p className="text-muted-foreground mb-5 max-w-prose text-sm leading-relaxed">
          Leave a note about something I built, or about something you want
          built. I reply to the address you put in the form.
        </p>
        <ContactForm />
      </div>
    </main>
  )
}

export default ContactPage
