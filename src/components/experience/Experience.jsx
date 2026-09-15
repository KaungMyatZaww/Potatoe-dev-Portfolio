import SectionHeader from "../common/SectionHeader";
import useReveal from "../../hooks/useReveal";
import { experience } from "../../data/portfolio";
import "./experience.scss";

function ExperienceEntry({ entry, index }) {
  const [ref, isVisible] = useReveal({ threshold: 0.12 });
  const ordinal = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={ref}
      className={`experience__entry reveal ${isVisible ? "is-visible" : ""}`}
    >
      <div className="experience__rail">
        <span className="experience__ordinal">{ordinal}</span>
        <span className="experience__duration">{entry.duration}</span>
        <span className="experience__company">{entry.company}</span>
      </div>

      <div className="experience__body">
        <header className="experience__head">
          <h3 className="experience__position">{entry.position}</h3>
          <span className="experience__location">{entry.location}</span>
        </header>

        <p className="experience__description">{entry.description}</p>

        <ul className="experience__stack">
          {entry.technologies.map((tech) => (
            <li key={tech} className="experience__tag">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Experience() {
  return (
    <div className="experience">
      <div className="experience__inner">
        <SectionHeader
          index="02"
          kicker="Where I've worked"
          title="Work Experience"
          jp="職務経歴"
        />

        <div className="experience__list">
          {experience.map((entry, index) => (
            <ExperienceEntry
              key={`${entry.company}-${entry.position}`}
              entry={entry}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Experience;
