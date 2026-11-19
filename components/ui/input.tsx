import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-card text-foreground placeholder:text-subtle-foreground selection:bg-primary selection:text-primary-foreground border-border flex h-12 w-full min-w-0 rounded-2xl border px-4 text-base transition-[border-color,box-shadow,background-color] duration-300 ease-[var(--ease-out)] outline-none",
        "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "hover:border-foreground/20 focus-visible:border-foreground/40 focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-foreground/60",
        className
      )}
      {...props}
    />
  )
}

export { Input }
