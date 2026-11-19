import Image from "next/image"

import { Reveal } from "@/components/motion"
import type { ProjectImage } from "@/lib/content/projects"
import { cn } from "@/lib/utils"

/**
 * Screenshots in a two-column masonry. Phone captures sit centred in a
 * muted frame so they don't tower over the desktop shots. Each image
 * opens full size in a new tab.
 */
export function ProjectGallery({ images }: { images: ProjectImage[] }) {
  return (
    <div className="columns-1 gap-5 sm:columns-2">
      {images.map((image, i) => {
        const mobile = image.device === "mobile"
        return (
          <Reveal key={image.src} blur={false} y={24} delay={(i % 2) * 0.06} amount={0.1} className="mb-5 break-inside-avoid">
            <figure className="flex flex-col gap-2.5">
              <a
                href={image.src}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group/shot bg-muted focus-visible:ring-ring/50 block overflow-hidden rounded-[18px] border outline-none focus-visible:ring-[3px]",
                  mobile && "flex justify-center px-6 py-8"
                )}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes={mobile ? "240px" : "(min-width: 1200px) 440px, (min-width: 640px) 45vw, calc(100vw - 2.5rem)"}
                  className={cn(
                    "h-auto transition-[scale] duration-700 ease-[var(--ease-out)] group-hover/shot:scale-[1.02] motion-reduce:group-hover/shot:scale-100",
                    mobile ? "w-full max-w-[220px] rounded-[22px] border" : "w-full"
                  )}
                />
                <span className="sr-only">Open full size (new tab)</span>
              </a>
              {image.caption ? (
                <figcaption className="text-muted-foreground text-[13.5px] leading-snug text-pretty">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          </Reveal>
        )
      })}
    </div>
  )
}

export default ProjectGallery
