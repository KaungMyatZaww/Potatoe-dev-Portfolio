import "./navbar.scss";

function Navbar() {
  return (
    <div className="navbar">
      <div className="containerrr">
        <div className="leftContainer">
          <img src="./images/logobg.png" alt="logo" />
          <ul>
            <li>
              <a href="#hero">Home</a>
            </li>
            <li>
              <a href="#about">About Me</a>
            </li>
            <li>
              <a href="#skills">My Skills</a>
            </li>
            <li>
              <a href="#project">Projects</a>
            </li>
            <li>
              <a href="#contact">Contact :3</a>
            </li>
          </ul>
        </div>

        <div className="buttonContainer">
          <img src="./images/search.png" alt="search" />
          <button>Get resume</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
