import { footer } from "@/lib/content/site"

export function Footer() {
  return (
    <footer className="border-border mt-20 flex flex-wrap items-baseline justify-between gap-2 border-t pt-6 text-sm text-neutral-500">
      <p>
        {footer.text}{" "}
        <a
          href={footer.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground focus-visible:ring-ring/50 rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-[3px]"
        >
          {footer.developer}
        </a>
      </p>
      <p>
        © {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
