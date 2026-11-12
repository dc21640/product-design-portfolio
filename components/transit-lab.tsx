"use client";
import { useState } from "react";

const routes = [
  { id:"A", title:"Campus Connector", minutes:18, walk:7, transfers:0, description:"Direct ride with short walks at either end", steps:["Walk to sample North Stop · 4 min","Ride Campus Connector · 11 min","Walk to Library Plaza · 3 min"] },
  { id:"B", title:"Central Transfer", minutes:21, walk:5, transfers:1, description:"Less walking with one transfer", steps:["Walk to sample Main Stop · 2 min","Ride Route 1 · 8 min","Transfer to Route 3 · 8 min","Walk to Library Plaza · 3 min"] },
  { id:"C", title:"Scenic Walk", minutes:25, walk:25, transfers:0, description:"A walking-only alternative", steps:["Follow the sample pedestrian corridor · 12 min","Continue to Library Plaza · 13 min"] },
];

export function TransitLab() {
  const [selected, setSelected] = useState("A");
  const [lessWalking, setLessWalking] = useState(false);
  const [details, setDetails] = useState(true);
  const visible = lessWalking ? routes.filter(r => r.walk <= 5) : routes;
  const route = routes.find(r => r.id === selected)!;
  return <div className="transit-lab-app">
    <section className="transit-panel" aria-label="Route comparison">
      <div className="transit-brand">transitflow<span>.</span><span className="transit-demo-label">DEMO DATA</span></div>
      <div className="transit-field-label">EXAMPLE JOURNEY</div>
      <div className="transit-destination"><span aria-hidden="true">●</span> Campus North</div>
      <div className="transit-destination destination-end"><span aria-hidden="true">◆</span> Library Plaza</div>
      <div className="transit-controls"><h2>Compare routes</h2><label className="transit-check"><input type="checkbox" checked={lessWalking} onChange={e => {const next=e.target.checked;setLessWalking(next);if(next) setSelected("B");}}/> Less walking</label></div>
      <div className="transit-options" role="group" aria-label="Sample routes">
        {visible.map(r => <button type="button" key={r.id} className={`transit-option ${selected === r.id ? "active" : ""}`} onClick={() => {setSelected(r.id);setDetails(true);}} aria-pressed={selected === r.id}><span><strong>{r.minutes} <small>min</small></strong><small>{r.title}</small></span><span className="transit-option-meta">{r.transfers===0 ? "No transfers" : `${r.transfers} transfer`}<small>{r.walk} min walking</small></span></button>)}
      </div>
      <button type="button" className="transit-detail-toggle" onClick={()=>setDetails(!details)} aria-expanded={details} aria-controls="transit-trip-steps">{details?"Hide":"Show"} trip details <span aria-hidden="true">{details?"−":"+"}</span></button>
      <div id="transit-trip-steps" className="transit-timeline" hidden={!details}><p className="transit-timeline-intro">{route.description}</p>{route.steps.map((step,i)=><div key={step} className="transit-step"><span>{String(i+1).padStart(2,"0")}</span>{step}</div>)}</div>
    </section>
    <section className="transit-map-panel" aria-label="Illustrative route map"><div className="transit-map-grid"/><div className="transit-map-track track-one"/><div className="transit-map-track track-two"/><div className="transit-map-pin start">A</div><div className="transit-map-pin end">B</div><div className="transit-map-card" aria-live="polite"><span>SELECTED SAMPLE ROUTE</span><strong>{route.title}</strong><small>{route.minutes} min · {route.transfers === 0 ? "Direct" : "1 transfer"} · {route.walk} min walking</small></div><div className="transit-map-disclaimer">Illustrative map · no live transit data</div></section>
  </div>;
}
