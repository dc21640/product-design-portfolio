import Link from 'next/link';
import type { FocusProject } from '@/lib/design-evidence';
import { focusEvidence } from '@/lib/design-evidence';
import { getProject } from '@/lib/site';

function LayoutSketch({type}:{type: 'chat'|'search'|'evidence'|'feed'|'folders'|'canvas'}) {
  // Purpose-built UI schematics reconstructed to explain product alternatives, not historic Figma screenshots.
  return <div className={`decision-sketch sketch-${type}`} aria-hidden="true">
    {type === 'chat' && <><div className="sketch-top"/><div className="sketch-chat-bubble"/><div className="sketch-chat-bubble secondary"/><div className="sketch-input"/></>}
    {type === 'search' && <><div className="sketch-search"/><div className="sketch-search-result"/><div className="sketch-search-result short"/><div className="sketch-search-result"/></>}
    {type === 'evidence' && <><div className="sketch-sidebar"/><div className="sketch-answer"><span/><span/><span/></div><div className="sketch-source"><span/><span/><span/></div></>}
    {type === 'feed' && <><div className="sketch-tile one"/><div className="sketch-tile two"/><div className="sketch-tile three"/><div className="sketch-tile four"/></>}
    {type === 'folders' && <><div className="sketch-folder"/><div className="sketch-folder"/><div className="sketch-folder"/></>}
    {type === 'canvas' && <><div className="sketch-pin first"/><div className="sketch-pin second"/><div className="sketch-note"/><div className="sketch-line"/></>}
  </div>;
}

export function DesignDeepDive({slug}:{slug: FocusProject}) {
  const project=focusEvidence[slug];
  const caseStudy=getProject(slug)!;
  return <>
    <section className="case-section" id="framing">
      <p className="kicker">01 / PROBLEM FRAMING</p>
      <h2>Define the job before the interface.</h2>
      <div className="framing-layout">
        <div><span className="evidence-field-name">WHO IT IS FOR · ASSUMPTION</span><p>{project.audience}</p></div>
        <div><span className="evidence-field-name">JOB TO BE DONE · HYPOTHESIS</span><p>{project.job}</p></div>
        <div><span className="evidence-field-name">DESIGN FRICTION</span><p>{project.friction}</p></div>
        <div><span className="evidence-field-name">FIRST RELEASE SCOPE</span><p>{project.scope}</p></div>
      </div>
      <div className="case-context-note"><strong>Research status — not yet validated.</strong><p>These are independently identified opportunities and design hypotheses. No interviews, field studies, or usability outcomes are presented as completed.</p></div>
    </section>
    <section className="case-section" id="alternatives">
      <p className="kicker">02 / EXPLORING APPROACHES</p>
      <h2>Show the alternatives, not just the final screen.</h2>
      <p>{project.hypothesis}</p>
      <p className="artifact-disclosure">These simplified diagrams reconstruct the product directions considered during prototyping; they are explanatory artifacts, not original dated sketches or user-tested variants.</p>
      <div className="design-alternatives">{project.options.map(opt=><article key={opt.id} className={`design-option ${opt.status==='Chosen direction'?'design-option-chosen':''}`}>
        <div className="design-option-head"><span>ROUTE {opt.id}</span><span>{opt.status}</span></div>
        <LayoutSketch type={opt.type}/><div className="design-option-copy"><h3>{opt.name}</h3><p><strong>What works:</strong> {opt.strength}</p><p><strong>Tradeoff:</strong> {opt.weakness}</p></div>
      </article>)}</div>
    </section>
    <section className="case-section" id="workflow">
      <p className="kicker">03 / INTERACTION LOGIC</p><h2>Follow a complete task.</h2>
      <p>The application is organized around one continuous user goal. Each step corresponds to a working interaction in the MVP.</p>
      <ol className="flow-steps">{project.workflow.map((step,index)=><li key={step}><span>{String(index+1).padStart(2,'0')}</span>{step}</li>)}</ol>
      <Link className="inline-link" href={`/lab/${slug}`}>Try the application <span aria-hidden="true">↗</span></Link>
    </section>
    <section className="case-section" id="iteration">
      <p className="kicker">04 / ITERATION TRACE</p><h2>Show the changed interaction.</h2>
      <p>These are changes made through implementation and self-critique—not outcomes from participant testing. Each change is visible in the working MVP.</p>
      <div className="iteration-grid">{caseStudy.iterations.map((item,i)=><article className="iteration-card" key={item.before}><span>REFINEMENT {String(i+1).padStart(2,'0')}</span><div><small>EARLIER VERSION</small><p>{item.before}</p></div><div><small>NOW</small><p>{item.after}</p></div><footer><strong>Design rationale:</strong> {item.why}</footer></article>)}</div>
    </section>
    <section className="case-section" id="evidence-plan">
      <p className="kicker">05 / EVIDENCE, NOT INVENTED METRICS</p><h2>Make the next decision testable.</h2>
      <p><strong>Research question:</strong> {project.testQuestion}</p>
      <div className="task-table" role="table" aria-label="Usability test plan"><div className="task-row task-row-head" role="row"><span role="columnheader">TASK</span><span role="columnheader">WHAT TO OBSERVE</span><span role="columnheader">SUCCESS SIGNAL</span></div>{project.tasks.map((task,index)=><div className="task-row" role="row" key={task.id}><div role="cell"><b>{String(index+1).padStart(2,'0')}.</b> {task.instruction}</div><div role="cell">{task.observe}</div><div role="cell">{task.success}</div></div>)}</div>
      <div className="study-cta"><div><h3>Usability study workspace</h3><p>Run a session, record task outcomes and friction, and export anonymized notes. No participant results have been added to this public case study.</p></div><Link href={`/study/${slug}`} className="button-primary">Open study kit <span aria-hidden="true">↗</span></Link></div>
    </section>
    <section className="case-section" id="ownership">
      <p className="kicker">06 / OWNERSHIP & LIMITATIONS</p><h2>Make the work explainable.</h2>
      <h3 className="ownership-heading">Design and implementation decisions</h3>
      <ul className="ownership-list">{project.designerContribution.map(item=><li key={item}>{item}</li>)}</ul>
      <h3 className="ownership-heading">How AI was used</h3><p>{project.aiRole}</p>
      <h3 className="ownership-heading">Questions still open</h3><ul className="ownership-list">{project.openQuestions.map(item=><li key={item}>{item}</li>)}</ul>
    </section>
  </>;
}
