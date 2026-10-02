import { readFile } from "fs/promises"
import { join } from "path"

/**
 * The mark is an SVG, so this route just serves that file. A photo
 * favicon needed a mask and a rasteriser; a lettermark does not.
 */
export async function GET() {
  try {
    const svg = await readFile(join(process.cwd(), "public", "favicon.svg"))
    return new Response(new Uint8Array(svg), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
