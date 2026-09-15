import SectionHeader from "../common/SectionHeader";
import useReveal from "../../hooks/useReveal";
import "./about.scss";

const FACTS = [
  { label: "Base", value: "Yangon, Myanmar" },
  { label: "Focus", value: "Full-Stack / MERN" },
  { label: "Status", value: "Open to work" },
];

function About() {
  const [copyRef, copyVisible] = useReveal();

  return (
    <div className="about">

      <div className="about__inner">
        <SectionHeader
          index="01"
          kicker="Who i am."
          title="Thinking outside the box!."
        />

        <div
          ref={copyRef}
          className={`about__copy reveal ${copyVisible ? "is-visible" : ""}`}
        >
          <p>
            I am just a dude who likes coding like i said. I am a full-stack
            developer specializing MERN stack development. I am really
            passionate about coding. So hit me up!
          </p>

          <dl className="about__facts">
            {FACTS.map((fact) => (
              <div className="about__fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="about__actions">
            <a className="btn btn--ghost" href="#project">
              See more
            </a>
            <a className="about__mail" href="#contact">
              Or get in touch →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
