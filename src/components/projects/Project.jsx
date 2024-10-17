import "./project.scss";

function Project() {
  const data = [
    {
      name: "Social-media",
      url: "https://github.com/KaungMyatZaww/Social-media-full-stack/tree/master",
    },
    {
      name: "Real-estate",
      url: "https://github.com/KaungMyatZaww/Real-Estate/tree/master",
    },
    {
      name: "Weather app",
      url: "",
    },
  ];
  return (
    <div className="project">
      <div className="projectContainer">
        <div className="left">
          <ul>
            {data.map((item) => (
              <li
                key={item.name}
                style={{ "--dynamic-content": `"${item.name}"` }}
              >
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="right">
          <img src="./images/Projects.png" alt="" className="proj" />
          <img
            src="./images/ProjectsHeader.png"
            alt=""
            className="projectHeader"
          />
        </div>
      </div>
    </div>
  );
}

export default Project;
