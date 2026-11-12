"use client";

import { useState } from "react";

const sourceData = [
  { id: "A", title: "Study notes — urban mobility", type: "Sample notes", excerpt: "A route's perceived convenience depends on travel time, reliability, walking distance, and how clearly transfers are communicated." },
  { id: "B", title: "Interview planning worksheet", type: "Sample document", excerpt: "Ask participants to describe the last time they researched a topic, which sources they trusted, and when they felt uncertain." },
  { id: "C", title: "Research synthesis checklist", type: "Sample checklist", excerpt: "Separate observations from assumptions. Keep each insight traceable to evidence, and mark what still needs validation." },
];
const questions = [
  { label: "How should I assess trust?", answer: "A promising approach is to show where each claim came from and what remains uncertain. For example, the synthesis checklist recommends separating observations from assumptions, while the interview worksheet encourages asking when participants felt uncertain.", citations: ["C", "B"] },
  { label: "What makes route planning hard?", answer: "Based on the sample notes, route decisions involve more than travel time. Reliability, walking distance, and the clarity of transfers are also part of the perceived experience. This is a starting hypothesis—not a validated user finding.", citations: ["A"] },
  { label: "What should I research first?", answer: "Start by asking participants to describe a recent research task and the moments they felt uncertain. Keep the resulting observations separate from assumptions as you synthesize what you heard.", citations: ["B", "C"] },
];
export function ClarityLab() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const q = questions[activeQuestion];
  return <div className="lab-app clarity-lab">
    <aside className="lab-rail" aria-label="Workspace navigation">
      <div className="lab-logo">✳ <span>clarity.</span></div>
      <div className="lab-rail-heading">WORKSPACE</div>
      <div className="lab-rail-item lab-rail-active">◫ &nbsp; Research space</div>
      <div className="lab-rail-item">▤ &nbsp; Sources <span className="lab-counter">03</span></div>
      <div className="lab-rail-caption">DEMO WORKSPACE</div>
      <p>Example documents and scripted responses. No files are uploaded or sent to an AI service.</p>
    </aside>
    <section className="lab-main">
      <div className="lab-topbar"><span>Research space / Evidence explorer</span><span className="lab-status">● Prototype</span></div>
      <div className="lab-content">
        <div className="lab-overline">SOURCE-FIRST RESEARCH</div>
        <h2>Answers you can <em>trace.</em></h2>
        <p className="lab-app-intro">Explore how an AI research product might keep evidence one click away.</p>
        <div className="lab-question-label">TRY A SAMPLE QUESTION</div>
        <div className="lab-question-grid" role="group" aria-label="Sample questions">{questions.map((question,i)=><button type="button" key={question.label} className={`lab-question ${activeQuestion===i ? "is-active" : ""}`} aria-pressed={activeQuestion===i} onClick={()=>{setActiveQuestion(i);setSelectedSource(null);setSaved(false);}}>{question.label}<span>↗</span></button>)}</div>
        <div className="lab-answer"><div className="lab-answer-head"><span>✳ &nbsp; Example response</span><button className="lab-save" type="button" onClick={()=>setSaved(!saved)} aria-pressed={saved}>{saved ? "✓ Saved in demo" : "+ Save insight"}</button></div><p>{q.answer}</p><div className="lab-citation-label">SUPPORTING SAMPLE SOURCES</div><div className="lab-cites">{q.citations.map(id=><button type="button" key={id} className={selectedSource===id?"selected":""} onClick={()=>setSelectedSource(selectedSource===id?null:id)} aria-pressed={selectedSource===id}>↗ Source {id}</button>)}</div></div>
      </div>
    </section>
    <aside className="lab-evidence" aria-label="Source evidence"><div className="lab-evidence-header">Source library <span>03</span></div><p>Choose a citation to inspect the referenced sample excerpt.</p>{sourceData.map(source=><button type="button" key={source.id} className={`lab-source ${selectedSource===source.id?"is-open":""}`} onClick={()=>setSelectedSource(selectedSource===source.id?null:source.id)} aria-expanded={selectedSource===source.id}><span className="lab-source-id">{source.id}</span><span className="lab-source-body"><strong>{source.title}</strong><small>{source.type}</small>{selectedSource===source.id&&<span className="lab-source-excerpt">“{source.excerpt}”</span>}</span></button>)}</aside>
  </div>;
}
