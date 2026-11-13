import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/icons";
import { ProjectPreview } from "@/components/project-preview";
import { DesignDeepDive } from "@/components/design-deep-dive";
import { isFocusProject } from "@/lib/design-evidence";
import { getProject, projects } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return { title: p?.title ?? "Project", description: p?.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const other = projects[(projects.findIndex(p => p.slug === project.slug) + 1) % projects.length];
  const focused = isFocusProject(slug);

  return <main id="main" className={`case-page ${focused ? `case-focus-${slug}` : ""}`}>
    <div className="shell case-intro">
      <Link className="back-link" href="/#work"><ArrowLeft size={17}/> All projects</Link>
      <div className="case-hero-grid"><div><p className="kicker">{project.category.toUpperCase()}</p><h1>{project.title}<span className="title-stop">.</span></h1><p className="case-headline">{project.headline}</p></div><div className="case-hero-aside"><p>{project.summary}</p><span className="case-status"><span className="status-mark"/>Independent MVP · In progress</span><Link className="case-quick-demo" href={`/lab/${project.slug}`}>Open the working MVP <ArrowUpRight size={17}/></Link></div></div>
      <dl className="case-facts"><div><dt>MY ROLE</dt><dd>{project.role}</dd></div><div><dt>TOOLS & METHODS</dt><dd>{project.tools}</dd></div><div><dt>TIMELINE</dt><dd>{project.timeline}</dd></div></dl>
    </div>
    <div className="shell case-feature"><ProjectPreview slug={project.slug} large/><div className="case-prototype-bar"><div><strong>Explore the interaction</strong><p>Explore the React application and its documented data limitations.</p></div><Link className="button-primary" href={`/lab/${project.slug}`}>Launch application <ArrowUpRight size={17}/></Link></div></div>
    <div className="shell case-article-layout"><aside className="case-toc" aria-label="On this page"><span>IN THIS CASE STUDY</span><a href="#challenge">Overview</a>{focused?<><a href="#framing">Problem framing</a><a href="#alternatives">Design alternatives</a><a href="#workflow">Interaction flow</a><a href="#iteration">Iterations</a><a href="#evidence-plan">Testing plan</a><a href="#ownership">My role & AI use</a></>:<><a href="#flow">Experience flow</a><a href="#decisions">Design decisions</a><a href="#iteration">Iteration</a><a href="#validation">What’s next</a></>}</aside><div className="case-article">
      <section className="case-section" id="challenge"><p className="kicker">THE CHALLENGE</p><h2>Start with the right question.</h2><p className="case-question">{project.question}</p><p>{project.approach}</p><div className="case-context-note"><strong>Scope, not a claim.</strong><p>I'm exploring this problem through an independent concept. These are design hypotheses; I have not yet conducted formal interviews or measured outcomes.</p></div></section>
      {focused ? <DesignDeepDive slug={slug} /> : <>
      <section className="case-section" id="flow"><p className="kicker">EXPERIENCE FLOW</p><h2>One clear task at a time.</h2><p>The current MVP focuses on a meaningful task with a working interaction path and clear boundaries.</p><div className="experience-list">{project.experience.map(item => <div key={item.title} className="experience-item"><div><h3>{item.title}</h3><p>{item.description}</p></div></div>)}</div><Link className="inline-link" href={`/lab/${project.slug}`}>Try this flow <ArrowUpRight size={18}/></Link></section>
      <section className="case-section" id="decisions"><p className="kicker">DESIGN DECISIONS</p><h2>The reasoning behind the UI.</h2><p>Each decision is intended to solve a specific interaction problem, with a tradeoff worth testing.</p><div className="decision-list">{project.decisions.map(item => <div className="decision" key={item.title}><div><h3>{item.title}</h3><p>{item.description}</p><p className="decision-tradeoff"><strong>Tradeoff</strong> — {item.tradeoff}</p></div></div>)}</div></section>
      <section className="case-section" id="iteration"><p className="kicker">THE ITERATION</p><h2>What changed—and why.</h2><p>These refinements come from a design critique of the prototype, not from invented user interviews. They show the choices I made as the interaction became more concrete.</p><div className="iteration-grid">{project.iterations.map(item=><article className="iteration-card" key={item.before}><span>DESIGN REFINEMENT</span><div><small>BEFORE</small><p>{item.before}</p></div><div><small>NOW</small><p>{item.after}</p></div><footer><strong>Rationale:</strong> {item.why}</footer></article>)}</div></section>
      <section className="case-section" id="validation"><p className="kicker">VALIDATION & NEXT STEPS</p><h2>What I still need to learn.</h2><p>{project.testing}</p><div className="task-panel"><h3>Planned usability tasks</h3><ul>{project.testTasks.map(item => <li key={item}>{item}</li>)}</ul></div><div className="limitations"><span>PROTOTYPE LIMITATIONS</span><p>{project.boundaries}</p></div></section></>}
    </div></div>
    <div className="shell next-project"><p className="kicker">NEXT PROJECT</p><Link href={`/projects/${other.slug}`}><span><small>{other.category}</small><strong>{other.title}</strong></span><ArrowRight size={26}/></Link></div>
  </main>;
}
