import { lazy, Suspense, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import SectionHeader from "../common/SectionHeader";
import useReveal from "../../hooks/useReveal";
import { contactEmail, socials } from "../../data/portfolio";
import "./contact.scss";

// react-simple-maps + d3-geo are far below the fold — load them on demand.
const Map = lazy(() => import("../map/Map"));

// Credentials come from the environment — see .env.example.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

const STATUS_MESSAGE = {
  sending: "Sending your message…",
  success: "Your message has been sent. I'll get back to you soon.",
  error: "Something went wrong and the message was not sent. Please email me directly.",
  unconfigured:
    "The contact form is not configured on this deployment. Please email me directly.",
};

function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [wrapRef, wrapVisible] = useReveal({ threshold: 0.08 });
  // Mount the map only once it is close to the viewport — this also defers
  // fetching the 233 kB topojson file until it can actually be seen.
  const [mapRef, mapVisible] = useReveal({
    threshold: 0,
    rootMargin: "300px 0px",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isConfigured) {
      setStatus("unconfigured");
      return;
    }

    setStatus("sending");

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => setStatus("success"),
        (error) => {
          console.error("EmailJS send failed:", error?.text || error);
          setStatus("error");
        }
      );
  };

  const isSending = status === "sending";
  const feedback = STATUS_MESSAGE[status] || "";

  return (
    <div className="contact">

      <div className="contact__inner">
        <SectionHeader
          index="05"
          kicker="Let's build something"
          title="Contact Me"
          jp="連絡"
        />

        <div className="contact__grid">
          <div
            ref={wrapRef}
            className={`contact__form-wrap reveal ${
              wrapVisible ? "is-visible" : ""
            }`}
          >
            <form ref={formRef} className="contact__form" onSubmit={handleSubmit}>
              <div className="contact__field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="contact__field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell me anything!"
                  rows={7}
                  required
                />
              </div>

              <button
                className="btn btn--primary btn--block"
                type="submit"
                disabled={isSending}
              >
                {isSending ? "Sending…" : "Send"}
              </button>

              <p
                className={`contact__feedback contact__feedback--${status}`}
                role="status"
                aria-live="polite"
              >
                {feedback}
              </p>
            </form>
          </div>

          <aside className="contact__aside">
            <div className="contact__map" ref={mapRef}>
              {mapVisible ? (
                <Suspense fallback={<div className="contact__map-placeholder" />}>
                  <Map />
                </Suspense>
              ) : (
                <div className="contact__map-placeholder" />
              )}
              <p className="contact__map-caption">
                <span className="contact__map-dot" aria-hidden="true" />
                Based in Yangon, Myanmar
              </p>
            </div>

            <dl className="contact__details">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </dd>
              </div>
              <div>
                <dt>Elsewhere</dt>
                <dd className="contact__socials">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>

      <footer className="contact__footer">
        <div className="contact__footer-inner">
          <p className="contact__copyright">
            &copy; {new Date().getFullYear()} Kaung Myat Zaw. All rights
            reserved.
          </p>
          <a className="contact__top" href="#hero">
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Contact;
