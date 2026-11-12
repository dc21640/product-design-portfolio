"use client";

import { useState } from "react";

type Source = { id: string; title: string; type: string; detail: string; excerpt: string };
type AnswerBlock = { text: string; source: string };
const documents: Source[] = [
  { id: "01", title: "Urban mobility notes", type: "Sample class notes", detail: "Research notebook / 4 pages", excerpt: "Perceived route convenience is affected by reliability, total journey time, walking effort, and how transfers are explained." },
  { id: "02", title: "Interview guide", type: "Sample worksheet", detail: "Discovery plan / 2 pages", excerpt: "Ask participants to walk through a recent research decision. Focus on moments of uncertainty and why they trusted one piece of evidence over another." },
  { id: "03", title: "Synthesis checklist", type: "Sample checklist", detail: "Analysis framework / 1 page", excerpt: "Write observed behavior separately from assumptions, attach evidence to each insight, and mark anything that still needs to be validated." },
];
const prompts: { title: string; eyebrow: string; blocks: AnswerBlock[]; takeaway: string }[] = [
  { title: "How do I evaluate trust?", eyebrow: "EVIDENCE & CONFIDENCE", blocks: [
    { text: "Start by making the connection between a claim and its supporting evidence visible. The synthesis checklist recommends separating observations from assumptions.", source: "03" },
    { text: "For discovery interviews, ask people to describe a real moment of uncertainty and what made a source credible to them.", source: "02" },
  ], takeaway: "Show the source next to each claim, and preserve uncertainty instead of making every answer sound certain." },
  { title: "What makes route decisions hard?", eyebrow: "COMPLEX CHOICES", blocks: [
    { text: "The sample notes describe route choice as a balance of perceived reliability, travel time, walking effort and understandable transfers.", source: "01" },
    { text: "These notes are a working hypothesis. They still need user interviews and behavioral validation.", source: "03" },
  ], takeaway: "A helpful comparison should surface the tradeoffs, not only the shortest route." },
  { title: "What should I research first?", eyebrow: "DISCOVERY PLAN", blocks: [
    { text: "Begin with participants' recent research tasks. Ask them to reconstruct the questions, tools and moments where they needed to verify something.", source: "02" },
    { text: "Capture direct observations and assumptions separately so later synthesis remains traceable.", source: "03" },
  ], takeaway: "Observe how people check answers before deciding which AI features to build." },
];

