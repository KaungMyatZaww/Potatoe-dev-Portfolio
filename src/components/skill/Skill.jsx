import SectionHeader from "../common/SectionHeader";
import useReveal from "../../hooks/useReveal";
import { skills } from "../../data/portfolio";
import "./skill.scss";

function SkillCell({ skill, index }) {
  const [ref, isVisible] = useReveal({ threshold: 0.1 });
  const ordinal = String(index + 1).padStart(2, "0");

  return (
    <li
      ref={ref}
      className={`skill__cell reveal ${isVisible ? "is-visible" : ""}`}
    >
      <div className="skill__cell-meta">
        <span className="skill__ordinal">{ordinal}</span>
        <span className="skill__category">{skill.category}</span>
      </div>

      <div className="skill__mark">
        <img
          src={skill.logoHover}
          alt=""
          width="56"
          height="56"
          loading="lazy"
        />
      </div>

      <h3 className="skill__name">{skill.name}</h3>
    </li>
  );
}

function Skill() {
  return (
    <div className="skill">

      <div className="skill__inner">
        <SectionHeader
          index="03"
          kicker="Technologies I've worked with"
          title="Skills & Technologies"
          jp="技術"
        />

        <ul className="skill__grid">
          {skills.map((skill, index) => (
            <SkillCell
              key={skill.name}
              skill={skill}
              index={index}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Skill;
