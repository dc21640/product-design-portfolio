'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BoardItem, MuseBoard, seedBoards, seedVisuals, Visual } from '@/lib/creative-data';
import { makeBoardPng } from '@/lib/muse-export';

type View = 'discover'|'boards'|'studio';
type Dialog = {type:'save';visualId:string}|{type:'visual';visualId:string}|{type:'new-board';visualId?:string}|{type:'new-note'}|{type:'rename-board'}|null;
const KEY='muse-studio-v1';
const categories=['All','Photography','Typography','Textures','Form'] as const;
const token=()=>typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random()}`;
const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
const toFile=(text:string,name:string,type:string)=>{
  const blob=new Blob([text],{type});const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
};
function optimizedDataURL(file:File):Promise<string>{
 return new Promise((resolve,reject)=>{
  const blobUrl=URL.createObjectURL(file);const img=new Image();
  img.onload=()=>{try{
    const scale=Math.min(1,1000/Math.max(img.width,img.height));const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
    const ctx=canvas.getContext('2d');if(!ctx)throw Error('Image processing unavailable');
    ctx.drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.72));
  }catch(e){reject(e);}finally{URL.revokeObjectURL(blobUrl);}};
  img.onerror=()=>{URL.revokeObjectURL(blobUrl);reject(Error('The selected image could not be read.'));};img.src=blobUrl;
 });
}

export function MuseApp(){
 const [view,setView]=useState<View>('discover');
 const [visuals,setVisuals]=useState<Visual[]>(seedVisuals);
 const [boards,setBoards]=useState<MuseBoard[]>(seedBoards);
 const [boardId,setBoardId]=useState(seedBoards[0].id);
 const [selected,setSelected]=useState<string|null>(null);
 const [category,setCategory]=useState<string>('All');
 const [search,setSearch]=useState('');
 const [dialog,setDialog]=useState<Dialog>(null);
 const [boardName,setBoardName]=useState('');
 const [noteText,setNoteText]=useState('');
 const [noteColor,setNoteColor]=useState<'yellow'|'pink'|'blue'>('yellow');
 const [notice,setNotice]=useState('');
 const [exporting,setExporting]=useState(false);
 const [ready,setReady]=useState(false);
 const [dragging,setDragging]=useState<{id:string,x:number,y:number,originX:number,originY:number}|null>(null);
 const uploadRef=useRef<HTMLInputElement>(null);
 const workspaceRef=useRef<HTMLDivElement>(null);
 const dialogRef=useRef<HTMLDivElement>(null);
 const board=boards.find(b=>b.id===boardId)??boards[0];
 const selectedItem=board?.items.find(i=>i.id===selected);
 const chosenVisual=selectedItem?.kind==='visual'?visuals.find(p=>p.id===selectedItem.visualId):null;
 const inspectedVisual=dialog?.type==='visual'?visuals.find(p=>p.id===dialog.visualId):null;

 useEffect(()=>{
  try{const saved=localStorage.getItem(KEY);if(saved){const v=JSON.parse(saved);
    if(Array.isArray(v.visuals))setVisuals(v.visuals);
    if(Array.isArray(v.boards)&&v.boards.length)setBoards(v.boards);
    if(typeof v.boardId==='string')setBoardId(v.boardId);
  }}catch{setNotice('Stored boards could not be restored. Sample boards are available.');}
  setReady(true);
 },[]);
 useEffect(()=>{
  if(!ready)return;
  try{localStorage.setItem(KEY,JSON.stringify({visuals,boards,boardId}));}
  catch{setNotice('Browser storage is full. Export your board data to preserve your changes.');}
 },[visuals,boards,boardId,ready]);
 useEffect(()=>{
  if(!dialog)return;
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const container=dialogRef.current;
  const focusables=()=>Array.from(container?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled])')??[]);
  focusables()[0]?.focus();
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();setDialog(null);return;}
   if(e.key!=='Tab')return;
   const items=focusables();if(!items.length)return;
   const first=items[0],last=items[items.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };
  window.addEventListener('keydown',key);
  return()=>{window.removeEventListener('keydown',key);previous?.focus();};
 },[dialog]);

 const displayed=useMemo(()=>visuals.filter(v=>(category==='All'||v.category===category)&&`${v.title} ${v.tags.join(' ')} ${v.category}`.toLowerCase().includes(search.toLowerCase().trim())),[visuals,category,search]);
 const go=(next:View)=>{setView(next);setSelected(null);};
 const newBoard=(visualId?:string)=>{
  const name=boardName.trim();if(!name){setNotice('Name your board first.');return;}
  const id=token();const item:BoardItem[] = visualId?[{id:token(),kind:'visual',visualId,x:75,y:86}]:[];
  setBoards(prev=>[...prev,{id,name,description:'A visual direction in progress',createdAt:Date.now(),items:item}]);
  setBoardId(id);setBoardName('');setDialog(null);go('studio');setNotice('Board created. Arrange it however you like.');
 };
 const saveVisual=(visualId:string,targetId:string)=>{
  setBoards(prev=>prev.map(b=>{
    if(b.id!==targetId)return b;
    if(b.items.some(it=>it.kind==='visual'&&it.visualId===visualId))return b;
    const position=b.items.length;return {...b,items:[...b.items,{id:token(),kind:'visual' as const,visualId,x:55+(position%3)*270,y:65+(Math.floor(position/3)%2)*312}]};
  }));setBoardId(targetId);setDialog(null);setNotice('Saved to board. Open Studio to arrange it.');
 };
 const moveItem=useCallback((id:string,x:number,y:number)=>setBoards(prev=>prev.map(b=>b.id!==boardId?b:{...b,items:b.items.map(it=>it.id===id?{...it,x:clamp(x,16,790),y:clamp(y,16,493)}:it)})),[boardId]);
 const updateNote=(text:string)=>{if(!selected)return;setBoards(prev=>prev.map(b=>b.id===boardId?{...b,items:b.items.map(it=>it.id===selected&&it.kind==='note'?{...it,text:text.slice(0,240)}:it)}:b));};
 const renameBoard=()=>{if(!boardName.trim())return;setBoards(prev=>prev.map(b=>b.id===boardId?{...b,name:boardName.trim()}:b));setBoardName('');setDialog(null);setNotice('Board renamed.');};
 const deleteBoard=()=>{if(boards.length<=1){setNotice('Keep at least one board. You can clear its items instead.');return;}if(!window.confirm(`Delete the board "${board.name}"? This removes its layout and notes.`))return;const next=boards.find(b=>b.id!==boardId)!;setBoards(prev=>prev.filter(b=>b.id!==boardId));setBoardId(next.id);setSelected(null);setNotice('Board deleted.');};
 const removeItem=()=>{if(!selected)return;setBoards(prev=>prev.map(b=>b.id===boardId?{...b,items:b.items.filter(i=>i.id!==selected)}:b));setSelected(null);setNotice('Removed from this board.');};
 const addNote=()=>{if(!noteText.trim())return;setBoards(prev=>prev.map(b=>b.id===boardId?{...b,items:[...b.items,{id:token(),kind:'note' as const,text:noteText.trim().slice(0,240),color:noteColor,x:310,y:260}]}:b));setNoteText('');setDialog(null);setNotice('Note added to canvas.');};
 const exportBoardData=()=>toFile(JSON.stringify({product:'Muse',exportedAt:new Date().toISOString(),board,visuals:visuals.filter(v=>board.items.some(i=>i.kind==='visual'&&i.visualId===v.id))},null,2),`${board.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-muse.json`,'application/json');
 const exportBoardImage=async()=>{
  if(exporting)return;setExporting(true);
  try{const png=await makeBoardPng(board,visuals);const url=URL.createObjectURL(png);const a=document.createElement('a');a.href=url;a.download=`${board.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-muse.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);setNotice('Board image exported as a PNG.');}
  catch{setNotice('Could not export this image. Try exporting the board data instead.');}
  finally{setExporting(false);}
 };
 const onImageUpload=async(files:FileList|null)=>{
  if(!files?.length)return;
  const selectedFiles=Array.from(files).filter(f=>f.type.startsWith('image/')).slice(0,6);
  if(selectedFiles.some(f=>f.size>12*1024*1024)){setNotice('Please choose images smaller than 12 MB each.');return;}
  try{
   const items=await Promise.all(selectedFiles.map(async file=>({id:token(),title:file.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ').slice(0,55),src:await optimizedDataURL(file),category:'Photography' as const,tags:['my upload'],origin:'upload' as const,credit:'Personal import · stored locally'})));
   setVisuals(prev=>[...items,...prev]);setCategory('All');setSearch('');go('discover');setNotice(`${items.length} visual${items.length>1?'s':''} added to your private library.`);
  }catch{setNotice('Those images could not be processed. Try another JPG or PNG.');}
  if(uploadRef.current)uploadRef.current.value='';
 };
 const scrollToStudio=(id:string)=>{setBoardId(id);go('studio');};
 const handlePointerDown=(e:React.PointerEvent<HTMLDivElement>,it:BoardItem)=>{
  if(e.button!==0)return;
  setSelected(it.id);e.currentTarget.setPointerCapture(e.pointerId);
  setDragging({id:it.id,x:e.clientX,y:e.clientY,originX:it.x,originY:it.y});
 };
 const handlePointerMove=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(!dragging)return;
  const scale=(workspaceRef.current?.getBoundingClientRect().width??1010)/1010;
  moveItem(dragging.id,dragging.originX+(e.clientX-dragging.x)/scale,dragging.originY+(e.clientY-dragging.y)/scale);
 };
 const keyNudge=(e:React.KeyboardEvent<HTMLDivElement>,it:BoardItem)=>{
  const dx=e.key==='ArrowLeft'?-12:e.key==='ArrowRight'?12:0;
  const dy=e.key==='ArrowUp'?-12:e.key==='ArrowDown'?12:0;
  if(dx||dy){e.preventDefault();setSelected(it.id);moveItem(it.id,it.x+dx,it.y+dy);}
  if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();setBoards(prev=>prev.map(b=>b.id===boardId?{...b,items:b.items.filter(item=>item.id!==it.id)}:b));setSelected(null);}
 };

 return <div className="muse-app" aria-label="Muse moodboard application">
   <div className="muse-top"><div className="muse-mark"><span className="muse-mark-icon" aria-hidden="true">✳</span><strong>muse<span className="muse-mark-dot">.</span></strong><span className="muse-mark-divider"/> <small>Visual thinking space</small></div><div className="muse-top-right"><span className="muse-private"><span/> Local workspace</span><button type="button" className="muse-top-upload" onClick={()=>uploadRef.current?.click()}>+ Add images</button></div></div>
   <input ref={uploadRef} type="file" multiple accept="image/*" className="sr-only" aria-label="Import your own images" onChange={e=>void onImageUpload(e.target.files)}/>
   <div className="muse-body">
    <nav className="muse-side" aria-label="Muse views"><div className="muse-side-label">WORKSPACE</div><button className={view==='discover'?'on':''} aria-current={view==='discover'?'page':undefined} onClick={()=>go('discover')}><span aria-hidden="true">◈</span> Discover</button><button className={view==='boards'?'on':''} aria-current={view==='boards'?'page':undefined} onClick={()=>go('boards')}><span aria-hidden="true">▦</span> My boards <small>{boards.length}</small></button><button className={view==='studio'?'on':''} aria-current={view==='studio'?'page':undefined} onClick={()=>go('studio')}><span aria-hidden="true">✦</span> Studio</button><div className="muse-side-foot"><span className="muse-side-label">A CREATIVE SPACE</span><p>Collect what speaks to you. Find the thread that connects it.</p><span>Everything saves to this browser.</span></div></nav>
    <div className="muse-main">
      {notice&&<div className="muse-toast" role="status"><span>{notice}</span><button aria-label="Dismiss notification" onClick={()=>setNotice('')}>×</button></div>}
      {view==='discover'&&<div className="muse-discover">
       <div className="muse-intro"><div><div className="muse-eyebrow">THE DISCOVERY LIBRARY / 001</div><h2>Find what<br/><em>moves you.</em></h2><p>Ideas rarely arrive in a straight line. Start with something interesting.</p><div className="muse-intro-actions"><button type="button" onClick={()=>scrollToStudio(boardId)}>Open Studio ↗</button><small>{boards.length} board{boards.length===1?'':'s'} · {visuals.length} visuals</small></div></div><div className="muse-start-card"><span>YOUR CREATIVE PROCESS</span><h3>See it. Save it. Shape it.</h3><p>Explore the library, save a reference to a board, then move pieces around in Studio. You can always return and edit.</p><button type="button" onClick={()=>go('boards')}>Explore my boards ↗</button></div></div>
       <div className="muse-controls"><label className="muse-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search visuals and tags</span><input type="search" placeholder="Search visuals, colors, ideas…" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button onClick={()=>setSearch('')} aria-label="Clear search">×</button>}</label><div className="muse-filter" aria-label="Filter visuals">{categories.map(c=><button key={c} type="button" className={category===c?'active':''} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
       <div className="muse-results"><strong>{displayed.length} visuals</strong><span>Selected pieces · personal imports</span></div>
       {displayed.length?<div className="muse-gallery">{displayed.map((p,i)=><article key={p.id} className={`muse-tile muse-tile-${i%4}`}><div className="muse-tile-img"><button className="muse-visual-open" type="button" onClick={()=>setDialog({type:'visual',visualId:p.id})} aria-label={`View ${p.title} details`}><img src={p.src} alt={p.title} loading="lazy"/></button><button className="muse-save" type="button" aria-label={`Save ${p.title} to a board`} onClick={()=>setDialog({type:'save',visualId:p.id})}>+ Save</button></div><div className="muse-tile-meta"><div><strong>{p.title}</strong><small>{p.category} · {p.origin==='upload'?'My image':'Reference'}</small></div><span aria-hidden="true">↗</span></div></article>)}</div>:<div className="muse-empty"><strong>No images found.</strong><p>Try another search or clear the category filter.</p><button onClick={()=>{setSearch('');setCategory('All');}}>Show all visuals</button></div>}
       <p className="muse-copyright">Demo imagery is attributed in the project README. Your imports stay in this browser.</p>
      </div>}
      {view==='boards'&&<div className="muse-boards"><div className="muse-view-heading"><div><p className="muse-eyebrow">YOUR COLLECTIONS</p><h2>Good ideas,<br/><em>gathered.</em></h2><p>Collect references and turn a direction into something tangible.</p></div><button className="muse-action" onClick={()=>setDialog({type:'new-board'})}>+ New board</button></div><div className="muse-board-grid">{boards.map(b=>{
       const covers=b.items.filter((i):i is Extract<BoardItem,{kind:'visual'}>=>i.kind==='visual').slice(0,3).map(i=>visuals.find(p=>p.id===i.visualId)).filter((v):v is Visual=>!!v);
       return <button type="button" className="muse-board-card" key={b.id} onClick={()=>scrollToStudio(b.id)}><div className="muse-board-covers">{covers.length?covers.map((p,i)=><img key={p.id} src={p.src} alt="" style={{gridColumn:i===0?'span 2':undefined}}/>):<div className="muse-board-placeholder" aria-hidden="true">✳</div>}</div><div className="muse-board-caption"><div><strong>{b.name}</strong><span>{b.items.length} items · {b.description}</span></div><b aria-hidden="true">↗</b></div></button>;
      })}<button className="muse-board-new" onClick={()=>setDialog({type:'new-board'})}><span>+</span><strong>A blank canvas</strong><small>Begin a new direction</small></button></div></div>}
      {view==='studio'&&board&&<div className="muse-studio"><div className="muse-studio-head"><div><span className="muse-eyebrow">OPEN CANVAS</span><h2>{board.name}</h2><p>{board.description}</p></div><div className="muse-studio-actions"><label className="sr-only" htmlFor="muse-current-board">Choose active board</label><select id="muse-current-board" value={boardId} onChange={e=>{setBoardId(e.target.value);setSelected(null);}}>{boards.map(b=><option value={b.id} key={b.id}>{b.name}</option>)}</select><button onClick={()=>setDialog({type:'new-note'})}>+ Note</button><button onClick={()=>go('discover')}>+ Visual</button><button onClick={()=>{setBoardName(board.name);setDialog({type:'rename-board'});}}>Rename</button><button className="muse-export" onClick={()=>void exportBoardImage()} disabled={exporting}>{exporting?'Exporting…':'Export image (PNG) ↓'}</button><button onClick={exportBoardData}>Export editable data (JSON) ↓</button></div></div><div className="muse-studio-hint">Drag to rearrange · Use arrow keys to nudge · Select a card to inspect · Export as PNG or editable JSON</div><div className="muse-workspace-scroll"><div ref={workspaceRef} className="muse-canvas" aria-label="Spatial board editor" onClick={()=>setSelected(null)}>{board.items.length?board.items.map(it=>{
       const v=it.kind==='visual'?visuals.find(p=>p.id===it.visualId):null;
       return <div key={it.id} role="button" tabIndex={0} aria-label={v?`Move ${v.title}`:`Move note: ${it.kind==='note'?it.text:''}`} aria-pressed={selected===it.id} className={`muse-canvas-item ${it.kind==='note'?`muse-note muse-note-${it.color}`:''} ${selected===it.id?'selected':''}`} style={{left:it.x,top:it.y,touchAction:'none'}} onPointerDown={e=>handlePointerDown(e,it)} onPointerMove={handlePointerMove} onPointerUp={()=>setDragging(null)} onPointerCancel={()=>setDragging(null)} onKeyDown={e=>keyNudge(e,it)} onClick={e=>{e.stopPropagation();setSelected(it.id);}}>{it.kind==='visual'&&v?<><img src={v.src} alt="" draggable={false}/><span>{v.title}</span></>:it.kind==='note'?<><span className="muse-note-label">A THOUGHT / ✳</span><p>{it.text}</p></>:<span>Unavailable reference</span>}</div>;
      }):<div className="muse-blank"><span>✳</span><strong>Your board starts here.</strong><p>Collect a visual from Discover or add a note to begin.</p><button onClick={e=>{e.stopPropagation();go('discover');}}>Discover visuals ↗</button></div>}</div></div><div className="muse-inspector"><div><span className="muse-eyebrow">SELECTED ITEM</span>{selectedItem?<><strong>{chosenVisual?.title??(selectedItem.kind==='note'?'Board note':'Visual')}</strong>{selectedItem.kind==='note'?<label className="muse-inspector-note">Edit note<textarea rows={3} value={selectedItem.text} onChange={e=>updateNote(e.target.value)}/></label>:<p>{chosenVisual?`${chosenVisual.category} · ${chosenVisual.tags.join(', ')}`:'A reference in your board.'}</p>}</>:<><strong>Make some space to think.</strong><p>Click a card on the canvas to see its details.</p></>}</div><div className="muse-inspector-actions">{selectedItem&&<button className="muse-remove" onClick={removeItem}>Remove item</button>}<button className="muse-remove" onClick={deleteBoard}>Delete board</button></div></div></div>}
    </div>
   </div>
   {dialog&&<div className="muse-dialog-cover" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setDialog(null);}}><div className="muse-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-label={dialog.type==='visual'?'Visual details':dialog.type==='save'?'Save visual to board':dialog.type==='new-board'?'Create a board':dialog.type==='rename-board'?'Rename board':'Create a note'}><div className="muse-dialog-top"><span className="muse-eyebrow">{dialog.type==='visual'?'DISCOVER / IMAGE DETAILS':dialog.type==='save'?'COLLECT AN IDEA':dialog.type==='new-board'?'A NEW DIRECTION':dialog.type==='rename-board'?'BOARD SETTINGS':'ADD YOUR THOUGHT'}</span><button aria-label="Close dialog" onClick={()=>setDialog(null)}>×</button></div>{dialog.type==='visual'&&inspectedVisual?<div className="muse-visual-detail"><div className="muse-visual-detail-image"><img src={inspectedVisual.src} alt={inspectedVisual.title}/></div><div className="muse-visual-detail-info"><h3>{inspectedVisual.title}</h3><p>Part of your visual inspiration library. Explore the image, then save it to a board when it fits your direction.</p><dl><div><dt>CATEGORY</dt><dd>{inspectedVisual.category}</dd></div><div><dt>VISUAL TAGS</dt><dd>{inspectedVisual.tags.join(' · ')}</dd></div><div><dt>SOURCE</dt><dd>{inspectedVisual.credit}</dd></div></dl><button type="button" onClick={()=>setDialog({type:'save',visualId:inspectedVisual.id})}>+ Save to a board</button></div></div>:dialog.type==='save'?<><h3>Save to a board</h3><p>Choose a direction for this visual, or start something new.</p><div className="muse-dialog-boards">{boards.map(b=><button key={b.id} onClick={()=>saveVisual(dialog.visualId,b.id)}><span>▦</span><strong>{b.name}</strong><small>{b.items.length} items</small><b>+</b></button>)}</div><button className="muse-dialog-link" onClick={()=>{setDialog({type:'new-board',visualId:dialog.visualId});}}>+ Create a new board instead</button></>:dialog.type==='new-board'?<form onSubmit={e=>{e.preventDefault();newBoard(dialog.type==='new-board'?dialog.visualId:undefined);}}><h3>Give it a name.</h3><p>A board for a project, a feeling, or an idea you can&apos;t quite explain yet.</p><label>Board name<input autoFocus maxLength={48} placeholder="e.g. Summer campaign direction" value={boardName} onChange={e=>setBoardName(e.target.value)}/></label><button className="muse-dialog-submit" disabled={!boardName.trim()} type="submit">Create board ↗</button></form>:dialog.type==='rename-board'?<form onSubmit={e=>{e.preventDefault();renameBoard();}}><h3>Rename this board.</h3><p>Give this direction a name you'll recognize.</p><label>Board name<input autoFocus maxLength={48} value={boardName} onChange={e=>setBoardName(e.target.value)}/></label><button className="muse-dialog-submit" disabled={!boardName.trim()} type="submit">Save name ↗</button></form>:<form onSubmit={e=>{e.preventDefault();addNote();}}><h3>Make a note.</h3><p>Pin a thought beside your references.</p><label>Your note<textarea autoFocus maxLength={240} rows={4} value={noteText} placeholder="What's the idea here?" onChange={e=>setNoteText(e.target.value)}/></label><div className="muse-color-options" role="group" aria-label="Note color">{(['yellow','pink','blue'] as const).map(c=><button type="button" key={c} aria-label={`${c} note`} aria-pressed={noteColor===c} onClick={()=>setNoteColor(c)} className={`muse-color-${c} ${noteColor===c?'chosen':''}`}/>)}</div><button className="muse-dialog-submit" disabled={!noteText.trim()} type="submit">Add to canvas ↗</button></form>}</div></div>}
 </div>;
}
