import React from "react";
import { ArrowUpRight } from "lucide-react";
import "./project.scss";

export default function Project() {
  const projects = [
    {
      name: "Social Media Platform",
      url: "https://github.com/KaungMyatZaww/Social-media-full-stack/tree/master",
    },
    {
      name: "Real Estate System",
      url: "https://github.com/KaungMyatZaww/Real-Estate/tree/master",
    },
    { name: "Weather App", url: "" },
  ];

  return (
    <section className="revamped-wrapper">
      <h1 className="title">Featured Projects</h1>
      <p className="subtitle">A curated list of my latest work</p>

      <div className="grid">
        {projects.map((item, idx) => (
          <a
            key={idx}
            href={item.url || "#"}
            className={`card ${!item.url ? "disabled" : ""}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="card-header">
              <h2>{item.name}</h2>
              {item.url && <ArrowUpRight className="icon" size={20} />}
            </div>
            <p className="desc">Click to view repository</p>
          </a>
        ))}
      </div>
    </section>
  );
}
