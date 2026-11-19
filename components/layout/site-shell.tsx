import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ScrollProgress } from "@/components/motion"

/**
 * One centred column, wide like an Apple product page. The nav floats
 * above everything as a glass pill; sections own their own spacing.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-dvh w-full overflow-x-clip">
      <a
        href="#main"
        className="focus:bg-background focus:ring-ring/50 sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:border focus:px-4 focus:py-2 focus:text-sm focus:ring-[3px]"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <div id="main" className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default SiteShell
