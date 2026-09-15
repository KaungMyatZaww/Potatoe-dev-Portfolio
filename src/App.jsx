import { useEffect } from "react";
import useHashRoute from "./hooks/useHashRoute";
import InkSurface from "./components/common/InkSurface";
import Navbar from "./components/navBar/Navbar";
import AllProjects from "./components/projects/AllProjects";
import Hero from "./components/hero/Hero.jsx";
import About from "./components/about/About.jsx";
import Experience from "./components/experience/Experience.jsx";
import Skill from "./components/skill/Skill.jsx";
import Project from "./components/projects/Project.jsx";
import Contact from "./components/contact/Contact.jsx";

const BASE_TITLE = "Potatoe-Dev";

/**
 * The home page as a sequence of surfaces.
 *
 * The site alternates paper and ink the way a bound volume alternates sheets and
 * plates: the hero and the work history sit on paper, the statement, the
 * specimen sheet and the close sit on ink. Each section also names the wash it
 * carries — including which corner the ink pooled in — so no two neighbours
 * look alike. `priority` marks the one wash that is above the fold.
 */
const HOME_SECTIONS = [
  { id: "hero", label: "Introduction", tone: "paper", wash: "hero", priority: true, Component: Hero },
  { id: "about", label: "About me", tone: "ink", wash: "corner", Component: About },
  { id: "experience", label: "Work experience", tone: "paper", wash: "band", Component: Experience },
  { id: "skills", label: "Skills and technologies", tone: "ink", wash: "slash", Component: Skill },
  { id: "project", label: "Featured projects", tone: "paper", wash: null, Component: Project },
  { id: "contact", label: "Contact", tone: "ink", wash: "slash", Component: Contact },
];

// Section anchors that exist on the home page.
const SECTION_IDS = HOME_SECTIONS.map((section) => section.id);

function HomePage() {
  return (
    <main id="main">
      {HOME_SECTIONS.map(({ id, label, tone, wash, priority, Component }) => (
        <section
          key={id}
          id={id}
          className={`surface surface--${tone}`}
          data-tone={tone}
          aria-label={label}
        >
          <InkSurface wash={wash} priority={priority} />
          <Component />
        </section>
      ))}
    </main>
  );
}

function App() {
  const route = useHashRoute();
  const isProjectsPage = route === "/projects";

  useEffect(() => {
    if (isProjectsPage) {
      document.title = `Projects — ${BASE_TITLE}`;
      window.scrollTo(0, 0);
      return;
    }

    document.title = BASE_TITLE;

    // Arriving back home through a section link (e.g. "Back" from the projects
    // page) means the section did not exist a moment ago — wait one frame for
    // it to mount before scrolling to it.
    const anchor = window.location.hash.replace(/^#\/?/, "");
    if (!SECTION_IDS.includes(anchor)) return undefined;

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [route, isProjectsPage]);

  return (
    <div className="app">
      <a className="skip-link" href={isProjectsPage ? "#main" : "#about"}>
        Skip to content
      </a>

      {/* Shared chrome — lives here so both the home page and the projects
          page keep navigation. */}
      <Navbar />

      {isProjectsPage ? <AllProjects /> : <HomePage />}
    </div>
  );
}

export default App;
