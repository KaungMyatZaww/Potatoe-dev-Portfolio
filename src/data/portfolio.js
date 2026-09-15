// ---------------------------------------------------------------------------
// Single source of truth for the portfolio content. Previously these arrays
// were declared inside each component, which made the sections impossible to
// restyle consistently.
// ---------------------------------------------------------------------------

export const navLinks = [
  { id: "hero", label: "Home", index: "00" },
  { id: "about", label: "About", index: "01" },
  { id: "experience", label: "Experience", index: "02" },
  { id: "skills", label: "Skills", index: "03" },
  { id: "project", label: "Projects", index: "04" },
  { id: "contact", label: "Contact", index: "05" },
];

export const experience = [
  {
    company: "KME Solutions",
    position: "Software Engineer",
    duration: "2025 September — Present",
    location: "Remote",
    description:
      "Maintaining and extending multiple legacy PHP applications while handling full-stack responsibilities, including feature development, bug fixes, and production support. In parallel, developing a new in-house CRM system using Next.js and NestJS, contributing to both frontend and backend architecture, API design, and database integration. Also involved in deployment, server configuration, and infrastructure tasks across Linux-based environments.",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "MySQL",
      "PHP",
      "Laravel",
      "Linux",
      "AWS",
      "Digital Ocean",
      "Docker",
      "Git",
      "Nginx",
      "Next.js",
      "NestJS",
    ],
  },
  {
    company: "Myanmar Information Technology Pte Ltd.",
    position: "Web Developer",
    duration: "2024 November — 2025 September",
    location: "Yangon, MM",
    description:
      "Developed and maintained an internal HR and payroll web application. Built and enhanced frontend features using Angular and collaborated closely with backend services built with Node.js and PostgreSQL. Later contributed to a WebView-based mobile version of the system and worked alongside an attendance application to ensure smooth data integration and consistent user experience across platforms.",
    technologies: ["Angular", "Node", "CSS", "HTML", "PostgreSQL"],
  },
];

export const skills = [
  { name: "HTML", logo: "/images/html.png", logoHover: "/images/htmlHover.png", category: "Frontend" },
  { name: "CSS", logo: "/images/css.png", logoHover: "/images/cssHover.png", category: "Frontend" },
  { name: "JavaScript", logo: "/images/js.png", logoHover: "/images/js.png", category: "Frontend" },
  { name: "React", logo: "/images/react.png", logoHover: "/images/reactHover.png", category: "Frontend" },
  { name: "Node.js", logo: "/images/node.png", logoHover: "/images/nodeHover.png", category: "Backend" },
  { name: "Three.js", logo: "/images/three.svg", logoHover: "/images/threeHover.svg", category: "3D Graphics" },
  { name: "Java", logo: "/images/java.svg", logoHover: "/images/javaHover.svg", category: "Backend" },
  { name: "Prisma", logo: "/images/prisma.svg", logoHover: "/images/prismaHover.svg", category: "Database" },
  { name: "MongoDB", logo: "/images/mongodb.svg", logoHover: "/images/mongodbHover.svg", category: "Database" },
  { name: "MySQL", logo: "/images/mysql.svg", logoHover: "/images/mysql.svg", category: "Database" },
];

// ---------------------------------------------------------------------------
// Projects.
//
// The first three are real, taken from the resume. Everything below the
// `PLACEHOLDERS` marker is filler so the gallery and the projects page can be
// evaluated with realistic volume — replace or delete them freely. Anything
// with `placeholder: true` is rendered with a generated ink plate and a visible
// "Placeholder" flag so it is never mistaken for real work.
//
// To add a real project: drop `image` in with a path such as
// "/images/projects/my-app.png" (place files in public/images/projects/).
// ---------------------------------------------------------------------------

export const projects = [
  {
    name: "Social Media Platform",
    url: "https://github.com/KaungMyatZaww/Social-media-full-stack/tree/master",
    summary:
      "A social networking site where users create profiles, post updates, and interact with others.",
    stack: ["React", "Node.js", "Express", "MySQL"],
    year: "2024",
  },
  {
    name: "Real Estate System",
    url: "https://github.com/KaungMyatZaww/Real-Estate/tree/master",
    summary:
      "A full-stack real estate platform enabling users to browse properties, make inquiries, and chat with agents in real time.",
    stack: ["React", "Node.js", "MongoDB", "Socket.io"],
    year: "2024",
  },
  {
    name: "Weather App",
    url: "",
    summary:
      "A responsive weather application that fetches and displays real-time weather data for any location.",
    stack: ["JavaScript", "SCSS"],
    year: "2023",
  },

  // --- PLACEHOLDERS (safe to delete) --------------------------------------
  {
    name: "Placeholder — Internal CRM",
    url: "",
    summary:
      "Replace this entry with one of your own. It exists so the layout can be judged with more than three cards.",
    stack: ["Next.js", "NestJS", "PostgreSQL"],
    year: "2025",
    placeholder: true,
  },
  {
    name: "Placeholder — Attendance System",
    url: "",
    summary:
      "Replace this entry with one of your own. The generated ink plate is a stand-in for a real screenshot.",
    stack: ["Angular", "Node.js", "Prisma"],
    year: "2025",
    placeholder: true,
  },
  {
    name: "Placeholder — Mobile WebView",
    url: "",
    summary:
      "Replace this entry with one of your own. Delete the placeholder block in src/data/portfolio.js when done.",
    stack: ["React Native", "REST", "Docker"],
    year: "2024",
    placeholder: true,
  },
  {
    name: "Placeholder — Side Experiment",
    url: "",
    summary:
      "Replace this entry with one of your own. Stack lines accept any number of items.",
    stack: ["TypeScript", "Vite", "Three.js"],
    year: "2023",
    placeholder: true,
  },
];

/** How many projects the home gallery shows before the "More Projects" tile. */
export const FEATURED_PROJECT_COUNT = 2;

export const socials = [
  { label: "GitHub", url: "https://github.com/KaungMyatZaww" },
  { label: "LinkedIn", url: "https://linkedin.com/in/kaungmyat-zaw" },
];

export const contactEmail = "kaungmyatzawneverdowell@gmail.com";
