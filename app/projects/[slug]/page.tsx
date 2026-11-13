import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { ProjectPreview } from "@/components/project-preview";
import { getProject, projects } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({params}: Props): Promise<Metadata> { const {slug}=await params; const p=getProject(slug); return {title: p?.title ?? "Project", description: p?.summary}; }

export default async function ProjectPage({params}: Props) {
  const {slug}=await params; const project=getProject(slug); if(!project) notFound();
  const other=projects.find(p=>p.slug!==project.slug)!;
  return <main id="main" className="case-page">
    <div className="shell case-header"><Link className="back-link" href="/#work"><ArrowLeft size={17}/> All projects</Link><div className="case-heading"><p className="eyebrow">{project.eyebrow}</p><h1>{project.title}<span className="hero-period">.</span></h1><p className="case-subtitle">{project.subtitle}</p><div className="case-meta"><span><small>TYPE</small>Independent concept</span><span><small>TIMELINE</small>{project.year}</span><span><small>STATUS</small><b className="status-dot"/>{project.status}</span></div></div></div>
    <div className="shell case-visual"><ProjectPreview slug={project.slug} large/></div>
    <div className="shell case-body reveal-on-scroll"><aside className="case-sidebar"><p className="eyebrow">PROJECT OVERVIEW</p><div className="case-sidebar-tags">{project.tags.map(t=><span key={t}>{t}</span>)}</div><div className="case-note"><strong>Transparency note</strong><p>This is an early-stage design exploration. The interface shown is a concept mockup, not a shipped product or validated result.</p></div></aside><div className="case-story"><div className="story-block"><span className="story-number">01 / CONTEXT</span><h2>The opportunity</h2><p>{project.summary}</p></div><div className="story-block"><span className="story-number">02 / PROBLEM TO EXPLORE</span><h2>The challenge</h2><p>{project.challenge}</p></div><div className="story-block"><span className="story-number">03 / EARLY DIRECTION</span><h2>What I'm exploring</h2><p>{project.direction}</p><ul className="focus-list">{project.focus.map(f=><li key={f}><span>↗</span>{f}</li>)}</ul></div><div className="story-block"><span className="story-number">04 / IN PROGRESS</span><h2>What's next</h2><p>The next step is to move beyond the visual concept and test the problem with real people. Planned activities:</p><ol className="next-steps">{project.nextSteps.map((s,i)=><li key={s}><span>{String(i+1).padStart(2,"0")}</span>{s}</li>)}</ol></div><div className="upcoming-panel"><span className="upcoming-kicker">COMING AS THE PROJECT DEVELOPS</span><h3>Research insights, iterations, and outcomes.</h3><p>This space will document real interviews, Figma explorations, usability feedback, engineering decisions, and lessons learned. No placeholder metrics or fabricated testimonials.</p></div></div></div>
    <div className="shell next-project"><span className="eyebrow">UP NEXT</span><Link href={`/projects/${other.slug}`}><span><small>EXPLORE ANOTHER PROJECT</small><strong>{other.title}</strong></span><span className="next-arrow"><ArrowRight size={27}/></span></Link></div>
  </main>;
}
