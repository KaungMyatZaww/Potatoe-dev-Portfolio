import React, { useState } from "react";
import "./skill.scss";

function Skill() {
  const data = [
    {
      name: "HTML",
      logo: "./images/html.png",
      logoHover: "./images/htmlHover.png",
    },
    {
      name: "CSS",
      logo: "./images/css.png",
      logoHover: "./images/cssHover.png",
    },
    {
      name: "JavaScript",
      logo: "./images/js.png",
      logoHover: "./images/js.png",
    },
    {
      name: "React",
      logo: "./images/react.png",
      logoHover: "./images/reactHover.png",
    },
    {
      name: "Node.js",
      logo: "./images/node.png",
      logoHover: "./images/nodeHover.png",
    },
    {
      name: "Three.js",
      logo: "./images/three.svg",
      logoHover: "./images/threeHover.svg",
    },
    {
      name: "Java",
      logo: "./images/java.svg",
      logoHover: "./images/javaHover.svg",
    },
    {
      name: "Prisma",
      logo: "./images/prisma.svg",
      logoHover: "./images/prismaHover.svg",
    },
  ];
  const db = [
    {
      name: "MongoDB",
      logo: "./images/mongodb.svg",
      logoHover: "./images/mongodbHover.svg",
    },
    {
      name: "MySQL",
      logo: "./images/mysql.svg",
      logoHover: "./images/mysql.svg",
    },
  ];
  const [hoveredItem, setHoveredItem] = useState(null);
  return (
    <div className="skill">
      <div className="headingContainer">
        <img src="./images/skills.png" alt="header" />
      </div>
      <div className="techContainer">
        <div className="firstEight">
          <ul>
            {data.map((item, index) => (
              <li
                key={item.name}
                style={{ "--dynamic-content": `"${item.name}"` }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <img
                  src={hoveredItem === index ? item.logoHover : item.logo}
                  alt={`${item.name} logo`}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="lastTwo">
          <ul>
            {db.map((item, index) => (
              <li
                key={item.name}
                style={{ "--dynamic-content": `"${item.name}"` }}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <img
                  src={hoveredItem === index ? item.logoHover : item.logo}
                  alt={`${item.name} logo`}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Skill;
