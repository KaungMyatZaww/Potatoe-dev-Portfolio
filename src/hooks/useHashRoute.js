import { useEffect, useState } from "react";

/**
 * Minimal pathname router for the two pages (home + projects).
 *
 * The projects page is a real path (`/projects`) so crawlers can index it as
 * its own URL — hash fragments are stripped by search engines and social
 * scrapers. Netlify serves the SPA shell for it via the `/* /index.html 200`
 * redirect. Section anchors (`#about`, …) stay plain hashes and keep working
 * untouched. No dependency needed.
 */

export const HOME = "/";
export const PROJECTS_PATH = "/projects";

function readRoute() {
  if (typeof window === "undefined") return HOME;

  return window.location.pathname === PROJECTS_PATH ? PROJECTS_PATH : HOME;
}

/** SPA navigation without a full reload. Plain hrefs still work with JS off. */
export function navigate(path) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/**
 * Click handler for section links. On the home page the native anchor jump
 * runs; from `/projects` it returns home first and `App` scrolls to the
 * section once it mounts.
 */
export function goToSection(event, id) {
  if (window.location.pathname !== HOME) {
    event.preventDefault();
    navigate(`/#${id}`);
  }
}

export default function useHashRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const handleChange = () => setRoute(readRoute());

    window.addEventListener("popstate", handleChange);
    return () => window.removeEventListener("popstate", handleChange);
  }, []);

  return route;
}
