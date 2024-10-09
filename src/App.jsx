import Hero from "./components/hero/Hero.jsx";
import Project from "./components/projects/Project.jsx";
import About from "./components/about/About.jsx";
import Contact from "./components/contact/Contact.jsx";
import "./app.scss";

function App() {
  return (
    <div className="app">
      <section id="hero">
        <Hero />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="project">
        <Project />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </div>
  );
}

export default App;
