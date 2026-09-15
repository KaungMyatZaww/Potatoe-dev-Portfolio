import "./hero.scss";

function Hero() {
  return (
    <div className="hero">
      <div className="hero__inner">
        <div className="hero__lead">
          <p className="hero__meta">
            <span className="hero__meta-index">00</span>
            <span className="hero__meta-rule" aria-hidden="true" />
            <span>Portfolio — 2026</span>
          </p>

          <h1 className="hero__title">
            <span>Think.</span>
            <span>Plan.</span>
            <span className="hero__title-accent">Create.</span>
          </h1>

          <p className="hero__kicker">
            <span className="hero__meta-rule" aria-hidden="true" />
            <span>What I do.</span>
          </p>

          <p className="hero__copy">I like coding. And creating for LIVES easier.</p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#about">
              More
            </a>
            <a
              className="btn btn--ghost"
              href="/RESUME.pdf"
              download
              aria-label="Download my resume as a PDF"
            >
              Résumé
            </a>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to about section">
        <span>Scroll</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </div>
  );
}

export default Hero;
