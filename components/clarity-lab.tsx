'use client';

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import type { ResearchSource, Evidence } from '@/lib/clarity-engine';

type Result={mode:'ai'|'evidence';answer:string;evidence:Evidence[];note:string};
type Saved={id:string;question:string;answer:string;mode:string;date:string};
const examples: ResearchSource[]=[
 {id:'S1',title:'Interview field notes · sample',body:'Verification was difficult: a student described switching between three tabs while verifying information for an assignment. They were unsure which sentence in an AI response came from which source. The participant wanted a way to keep the supporting passage visible while reading the answer, with a clear citation. This is a fictional sample prepared solely for an interface demonstration.'},
 {id:'S2',title:'Research principles · sample',body:'Interview recent task behavior rather than hypothetical product preferences. Keep observation and assumption separate. Use evidence directly beside each research claim. When a conclusion is uncertain, label it as a hypothesis. This is illustrative sample content, not a published reference.'},
 {id:'S3',title:'Information architecture · sample',body:'Make it simple to return to the original document without losing the research question. Source previews should preserve the selected citation and keep important passages easy to scan. This is illustrative sample content, not a published reference.'},
];
const suggested=['What made verification difficult?', 'How should a citation work?', 'What should we test with students?'];
function makeId(){return 'S'+Math.random().toString(36).slice(2,9).toUpperCase();}
export function ClarityLab(){
 const [docs,setDocs]=useState<ResearchSource[]>(examples);
 const [question,setQuestion]=useState('What made verification difficult?');
 const [answer,setAnswer]=useState<Result|null>(null);
 const [activeSource,setActiveSource]=useState('S1');
 const [saved,setSaved]=useState<Saved[]>([]);
 const [view,setView]=useState<'ask'|'saved'>('ask');
 const [adding,setAdding]=useState(false);
 const [draftTitle,setDraftTitle]=useState('');
 const [draftBody,setDraftBody]=useState('');
 const [search,setSearch]=useState('');
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState('');
 const [loaded,setLoaded]=useState(false);
 const resultRef=useRef<HTMLDivElement>(null);
 const sourcePanelRef=useRef<HTMLElement>(null);
 const sourceInputId=useId();
 useEffect(()=>{
   try{
    const storedDocs=localStorage.getItem('clarity-sources-v1');
    const storedSaved=localStorage.getItem('clarity-saved-v1');
    if(storedDocs){ const value=JSON.parse(storedDocs); if(Array.isArray(value)&&value.length<=8&&value.every(d=>typeof d.id==='string'&&typeof d.body==='string'&&typeof d.title==='string'))setDocs(value); }
    if(storedSaved){const value=JSON.parse(storedSaved);if(Array.isArray(value))setSaved(value.slice(0,30));}
   }catch{/* Keep starter examples if storage is unavailable. */}
   setLoaded(true);
 },[]);
 useEffect(()=>{if(loaded){try{localStorage.setItem('clarity-sources-v1',JSON.stringify(docs));}catch{setError('Browser storage is full. Documents may not persist after refresh.');}}},[docs,loaded]);
 useEffect(()=>{if(loaded){try{localStorage.setItem('clarity-saved-v1',JSON.stringify(saved));}catch{/* Storage may be unavailable. */}}},[saved,loaded]);
 const current=docs.find(d=>d.id===activeSource)||docs[0];
 const isExample=(doc:ResearchSource)=>doc.title.endsWith('· sample');
 const shown=docs.filter(d=>(d.title+' '+d.body).toLowerCase().includes(search.toLowerCase()));
 const savedAnswer=!!answer&&saved.some(s=>s.question===question&&s.answer===answer.answer);
 function addSource(){
  setError('');
  if(docs.length>=8) return setError('This MVP supports up to 8 sources. Remove one to add another.');
  if(!draftTitle.trim()||draftBody.trim().length<30||draftBody.length>30000) return setError('Add a title and 30–30,000 characters of text.');
  const id=makeId();setDocs(prev=>[...prev,{id,title:draftTitle.trim().slice(0,120),body:draftBody.trim()}]);setActiveSource(id);setDraftTitle('');setDraftBody('');setAdding(false);setAnswer(null);
 }
 async function importFiles(event:ChangeEvent<HTMLInputElement>){
  setError('');const files=Array.from(event.target.files||[]);
  if(files.length+docs.length>8){setError('The maximum is 8 sources. Remove some or choose fewer files.');event.target.value='';return;}
  const newDocs:ResearchSource[]=[];
  for(const file of files){
   if(!/\.(txt|md|csv|json)$/i.test(file.name)){setError('This MVP imports TXT, MD, CSV and JSON files. Paste PDF text into a source for now.');continue;}
   if(file.size>30000){setError('Each text file must be under 30 KB for this MVP.');continue;}
   const body=await file.text();
   if(body.trim().length>=30){newDocs.push({id:makeId(),title:file.name.slice(0,120),body:body.trim()});}else setError('A selected file was too short.');
  }
  if(newDocs.length){setDocs(prev=>[...prev,...newDocs]);setActiveSource(newDocs[0].id);setAnswer(null);}
  event.target.value='';
 }
 async function ask(event?:FormEvent){event?.preventDefault();setView('ask');setError('');if(!question.trim()||docs.length===0){setError('Enter a question and add at least one source.');return;}
  setLoading(true);setAnswer(null);
  try{
   const response=await fetch('/api/clarity',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:question.trim(),sources:docs})});
   const result=await response.json();
   if(!response.ok)throw Error(result.error||'Could not answer this question.');
   setAnswer(result);if(result.evidence?.length)setActiveSource(result.evidence[0].sourceId);
   requestAnimationFrame(()=>resultRef.current?.focus());
  }catch(err){setError(err instanceof Error?err.message:'Something went wrong. Try again.');}
  finally{setLoading(false);}
 }
 function saveCurrent(){if(!answer)return;setSaved(prev=>prev.some(s=>s.question===question&&s.answer===answer.answer)?prev.filter(s=>!(s.question===question&&s.answer===answer.answer)):[{id:makeId(),question,answer:answer.answer,mode:answer.mode,date:new Date().toLocaleDateString()},...prev].slice(0,30));}
 function inspectSource(id:string){setActiveSource(id);if(typeof window!=='undefined'&&window.matchMedia('(max-width: 1100px)').matches){sourcePanelRef.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}}
 function answerText(text:string){return text.split(/(\[[A-Za-z0-9_-]+\])/g).map((part,index)=>{const match=part.match(/^\[([A-Za-z0-9_-]+)\]$/);return match&&answer?.evidence.some(e=>e.sourceId===match[1])?<button className="cp-inline-citation" key={index} type="button" onClick={()=>inspectSource(match[1])} aria-label={`Inspect supporting source ${match[1]}`}>{part}</button>:part;});}
 function removeSource(id:string){setDocs(prev=>prev.filter(d=>d.id!==id));if(activeSource===id)setActiveSource(docs.find(d=>d.id!==id)?.id||'');setAnswer(null);}
 return <div className="clarity-product" aria-label="Clarity AI research workspace">
  <aside className="cp-sidebar"><div className="cp-logo"><span className="cp-symbol">✳</span> Clarity <span>AI</span></div><p className="cp-side-caption">YOUR RESEARCH WORKSPACE</p><nav aria-label="Clarity navigation" className="cp-nav"><button className={view==='ask'?'is-active':''} aria-current={view==='ask'?'page':undefined} onClick={()=>setView('ask')}>◫ <span>Ask a question</span></button><button className={view==='saved'?'is-active':''} aria-current={view==='saved'?'page':undefined} onClick={()=>setView('saved')}>▤ <span>Saved answers</span><span className="cp-count">{saved.length}</span></button></nav><div className="cp-privacy">Private by default <span>Sources and saved answers stay in this browser. Queries are sent to this site’s server when you ask; if Claude is configured, selected excerpts are sent to Anthropic.</span></div></aside>
  <section className="cp-work" aria-label="Research answers">
   {view==='ask'?<>
    <div className="cp-work-top"><div><p className="cp-eyebrow">A MORE THOUGHTFUL WAY TO RESEARCH</p><h2>Ask better questions.<br/><em>Follow the evidence.</em></h2></div><span className="cp-mode-tag">WORKING MVP</span></div>
    <p className="cp-lede">Add a few sources, ask a question, and inspect the passages behind the answer. No mystery citations.</p>
    <div className="cp-prompt-chips" aria-label="Example questions">{suggested.map(p=><button key={p} type="button" onClick={()=>setQuestion(p)}>{p}<span aria-hidden>↗</span></button>)}</div>
    <form className="cp-compose" onSubmit={ask}><label htmlFor="clarity-question">Your research question</label><textarea id="clarity-question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={1200} rows={3} placeholder="What can the sources tell me about…?"/><div className="cp-compose-footer"><span>{docs.length} source{docs.length!==1?'s':''} attached · {question.length}/1200</span><button className="cp-primary" disabled={loading||!question.trim()||!docs.length} type="submit">{loading?'Finding evidence…':'Analyze sources'} <span aria-hidden>↗</span></button></div></form>
    {error&&<p className="cp-error" role="alert">{error}</p>}
    <div className="cp-results" ref={resultRef} tabIndex={-1} aria-live="polite">{answer?<><div className="cp-results-header"><div><p className="cp-eyebrow">{answer.mode==='ai'?'CLAUDE-ASSISTED SYNTHESIS':'SOURCE SEARCH · NO MODEL KEY REQUIRED'}</p><h3>{answer.mode==='ai'?'Research synthesis':'Relevant source excerpts'}</h3></div><button type="button" onClick={saveCurrent} aria-pressed={savedAnswer} className="cp-save">{savedAnswer?'✓ Saved':'+ Save answer'}</button></div><p className="cp-answer-copy">{answerText(answer.answer)}</p><p className="cp-answer-notice">{answer.note}</p>{answer.evidence.length>0&&<><div className="cp-evidence-label">OPEN THE EVIDENCE</div><div className="cp-evidence-row">{answer.evidence.map((ev,index)=><button className={activeSource===ev.sourceId?'is-active':''} type="button" key={`${ev.sourceId}-${index}`} onClick={()=>inspectSource(ev.sourceId)}><span>[{ev.sourceId}] {ev.title}</span><small>{ev.quote.slice(0,126)}{ev.quote.length>126?'…':''}</small></button>)}</div></>}</>:<div className="cp-placeholder"><span aria-hidden>✳</span><h3>Start with the sources.</h3><p>Your research answer will appear here, with evidence you can inspect on the right.</p></div>}</div>
   </>:<div className="cp-saved-view"><p className="cp-eyebrow">PERSONAL COLLECTION · STORED IN THIS BROWSER</p><h2>Saved research</h2><p>Revisit your questions and copy useful notes to another tool.</p>{saved.length===0?<div className="cp-placeholder"><h3>Nothing saved yet.</h3><p>Ask a question, then select “Save answer”.</p><button className="cp-primary" onClick={()=>setView('ask')}>Ask your first question ↗</button></div>:<div className="cp-saved-items">{saved.map(s=><article key={s.id}><small>{s.mode==='ai'?'AI-assisted':'Source search'} · {s.date}</small><h3>{s.question}</h3><p>{s.answer}</p><div><button onClick={()=>{setQuestion(s.question);setView('ask');}}>Ask again ↗</button><button onClick={()=>setSaved(prev=>prev.filter(x=>x.id!==s.id))}>Remove</button></div></article>)}</div>}</div>}
  </section>
  <aside ref={sourcePanelRef} className="cp-source-panel" aria-label="Sources library"><div className="cp-panel-top"><p className="cp-eyebrow">EVIDENCE LIBRARY</p><h3>Your sources <span>{docs.length}/8</span></h3><p>Inspect source text at any time.</p></div><div className="cp-source-actions"><label className="cp-upload">+ Import text files<input id={sourceInputId} type="file" accept=".txt,.md,.csv,.json,text/plain" multiple onChange={importFiles}/></label><button type="button" onClick={()=>setAdding(!adding)} aria-expanded={adding}>+ Paste source</button></div>
  {adding&&<div className="cp-add-source"><label htmlFor="cp-title">Source title</label><input id="cp-title" value={draftTitle} maxLength={120} onChange={e=>setDraftTitle(e.target.value)} placeholder="Article notes"/><label htmlFor="cp-body">Source text</label><textarea id="cp-body" value={draftBody} onChange={e=>setDraftBody(e.target.value)} rows={5} maxLength={30000} placeholder="Paste your notes or article text…"/><button type="button" onClick={addSource}>Add source</button></div>}
  {error&&<p className="cp-panel-error" role="alert">{error}</p>}
  <label className="cp-search-label" htmlFor="cp-search">Find a source</label><input id="cp-search" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter documents…"/><div className="cp-source-list">{shown.map(doc=><div className={`cp-source ${activeSource===doc.id?'is-active':''}`} key={doc.id}><button type="button" onClick={()=>setActiveSource(doc.id)} aria-pressed={activeSource===doc.id}><span className="cp-source-icon" aria-hidden>▤</span><span><strong>{doc.title}</strong><small>{isExample(doc)?'Illustrative sample':'Your document'} · {doc.body.length.toLocaleString()} chars</small></span></button><button type="button" className="cp-remove" aria-label={`Remove ${doc.title}`} title="Remove source" onClick={()=>removeSource(doc.id)}>×</button></div>)}{shown.length===0&&<p className="cp-empty-search">No matching sources.</p>}</div>
  {current?<div className="cp-source-excerpt"><p className="cp-eyebrow">SELECTED SOURCE · {current.id}</p><h4>{current.title}</h4><p>{current.body.slice(0,1600)}{current.body.length>1600?'…':''}</p>{isExample(current)&&<small>Fictional content provided to demonstrate the UI.</small>}</div>:<p className="cp-empty-search">Add a source to begin.</p>}
  </aside>
 </div>;
}
