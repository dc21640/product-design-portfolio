import Link from "next/link";
import type { Project } from "@/lib/site";
import { ArrowUpRight } from "./icons";

export function ClarityPreview({ large = false }: { large?: boolean }) {
  return <div className={`project-art art-clarity ${large ? "project-art-large" : ""}`} role="img" aria-label="Illustrative Clarity AI research workspace, showing a research answer alongside its source evidence">
    <div className="art-clarity-browser" aria-hidden="true">
      <div className="art-browser-bar"><span className="art-browser-dots"><i/><i/><i/></span><span>Clarity / Workspace</span><span className="art-browser-icon">◈</span></div>
      <div className="art-browser-body">
        <div className="art-browser-rail"><strong>clarity<span>.</span></strong><small>WORKSPACE</small><div className="art-rail-active">Research space</div><div>Source library</div><div>Saved insights</div><small className="art-rail-bottom">A BETTER WAY TO RESEARCH</small></div>
        <div className="art-browser-main"><span className="art-small-label">URBAN MOBILITY RESEARCH</span><h4>Stay close to<br/>the source.</h4><p>What factors influence how people choose a route?</p><div className="art-response"><span>RESEARCH NOTE</span><p>Journey choices often involve time, reliability, and walking effort—not just the shortest route.</p><div><b>01</b> Sample notes <b>↗</b></div></div></div>
        <div className="art-browser-evidence"><span>↗ &nbsp; SOURCE EVIDENCE</span><div className="art-evidence-card"><small>01 / SAMPLE DOCUMENT</small><strong>Urban mobility notes</strong><p>Route convenience is shaped by time, walking distance, and reliability.</p></div></div>
      </div>
    </div>
    <span className="art-label" aria-hidden="true">01 / INTERFACE CONCEPT</span>
  </div>;
}

export function TransitPreview({ large = false }: { large?: boolean }) {
  return <div className={`project-art art-transit ${large ? "project-art-large" : ""}`} role="img" aria-label="Illustrative TransitFlow phone concept showing published Blacksburg Transit route names and corridor descriptions">
    <div className="art-transit-map" aria-hidden="true"><div className="map-road road-one"/><div className="map-road road-two"/><div className="map-road road-three"/><div className="map-path"><span/><span/></div></div>
    <div className="art-transit-phone" aria-hidden="true">
      <div className="art-phone-status"><span>9:41</span><span>●●◖</span></div>
      <div className="art-phone-content"><div className="art-transit-brand">transitflow<span>.</span></div><span className="art-small-label">PLAN YOUR JOURNEY</span><h4>Go with<br/>confidence.</h4><div className="art-destinations"><div><i className="start-dot"/> Stroubles Circle</div><div><i className="end-dot"/> VT Transit Center</div></div><div className="art-route-caption">BT route examples <span>Daytime</span></div><div className="art-route-option selected"><strong>HWA</strong><div>Hethwood A<small>Via Prices Fork Rd</small></div><span>↗</span></div><div className="art-route-option"><strong>HWC</strong><div>Hethwood Combined<small>Later / weekends</small></div><span>↗</span></div></div>
    </div>
    <div className="art-map-note" aria-hidden="true">BLACKSBURG BUS CORRIDORS / DEMO</div>
    <span className="art-label" aria-hidden="true">02 / MOBILE CONCEPT</span>
  </div>;
}

export function ProjectPreview({ slug, large = false }: { slug: Project["slug"]; large?: boolean }) {
  return slug === "clarity-ai" ? <ClarityPreview large={large}/> : <TransitPreview large={large}/>;
}

export function ProjectCard({ project }: { project: Project }) {
  return <article className="featured-project">
    <Link href={`/projects/${project.slug}`} className="featured-project-visual" aria-label={`View ${project.title} project case study`}><ProjectPreview slug={project.slug}/></Link>
    <div className="featured-project-info">
      <div className="project-topline"><span>{project.index} / {project.category}</span><span>{project.year}</span></div>
      <div><p className="project-status"><span className="status-mark" aria-hidden="true"/> IN PROGRESS</p><h3>{project.title}</h3><p className="project-headline">{project.headline}</p><p className="project-summary">{project.summary}</p></div>
      <div className="project-actions"><Link className="project-link" href={`/projects/${project.slug}`}>Read case study <ArrowUpRight size={19}/></Link><Link className="project-demo-link" href={`/lab/${project.slug}`}>Try prototype <ArrowUpRight size={17}/></Link></div>
    </div>
  </article>;
}
