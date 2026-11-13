'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { zipSync, strToU8 } from 'fflate';
import { Photo, seedPhotos, ReviewState } from '@/lib/creative-data';
import { deletePhoto, getPhoto, putPhoto } from '@/lib/photo-vault';

type Mode='library'|'review'|'proofing';
type Filter='all'|'picked'|'unrated'|'approved'|'changes';
const KEY='exposure-studio-v1';
const id=()=>crypto.randomUUID?.()??`${Date.now()}-${Math.random()}`;
const escapeCsv=(v:string|number)=>`"${String(v).replace(/"/g,'""')}"`;
const download=(content:Blob,name:string)=>{
 const url=URL.createObjectURL(content);const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
};

export function ExposureApp(){
 const [photos,setPhotos]=useState<Photo[]>(seedPhotos);
 const [mode,setMode]=useState<Mode>('library');
 const [filter,setFilter]=useState<Filter>('all');
 const [sort,setSort]=useState<'original'|'rating'|'name'>('original');
 const [search,setSearch]=useState('');
 const [activeId,setActiveId]=useState(seedPhotos[0].id);
 const [notice,setNotice]=useState('');
 const [ready,setReady]=useState(false);
 const [working,setWorking]=useState(false);
 const uploader=useRef<HTMLInputElement>(null);
 const blobUrls=useRef<string[]>([]);
 const active=mode==='proofing'?(photos.find(p=>p.id===activeId&&p.picked)??photos.find(p=>p.picked)??photos[0]):(photos.find(p=>p.id===activeId)??photos[0]);
 const counts=useMemo(()=>({total:photos.length,picks:photos.filter(p=>p.picked).length,reviewed:photos.filter(p=>p.rating>0).length,approved:photos.filter(p=>p.review==='approved').length}),[photos]);
 const visible=useMemo(()=>photos.filter(p=>{
  if(filter==='picked'&&!p.picked)return false;
  if(filter==='unrated'&&p.rating!==0)return false;
  if(filter==='approved'&&p.review!=='approved')return false;
  if(filter==='changes'&&p.review!=='revisions')return false;
  return `${p.name} ${p.caption}`.toLowerCase().includes(search.toLowerCase().trim());
 }).sort((a,b)=>sort==='rating'?b.rating-a.rating:sort==='name'?a.name.localeCompare(b.name):0),[photos,filter,search,sort]);
 const focusPhotos=mode==='proofing'?photos.filter(p=>p.picked):(visible.length?visible:photos);

 useEffect(()=>{
  let canceled=false;
  (async()=>{
   let restored:Photo[]=seedPhotos;
   try{const saved=localStorage.getItem(KEY);if(saved){const parsed=JSON.parse(saved);if(Array.isArray(parsed)&&parsed.length){restored=parsed as Photo[];}}}catch{}
   const results=await Promise.all(restored.map(async p=>{
     if(p.source==='demo')return p;
     try{const blob=await getPhoto(p.id);if(blob){const url=URL.createObjectURL(blob);blobUrls.current.push(url);return {...p,src:url};}}catch{}
     return null;
   }));
   if(!canceled){const available=results.filter((p):p is Photo=>!!p);setPhotos(available);setReady(true);}
  })();
  return()=>{canceled=true;blobUrls.current.forEach(u=>URL.revokeObjectURL(u));blobUrls.current=[];};
 },[]);
 useEffect(()=>{
  if(!ready)return;
  try{localStorage.setItem(KEY,JSON.stringify(photos.map(p=>p.source==='upload'?{...p,src:''}:p)));}catch{setNotice('Your browser could not save image metadata. Export your selection to keep a record.');}
 },[photos,ready]);
 useEffect(()=>{if(!photos.some(p=>p.id===activeId)&&photos[0])setActiveId(photos[0].id);},[photos,activeId]);
 const mutate=useCallback((pId:string,changes:Partial<Photo>)=>setPhotos(prev=>prev.map(p=>p.id===pId?{...p,...changes}:p)),[]);
 const shift=(step:number)=>{const arr=focusPhotos;if(!arr.length)return;const i=arr.findIndex(p=>p.id===activeId);setActiveId(arr[(i+step+arr.length)%arr.length]?.id??activeId);};
 useEffect(()=>{
  if(mode==='library')return;
  const key=(e:KeyboardEvent)=>{
   const el=e.target as HTMLElement|null;
   if(el&&['INPUT','TEXTAREA','SELECT'].includes(el.tagName))return;
   if(e.key==='ArrowRight'){e.preventDefault();shift(1);}
   if(e.key==='ArrowLeft'){e.preventDefault();shift(-1);}
   if(mode==='review'&&active){
    if(/^[1-5]$/.test(e.key)){e.preventDefault();mutate(active.id,{rating:Number(e.key)});}
    if(e.key.toLowerCase()==='p'){e.preventDefault();mutate(active.id,{picked:!active.picked});}
   }
  };
  window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[mode,activeId,active?.rating,active?.picked,photos,filter,search,sort]);
 const startReview=()=>{const next=photos.find(p=>p.rating===0)??photos.find(p=>p.picked)??photos[0];if(next)setActiveId(next.id);setMode('review');};
 const startProofing=()=>{const first=photos.find(p=>p.picked);if(first)setActiveId(first.id);setMode('proofing');};
 const doImport=async(files:FileList|null)=>{
  if(!files?.length)return;
  const allowed=Array.from(files).filter(f=>f.type.startsWith('image/')).slice(0,40);
  if(allowed.some(f=>f.size>24*1024*1024)){setNotice('Import JPG, PNG or WebP images under 24 MB each.');return;}
  setWorking(true);
  const imported:Photo[]=[];
  try{
   for(const file of allowed){const pId=id();await putPhoto(pId,file);const url=URL.createObjectURL(file);blobUrls.current.push(url);
    imported.push({id:pId,name:file.name,src:url,source:'upload',rating:0,picked:false,review:'pending',caption:file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' '),comment:''});
   }
   setPhotos(prev=>[...imported,...prev]);setActiveId(imported[0]?.id??activeId);setFilter('all');setSearch('');setMode('library');setNotice(`${imported.length} photo${imported.length===1?'':'s'} imported into your local workspace.`);
  }catch{setNotice('The browser could not store all those images. Try fewer or smaller files.');}
  finally{setWorking(false);if(uploader.current)uploader.current.value='';}
 };
 const removeImported=async()=>{
  if(!active||active.source!=='upload')return;
  if(!window.confirm(`Remove ${active.name} from this browser workspace?`))return;
  setWorking(true);
  try{await deletePhoto(active.id);blobUrls.current=blobUrls.current.filter(url=>url!==active.src);URL.revokeObjectURL(active.src);setPhotos(prev=>prev.filter(p=>p.id!==active.id));setNotice('Imported photo removed from local storage.');}
  catch{setNotice('Could not remove this image from browser storage.');}
  finally{setWorking(false);}
 };
 const changePhoto=(status:ReviewState)=>{if(!active)return;mutate(active.id,{review:status});setNotice(status==='approved'?'Marked approved for this local proofing session.':'Review decision saved in this browser.');};
 const resetSession=async()=>{
  if(!window.confirm('Reset ratings, selections and uploaded images to the demo state? This cannot be undone.'))return;
  setWorking(true);try{await Promise.all(photos.filter(p=>p.source==='upload').map(p=>deletePhoto(p.id)));localStorage.removeItem(KEY);setPhotos(seedPhotos);setActiveId(seedPhotos[0].id);setFilter('all');setSearch('');setMode('library');setNotice('Demo workspace restored.');}catch{setNotice('Could not fully reset local image storage.');}finally{setWorking(false);}
 };
 const manifest=()=>[
  ['file','caption','rating','selected','client_decision','client_note'].map(escapeCsv).join(','),
  ...photos.map(p=>[p.name,p.caption,p.rating,p.picked?'yes':'no',p.review,p.comment].map(escapeCsv).join(','))
 ].join('\r\n');
 const exportCsv=()=>download(new Blob([manifest()],{type:'text/csv;charset=utf-8'}),'exposure-review-manifest.csv');
 const exportPicks=async()=>{
  const picks=photos.filter(p=>p.picked);if(!picks.length)return;
  setWorking(true);setNotice('Preparing selected images…');
  try{
   const files:Record<string,Uint8Array>={'manifest.csv':strToU8(manifest()),'READ_ME.txt':strToU8('EXPOSURE — LOCAL DELIVERY PACKAGE\nSelected image files and the full local review manifest. Demo sample imagery is not client work. Uploaded images remain private to this browser until you export them.\n')};
   for(let i=0;i<picks.length;i++){
    const p=picks[i];const blob=p.source==='upload'?await getPhoto(p.id):await fetch(p.src).then(r=>{if(!r.ok)throw new Error('Could not load demo asset.');return r.blob();});
    if(!blob)throw new Error(`Missing local file for ${p.name}`);
    const ext=p.name.split('.').pop()?.replace(/[^a-z0-9]/gi,'').toLowerCase()||'jpg';
    const fileName=`selected/${String(i+1).padStart(2,'0')}-${p.name.replace(/[^a-zA-Z0-9_.-]/g,'_')}`;
    files[fileName.endsWith(`.${ext}`)?fileName:`${fileName}.${ext}`]=new Uint8Array(await blob.arrayBuffer());
   }
   const zip=zipSync(files,{level:2});download(new Blob([new Uint8Array(zip)],{type:'application/zip'}),'exposure-selected-photos.zip');setNotice(`${picks.length} selected image${picks.length===1?'':'s'} packaged for download.`);
  }catch(e){setNotice(e instanceof Error?e.message:'Export failed. Please try again.');}
  finally{setWorking(false);}
 };
 return <div className="expo-app" aria-label="Exposure photography workspace">
  <div className="expo-top"><div className="expo-brand"><span className="expo-logo" aria-hidden="true">◧</span><strong>exposure<span>.</span></strong><small>PRO / WORKSPACE</small></div><div className="expo-top-right"><span><i aria-hidden="true"/> Private browser workspace</span><button onClick={()=>uploader.current?.click()} disabled={working}>+ Import photos</button></div></div>
  <input className="sr-only" type="file" ref={uploader} accept="image/jpeg,image/png,image/webp,image/avif,image/gif" multiple aria-label="Import photos" onChange={e=>void doImport(e.target.files)}/>
  <div className="expo-shell"><aside className="expo-side"><span className="expo-nav-label">YOUR WORKSPACE</span><nav aria-label="Exposure views"><button className={mode==='library'?'on':''} aria-current={mode==='library'?'page':undefined} onClick={()=>setMode('library')}><span>▦</span> Library <b>{counts.total}</b></button><button className={mode==='review'?'on':''} aria-current={mode==='review'?'page':undefined} onClick={()=>setMode('review')}><span>◈</span> Review <b>{counts.reviewed}</b></button><button className={mode==='proofing'?'on':''} aria-current={mode==='proofing'?'page':undefined} onClick={()=>setMode('proofing')}><span>✳</span> Proofing <b>{counts.approved}</b></button></nav><div className="expo-side-bottom"><p className="expo-nav-label">CURRENT COLLECTION</p><div className="expo-collection-dot" aria-hidden="true"/><strong>Editorial studies</strong><small>Demo session / 2026</small><button onClick={resetSession} disabled={working}>Reset demo ↗</button></div></aside>
   <main className="expo-main"><div className="expo-heading"><div><p className="expo-eyebrow">COLLECTION / 001 / INDEPENDENT PRODUCT MVP</p><h2>{mode==='library'?'The edit.':mode==='review'?'Make the cut.':'The final look.'}</h2><p>{mode==='library'?'Every frame has a story. Find the ones worth telling.':mode==='review'?'Less clicking, more looking. Rate, select and move forward.':'A focused, local preview of the client approval experience.'}</p></div><div className="expo-top-actions"><button onClick={exportCsv}>Export manifest ↓</button><button className="expo-primary" onClick={()=>void exportPicks()} disabled={!counts.picks||working}>{working?'Working…':`Deliver ${counts.picks} picks ↓`}</button></div></div>
    <nav className="expo-workflow" aria-label="Photography workflow"><button type="button" className={mode==='library'?'on':''} aria-current={mode==='library'?'step':undefined} onClick={()=>uploader.current?.click()} disabled={working}><span className="expo-workflow-step">1</span> Import photos</button><button type="button" className={mode==='review'?'on':''} aria-current={mode==='review'?'step':undefined} onClick={startReview}><span className="expo-workflow-step">2</span> Rate and select</button><button type="button" className={mode==='proofing'?'on':''} aria-current={mode==='proofing'?'step':undefined} onClick={startProofing}><span className="expo-workflow-step">3</span> Client preview</button><button type="button" onClick={()=>void exportPicks()} disabled={!counts.picks||working}><span className="expo-workflow-step">4</span> Export picks</button></nav>
    {notice&&<div className="expo-status" role="status"><span>{notice}</span><button onClick={()=>setNotice('')} aria-label="Dismiss message">×</button></div>}
    <div className="expo-stat-grid" aria-label="Collection summary"><div><span>ALL FRAMES</span><strong>{counts.total.toString().padStart(2,'0')}</strong></div><div><span>RATED</span><strong>{counts.reviewed.toString().padStart(2,'0')}</strong><small>{Math.round(100*counts.reviewed/Math.max(1,counts.total))}% complete</small></div><div><span>SELECTED</span><strong>{counts.picks.toString().padStart(2,'0')}</strong></div><div><span>APPROVED</span><strong>{counts.approved.toString().padStart(2,'0')}</strong></div></div>
    {mode==='library'&&<>
     <div className="expo-guidance"><div><strong>{counts.reviewed===counts.total?'Your first pass is complete.':'Ready for the first pass?'}</strong><p>{counts.reviewed===counts.total?`You've rated all ${counts.total} frames. Revisit your favorites or move into client preview.`:`${counts.total-counts.reviewed} frames still need a rating. Review one at a time, mark your strongest selects, then preview what a client would see.`}</p></div><button type="button" onClick={counts.reviewed===counts.total&&counts.picks?startProofing:startReview}>{counts.reviewed===counts.total&&counts.picks?'Preview selected photos ↗':'Review next frame ↗'}</button></div>
     <div className="expo-toolbar"><label className="expo-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search image filenames or captions</span><input type="search" placeholder="Find a frame…" value={search} onChange={e=>setSearch(e.target.value)}/></label><label className="expo-filter-select">Filter<span className="sr-only"> photos</span><select value={filter} onChange={e=>setFilter(e.target.value as Filter)}><option value="all">All images</option><option value="picked">Selected only</option><option value="unrated">Not rated</option><option value="approved">Approved</option><option value="changes">Needs changes</option></select></label><label className="expo-filter-select">Sort<select value={sort} onChange={e=>setSort(e.target.value as typeof sort)}><option value="original">Import order</option><option value="rating">Highest rated</option><option value="name">Filename A–Z</option></select></label></div>
     {visible.length?<div className="expo-library-grid">{visible.map((p,i)=><article key={p.id} className={`expo-thumb ${activeId===p.id?'active':''}`}><button type="button" className="expo-thumb-open" onClick={()=>{setActiveId(p.id);setMode('review');}} aria-label={`Open ${p.name} in full-size review`}><div className="expo-thumb-photo"><img src={p.src} alt={p.caption||p.name} loading="lazy"/><span className="expo-thumb-number">{String(photos.indexOf(p)+1).padStart(2,'0')}</span>{p.review==='approved'&&<span className="expo-badge success">APPROVED</span>}{p.review==='revisions'&&<span className="expo-badge warning">CHANGES</span>}</div><span className="expo-thumb-name">{p.name}</span><span className="expo-thumb-stars">{p.rating?'★'.repeat(p.rating)+'☆'.repeat(5-p.rating):'Not rated'}</span></button><button aria-label={`${p.picked?'Remove':'Add'} ${p.name} ${p.picked?'from':'to'} selected images`} aria-pressed={p.picked} className={`expo-thumb-pick ${p.picked?'chosen':''}`} onClick={()=>mutate(p.id,{picked:!p.picked})}>{p.picked?'✓ PICK':'＋ PICK'}</button></article>)}</div>:<div className="expo-empty"><strong>No frames match this view.</strong><p>Try changing your filters or importing new images.</p><button onClick={()=>{setFilter('all');setSearch('');}}>Clear filters</button></div>}
     {active&&<div className="expo-inspect"><div><span className="expo-eyebrow">FRAME INSPECTOR</span><strong>{active.name}</strong><p>{active.caption}</p></div><div className="expo-inspect-buttons"><button onClick={()=>{setMode('review');}} className="expo-small-primary">Review frame ↗</button><button onClick={()=>mutate(active.id,{picked:!active.picked})}>{active.picked?'Remove pick':'Select frame'}</button>{active.source==='upload'&&<button onClick={()=>void removeImported()}>Remove upload</button>}</div></div>}
    </>}
    {mode==='proofing'&&counts.picks===0&&<div className="expo-empty expo-empty-proof"><strong>No selected photos yet.</strong><p>Pick at least one image during review, then return here to experience the client approval flow.</p><button type="button" onClick={startReview}>Start selecting photos ↗</button></div>}
    {(mode==='review'||(mode==='proofing'&&counts.picks>0))&&active&&<div className="expo-review-shell"><div className="expo-focus"><div className="expo-focus-bar"><div><span>{mode==='review'?'CULLING / FOCUS MODE':'PROOFING / CLIENT PREVIEW'}</span><strong>{active.name}</strong></div><span>{Math.max(0,focusPhotos.findIndex(p=>p.id===activeId))+1} / {focusPhotos.length}</span></div><div className="expo-focus-photo"><img src={active.src} alt={active.caption||active.name}/><button className="expo-prev" aria-label="Previous image" onClick={()=>shift(-1)}>←</button><button className="expo-next" aria-label="Next image" onClick={()=>shift(1)}>→</button></div><div className="expo-filmstrip" aria-label="Choose a frame">{focusPhotos.map(p=><button type="button" aria-label={`View ${p.name}`} aria-current={active.id===p.id?'true':undefined} className={active.id===p.id?'active':''} key={p.id} onClick={()=>setActiveId(p.id)}><img src={p.src} alt=""/></button>)}</div></div><div className="expo-review-panel">
       {mode==='review'?<><span className="expo-eyebrow">PHOTO REVIEW</span><h3>Make your selection.</h3><p>Rate each frame. Keep the best. Move quickly without losing your place.</p><div className="expo-rating"><span>YOUR RATING</span><div role="group" aria-label="Photo rating">{[1,2,3,4,5].map(n=><button type="button" aria-pressed={active.rating===n} aria-label={`Rate ${n} star${n===1?'':'s'}`} onClick={()=>mutate(active.id,{rating:active.rating===n?0:n})} key={n} className={n<=active.rating?'is-filled':''}>★</button>)}</div><small>Use keys 1–5 · ← → to navigate</small></div><button className={`expo-pick-main ${active.picked?'selected':''}`} onClick={()=>mutate(active.id,{picked:!active.picked})}>{active.picked?'✓ In selected set':'＋ Add to selected set'}<span>Shortcut P</span></button><label className="expo-caption">Caption / context<textarea rows={3} value={active.caption} onChange={e=>mutate(active.id,{caption:e.target.value.slice(0,240)})}/></label>{active.source==='upload'&&<button className="expo-delete-import" onClick={()=>void removeImported()} disabled={working}>Remove this imported image</button>}<div className="expo-review-foot"><span>EDITING TIP</span><p>Good culling is a design decision: remove repetition, keep variety, and build a visual rhythm.</p></div></>:<><span className="expo-eyebrow">CLIENT REVIEW / LOCAL SIMULATION</span><h3>Ready for approval?</h3><p>Walk through the decision-making experience as a client. These choices are stored only in your browser—not shared with another person.</p><div className="expo-proofing-buttons"><button className={active.review==='approved'?'current':''} aria-pressed={active.review==='approved'} onClick={()=>changePhoto('approved')}>✓ Approve image</button><button className={active.review==='revisions'?'current-alt':''} aria-pressed={active.review==='revisions'} onClick={()=>changePhoto('revisions')}>↺ Request changes</button><button className="expo-clear-decision" onClick={()=>changePhoto('pending')}>Clear decision</button></div><label className="expo-caption">Feedback to photographer<textarea rows={5} placeholder="What should change?" value={active.comment} onChange={e=>mutate(active.id,{comment:e.target.value.slice(0,600)})}/></label><div className="expo-review-foot"><span>WHAT THIS PROTOTYPE DOESN'T DO</span><p>No external share links, live client accounts or cloud synchronization. Export the manifest to keep a record.</p></div></>}
      </div></div>}
    <div className="expo-bottom-note"><span>✳</span><p>Sample photos are included for demonstration. Imports, ratings and review comments stay on this device; delivery exports are generated locally in your browser.</p></div>
   </main></div>
 </div>;
}
