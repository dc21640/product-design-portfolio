"use client";

import { useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import { projects, type Project } from "@/lib/site";
import { ProjectCard, ProjectPreview } from "@/components/project-preview";

export function InteractiveWork() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [active, setActive] = useState<Project | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [finePointer, setFinePointer] = useState(false);
  const area = useRef<HTMLDivElement>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    setFinePointer(true);
    const r = area.current?.getBoundingClientRect();
    if (r) setPointer({ x: event.clientX - r.left, y: event.clientY - r.top });
  }

  return <div className="interactive-work">
    <div className="work-controls" aria-label="Project view options">
      <span className="work-count">02 PROJECTS / 2026</span>
      <div className="view-switch" role="group" aria-label="Choose project layout">
        <button type="button" aria-pressed={view === "list"} onClick={() => { setView("list"); setActive(null); }}>List <span aria-hidden="true">☷</span></button>
        <button type="button" aria-pressed={view === "grid"} onClick={() => { setView("grid"); setActive(null); }}>Grid <span aria-hidden="true">⊞</span></button>
      </div>
    </div>
    <div ref={area} className="work-interaction-area" onPointerMove={move} onPointerLeave={() => setActive(null)}>
      {view === "grid" ? <div className="project-grid interactive-grid">{projects.map(p => <ProjectCard key={p.slug} project={p}/>)}</div> :
      <div className="work-list">
        {projects.map(project => <Link href={`/projects/${project.slug}`} key={project.slug} className={`work-list-row ${active?.slug === project.slug ? "is-active" : ""}`} onPointerEnter={e => { if (e.pointerType === "mouse") setActive(project); }} onFocus={() => setActive(null)}>
          <span className="work-list-number">{project.number} /</span>
          <span className="work-list-main"><strong>{project.title}</strong><small>{project.subtitle}</small></span>
          <span className="work-list-type">{project.tags[0]}<br/><span>{project.status}</span></span>
          <span className="work-list-arrow" aria-hidden="true">↗</span>
        </Link>)}
      </div>}
      {view === "list" && active && finePointer && <div className="hover-preview" aria-hidden="true" style={{ left: Math.min(Math.max(pointer.x + 30, 10), Math.max((area.current?.clientWidth ?? 900) - 385, 10)), top: Math.max(pointer.y - 170, -10) }}><ProjectPreview slug={active.slug}/><div className="hover-preview-label">OPEN CASE STUDY ↗</div></div>}
    </div>
    <p className="project-honesty">Both projects are independent concepts in progress. Interface previews are illustrative—not validated research or shipped products.</p>
  </div>;
}
