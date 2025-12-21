import React, { useState } from "react";
import "./skill.scss";

function Skill() {
  const skills = [
    {
      name: "HTML",
      logo: "./images/html.png",
      logoHover: "./images/htmlHover.png",
      category: "Frontend"
    },
    {
      name: "CSS",
      logo: "./images/css.png",
      logoHover: "./images/cssHover.png",
      category: "Frontend"
    },
    {
      name: "JavaScript",
      logo: "./images/js.png",
      logoHover: "./images/js.png",
      category: "Frontend"
    },
    {
      name: "React",
      logo: "./images/react.png",
      logoHover: "./images/reactHover.png",
      category: "Frontend"
    },
    {
      name: "Node.js",
      logo: "./images/node.png",
      logoHover: "./images/nodeHover.png",
      category: "Backend"
    },
    {
      name: "Three.js",
      logo: "./images/three.svg",
      logoHover: "./images/threeHover.svg",
      category: "3D Graphics"
    },
    {
      name: "Java",
      logo: "./images/java.svg",
      logoHover: "./images/javaHover.svg",
      category: "Backend"
    },
    {
      name: "Prisma",
      logo: "./images/prisma.svg",
      logoHover: "./images/prismaHover.svg",
      category: "Database"
    },
    {
      name: "MongoDB",
      logo: "./images/mongodb.svg",
      logoHover: "./images/mongodbHover.svg",
      category: "Database"
    },
    {
      name: "MySQL",
      logo: "./images/mysql.svg",
      logoHover: "./images/mysql.svg",
      category: "Database"
    },
  ];

  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <section className="skill-section">
      <h1 className="title">Skills & Technologies</h1>
      <p className="subtitle">Technologies I've worked with</p>

      <div className="grid">
        {skills.map((skill, idx) => (
          <div
            key={skill.name}
            className={`skill-card ${skill.name === 'MongoDB' || skill.name === 'MySQL' ? 'wide-card' : ''}`}
            onMouseEnter={() => setHoveredItem(idx)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="card-header">
              <h2>{skill.name}</h2>
              <span className="category">{skill.category}</span>
            </div>
            <div className="skill-logo-container">
              <img
                src={hoveredItem === idx ? skill.logoHover : skill.logo}
                alt={`${skill.name} logo`}
                className="skill-logo"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skill;
