"use client"

import { useEffect, useRef } from "react"
import Lenis from "lenis"

const DESKTOP_QUERY = "(hover: hover) and (pointer: fine)"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

/**
 * Radix locks the page behind a modal by setting these on <body>. Lenis
 * drives the scroll position itself, so it sails straight through that
 * lock unless it is told to stand down.
 */
function isScrollLocked() {
  return (
    document.body.hasAttribute("data-scroll-locked") ||
    document.body.style.overflow === "hidden"
  )
}

export function LenisSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)
  const savedScrollBehavior = useRef<string | null>(null)
  const lockObserverRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const desktopMedia = window.matchMedia(DESKTOP_QUERY)
    const reducedMedia = window.matchMedia(REDUCED_MOTION_QUERY)

    const stopLenis = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }

      lockObserverRef.current?.disconnect()
      lockObserverRef.current = null

      lenisRef.current?.destroy()
      lenisRef.current = null

      if (savedScrollBehavior.current !== null) {
        document.documentElement.style.scrollBehavior =
          savedScrollBehavior.current
        savedScrollBehavior.current = null
      }
    }

    const startLenis = () => {
      if (lenisRef.current) return

      savedScrollBehavior.current = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = "auto"

      const lenis = new Lenis({
        anchors: true,
        autoRaf: false,
        // Low lerp = long, soft glide (Apple-like). ~0.09 settles in ~600ms.
        lerp: 0.09,
        wheelMultiplier: 1,
        smoothWheel: true,
      })
      lenisRef.current = lenis

      const raf = (time: number) => {
        lenis.raf(time)
        rafRef.current = requestAnimationFrame(raf)
      }
      rafRef.current = requestAnimationFrame(raf)

      // Hand the page back whenever a modal takes it, and pick it up
      // again on close. Without this the command menu's wheel events
      // fall through to Lenis and scroll the portfolio underneath.
      const syncLock = () => {
        if (isScrollLocked()) lenis.stop()
        else lenis.start()
      }
      syncLock()

      const observer = new MutationObserver(syncLock)
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["data-scroll-locked", "style"],
      })
      lockObserverRef.current = observer
    }

    const sync = () => {
      if (desktopMedia.matches && !reducedMedia.matches) {
        startLenis()
      } else {
        stopLenis()
      }
    }

    sync()

    const onChange = () => sync()

    if (desktopMedia.addEventListener) {
      desktopMedia.addEventListener("change", onChange)
      reducedMedia.addEventListener("change", onChange)
    } else {
      desktopMedia.addListener(onChange)
      reducedMedia.addListener(onChange)
    }

    return () => {
      if (desktopMedia.removeEventListener) {
        desktopMedia.removeEventListener("change", onChange)
        reducedMedia.removeEventListener("change", onChange)
      } else {
        desktopMedia.removeListener(onChange)
        reducedMedia.removeListener(onChange)
      }
      stopLenis()
    }
  }, [])

  return null
}

export default LenisSmoothScroll
