import { useEffect, useState } from "react";

/**
 * Which surface the masthead is currently floating over — "paper" or "ink".
 *
 * The bar is opaque (a translucent one smears whatever scrolls behind it, and
 * over a light sheet it stops working as a frame), so it has to *wear* the
 * surface underneath rather than let it show through. On the paper hero the bar
 * is paper with ink type; over the ink plates it inverts.
 *
 * The tone is read from the DOM rather than inferred from scroll offsets:
 * whichever element marked `[data-tone]` covers the bar's mid-line owns it.
 * That keeps working when sections change height, and avoids hard-coding the
 * layout here.
 *
 * @param {string} fallback tone to use before any section is measured
 */
export default function useSurfaceTone(fallback = "paper") {
  const [tone, setTone] = useState(fallback);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;

      const navHeight =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height"
          )
        ) || 72;
      // Probe the bar's mid-line: the surface flips when a boundary crosses
      // the middle of the bar, which is where the eye reads the change.
      const y = navHeight / 2;

      let next = fallback;
      for (const node of document.querySelectorAll("[data-tone]")) {
        const { top, bottom } = node.getBoundingClientRect();
        if (top <= y && bottom > y) {
          next = node.dataset.tone;
          break;
        }
      }

      setTone((current) => (current === next ? current : next));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [fallback]);

  return tone;
}
