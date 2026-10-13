import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

/**
 * Two columns. The left one stays put and carries who this is.
 * The right one is the work. Nothing about this frame is a ruled sheet.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-6xl overflow-x-clip px-5 sm:px-8">
      <a
        href="#main"
        className="focus:bg-background focus:ring-ring/50 sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-sm focus:border focus:px-3 focus:py-2 focus:text-sm focus:ring-[3px]"
      >
        Skip to content
      </a>

      <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-24">
        <Navbar />
        <div id="main" className="w-full min-w-0 max-w-full pt-2 pb-16 md:py-14">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default SiteShell
