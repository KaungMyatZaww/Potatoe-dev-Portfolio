import { ArrowRight } from "lucide-react";
import useReveal from "../../hooks/useReveal";
import { navigate, PROJECTS_PATH } from "../../hooks/useHashRoute";
import {
  projects,
  FEATURED_PROJECT_COUNT,
} from "../../data/portfolio";
import "./project.scss";

const COVERS = [
  "/textures/project-covers-1.webp",
  "/textures/project-covers-2.webp",
  "/textures/project-covers-3.webp",
];

/**
 * Projects gallery, presented as a light "paper plate" bound into the ink book.
 *
 * Mirrors the reference: a mono header row, then a three-column grid of two
 * featured projects plus a "More Projects" tile that leads to the full
 * projects page. Project thumbnails fall back to generated ink artwork until a
 * real `image` is supplied.
 */

function ProjectCard({ project, index }) {
  const [ref, isVisible] = useReveal({ threshold: 0.12 });

  const inner = (
    <>
      <div className="project__thumb">
        {project.image ? (
          <img src={project.image} alt={project.name} loading="lazy" />
        ) : (
          <img
            src={COVERS[index]}
            alt={`${project.name} — project cover`}
            loading="lazy"
          />
        )}
        {project.placeholder && (
          <span className="project__badge">Placeholder</span>
        )}
      </div>

      <h3 className="project__name">{project.name}</h3>
      <p className="project__summary">{project.summary}</p>

      <ul className="project__stack">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </>
  );

  const className = `project__card reveal ${isVisible ? "is-visible" : ""}`;

  if (!project.url) {
    return (
      <li ref={ref} className={className}>
        {inner}
      </li>
    );
  }

  return (
    <li ref={ref} className={className}>
      <a
        className="project__card-link"
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name} — view repository on GitHub`}
      >
        {inner}
      </a>
    </li>
  );
}

function MoreProjectsCard({ index }) {
  const [ref, isVisible] = useReveal({ threshold: 0.12 });

  return (
    <li
      ref={ref}
      className={`project__card project__card--more reveal ${
        isVisible ? "is-visible" : ""
      }`}
    >
      <a
        className="project__card-link"
        href="/projects"
        onClick={(event) => {
          event.preventDefault();
          navigate(PROJECTS_PATH);
        }}
      >
        <div className="project__thumb" aria-hidden="true">
          <img
            src={COVERS[index]}
            alt="More projects — browse the full list"
            loading="lazy"
          />
        </div>

        <h3 className="project__name">More Projects</h3>
        <p className="project__summary">
          A few more side projects and experiments I&rsquo;ve built along the
          way.
        </p>

        <span className="project__more-link">
          View projects
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </a>
    </li>
  );
}

function Project() {
  const featured = projects.slice(0, FEATURED_PROJECT_COUNT);

  return (
    <div className="project">
      <div className="project__inner">
        <div className="project__head">
          <p className="project__label">
            Projects
            <span className="project__dash" aria-hidden="true" />
          </p>

          <a
            className="project__all"
            href="/projects"
            onClick={(event) => {
              event.preventDefault();
              navigate(PROJECTS_PATH);
            }}
          >
            View all projects
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>

        <ul className="project__grid">
          {featured.map((project, index) => (
            <ProjectCard key={project.name} project={project} index={index} />
          ))}
          <MoreProjectsCard index={featured.length} />
        </ul>
      </div>
    </div>
  );
}

export default Project;
