"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Check, Loader2 } from "lucide-react"

import { EASE } from "@/components/motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type FormState = "idle" | "loading" | "success" | "error"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_MESSAGE = 10

/** Posts to /api/contact, which relays over SMTP. */
export function ContactForm() {
  const [state, setState] = useState<FormState>("idle")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [body, setBody] = useState("")
  const [touched, setTouched] = useState({ email: false, body: false })
  const reduce = useReducedMotion()

  const emailValid = EMAIL_RE.test(email.trim())
  const bodyLength = body.trim().length
  const bodyValid = bodyLength >= MIN_MESSAGE

  const canSubmit = useMemo(() => emailValid && bodyValid, [emailValid, bodyValid])

  // Any edit after a result clears it, so the button reads "Send" again.
  const settle = () => {
    if (state === "success" || state === "error") {
      setState("idle")
      setFeedback(null)
    }
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (state === "success") return
    setTouched({ email: true, body: true })
    if (state === "loading" || !canSubmit) return

    setState("loading")
    setFeedback(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), message: body.trim() }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setState("error")
        setFeedback(data?.error || "That didn't send. Try again in a moment.")
        return
      }

      setState("success")
      setFeedback("Message sent. I'll get back to you soon.")
      setEmail("")
      setBody("")
      setTouched({ email: false, body: false })
    } catch {
      setState("error")
      setFeedback("No connection. Check your network and try again.")
    }
  }

  const showEmailError = touched.email && !emailValid
  const showBodyError = touched.body && !bodyValid

  const label = {
    idle: { text: "Send message", icon: <ArrowRight aria-hidden className="size-4" /> },
    error: { text: "Try again", icon: <ArrowRight aria-hidden className="size-4" /> },
    loading: { text: "Sending", icon: <Loader2 aria-hidden className="size-4 animate-spin" /> },
    success: { text: "Sent", icon: <Check aria-hidden className="size-4" /> },
  }[state]

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate aria-busy={state === "loading"}>
      <div className="space-y-2.5">
        <Label htmlFor="contact-email">Your email</Label>
        <Input
          id="contact-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            settle()
          }}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          aria-invalid={showEmailError || undefined}
          aria-describedby="contact-email-hint"
          required
        />
        <p id="contact-email-hint" className="text-muted-foreground text-[13px]">
          {showEmailError ? "That address doesn't look complete." : "Replies go to this address."}
        </p>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="contact-message">Your message</Label>
        <Textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="What are you building, and where could I help?"
          className="min-h-36 resize-none"
          value={body}
          onChange={(event) => {
            setBody(event.target.value)
            settle()
          }}
          onBlur={() => setTouched((t) => ({ ...t, body: true }))}
          aria-invalid={showBodyError || undefined}
          aria-describedby="contact-message-hint"
          required
        />
        <p
          id="contact-message-hint"
          className="text-muted-foreground flex justify-between gap-4 text-[13px]"
        >
          <span>
            {showBodyError
              ? `A little more, please — at least ${MIN_MESSAGE} characters.`
              : `At least ${MIN_MESSAGE} characters so I know what you need.`}
          </span>
          <span aria-hidden className="tabular-nums">
            {bodyLength}
          </span>
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 pt-1 sm:flex-row sm:items-center">
        <motion.button
          type="submit"
          layout={!reduce}
          transition={{ layout: { duration: 0.6, ease: EASE } }}
          disabled={state === "loading" || (state !== "success" && !canSubmit)}
          data-ui-feedback="tap"
          className={cn(
            "bg-foreground text-background focus-visible:ring-ring/50 inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full pr-1.5 pl-6 text-[15px] font-medium outline-none focus-visible:ring-[3px]",
            "transition-opacity duration-300 disabled:cursor-not-allowed disabled:opacity-40",
            state === "loading" && "disabled:opacity-100"
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={state}
              initial={reduce ? false : { y: 18, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={reduce ? undefined : { y: -18, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="inline-flex items-center gap-2.5 whitespace-nowrap"
            >
              {label.text}
              <span className="bg-background text-foreground inline-flex size-9 items-center justify-center rounded-full">
                {label.icon}
              </span>
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {feedback ? (
            <motion.p
              key={feedback}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className={cn(
                "text-[15px]",
                state === "success" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {feedback}
            </motion.p>
          ) : null}
        </AnimatePresence>
        {/* Persistent live region so screen readers hear every result. */}
        <p role="status" aria-live="polite" className="sr-only">
          {feedback ?? ""}
        </p>
      </div>
    </form>
  )
}

export default ContactForm
