import { useEffect, useState } from "react";
import { goToSection } from "../../hooks/useHashRoute";
import useSurfaceTone from "../../hooks/useSurfaceTone";
import { navLinks } from "../../data/portfolio";
import "./navbar.scss";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // The bar is opaque, so it takes its colours from the surface beneath it.
  const tone = useSurfaceTone("paper");

  // Close on Escape and prevent the page from scrolling behind the menu.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className={`navbar navbar--${tone}`}>
      <div className="navbar__inner">
        <a
          className="navbar__brand"
          href="#hero"
          aria-label="Potatoe Dev — home"
          onClick={(event) => goToSection(event, "hero")}
        >
          <img src="/images/logo-removebg.png" alt="" width="40" height="40" />
          <span className="navbar__brand-text">
            <span className="navbar__brand-name">Potatoe</span>
            <span className="navbar__brand-role">Full-Stack Developer</span>
          </span>
        </a>

        <nav className="navbar__nav" aria-label="Primary">
          <ul className="navbar__list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  className="navbar__link"
                  href={`#${link.id}`}
                  onClick={(event) => goToSection(event, link.id)}
                >
                  <span className="navbar__link-index">{link.index}</span>
                  <span className="navbar__link-label">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar__actions">
          <a className="navbar__resume" href="/RESUME.pdf" download>
            Résumé
          </a>

          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="navbar__toggle-bar" aria-hidden="true" />
            <span className="navbar__toggle-bar" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile / narrow-screen menu */}
      <div
        id="mobile-menu"
        className={`navbar__menu ${isOpen ? "is-open" : ""}`}
        hidden={!isOpen}
      >
        <nav aria-label="Mobile">
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => {
                    goToSection(event, link.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="navbar__link-index">{link.index}</span>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          className="btn btn--primary navbar__menu-resume"
          href="/RESUME.pdf"
          download
          onClick={() => setIsOpen(false)}
        >
          Get My Resume
        </a>
      </div>
    </header>
  );
}

export default Navbar;
