import Link from "next/link";
import { ProjectCard } from "@/components/project-preview";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { projects, site } from "@/lib/site";

// Four real portfolio projects, including Muse. Each shortcut links to its card
// and each card links to both the case study and the working app.
export default function Home() {
  return (
    <main id="main">
      <section className="home-hero refined-hero shell" aria-labelledby="home-title">
        <div className="refined-hero-meta">
          <p className="refined-eyebrow"><span className="refined-eyebrow-mark" aria-hidden="true"/> DAVEN CORRIELUS <span className="refined-slash" aria-hidden="true">/</span> PRODUCT DESIGN</p>
          <p className="refined-hero-location">Virginia Tech · Blacksburg, Virginia</p>
        </div>

        <div className="refined-hero-grid">
          <div className="refined-hero-primary">
            <h1 id="home-title"><span>Designing for people.</span><span>Building with <span className="refined-accent">purpose.</span></span></h1>
            <p className="refined-hero-description">I’m Daven, an engineering student and independent product designer. I turn complex ideas into clear, practical digital experiences—from early concepts to working prototypes.</p>
            <div className="refined-hero-actions">
              <Link className="button-primary" href="#work">Explore projects <ArrowRight size={17}/></Link>
              <a className="button-text" href={site.resumeUrl} target="_blank" rel="noopener noreferrer">View résumé <ArrowUpRight size={17}/></a>
            </div>
          </div>
          <aside className="refined-hero-aside" aria-label="Design focus and availability">
            <p className="refined-aside-label">MY PRACTICE</p>
            <p className="refined-aside-heading">Thoughtful interfaces for complicated everyday problems.</p>
            <p className="refined-aside-detail">Research, interaction design, and front-end engineering—brought together in products you can actually try.</p>
            <div className="refined-availability"><span className="refined-availability-dot" aria-hidden="true"/> Open to Summer 2027 internships</div>
          </aside>
        </div>

        <nav className="refined-project-index" aria-label="Jump to a featured project">
          <span className="refined-index-title">Explore the work <span aria-hidden="true">↓</span></span>
          <div className="refined-index-links">
            {projects.map((project) => (
              <a key={project.slug} href={`#project-${project.slug}`}>
                <span className="refined-index-no">{project.index}</span>
                {project.title}
                <span className="refined-index-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </nav>
      </section>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="shell">
          <div className="section-intro">
            <div><p className="kicker">01 / SELECTED WORK</p><h2 id="work-title">Four projects. Four perspectives<span className="title-stop">.</span></h2></div>
            <p>AI research, transit navigation, visual discovery, and professional photography. Open a case study or try the real prototype.</p>
          </div>
          <div className="featured-projects">
            {projects.map(project => <ProjectCard key={project.slug} project={project}/>)}
          </div>
          <p className="work-note"><span aria-hidden="true">ⓘ</span> These are independent MVPs in progress. Each case study explains what works, what remains experimental, and what still needs real user testing.</p>
        </div>
      </section>

      <section className="about-teaser shell" aria-labelledby="approach-title">
        <div className="about-teaser-title"><p className="kicker">02 / HOW I WORK</p><h2 id="approach-title">Curiosity meets<br/><em>structure.</em></h2></div>
        <div className="about-teaser-copy"><p>I study Industrial &amp; Systems Engineering with a minor in Computer Science at Virginia Tech. I’m interested in the space where technical complexity becomes understandable, useful experiences.</p><p>My process starts with the problem, continues through thoughtful prototypes, and improves through observation and feedback.</p><Link href="/about" className="inline-link">More about me <ArrowUpRight size={18}/></Link></div>
      </section>
    </main>
  );
}
