export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  period: string;
  stack: string[];
  image: string | null;
  imageAlt: string;
  problem: string;
  contribution: string;
  decision: string;
  outcome: string;
};

export const geoEruptScreenshots = [
  { image: "/images/geoerupt/Gunung Kelud Daily Reports App-1.png", alt: "GeoErupt daily activity reports for Mount Kelud" },
  { image: "/images/geoerupt/Maps KRB Gunung Kelud Mockup-2.png", alt: "GeoErupt map showing Mount Kelud volcanic hazard zones" },
  { image: "/images/geoerupt/GeoErupt Safety Guide Smartphone Mockup-5.png", alt: "GeoErupt volcanic eruption safety guide" },
  { image: "/images/geoerupt/GeoErupt Eruption News App Mockup-6.png", alt: "GeoErupt volcanic eruption news" },
];

export const portfolio = {
  name: "Abid Farhan Abdullah",
  role: "Full-Stack Developer / Backend Engineer",
  // Set the real public HTTPS origin before publishing; do not use a placeholder domain.
  siteUrl: "",
  education: "Diploma IV in Informatics Engineering, PENS / EEPIS. Class of 2022–2026. GPA 3.69 / 4.00.",
  intro: "I build web applications and backend services for real business workflows, from REST APIs and relational databases to real-time collaborative interfaces.",
  // Use paths relative to /public, for example /images/portrait.webp.
  portrait: "/images/portrait-5fca94e5add3.webp" as string | null,
  // Add only real, verified URLs. Empty links are never rendered.
  contact: {
    email: "abidfarhan508@gmail.com",
    github: "https://github.com/abifarhann",
    linkedin: "https://www.linkedin.com/in/abid-farhan/",
    resume: "/abid-farhan-cv.pdf",
    phone: "+62 857-3085-9367",
  },
  projects: [
    {
      id: "nedo-studio",
      number: "01",
      title: "Real-Time Collaborative Low-Code Editor",
      category: "Academic collaboration · Nedo Studio",
      period: "Sep 2025 – Jun 2026",
      stack: ["CRDT", "REST APIs", "Low-Code"],
      image: null,
      imageAlt: "Real-time collaborative editor screenshot",
      problem: "Let multiple people work on the same low-code interface while keeping component changes synchronized.",
      contribution: "Developed CRDT-based collaborative features, integrated RESTful APIs, and built responsive, reusable UI components with PT Sinergi Dimensi Informatika.",
      decision: "Used CRDTs to keep collaborative state consistent across clients and connected frontend components to backend services through RESTful APIs.",
      outcome: "Delivered collaborative editing and synchronized data across clients. The related conceptual framework was published at IEEE iSemantic 2026.",
    },
    {
      id: "product-portal",
      number: "02",
      title: "Portal Produk: Product Management System",
      category: "Internship contribution · CV DB Klik",
      period: "Apr 2026 – Jul 2026",
      stack: ["Laravel", "PHP", "REST APIs"],
      image: null,
      imageAlt: "Product portal and omnichannel systems screenshot",
      problem: "Support internal operations spanning pricing, purchasing, assets, petty cash, and Chart of Accounts workflows.",
      contribution: "Delivered end-to-end petty cash and Chart of Accounts features, enhanced RESTful APIs, and improved bulk price and margin updates, filtering, pagination, and Excel/XML exports.",
      decision: "Implemented role-based permissions, approval workflows, input validation, and server-side data handling. Added feature tests for controllers, services, account requests, and imports.",
      outcome: "Contributed 200+ merged pull requests across 15+ business modules and added eight feature-test files covering Chart of Accounts workflows.",
    },
    {
      id: "volcano-app",
      number: "03",
      title: "GeoErupt: Mount Kelud EWS App",
      category: "Mobile development · Volcano monitoring",
      period: "Feb 2025 – Jun 2025",
      stack: ["Flutter", "Sensor Data", "API Integration"],
      image: geoEruptScreenshots[0].image,
      imageAlt: geoEruptScreenshots[0].alt,
      problem: "Make Mount Kelud activity monitoring, geological information, and eruption alerts accessible through a mobile application.",
      contribution: "Built Flutter interfaces for geological data and emergency notifications, integrating real-time sensor data and API services.",
      decision: "Connected sensor data and API services to the mobile interface, then tested and optimized the application across multiple Android devices.",
      outcome: "Delivered mobile monitoring and emergency-notification features, with testing across multiple Android devices.",
    },
  ] satisfies Project[],
  additionalProjects: [
    {
      id: "smart-kids-academy",
      title: "Smart Kids Academy",
      role: "Back-End Developer",
      period: "Aug 2025",
      stack: ["Laravel", "GitHub"],
      summary: "Designed the backend architecture for a tutoring platform, implemented authentication and authorization, modeled reporting and student evaluation data, and tuned database queries.",
    },
    {
      id: "docxtra",
      title: "DOCXTRA Web & Mobile App",
      role: "Front-End & Mobile Developer",
      period: "Feb 2024 – Jun 2024",
      stack: ["Next.js", "Tailwind CSS", "Flutter"],
      summary: "Built API-connected web features and real-time data views using Next.js and Tailwind CSS. Contributed to the Flutter app’s Syntax Guard feature within an agile team.",
    },
    {
      id: "owpets",
      title: "OWPETS: Pet Monitoring App",
      role: "Full Stack Mobile Developer",
      period: "May 2024 – Jun 2024",
      stack: ["Flutter", "Firebase"],
      summary: "Developed mobile features and data integration with Flutter and Firebase, and contributed to UI/UX design for the pet monitoring application.",
    },
  ],
  experience: [
    {
      company: "CV DB Klik",
      role: "Full Stack Developer Intern",
      period: "Apr 2026 – Jul 2026",
      label: "Business workflows",
      stack: ["Laravel", "REST APIs"],
      contributions: [
        "Delivered features and fixes across 15+ business modules through 200+ merged pull requests.",
        "Built petty cash and Chart of Accounts workflows, including approvals, reimbursements, import/export, and role-based permissions.",
        "Enhanced RESTful APIs and data-heavy workflows; added eight feature-test files for Chart of Accounts.",
      ],
    },
    {
      company: "PT. Sinergi Dimensi Informatika",
      role: "Front-End Developer · Nedo Studio",
      period: "Sep 2025 – Jun 2026",
      label: "Collaborative low-code",
      stack: ["CRDT", "REST APIs", "Reusable UI"],
      contributions: [
        "Developed CRDT features for real-time collaborative editing and consistent synchronization across clients.",
        "Integrated RESTful APIs and built responsive, reusable UI components from design specifications.",
        "Collaborated with backend and product teams to deliver features and refine dynamic interactions.",
      ],
    },
    {
      company: "PT. Travelana Mandiri Sejahtera",
      role: "Back-End Developer Intern",
      period: "Aug 2024 – Feb 2025",
      label: "APIs & data integrity",
      stack: ["REST APIs", "Relational Databases"],
      contributions: [
        "Designed and implemented RESTful APIs serving web and mobile applications.",
        "Built and maintained database structures for consistent, reliable data across modules.",
        "Worked with frontend developers on API integration and system performance.",
      ],
    },
  ],
  skills: [
    { name: "Backend", items: "Laravel / PHP / .NET / REST APIs", usage: "Business logic, authentication & service integration" },
    { name: "Frontend & Mobile", items: "JavaScript / React / Next.js / Flutter / Dart", usage: "HTML & CSS interfaces with Tailwind CSS, Bootstrap & DaisyUI" },
    { name: "Databases", items: "MySQL / PostgreSQL / Firebase", usage: "Relational schemas, data integrity & mobile data integration" },
    { name: "Tools & Real-Time", items: "Git / Postman / CRDT", usage: "Version control, API testing & collaborative editing" },
  ],
  publication: {
    title: "A Conceptual Framework for CRDT-Based Collaborative Low-Code Frontend Architecture",
    venue: "IEEE iSemantic 2026",
    doi: "10.1109/iSemantic71495.2026.11742770",
    url: "https://doi.org/10.1109/iSemantic71495.2026.11742770",
  },
  certifications: [
    { name: "Getting Started with Generative AI", issuer: "IBM SkillsBuild", detail: "Oct 2026" },
    { name: "Alibaba Cloud Certified Developer", issuer: "Alibaba Cloud", detail: "Expired Jan 2026" },
    { name: "PENS English Proficiency Test", issuer: "PENS Language and Culture Center", detail: "PEPT 463 · Mar 2025" },
  ],
  languages: "Indonesian (native) / English (PEPT 463)",
};

export function getPortfolioAssetPaths(): string[] {
  return [
    portfolio.portrait,
    portfolio.contact.resume,
    ...portfolio.projects.map((project) => project.image),
    ...geoEruptScreenshots.map((screenshot) => screenshot.image),
  ].filter((source): source is string => Boolean(source));
}
