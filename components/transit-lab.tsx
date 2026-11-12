"use client";

import { useState, type CSSProperties } from "react";
import { journeys, origins, type OriginId, type ServiceWindow } from "@/lib/transit-data";

const serviceNames: Record<ServiceWindow, string> = {
  weekday: "Weekday AM",
  later: "Evening / weekend",
};

export function TransitLab() {
  const [origin, setOrigin] = useState<OriginId>("stroubles");
  const [period, setPeriod] = useState<ServiceWindow>("weekday");
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const selected = journeys.find((j) => j.origin === origin && j.service.includes(period));
  const place = origins.find((item) => item.id === origin)!;
  const journey = selected ?? journeys.find((j) => j.origin === origin)!;

  function selectOrigin(value: OriginId) {
    setOrigin(value);
    setExpanded(true);
    setCopied(false);
  }
  async function copyRoute() {
    if (!journey || !navigator.clipboard) return;
    const summary = `${journey.code} — ${journey.name}\nFrom: ${place.label}\nTo: ${journey.to} (${journey.loop})\nVia: ${journey.via.join(" → ")}\n\nIllustrative trip guide; verify service at ridebt.org/schedules`;
    try { await navigator.clipboard.writeText(summary); setCopied(true); }
    catch { setCopied(false); }
  }

  return <div className="tf-app">
    <section className="tf-sidebar" aria-labelledby="tf-title">
      <div className="tf-brandline"><div className="tf-brand">transit<span>flow</span><b>.</b></div><span className="tf-demo-pill">DESIGN DEMO</span></div>
      <div className="tf-headcopy"><p className="tf-eyebrow">BLACKSBURG, VIRGINIA</p><h2 id="tf-title">Find your way <em>to campus.</em></h2><p>Explore published BT bus corridors in a clearer, calmer interface.</p></div>
      <div className="tf-form">
        <label htmlFor="tf-origin">Traveling from</label>
        <div className="tf-select-wrap"><span className="tf-input-marker" aria-hidden="true"/><select id="tf-origin" value={origin} onChange={event=>selectOrigin(event.target.value as OriginId)}>{origins.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select><span className="tf-select-chevron" aria-hidden="true">⌄</span></div>
        <div className="tf-destination"><span className="tf-destination-mark" aria-hidden="true"/><div><span>Destination</span><strong>Virginia Tech Transit Center</strong></div></div>
      </div>
      <fieldset className="tf-service"><legend>When would you travel?</legend><div className="tf-service-choices">{(["weekday","later"] as const).map(v=><button type="button" key={v} aria-pressed={period === v} className={period === v ? "is-selected" : ""} onClick={()=>{setPeriod(v);setExpanded(true);setCopied(false);}}>{serviceNames[v]}</button>)}</div></fieldset>
      <div className="tf-result-heading"><span>YOUR ROUTE</span><small>Official line · example itinerary</small></div>
      <div className="tf-route-results" aria-live="polite" aria-atomic="true">
        {selected ? <article className="tf-route-card" style={{"--route-color":journey.color} as CSSProperties}>
          <div className="tf-route-main"><span className="tf-line-badge">{journey.code}</span><div><h3>{journey.name}</h3><p>To {journey.loop} · Direct bus corridor</p></div><span className="tf-route-check" aria-label="Selected route">✓</span></div>
          <div className="tf-route-info"><span>Published route</span><span>No live arrival data</span></div>
          <div className="tf-route-message">{journey.note}</div>
        </article> : <div className="tf-no-service"><strong>No matching published example in this demo.</strong><p>Try “Weekday daytime” or choose another origin. This is not a statement that no real bus is operating.</p></div>}
      </div>
      <div className="tf-actionrow"><button disabled={!selected} className="tf-steps-button" type="button" aria-controls="tf-steps" aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}>{expanded ? "Hide journey steps" : "Show journey steps"}<span aria-hidden="true">{expanded?"−":"+"}</span></button></div>
      <div id="tf-steps" hidden={!expanded || !selected} className="tf-steps"><ol>{journey.journey.map((step,index)=><li key={step}><span>{String(index+1).padStart(2,"0")}</span><p>{step}</p></li>)}</ol></div>
    </section>
    <section className="tf-visual" aria-labelledby="tf-map-label" style={{"--route-color":journey.color} as CSSProperties}>
      <div className="tf-visual-top"><div><p className="tf-eyebrow">{selected ? "THE ROUTE AT A GLANCE" : "REFERENCE CORRIDOR · CHECK SERVICE"}</p><h3 id="tf-map-label">{place.label} <span>→</span> {journey.loop}</h3></div><span className="tf-schematic-tag">SCHEMATIC</span></div>
      <div className="tf-map" aria-label={`Simplified corridor diagram for ${journey.code}: ${journey.via.join(", ")}`} role="img">
        <svg className="tf-map-svg" viewBox="0 0 760 430" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <g fill="none" stroke="#d6dfed" strokeWidth="18" strokeLinecap="round" opacity=".9"><path d="M-90 90 L270 90 L500 410"/><path d="M100 -50 L160 470"/><path d="M-80 330 L800 330"/><path d="M530 -50 L630 480"/></g>
          <g fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round"><path d="M-90 90 L270 90 L500 410"/><path d="M100 -50 L160 470"/><path d="M-80 330 L800 330"/><path d="M530 -50 L630 480"/></g>
          <path d="M92 330 L260 290 L395 180 L650 116" fill="none" stroke="#fff" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M92 330 L260 290 L395 180 L650 116" fill="none" stroke="var(--route-color)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
          {[[92,330],[260,290],[395,180],[650,116]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={i===0||i===3?13:10} fill="white" stroke="var(--route-color)" strokeWidth="6"/>{i===0&&<circle cx={x} cy={y} r="5" fill="var(--route-color)"/>}</g>)}
        </svg>
        <div className="tf-map-street tf-street-one" aria-hidden="true">PRICES FORK RD</div>
        <div className="tf-map-street tf-street-two" aria-hidden="true">VIRGINIA TECH</div>
        <div className="tf-map-label tf-label-start"><span className="tf-map-label-num">01</span><strong>{journey.via[0]}</strong><small>Starting area</small></div>
        <div className="tf-map-label tf-label-end"><span className="tf-map-label-num">04</span><strong>{journey.loop}</strong><small>Campus arrival</small></div>
      </div>
      <div className="tf-waypoints" aria-label="Corridor landmarks"><p className="tf-eyebrow">PUBLISHED CORRIDOR</p><ol>{journey.via.map((stop,index)=><li key={`${journey.id}-${index}`}><span className="tf-waypoint-dot"/><span>{stop}</span></li>)}</ol></div>
      <div className="tf-bottomline"><p>{selected ? "Route codes and corridors reference Blacksburg Transit. This is a conceptual diagram—not a live navigator." : "This is a corridor reference only. No route example is verified in the selected demo service window. Confirm actual service with BT."}</p><div><button type="button" className="tf-copy" onClick={copyRoute}>{copied ? "Copied route summary ✓" : "Copy route summary"}</button><a href="https://ridebt.org/schedules" target="_blank" rel="noopener noreferrer">Official BT schedules ↗</a></div></div>
    </section>
  </div>;
}
