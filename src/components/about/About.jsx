import "./about.scss";

import Test from "../test/Test";

function About() {
  return (
    <div className="about">
      <div className="container">
        <div className="left">
          <Test />
        </div>
        <div className="right">
          <h1>Thinking outside the box!.</h1>
          <div className="whatWeDo">
            <img src="./public/images/line.png" alt="" />
            <h2>Who i am.</h2>
          </div>
          <p>
            I am just a dude who likes coding like i said. I am a full-stack
            developer specializing MERN stack development. I am really
            passionate about coding. So hit me up!
          </p>
          <button>
            <a href="#project">See more</a>
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;
