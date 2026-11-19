import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-card text-foreground placeholder:text-subtle-foreground border-border flex field-sizing-content min-h-32 w-full rounded-2xl border px-4 py-3.5 text-base leading-relaxed transition-[border-color,box-shadow,background-color] duration-300 ease-[var(--ease-out)] outline-none",
        "hover:border-foreground/20 focus-visible:border-foreground/40 focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-foreground/60",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
