import Link from "next/link";
import type { Project } from "@/lib/site";
import { ArrowUpRight, Sparkle } from "./icons";

export function ClarityPreview({ large = false }: { large?: boolean }) {
  return <div className={`preview clarity-preview ${large ? "preview-large" : ""}`} aria-label="Illustrative Clarity AI interface concept">
    <div className="clarity-glow" />
    <div className="clarity-window">
      <div className="window-bar"><div className="window-dots"><i/><i/><i/></div><span>Clarity / workspace</span><span className="window-bar-right">✳</span></div>
      <div className="clarity-content"><aside className="clarity-sidebar"><div className="app-brand"><span className="mini-brand">✳</span> clarity</div><span className="sidebar-caption">WORKSPACE</span><span className="side-item active">◫ &nbsp; My research</span><span className="side-item">▤ &nbsp; Documents</span><span className="side-item">♧ &nbsp; Collections</span><span className="sidebar-caption sidebar-second">RECENT</span><span className="side-item muted">◦ &nbsp; Urban mobility</span><span className="side-item muted">◦ &nbsp; Design systems</span></aside>
      <div className="clarity-main"><div className="clarity-top"><span>Urban mobility research</span><span className="small-circle">D</span></div><div className="clarity-center"><span className="clarity-ai-icon"><Sparkle size={18}/></span><div className="small-heading">Make sense of the details.</div><div className="small-copy">Ask your sources a question, get an answer you can trace.</div><div className="prompt-card"><span>What patterns emerge across my sources?</span><span className="prompt-arrow">↗</span></div><div className="source-pills"><span>▧ &nbsp; 6 sources attached</span><span>✧ &nbsp; Source-first answers</span></div></div></div></div>
    </div><span className="preview-disclaimer">CONCEPT INTERFACE · NOT A LIVE PRODUCT</span>
  </div>;
}

export function TransitPreview({ large = false }: { large?: boolean }) {
  return <div className={`preview transit-preview ${large ? "preview-large" : ""}`} aria-label="Illustrative TransitFlow mobile interface concept">
    <div className="transit-grid"/><div className="transit-orb transit-orb-one"/><div className="transit-orb transit-orb-two"/>
    <div className="transit-phone"><div className="phone-notch"/><div className="phone-top"><span>9:41</span><span>●●● ▰</span></div><div className="phone-body"><div className="phone-brand">transitflow<span>↗</span></div><div className="phone-title">Where to?</div><div className="search-dest"><span className="search-dot dark"/><span>Virginia Tech</span></div><div className="search-dest destination"><span className="search-dot coral"/><span>Downtown Blacksburg</span></div><div className="route-heading"><strong>Suggested routes</strong><span>Today</span></div><div className="route-option selected"><div className="route-option-top"><span className="route-tag"><i/> 3</span><strong>12 min</strong><span>↗</span></div><div className="route-option-bottom"><span>Bus + 2 min walk</span><span>Best route</span></div></div><div className="route-option"><div className="route-option-top"><span className="route-tag lavender"><i/> 7</span><strong>18 min</strong><span>↗</span></div><div className="route-option-bottom"><span>Bus + 5 min walk</span><span>1 transfer</span></div></div><div className="phone-bottom-nav"><span>⌂<small>Explore</small></span><span>◇<small>Routes</small></span><span>◯<small>Saved</small></span></div></div></div>
    <span className="preview-disclaimer">CONCEPT INTERFACE · ILLUSTRATIVE ROUTE DATA</span>
  </div>;
}

export function ProjectPreview({ slug, large = false }: { slug: Project["slug"]; large?: boolean }) {
  return slug === "clarity-ai" ? <ClarityPreview large={large}/> : <TransitPreview large={large}/>;
}

export function ProjectCard({ project }: { project: Project }) {
  return <Link href={`/projects/${project.slug}`} className="project-card" aria-label={`View ${project.title} case study`}>
    <ProjectPreview slug={project.slug}/>
    <div className="project-card-bottom"><div><div className="project-index">PROJECT {project.number} <span>—</span> {project.year}</div><h3>{project.title}</h3><p>{project.subtitle}</p></div><span className="circle-arrow"><ArrowUpRight size={21}/></span></div>
    <div className="project-card-tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}<span className="in-progress-tag">● {project.status}</span></div>
  </Link>;
}