export function ClarityLab() {
  const [question, setQuestion] = useState(0);
  const [source, setSource] = useState<string>("03");
  const [saved, setSaved] = useState<number[]>([]);
  const [view, setView] = useState<"research"|"saved">("research");
  const [query, setQuery] = useState("");
  const answer = prompts[question];
  const activeDocument = documents.find(d => d.id === source) ?? documents[0];
  const visibleDocuments = documents.filter(doc => `${doc.title} ${doc.type}`.toLowerCase().includes(query.toLowerCase()));
  const isSaved = saved.includes(question);
  const relevantSources = Array.from(new Set(answer.blocks.map(b=>b.source)));

  function chooseQuestion(index: number) { setQuestion(index); setSource(prompts[index].blocks[0].source); setView("research"); }
  function toggleSave() { setSaved(prev=>prev.includes(question)?prev.filter(i=>i!==question):[...prev,question]); }

  return <div className="ca-app">
    <aside className="ca-rail" aria-label="Clarity workspace">
      <div className="ca-logo"><span className="ca-logo-symbol" aria-hidden="true">✳</span> clarity<span>.</span></div>
      <div className="ca-workspace-label">DEMO WORKSPACE</div>
      <nav className="ca-rail-nav" aria-label="Workspace sections">
        <button type="button" className={view==="research"?"active":""} aria-current={view==="research"?"page":undefined} onClick={()=>setView("research")}><span aria-hidden="true">◫</span> Research space</button>
        <button type="button" className={view==="saved"?"active":""} aria-current={view==="saved"?"page":undefined} onClick={()=>setView("saved")}><span aria-hidden="true">▤</span> Saved insights <b>{saved.length}</b></button>
      </nav>
      <div className="ca-rail-note"><span className="ca-note-dot"/> Prototype mode<br/><small>Scripted content, no live AI.</small></div>
    </aside>
    <section className="ca-main" aria-label="Research assistant">
      <div className="ca-topbar"><span>Workspace <span aria-hidden="true">/</span> {view==="research"?"Evidence explorer":"Saved insights"}</span><span className="ca-topbar-demo">INTERACTIVE DEMO</span></div>
      {view==="research" ? <div className="ca-work">
        <div className="ca-heading"><p>RESEARCH, WITH RECEIPTS</p><h2>Stay close to <em>the source.</em></h2><span>Answers are more useful when you can check their reasoning.</span></div>
        <div className="ca-subheading">CHOOSE A RESEARCH QUESTION</div>
        <div className="ca-prompts" role="group" aria-label="Sample questions">{prompts.map((p,index)=><button type="button" className={question===index?"active":""} key={p.title} aria-pressed={question===index} onClick={()=>chooseQuestion(index)}>{p.title}<span aria-hidden="true">↗</span></button>)}</div>
        <div className="ca-answer"><div className="ca-answer-top"><div className="ca-answer-marker"><span aria-hidden="true">✳</span><div><small>SCRIPTED EXAMPLE RESPONSE</small><strong>{answer.eyebrow}</strong></div></div><button type="button" aria-pressed={isSaved} className={`ca-save ${isSaved?"saved":""}`} onClick={toggleSave}>{isSaved?"✓ Saved":"+ Save insight"}</button></div>
          <div className="ca-answer-text">{answer.blocks.map((block,index)=><p key={index}>{block.text} <button type="button" className={`ca-inline-cite ${source===block.source?"active":""}`} aria-label={`Inspect source ${block.source} supporting this statement`} aria-pressed={source===block.source} onClick={()=>setSource(block.source)}>[{block.source}]</button></p>)}</div>
          <div className="ca-takeaway"><span>DESIGN TAKEAWAY</span><p>{answer.takeaway}</p></div>
          <div className="ca-sources-used"><span>{relevantSources.length} supporting sample sources</span><span>Click a citation to inspect evidence →</span></div>
        </div>
      </div> : <div className="ca-work ca-saved-view"><p className="ca-subheading">PERSONAL COLLECTION · DEMO ONLY</p><h2>Saved insights</h2>{saved.length ? <div className="ca-saved-list">{saved.map(index=><button type="button" key={index} onClick={()=>chooseQuestion(index)}><span>RESEARCH NOTE {String(index+1).padStart(2,"0")}</span><strong>{prompts[index].title}</strong><small>Open note ↗</small></button>)}</div> : <div className="ca-empty"><strong>Nothing saved yet.</strong><p>Choose a question in the research space, then select “Save insight” to collect it here.</p><button type="button" onClick={()=>setView("research")}>Explore questions →</button></div>}<p className="ca-saved-note">Saved items are temporary in this prototype and reset when the page reloads.</p></div>}
    </section>
    <aside className="ca-evidence" aria-label="Evidence panel"><div className="ca-evidence-header"><div><p>THE SOURCE LIBRARY</p><h3>Trace the evidence</h3></div><span>03 FILES</span></div><label htmlFor="ca-source-search" className="ca-search-label">Find a document</label><input id="ca-source-search" type="search" placeholder="Search sample sources" value={query} onChange={e=>setQuery(e.target.value)}/>
      <div className="ca-sources">{visibleDocuments.length?visibleDocuments.map(doc=><button type="button" key={doc.id} className={`ca-document ${source===doc.id?"open":""}`} onClick={()=>setSource(doc.id)} aria-pressed={source===doc.id}><span className="ca-doc-icon" aria-hidden="true">▤</span><span className="ca-doc-heading"><strong>{doc.title}</strong><small>{doc.type}</small></span><span className="ca-doc-arrow" aria-hidden="true">{source===doc.id?"−":"+"}</span></button>):<p className="ca-no-results">No sample sources match your search.</p>}</div>
      <div className="ca-excerpt" aria-live="polite"><div className="ca-excerpt-meta"><span>SELECTED EVIDENCE · {activeDocument.id}</span><span>{activeDocument.detail}</span></div><h4>{activeDocument.title}</h4><blockquote>“{activeDocument.excerpt}”</blockquote><p>Illustrative text written for this design exercise—not a published source.</p></div>
    </aside>
  </div>;
}
