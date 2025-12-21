import Map from "../map/Map";
import "./contact.scss";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

function Contact() {
  const ref = useRef();
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_wwn4l8p", "template_0m4789h", ref.current, {
        publicKey: "LOzuyglRtRqwloopj",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          setSuccess(true);
        },
        (error) => {
          console.log("FAILED...", error.text);
          setSuccess(false);
        }
      );
  };

  return (
    <div className="contact">
      <div className="contact-content">
        <div className="contactContainer">
          <div className="left">
            <form ref={ref} onSubmit={handleSubmit}>
              <h1>CONTACT ME :0</h1>
              <input name="name" type="text" placeholder="Name" />
              <input name="email" type="email" placeholder="Mail" />
              <textarea
                name="message"
                id=""
                placeholder="Tell me anything!"
                rows={8}
              ></textarea>
              <button type="submit">Send</button>
              {success &&
                "YOur message has been sent. Get back to you soonge! "}
            </form>
          </div>
          <div className="right">
            <Map />
          </div>
        </div>
        <footer className="contact-footer">
          <div className="socials">
            <a
              href="https://github.com/KaungMyatZaww"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/kaungmyat-zaw"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              LinkedIn
            </a>
          </div>
          <div className="copyright">
            &copy; {new Date().getFullYear()} Kaung Myat Zaw. All rights
            reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
export default Contact;
