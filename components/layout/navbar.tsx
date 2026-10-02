"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { SoundToggle } from "@/components/common/sound-toggle"
import { ThemeToggle } from "@/components/common/theme-toggle"
import {
  CommandMenu,
  CommandTrigger,
  useCommandMenu,
} from "@/components/common/command-menu"
import {
  BlueskyIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/icons/brand"
import { navLinks } from "@/lib/content/site"
import { profile, socialLinks } from "@/lib/content/profile"
import { cn } from "@/lib/utils"

const socialIcons = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  x: XIcon,
  bluesky: BlueskyIcon,
  instagram: InstagramIcon,
} as const

export function Navbar() {
  const pathname = usePathname()
  const { open, setOpen } = useCommandMenu()
  const reach = socialLinks.filter(
    (link) => link.icon in socialIcons
  )

  return (
    <>
      <header className="flex flex-col gap-8 py-8 md:sticky md:top-0 md:self-start md:py-14">
        <div>
          <Link
            href="/"
            className="focus-visible:ring-ring/50 group inline-flex items-center gap-3 rounded-sm outline-none focus-visible:ring-[3px]"
          >
            <Image
              src={profile.avatarPhoto}
              alt=""
              width={48}
              height={48}
              priority
              className="size-12 rounded-full object-cover"
            />
            <span>
              <span className="block text-lg leading-none font-semibold tracking-tight">
                {profile.name}
              </span>
              <span className="text-muted-foreground mt-1 block text-sm">
                {profile.meta}
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="mt-8 flex flex-col items-start gap-1">
            <Link
              href="/"
              aria-current={pathname === "/" ? "page" : undefined}
              className={cn(
                "focus-visible:ring-ring/50 hover:text-foreground rounded-sm py-1.5 text-sm outline-none focus-visible:ring-[3px]",
                pathname === "/"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            {navLinks.map((link) => {
              const isActive = link.href === pathname
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "focus-visible:ring-ring/50 hover:text-foreground rounded-sm py-1.5 text-sm outline-none focus-visible:ring-[3px]",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex flex-col items-start gap-4">
          <ul className="flex flex-wrap items-center gap-1">
            {reach.map((link) => {
              const Icon = socialIcons[link.icon as keyof typeof socialIcons]
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 flex size-11 items-center justify-center rounded-sm outline-none focus-visible:ring-[3px]"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              )
            })}
          </ul>
          <div className="flex items-center gap-2">
            <CommandTrigger onClick={() => setOpen(true)} />
            <SoundToggle />
            <ThemeToggle className="size-7" />
          </div>
        </div>
        <CommandMenu open={open} onOpenChange={setOpen} />
      </header>
    </>
  )
}

export default Navbar
