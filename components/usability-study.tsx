'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { focusEvidence, type FocusProject } from '@/lib/design-evidence';

type Outcome = 'not-tested' | 'independent' | 'with-help' | 'unable';
type TaskResult = { id:string; outcome:Outcome; friction:string; observation:string };
type Session = { id:string; participantCode:string; date:string; taskResults:TaskResult[]; worked:string; problems:string; nextChange:string; recordedAt:string };
const options: {value:Outcome;label:string}[] = [
  {value:'not-tested',label:'Not attempted'},
  {value:'independent',label:'Completed independently'},
  {value:'with-help',label:'Completed with help'},
  {value:'unable',label:'Could not complete'}
];
const download = (content:string, filename:string, mime:string) => {
  const url=URL.createObjectURL(new Blob([content],{type:mime}));
  const a=document.createElement('a'); a.href=url; a.download=filename; a.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
};
const quoteCSV = (value:unknown) => `"${String(value ?? '').replace(/"/g,'""')}"`;
function newSession(slug:FocusProject): Session {
  const id=typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {id,participantCode:'',date:new Date().toISOString().slice(0,10),taskResults:focusEvidence[slug].tasks.map(t=>({id:t.id,outcome:'not-tested',friction:'',observation:''})),worked:'',problems:'',nextChange:'',recordedAt:''};
}

