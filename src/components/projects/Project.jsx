import "./project.scss";

function Project() {
  const data = ["Social-media", "Real-estate", "Weather app"];
  return (
    <div className="project">
      <div className="projectContainer">
        <div className="left">
          <ul>
            {data.map((item) => (
              <li key={item} style={{ "--dynamic-content": `"${item}"` }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="right">
          <img src="./images/moon.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Project;
