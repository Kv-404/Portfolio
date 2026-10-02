import { experiences } from "@/lib/content/experience"
import { profile, socialLinks } from "@/lib/content/profile"
import { siteUrl, socialPreviewDescription } from "@/lib/content/site"
import { stack } from "@/lib/content/stack"

/**
 * Rendered on the server so crawlers see the graph in the initial HTML.
 * Everything here is derived from the same content the page renders.
 */
export default function StructuredData() {
  const currentEmployers = experiences
    .filter((experience) => experience.isCurrent)
    .map((experience) => ({
      "@type": "Organization",
      name: experience.company,
      url: experience.website,
    }))

  const person = {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: profile.name,
    alternateName: profile.handle,
    jobTitle: profile.title,
    description: socialPreviewDescription,
    url: siteUrl,
    image: `${siteUrl}${profile.avatarPhoto}`,
    nationality: "Indian",
    address: {
      "@type": "PostalAddress",
      addressCountry: "India",
      addressRegion: profile.region,
      addressLocality: "Mumbai",
    },
    sameAs: socialLinks.filter((link) => link.isExternal).map((link) => link.href),
    knowsAbout: stack.flatMap((category) =>
      category.skills.map((skill) => skill.title)
    ),
    // Dropped entirely between roles rather than emitted as an empty list.
    ...(currentEmployers.length ? { worksFor: currentEmployers } : {}),
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${profile.name} Portfolio`,
        description: socialPreviewDescription,
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
