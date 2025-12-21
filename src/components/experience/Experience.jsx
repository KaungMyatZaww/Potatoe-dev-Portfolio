import React from "react";
import "./experience.scss";

function Experience() {
  const experiences = [
    {
      company: "Myanmar Information Technology Pte Ltd.",
      position: "Web Developer",
      duration: "2024 November - 2025 September",
      description:
        "Developed and maintained an internal HR and payroll web application. Built and enhanced frontend features using Angular and collaborated closely with backend services built with Node.js and PostgreSQL. Later contributed to a WebView-based mobile version of the system and worked alongside an attendance application to ensure smooth data integration and consistent user experience across platforms.",
      technologies: ["Angular", "Node", "CSS", "HTML", "PostgreSQL"],
    },
    {
      company: "KME Solutions",
      position: "Software Engineer",
      duration: "2025 September - Present",
      description:
        "Maintaining and extending multiple legacy PHP applications while handling full-stack responsibilities, including feature development, bug fixes, and production support. In parallel, developing a new in-house CRM system using Next.js and NestJS, contributing to both frontend and backend architecture, API design, and database integration. Also involved in deployment, server configuration, and infrastructure tasks across Linux-based environments.",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "MySQL",
        "PHP",
        "Laravel",
        "Linux",
        "AWS",
        "Digital Ocean",
        "Docker",
        "Git",
        "Nginx",
        "Next.js",
        "NestJS",
      ],
    },
  ];

  return (
    <section className="experience-section">
      <h1 className="title">Work Experience</h1>
      <p className="subtitle">My professional journey</p>

      <div className="experience-grid">
        {experiences.map((exp, idx) => (
          <div key={idx} className="experience-card">
            <div className="card-header">
              <h2>{exp.position}</h2>
              <span className="company">{exp.company}</span>
            </div>
            <div className="duration">{exp.duration}</div>
            <p className="description">{exp.description}</p>
            <div className="technologies">
              {exp.technologies.map((tech, techIdx) => (
                <span key={techIdx} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experience;