export function UsabilityStudy({slug}:{slug:FocusProject}) {
  const project=focusEvidence[slug];
  const storageKey=`portfolio-research-${slug}-v1`;
  const [sessions,setSessions]=useState<Session[]>([]);
  const [draft,setDraft]=useState<Session|null>(null);
  const [permission,setPermission]=useState(false);
  const [status,setStatus]=useState('');
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{
    try {const raw=localStorage.getItem(storageKey);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed))setSessions(parsed.filter(s=>s&&typeof s.id==='string'&&Array.isArray(s.taskResults)));}}
    catch{setStatus('This browser could not restore saved notes. You can begin a new session.');}
    setLoaded(true);
  },[storageKey]);
  const totals=useMemo(()=>sessions.reduce((acc,s)=>{for(const task of s.taskResults){if(task.outcome==='independent')acc.independent++;if(task.outcome==='with-help')acc.help++;if(task.outcome==='unable')acc.unable++;}return acc;},{independent:0,help:0,unable:0}),[sessions]);
  const update=(patch:Partial<Session>)=>setDraft(p=>p?{...p,...patch}:p);
  const updateTask=(id:string,patch:Partial<TaskResult>)=>setDraft(p=>p?{...p,taskResults:p.taskResults.map(t=>t.id===id?{...t,...patch}:t)}:p);
  const save=()=>{
    if(!draft)return;
    if(!/^[a-z0-9-]{1,16}$/i.test(draft.participantCode.trim())){setStatus('Use a short anonymous code, such as P01. Do not enter a person’s name.');return;}
    const record={...draft,participantCode:draft.participantCode.trim(),recordedAt:new Date().toISOString()};
    const next=[record,...sessions.filter(s=>s.id!==draft.id)];
    try {localStorage.setItem(storageKey,JSON.stringify(next));setSessions(next);setDraft(null);setStatus('Session saved in this browser. Export a copy to preserve your research.');}
    catch {setStatus('This browser could not save the session. Export your notes as a file instead.');download(JSON.stringify(record,null,2),`${slug}-session-${record.participantCode}.json`,'application/json');}
  };
  const exportAll=()=>{if(!sessions.length)return;
    const headers=['project','session_id','participant_code','date','task_id','task','outcome','friction','observation','worked','problems','next_change'];
    const rows=sessions.flatMap(s=>project.tasks.map(task=>{const r=s.taskResults.find(t=>t.id===task.id);return [slug,s.id,s.participantCode,s.date,task.id,task.instruction,r?.outcome,r?.friction,r?.observation,s.worked,s.problems,s.nextChange];}));
    download([headers,...rows].map(row=>row.map(quoteCSV).join(',')).join('\r\n'),`${slug}-usability-sessions.csv`,'text/csv;charset=utf-8');
  };
  const remove=(id:string)=>{if(!window.confirm('Delete this locally saved session? This cannot be undone.'))return;
    const next=sessions.filter(s=>s.id!==id);try{localStorage.setItem(storageKey,JSON.stringify(next));setSessions(next);setStatus('Session deleted from this browser.');}catch{setStatus('Unable to update browser storage.');}
  };
  return <div className="study-shell">
    <div className="study-intro"><div><p className="kicker">RESEARCH WORKSPACE / {project.title.toUpperCase()}</p><h2>Observe before you conclude.</h2><p>This study kit is for evaluating the actual MVP. It contains tasks, success criteria, and a local note-taking form—<strong>not prewritten findings.</strong></p></div><Link href={`/lab/${slug}`} className="study-try" target="_blank" rel="noopener noreferrer">Open {project.title} in a new tab <span aria-hidden="true">↗</span></Link></div>
    <div className="study-privacy" role="note"><strong>Privacy & consent.</strong> Ask for permission before taking notes. Use anonymous codes such as P01, not names or contact information. Nothing from this form is sent to a server. Browser storage can be cleared; export your notes before switching devices.</div>
    <div className="study-columns">
      <section className="study-guide" aria-labelledby="study-task-title"><p className="kicker">FACILITATOR'S GUIDE</p><h3 id="study-task-title">Tasks to observe</h3><p>Read the task aloud without explaining the interface. Note hesitation, unexpected actions, and whether help was needed. Avoid leading questions.</p>
        <ul>{project.tasks.map(task=><li key={task.id}><div><strong>{task.instruction}</strong><small><b>Observe:</b> {task.observe}</small><small><b>Completion criterion:</b> {task.success}</small></div></li>)}</ul>
        <div className="study-guide-note"><strong>After the tasks</strong><p>Ask: “What was most confusing?” “What felt straightforward?” and “What would you change first?” Do not translate these responses into a quantitative claim without documenting the sessions.</p></div>
      </section>
      <section className="study-record" aria-labelledby="study-record-title"><div className="study-record-head"><div><p className="kicker">SESSION LOG</p><h3 id="study-record-title">Record what actually happened</h3></div></div>
        {!draft ? <div className="study-start"><label className="study-consent"><input type="checkbox" checked={permission} onChange={e=>setPermission(e.target.checked)}/><span>I have permission to record anonymous usability observations.</span></label><button className="study-primary" type="button" onClick={()=>{setDraft(newSession(slug));setStatus('');}} disabled={!permission}>Start anonymous session</button><p>The session form becomes available after confirming permission. You can save an incomplete session.</p></div> : <form className="study-form" onSubmit={e=>{e.preventDefault();save();}}>
          <div className="study-form-row"><label>Participant code <input type="text" value={draft.participantCode} onChange={e=>update({participantCode:e.target.value})} maxLength={16} pattern="[a-zA-Z0-9-]{1,16}" placeholder="P01" required/></label><label>Session date <input type="date" value={draft.date} onChange={e=>update({date:e.target.value})} required/></label></div>
          {project.tasks.map(task=>{const current=draft.taskResults.find(t=>t.id===task.id)!;return <fieldset className="study-task-form" key={task.id}><legend>{task.instruction}</legend>
            <label>Outcome <select value={current.outcome} onChange={e=>updateTask(task.id,{outcome:e.target.value as Outcome})}>{options.map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></label>
            <label>Friction or difficulty <input value={current.friction} onChange={e=>updateTask(task.id,{friction:e.target.value})} placeholder="E.g., missed Save to board" maxLength={260}/></label>
            <label>Observation (what happened, not why you assume it happened) <textarea rows={2} value={current.observation} onChange={e=>updateTask(task.id,{observation:e.target.value})} maxLength={900} placeholder="Observed behavior or anonymous quote…"/></label>
          </fieldset>;})}
          <div className="study-debrief"><label>What worked well? <textarea rows={2} value={draft.worked} onChange={e=>update({worked:e.target.value})} maxLength={1000}/></label><label>What caused confusion? <textarea rows={2} value={draft.problems} onChange={e=>update({problems:e.target.value})} maxLength={1000}/></label><label>Potential design change to evaluate <textarea rows={2} value={draft.nextChange} onChange={e=>update({nextChange:e.target.value})} maxLength={1000}/></label></div>
          <div className="study-form-actions"><button type="submit" className="study-primary">Save session locally</button><button type="button" className="study-secondary" onClick={()=>{if(window.confirm('Discard unsaved session notes?'))setDraft(null);}}>Discard draft</button></div>
        </form>}
        {status&&<p className="study-status" role="status">{status}</p>}
      </section>
    </div>
    <section className="study-archive" aria-label="Saved anonymous research sessions"><div className="study-archive-header"><div><p className="kicker">OBSERVATION RECORD</p><h3>{loaded?sessions.length:'—'} saved session{sessions.length===1?'':'s'}</h3><p>Results below only reflect notes saved in this browser. They are not public product claims.</p></div><button className="study-secondary" type="button" disabled={!sessions.length} onClick={exportAll}>Export CSV</button></div>
      {sessions.length ? <><div className="study-totals"><span><strong>{totals.independent}</strong> tasks completed independently</span><span><strong>{totals.help}</strong> completed with help</span><span><strong>{totals.unable}</strong> could not complete</span></div><div className="study-session-list">{sessions.map(s=><div key={s.id}><div><strong>{s.participantCode}</strong><small>{s.date} · {s.taskResults.filter(t=>t.outcome!=='not-tested').length} task outcomes recorded</small></div><button className="study-text-button" type="button" onClick={()=>{setDraft({...s});setStatus('Editing previously saved session.');}}>Edit</button><button className="study-text-button danger" type="button" onClick={()=>remove(s.id)}>Delete</button></div>)}</div></> : <div className="study-empty"><strong>No sessions recorded.</strong><p>Run the study with actual participants, then export your anonymized notes. You should not display success rates or participant quotes before testing.</p></div>}
    </section>
  </div>;
}
