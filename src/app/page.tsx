import Image from "next/image";
import { geoEruptScreenshots, getPortfolioAssetPaths, portfolio } from "@/data/portfolio";
import { ProjectArt } from "@/components/project-art";
import { Reveal } from "@/components/reveal";
import { DevAssetRefresh } from "@/components/dev-asset-refresh";
import { SmoothDetails } from "@/components/smooth-details";
import { ProjectCarousel } from "@/components/project-carousel";
import { readAssetVersions, versionedAssetUrl } from "@/lib/asset-versions";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "↘"}</span>;
}

function projectImageSizes(id: string) {
  if (id === "nedo-studio") return "92vw";
  if (id === "product-portal") return "(max-width: 600px) 88vw, 53vw";
  return "(max-width: 600px) 88vw, (max-width: 900px) 38vw, 30vw";
}

export default async function Home() {
  const { contact } = portfolio;
  const development = process.env.NODE_ENV === "development";
  const assetVersions = await readAssetVersions(getPortfolioAssetPaths());
  const resume = versionedAssetUrl(contact.resume, assetVersions);
  return (
    <>
      {development && <DevAssetRefresh initialVersions={assetVersions} />}
      <Reveal />
      <header className="hero" id="top">
        <nav className="navigation page-pad" aria-label="Main navigation">
          <a href="#top" className="brand" aria-label="Abid Farhan, back to top">AF<span>®</span></a>
          <span className="nav-note mono">INDEPENDENT MIND.<br />CONNECTED SYSTEMS.</span>
          <div className="nav-links"><a href="#work">Work</a><a href="#experience">Experience</a><a href="#about">About</a><a href="#contact">Contact <Arrow diagonal /></a></div>
        </nav>
        <div className="hero-stage">
          <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
          <span className="hero-side mono">CODE WITH INTENT. BUILD WITH PURPOSE.</span>
          <h1 className="hero-name" aria-label="Abid Farhan Abdullah"><span>ABID</span><span className="name-slash">/</span><span>FARHAN</span></h1>
          <div className="portrait">
            {portfolio.portrait ? <Image src={versionedAssetUrl(portfolio.portrait, assetVersions)} alt="Abid Farhan Abdullah" fill sizes="(max-width: 600px) 36vw, (max-width: 900px) 30vw, (max-width: 1375px) 24vw, 330px" preload unoptimized={development} /> : <div className="portrait-placeholder" role="img" aria-label="Portrait placeholder: Abid Farhan Abdullah"><div className="portrait-grid" /><span className="portrait-index mono" aria-hidden="true">FIG. 01 / THE DEVELOPER</span><div className="silhouette"><div className="silhouette-head" /><div className="silhouette-body" /></div><span className="portrait-caption mono" aria-hidden="true">YOUR PORTRAIT HERE ↗</span></div>}
          </div>
          <span className="hero-annotation mono">BASED IN INDONESIA<br />BUILDING FOR THE WEB.</span>
          <span className="hero-plus plus-left" aria-hidden="true">+</span><span className="hero-plus plus-right" aria-hidden="true">+</span>
        </div>
        <div className="hero-bottom page-pad"><p className="mono">FULL-STACK DEVELOPER<br />/ BACKEND ENGINEER</p><a className="round-link" href="#work">View Work <span>↗</span></a><a className="scroll-link mono" href="#about">SCROLL TO EXPLORE <span>↓</span></a></div>
      </header>
      <main id="main" tabIndex={-1}>
        <section id="about" className="about page-pad section-light">
          <div className="section-kicker mono"><span>01 / A LITTLE CONTEXT</span><span>MORE THAN THE CODE</span></div>
          <div className="about-content" data-reveal><span className="tiny-cross" aria-hidden="true">✳</span><h2>{portfolio.intro}</h2><p>{portfolio.education}</p>{contact.resume ? <a className="pill-link" href={resume} target="_blank" rel="noopener noreferrer">View Résumé <span>↗</span></a> : <a className="pill-link" href="#experience">Get to know my work <span>↗</span></a>}</div>
          <span className="about-footnote mono">THOUGHTFUL INTERFACES. RELIABLE FOUNDATIONS.</span>
        </section>
        <section id="work" className="work page-pad section-light">
          <div className="section-kicker mono"><span>02 / SELECTED WORK</span><span>IDEAS → WORKING SYSTEMS</span></div>
          <div className="section-heading" data-reveal><h2>BUILT TO SOLVE.<br />MADE TO WORK.</h2><p>A selection of projects across<br />collaboration, commerce, and mobile.</p></div>
          <div className="project-grid">
            {portfolio.projects.map((project, index) => <article key={project.id} className={`project project-${project.id}`} data-reveal data-reveal-delay={index * 70}>
              {project.id === "volcano-app" ? <ProjectCarousel slides={geoEruptScreenshots.map((slide) => ({ ...slide, image: versionedAssetUrl(slide.image, assetVersions) }))} title={project.title} href={`#${project.id}-details`} sizes={projectImageSizes(project.id)} unoptimized={development} /> : <a className={`project-image image-${project.id}`} href={`#${project.id}-details`} aria-label={`Read about ${project.title}`}>
                {project.image ? <Image src={versionedAssetUrl(project.image, assetVersions)} alt={project.imageAlt} fill sizes={projectImageSizes(project.id)} unoptimized={development} /> : <ProjectArt kind={project.id} />}
                {!project.image && <span className="image-placeholder-label mono">CONCEPT PREVIEW / SCREENSHOTS WITHHELD FOR PRIVACY</span>}
                <span className="image-open" aria-hidden="true">↗</span>
              </a>}
              <div className="project-meta"><span className="mono project-number">/{project.number}</span><div><p className="mono project-category">{project.category}</p><h3>{project.title}</h3><p className="mono project-period">{project.period}</p><p className="mono project-stack">{project.stack.join(" / ")}</p></div></div>
              <SmoothDetails id={`${project.id}-details`} label={`Explore project: ${project.title}`} summary="Explore project"><div className="detail-content">{[["The problem", project.problem], ["My contribution", project.contribution], ["Technical decisions", project.decision], ["Outcome & evidence", project.outcome]].map(([title, text]) => <div key={title}><h4 className="mono">{title}</h4><p>{text}</p></div>)}{project.id === "nedo-studio" && <a className="evidence-link" href={portfolio.publication.url} target="_blank" rel="noopener noreferrer">Read the iSemantic publication <Arrow diagonal /></a>}</div>
              </SmoothDetails>
            </article>)}
          </div>
          <div className="project-archive" data-reveal>
            <h3 className="mono">MORE PROJECTS / BACKEND, WEB & MOBILE</h3>
            {portfolio.additionalProjects.map((project) => <SmoothDetails id={`${project.id}-details`} key={project.id} className="archive-project" label={`Explore project: ${project.title}`} summary={<div><h4>{project.title}</h4><p className="mono">{project.role} / {project.period}</p></div>}>
              <div className="archive-copy"><p>{project.summary}</p><p className="mono">{project.stack.join(" / ")}</p></div>
            </SmoothDetails>)}
          </div>
          <div className="work-end mono"><span>SELECTED PROJECTS / 01-03</span><span>ALWAYS LEARNING. ALWAYS BUILDING. ↗</span></div>
        </section>
        <section id="experience" className="experience page-pad">
          <div className="section-kicker mono"><span>03 / EXPERIENCE</span><span>FROM REQUIREMENTS TO REALITY</span></div>
          <div className="experience-intro" data-reveal><h2>GOOD SOFTWARE STARTS<br />WITH UNDERSTANDING<br />THE WORK.</h2><p>Turning everyday business needs<br />into connected, usable systems.</p></div>
          <div className="experience-stage"><div className="experience-orbit" aria-hidden="true" /><div className="experience-word" aria-hidden="true">HOW I WORK</div><span className="experience-note mono">BUSINESS LOGIC<br />SYSTEM INTEGRATION<br />REAL-WORLD WORKFLOWS</span>
            {portfolio.experience.map((job, index) => <article className={`experience-panel panel-${index}`} key={job.company} data-reveal data-reveal-delay={index * 70}><div className="panel-top mono"><span>0{index + 1} / {job.label}</span><Arrow diagonal /></div><h3>{job.company}</h3><p className="job-role">{job.role}</p><p className="mono job-period">{job.period}</p><ul>{job.contributions.map((item) => <li key={item}>{item}</li>)}</ul><div className="panel-bottom mono">{job.stack.join(" / ")}</div></article>)}
          </div>
          <div className="experience-end mono"><span>BUILD. CONNECT. ITERATE.</span><span>THE PROCESS MATTERS. ↗</span></div>
        </section>
        <section className="skills page-pad section-light" id="skills">
          <div className="section-kicker mono"><span>04 / THE TOOLKIT</span><span>TOOLS IN SERVICE OF THE PROBLEM</span></div>
          <div className="section-heading" data-reveal><h2>THE RIGHT TOOLS.<br />SOLID FOUNDATIONS.</h2><p>From the interface to the database.<br />A practical, connected stack.</p></div>
          <div className="skill-list">{portfolio.skills.map((skill, index) => <div className="skill-row" key={skill.name} data-reveal data-reveal-delay={index * 50}><span className="mono skill-index">0{index + 1}</span><h3>{skill.name}</h3><div><p>{skill.items}</p><span>{skill.usage}</span></div><Arrow diagonal /></div>)}</div>
          <div className="credentials" data-reveal>
            <div className="publication"><h3 className="mono">RESEARCH / {portfolio.publication.venue}</h3><a href={portfolio.publication.url} target="_blank" rel="noopener noreferrer">{portfolio.publication.title} <Arrow diagonal /></a><p className="mono">DOI: {portfolio.publication.doi}</p></div>
            <div className="certifications"><h3 className="mono">CERTIFICATIONS & LANGUAGES</h3><ul>{portfolio.certifications.map((certification) => <li key={certification.name}><h4>{certification.name}</h4><p>{certification.issuer}</p><p className="mono">{certification.detail}</p></li>)}</ul><p className="languages">{portfolio.languages}</p></div>
          </div>
        </section>
      </main>
      <footer id="contact" className="footer page-pad">
        <div className="section-kicker mono"><span>05 / WHAT’S NEXT?</span><a href="#top">BACK TO TOP ↑</a></div>
        <div className="contact-content"><div><p className="mono">HAVE A ROLE OR A PROJECT IN MIND?</p><h2>LET’S TALK<span>↗</span></h2><p className="contact-copy">Looking for a developer who cares about<br />the interface and what runs behind it?</p></div><div className="contact-actions">{contact.email ? <a className="contact-button" href={`mailto:${contact.email}`}>Email Me <span>↗</span></a> : <p className="contact-pending mono">CONTACT DETAILS<br />COMING SOON.</p>}<div className="social-links">{contact.github && <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}{contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}{contact.resume && <a href={resume} target="_blank" rel="noopener noreferrer">CV ↗</a>}</div>{contact.phone && <a className="phone-link mono">{contact.phone}</a>}</div></div>
        <div className="footer-line mono"><span>ABID FARHAN ABDULLAH</span><span>FULL-STACK / BACKEND</span><span>BUILT WITH INTENT.</span></div>
        <div className="footer-wordmark" aria-hidden="true">ABID/FARHAN</div>
        <div className="footer-bottom mono"><span>© {new Date().getFullYear()} ABID FARHAN ABDULLAH</span><span>THANKS FOR SCROLLING.</span></div>
      </footer>
    </>
  );
}
