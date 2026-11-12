import Link from "next/link";
import { ProjectCard } from "@/components/project-preview";
import { ArrowRight, ArrowUpRight } from "@/components/icons";
import { projects, site } from "@/lib/site";

export default function Home() {
  return <main id="main">
    <section className="home-hero shell" aria-labelledby="home-title">
      <div className="hero-kicker-row"><span className="kicker">INDEPENDENT PRODUCT DESIGNER & DEVELOPER</span><span className="hero-location">Virginia Tech · Blacksburg, VA</span></div>
      <div className="hero-grid">
        <div>
          <h1 id="home-title">Making complex things feel <em>clear.</em></h1>
          <p className="hero-lede">I'm Daven. I design and build digital experiences with an engineer’s eye for systems and a designer’s attention to detail.</p>
          <div className="hero-buttons"><Link className="button-primary" href="#work">Explore my work <ArrowRight size={17}/></Link><a className="button-text" href={site.resumeUrl} target="_blank" rel="noopener noreferrer">View résumé <ArrowUpRight size={17}/></a></div>
        </div>
        <aside className="hero-note" aria-label="Current focus">
          <div className="hero-note-index">CURRENTLY EXPLORING / 2026</div>
          <p>Useful AI interfaces.<br/>Clearer journeys.<br/>Better everyday tools.</p>
          <div className="availability"><span className="availability-dot" aria-hidden="true"/>Open to Summer 2027 design opportunities</div>
        </aside>
      </div>
    </section>

    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="shell">
        <div className="section-intro"><div><p className="kicker">01 / THE WORK</p><h2 id="work-title">Selected projects<span className="title-stop">.</span></h2></div><p>Two independent design explorations. Each includes a working interaction prototype and a transparent account of what’s still being developed.</p></div>
        <div className="featured-projects">{projects.map(project => <ProjectCard key={project.slug} project={project}/>)}</div>
        <p className="work-note"><span aria-hidden="true">ⓘ</span> Both projects are in progress. Prototype interactions are real; sample content and outcomes are not presented as user research or shipped products.</p>
      </div>
    </section>

    <section className="about-teaser shell" aria-labelledby="approach-title">
      <div className="about-teaser-title"><p className="kicker">02 / A LITTLE ABOUT MY APPROACH</p><h2 id="approach-title">Curiosity meets<br/><em>structure.</em></h2></div>
      <div className="about-teaser-copy"><p>I'm studying Industrial & Systems Engineering with a minor in Computer Science at Virginia Tech. I care about the point where complicated systems become understandable, useful experiences.</p><p>My process starts with framing the right problem, continues through thoughtful prototypes, and improves through observation and feedback.</p><Link href="/about" className="inline-link">More about me <ArrowUpRight size={18}/></Link></div>
    </section>
  </main>;
}
