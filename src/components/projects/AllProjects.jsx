import { useMemo } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import useReveal from "../../hooks/useReveal";
import { goToSection } from "../../hooks/useHashRoute";
import InkSurface from "../common/InkSurface";
import { projects } from "../../data/portfolio";
import "./allProjects.scss";

/**
 * The standalone projects page reached from the gallery's "More Projects" /
 * "View all projects" links. Keeps the plate list layout, on the same paper
 * surface as the gallery so the two read as one area of the site.
 */

function ProjectRow({ project, index, coverSrc }) {
  const [ref, isVisible] = useReveal({ threshold: 0.1 });
  const ordinal = String(index + 1).padStart(2, "0");
  const isLinked = Boolean(project.url);

  const body = (
    <>
      <div className="all-projects__thumb" aria-hidden="true">
        {project.image ? (
          <img src={project.image} alt={project.name} loading="lazy" />
        ) : (
          <img
            src={coverSrc}
            alt={`${project.name} — project cover`}
            loading="lazy"
          />
        )}
      </div>

      <div className="all-projects__main">
        <span className="all-projects__ordinal">{ordinal}</span>

        <h2 className="all-projects__name">
          {project.name}
          {project.placeholder && (
            <span className="all-projects__badge">Placeholder</span>
          )}
        </h2>

        <p className="all-projects__summary">{project.summary}</p>

        <ul className="all-projects__stack">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>

      <div className="all-projects__aside">
        <span className="all-projects__year">{project.year}</span>
        {isLinked ? (
          <ArrowUpRight size={22} aria-hidden="true" />
        ) : (
          <span className="all-projects__pending">Private</span>
        )}
      </div>
    </>
  );

  const className = `all-projects__row reveal ${
    isVisible ? "is-visible" : ""
  } ${isLinked ? "" : "is-pending"}`;

  if (!isLinked) {
    return (
      <li ref={ref} className={className}>
        {body}
      </li>
    );
  }

  return (
    <li ref={ref} className={className}>
      <a
        className="all-projects__link"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name} — view repository on GitHub`}
      >
        {body}
      </a>
    </li>
  );
}

export default function AllProjects() {
  const placeholderCount = projects.filter((p) => p.placeholder).length;

  const coverMap = useMemo(() => {
    return Object.fromEntries(
      projects.map((p) => [p.name, Math.floor(Math.random() * 6) + 1])
    );
  }, []);

  return (
    <main
      id="main"
      className="all-projects surface surface--paper"
      data-tone="paper"
    >
      <InkSurface />

      <div className="all-projects__inner">
        <header className="all-projects__head">
          <a
            className="all-projects__back"
            href="/#project"
            onClick={(event) => goToSection(event, "project")}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </a>

          <div className="all-projects__title-row">
            <h1 className="all-projects__title">All Projects</h1>
            <p className="all-projects__count">
              {projects.length} projects
              {placeholderCount > 0 && ` · ${placeholderCount} placeholder`}
            </p>
          </div>
        </header>

        <ul className="all-projects__list">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.name}
              project={project}
              index={index}
              coverSrc={`/textures/project-covers-${coverMap[project.name]}.webp`}
            />
          ))}
        </ul>
      </div>
    </main>
  );
}
