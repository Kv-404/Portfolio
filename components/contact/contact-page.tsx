import { ArrowUpRight } from "lucide-react"

import { ContactForm } from "@/components/contact/contact-form"
import { PageHeader } from "@/components/layout/page-header"
import { Reveal, Stagger, StaggerItem } from "@/components/motion"
import { profile, socialLinks } from "@/lib/content/profile"

const elsewhere = socialLinks.filter((link) => link.isExternal)

const facts = [
  { term: "Replies", detail: "Usually within two days." },
  { term: "Based in", detail: `${profile.location} · IST, UTC+5:30` },
  { term: "Open to", detail: "Internships, collaborations, good questions." },
]

/** Header, then a quiet info column beside a form with room to breathe. */
export function ContactPage() {
  return (
    <main className="pb-24 sm:pb-32">
      <PageHeader
        eyebrow="Contact"
        title="Say hello."
        lede="Write about something I built, something you want built, or a role you think fits. Every note is read by me, not a filter."
      />

      <div className="grid grid-cols-1 gap-12 border-t pt-10 sm:pt-12 lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-4" aria-label="Contact details">
          <Stagger>
            <dl className="divide-y">
              {facts.map((fact) => (
                <StaggerItem key={fact.term} className="py-4 first:pt-0">
                  <dt className="text-subtle-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
                    {fact.term}
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-snug">{fact.detail}</dd>
                </StaggerItem>
              ))}
            </dl>
          </Stagger>

          <Reveal delay={0.2} className="mt-10">
            <p className="text-subtle-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
              Elsewhere
            </p>
            <ul className="mt-4 divide-y border-y">
              {elsewhere.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group focus-visible:ring-ring/50 flex items-center justify-between gap-4 rounded-sm py-3 text-[15px] outline-none focus-visible:ring-[3px]"
                  >
                    <span>{link.name}</span>
                    <span className="text-muted-foreground group-hover:text-foreground flex items-center gap-2 text-sm transition-colors">
                      <span className="hidden sm:inline">{link.icon === "x" ? profile.xHandle : null}</span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </aside>

        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
          <h2 className="sr-only">Send a message</h2>
          <ContactForm />
        </Reveal>
      </div>
    </main>
  )
}

export default ContactPage
