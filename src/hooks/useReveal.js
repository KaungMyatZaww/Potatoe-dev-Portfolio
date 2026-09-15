import { useEffect, useRef, useState } from "react";

/**
 * Reveals an element once it scrolls into view.
 *
 * Returns `[ref, isVisible]`. Attach the ref to the element you want to animate
 * and toggle a class from `isVisible`.
 *
 * The hidden state is `opacity: 0`, so a trigger that never fires would leave
 * the page permanently blank — a severe failure mode for a portfolio. Two
 * guards prevent that:
 *
 *   1. A short health probe. IntersectionObserver delivers an initial entry for
 *      every observed target, so if nothing at all has arrived shortly after
 *      mount the observer is not working in this environment. A shared,
 *      rAF-throttled scroll/resize check then takes over.
 *   2. Reduced-motion users, and browsers without IntersectionObserver, skip
 *      observation entirely and show content immediately.
 *
 * When the observer is healthy the backstop never engages, so the configured
 * threshold and rootMargin stay fully in control of the animation timing.
 */

// --- Backstop state (module scope: one listener for the whole page) --------
const pending = new Set();
let frameHandle = 0;
let listening = false;
let everDelivered = false;
let observerHealthy = true;
let probeTimer = 0;

function runCheck() {
  frameHandle = 0;
  const viewportHeight = window.innerHeight;

  for (const entry of Array.from(pending)) {
    const rect = entry.element.getBoundingClientRect();
    if (rect.top < viewportHeight && rect.bottom > 0) entry.reveal();
  }
}

function scheduleCheck() {
  if (frameHandle) return;
  frameHandle = window.requestAnimationFrame(runCheck);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", scheduleCheck, { passive: true });
  window.addEventListener("resize", scheduleCheck, { passive: true });
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", scheduleCheck);
  window.removeEventListener("resize", scheduleCheck);

  if (frameHandle) {
    window.cancelAnimationFrame(frameHandle);
    frameHandle = 0;
  }
}

// If the observer has not reported back in this long, assume it is inert and
// hand control to the scroll backstop.
function startHealthProbe() {
  if (probeTimer || everDelivered) return;

  probeTimer = window.setTimeout(() => {
    probeTimer = 0;
    if (everDelivered) return;

    observerHealthy = false;
    startListening();
    scheduleCheck();
  }, 900);
}

function register(entry) {
  pending.add(entry);
  startHealthProbe();

  if (!observerHealthy) {
    startListening();
    scheduleCheck();
  }
}

function unregister(entry) {
  pending.delete(entry);
  if (pending.size === 0) stopListening();
}

export default function useReveal({
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
  once = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return undefined;
    }

    const entry = {
      element,
      reveal: () => {
        setIsVisible(true);
        if (once) unregister(entry);
      },
    };

    register(entry);

    const observer = new IntersectionObserver(
      (entries) => {
        // Any delivery at all proves the observer is functioning.
        everDelivered = true;
        observerHealthy = true;

        entries.forEach((observed) => {
          if (observed.isIntersecting) {
            entry.reveal();
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      unregister(entry);
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
}
