'use client';

import {useCallback,useEffect,useMemo,useRef,useState,type FormEvent} from 'react';
import type * as Leaflet from 'leaflet';
import type {MapRoute,MapStop,NetworkResponse,PlanResponse,TripOption} from '@/lib/gtfs-public';

const BLACKSBURG_CODES=new Set(['BMR','CAS','CRB','CRC','HDG','HWA','HWB','HWC','HXP','HXS','NMG','PHB','PHD','PRG','SMA','SME','SMS','TCP','TCR','UCB']);
const MAP_CENTER:[number,number]=[37.2296,-80.4139];
const BT_SCHEDULES='https://ridebt.org/schedules';
const short=(name:string)=>name.replace(/\s+(Eastbound|Westbound|Northbound|Southbound)\b/gi,' $1');

function easternNow(){
  const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  const by=(name:string)=>parts.find(x=>x.type===name)?.value||'00';
  return {date:`${by('year')}-${by('month')}-${by('day')}`,time:`${by('hour')}:${by('minute')}`};
}
function distanceKm(a:{lat:number;lon:number},b:{lat:number;lon:number}){
  const r=6371,rad=Math.PI/180,dLat=(a.lat-b.lat)*rad,dLon=(a.lon-b.lon)*rad;
  const x=Math.sin(dLat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLon/2)**2;
  return r*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
}
function esc(s:string){return s.replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));}
function RouteLine({route}:{route:MapRoute}){return <span className="tf-line-symbol" style={{background:route.color,color:route.textColor}}>{route.shortName}</span>;}
function ClockIcon(){return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>;}
function PinIcon(){return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;}

export function TransitMap(){
  const div=useRef<HTMLDivElement|null>(null);
  const map=useRef<Leaflet.Map|null>(null);
  const leaflet=useRef<typeof import('leaflet')|null>(null);
  const networkLayers=useRef<Leaflet.LayerGroup|null>(null);
  const itineraryLayers=useRef<Leaflet.LayerGroup|null>(null);
  const locationLayer=useRef<Leaflet.LayerGroup|null>(null);
  const [data,setData]=useState<NetworkResponse|null>(null);
  const [loading,setLoading]=useState(true);
  const [mapReady,setMapReady]=useState(false);
  const [problem,setProblem]=useState('');
  const [routeId,setRouteId]=useState('all');
  const [stopQuery,setStopQuery]=useState('');
  const [selectedStop,setSelectedStop]=useState<string|null>(null);
  const [from,setFrom]=useState('');const [to,setTo]=useState('');
  const [date,setDate]=useState('');const [time,setTime]=useState('');
  const [planning,setPlanning]=useState(false);
  const [plan,setPlan]=useState<PlanResponse|null>(null);
  const [planError,setPlanError]=useState('');
  const [selectedOption,setSelectedOption]=useState(0);
  const [locating,setLocating]=useState(false);
  const [locationError,setLocationError]=useState('');
  const [allStops,setAllStops]=useState(false);

  const reload=useCallback(async()=>{
    setLoading(true);setProblem('');
    try{
      const result=await fetch('/api/transit/network',{cache:'no-store'});
      const body=await result.json();if(!result.ok)throw Error(body.error||'Schedule feed unavailable');
      if(!body.routes?.length||!body.stops?.length)throw Error('The BT feed did not return usable routes and stops.');
      setData(body as NetworkResponse);
    }catch(err){setProblem(err instanceof Error?err.message:'Could not load bus network.');}
    finally{setLoading(false);}
  },[]);
  useEffect(()=>{const now=easternNow();setDate(now.date);setTime(now.time);void reload();},[reload]);

  const routes=useMemo(()=>data?.routes.filter(r=>BLACKSBURG_CODES.has(r.shortName.toUpperCase())).sort((a,b)=>a.shortName.localeCompare(b.shortName))||[],[data]);
  const relevantRouteIds=useMemo(()=>new Set(routes.map(r=>r.id)),[routes]);
  const stops=useMemo(()=>data?.stops.filter(s=>s.routeIds.some(id=>relevantRouteIds.has(id)))||[],[data,relevantRouteIds]);
  const stopIndex=useMemo(()=>new Map(stops.map(s=>[s.id,s])),[stops]);
  const duplicateNames=useMemo(()=>{const counts=new Map<string,number>();for(const s of stops)counts.set(s.name,(counts.get(s.name)||0)+1);return counts;},[stops]);
  const stopLabel=(s:MapStop)=>`${s.name}${(duplicateNames.get(s.name)||0)>1?` (stop ${s.id})`:''}`;
  const routeIndex=useMemo(()=>new Map(routes.map(r=>[r.id,r])),[routes]);
  const activeRoute=routeIndex.get(routeId);
  const shownStops=useMemo(()=>routeId==='all'?stops:stops.filter(s=>s.routeIds.includes(routeId)),[stops,routeId]);
  const selected=selectedStop?stopIndex.get(selectedStop):null;
  const stopResults=useMemo(()=>{
    const q=stopQuery.trim().toLowerCase();if(!q)return [];
    return stops.filter(s=>s.name.toLowerCase().includes(q)||s.id.toLowerCase().includes(q)).slice(0,8);
  },[stopQuery,stops]);
  const chosen=plan?.options[selectedOption];

  useEffect(()=>{
    if(!div.current||map.current)return;
    let mounted=true;
    void import('leaflet').then(L=>{
      if(!mounted||!div.current)return;
      leaflet.current=L;
      const m=L.map(div.current,{zoomControl:false,scrollWheelZoom:false,keyboard:true,preferCanvas:true}).setView(MAP_CENTER,13);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
        maxZoom:19,subdomains:[],
      }).addTo(m);
      L.control.zoom({position:'bottomright'}).addTo(m);
      networkLayers.current=L.layerGroup().addTo(m);
      itineraryLayers.current=L.layerGroup().addTo(m);
      locationLayer.current=L.layerGroup().addTo(m);
      map.current=m;setMapReady(true);
      window.requestAnimationFrame(()=>m.invalidateSize());
    });
    return ()=>{mounted=false;if(map.current){map.current.remove();map.current=null;}leaflet.current=null;};
  },[]);

  useEffect(()=>{
    const L=leaflet.current,m=map.current,layer=networkLayers.current;
    if(!L||!m||!layer||!data)return;
    layer.clearLayers();
    // Each published GTFS shape is a representative trip pattern, not a straight-line guess.
    const drawn=routeId==='all'?routes:[activeRoute].filter((r):r is MapRoute=>Boolean(r));
    for(const route of drawn){
      if(route.shape.length>=2){
        L.polyline(route.shape,{color:route.color,weight:routeId==='all'?2.6:5,opacity:routeId==='all'?.58:.9,interactive:true})
          .bindTooltip(esc(`${route.shortName} · ${route.name}`),{sticky:true}).on('click',()=>setRouteId(route.id)).addTo(layer);
      }
    }
    for(const s of shownStops){
      const isSelected=s.id===selectedStop;
      const marker=L.circleMarker([s.lat,s.lon],{
        radius:isSelected?8:routeId==='all'?3.3:5,weight:isSelected?3:1.5,
        color:isSelected?'#1d2944':'#ffffff',fillColor:isSelected?'#ffbf5d':'#234c71',fillOpacity:1,
      }).bindTooltip(esc(s.name),{direction:'top',offset:[0,-5]});
      marker.on('click',()=>setSelectedStop(s.id));marker.addTo(layer);
    }
  },[data,routes,shownStops,routeId,activeRoute,selectedStop,mapReady]);

  // Fit the route when selected, but do not fight a user's ordinary map panning.
  useEffect(()=>{
    const L=leaflet.current,m=map.current;
    if(!L||!m||!data)return;
    if(routeId==='all'){m.setView(MAP_CENTER,13,{animate:true});return;}
    const r=routeIndex.get(routeId);if(!r)return;
    const pts=r.shape.length?r.shape:r.stopIds.map(id=>stopIndex.get(id)).filter((x):x is MapStop=>!!x).map(s=>[s.lat,s.lon] as [number,number]);
    if(pts.length)m.fitBounds(L.latLngBounds(pts),{padding:[40,40],maxZoom:14,animate:true});
  },[routeId,data,routeIndex,stopIndex,mapReady]);

  useEffect(()=>{
    const L=leaflet.current,m=map.current,layer=itineraryLayers.current;
    if(!L||!m||!layer)return;
    layer.clearLayers();if(!chosen)return;
    for(const leg of chosen.legs){
      if(leg.shape.length>=2)L.polyline(leg.shape,{color:leg.color,weight:7,opacity:.92}).addTo(layer);
      for(const [id,label,color] of [[leg.fromStopId,`Board · ${leg.fromName}`,'#16806d'],[leg.toStopId,`Alight · ${leg.toName}`,'#bc5753']] as const){
        const stop=stopIndex.get(id);if(stop)L.circleMarker([stop.lat,stop.lon],{radius:9,color:'#fff',weight:3,fillColor:color,fillOpacity:1}).bindTooltip(esc(label)).addTo(layer);
      }
    }
    const p=chosen.legs.flatMap(x=>x.shape);
    if(p.length)m.fitBounds(L.latLngBounds(p),{padding:[40,40],maxZoom:14});
  },[chosen,stopIndex,mapReady]);

  function focusStop(stop:MapStop){setSelectedStop(stop.id);map.current?.setView([stop.lat,stop.lon],16,{animate:true});}
  function chooseStop(id:string,which:'from'|'to'){if(which==='from')setFrom(id);else setTo(id);setPlan(null);setPlanError('');}
  async function searchTrip(e:FormEvent){e.preventDefault();setPlanError('');setPlan(null);
    if(!from||!to||!date||!time){setPlanError('Select a start, destination, date and time.');return;}
    if(from===to){setPlanError('Choose two different stops.');return;}
    setPlanning(true);
    try{
      const q=new URLSearchParams({from,to,date,time});const res=await fetch(`/api/transit/plan?${q.toString()}`,{cache:'no-store'});
      const result=await res.json();if(!res.ok)throw Error(result.error||'Trip planner unavailable');
      setPlan(result as PlanResponse);setSelectedOption(0);
    }catch(err){setPlanError(err instanceof Error?err.message:'Could not plan this trip.');}
    finally{setPlanning(false);}
  }
  function locate(){if(!navigator.geolocation){setLocationError('Location sharing is unavailable in this browser.');return;}
    setLocating(true);setLocationError('');
    navigator.geolocation.getCurrentPosition(pos=>{
      const here={lat:pos.coords.latitude,lon:pos.coords.longitude};setLocating(false);
      // Limit the feature to the requested Blacksburg service area.
      if(distanceKm(here,{lat:MAP_CENTER[0],lon:MAP_CENTER[1]})>18){setLocationError('You appear to be outside the Blacksburg map area.');return;}
      const L=leaflet.current,layer=locationLayer.current;layer?.clearLayers();
      if(L&&layer)L.circleMarker([here.lat,here.lon],{radius:8,color:'#fff',weight:3,fillColor:'#315dbe',fillOpacity:1}).bindTooltip('Your approximate position').addTo(layer);
      map.current?.setView([here.lat,here.lon],15,{animate:true});
      const nearest=[...stops].sort((a,b)=>distanceKm(here,a)-distanceKm(here,b))[0];
      if(nearest)setSelectedStop(nearest.id);
    },()=>{setLocating(false);setLocationError('Location permission was not granted. You can still search stops manually.');},{enableHighAccuracy:false,timeout:10000,maximumAge:30000});
  }
  const topRoutes=routeId==='all'?routes:routes.filter(r=>r.id===routeId);
  return <section className="tf-app" aria-label="Interactive Blacksburg bus map">
    <header className="tf-head"><div><div className="tf-kicker">TRANSITFLOW / BLACKSBURG, VA</div><h2>Move through town, <em>with clarity.</em></h2><p>Real bus stops, published route shapes, and timetable-based trips. Made for Blacksburg, built around the details.</p></div><div className="tf-feed-pill"><span className={problem?'tf-offline':'tf-online'}/>{loading?'Loading network':problem?'Feed temporarily unavailable':'Published GTFS data'}</div></header>
    <div className="tf-legend"><span><i className="tf-legend-dot"/> Published route and stop data</span><span><ClockIcon/> Schedules, not live arrivals</span><a href={BT_SCHEDULES} target="_blank" rel="noopener noreferrer">Official BT schedules ↗</a></div>
    <div className="tf-layout">
      <div className="tf-side">
        <div className="tf-side-section tf-search-section"><div className="tf-stephead"><h3>Explore the network</h3></div>
          <label htmlFor="tf-stop-search">Find a stop</label><div className="tf-input-icon"><PinIcon/><input id="tf-stop-search" type="search" autoComplete="off" value={stopQuery} onChange={e=>setStopQuery(e.target.value)} placeholder="Try Newman Library or Torgersen" disabled={!data}/></div>
          {stopQuery&&<div className="tf-suggestions" aria-label="Matching stops">{stopResults.length?stopResults.map(s=><button type="button" key={s.id} onClick={()=>{focusStop(s);setStopQuery('');}}><strong>{short(s.name)}</strong><span>{s.routeIds.length} route connections ↗</span></button>):<p>No matching stops in the Blacksburg area.</p>}</div>}
          <div className="tf-route-heading"><label htmlFor="tf-route">Bus route</label><span>{routes.length} lines</span></div>
          <select id="tf-route" value={routeId} onChange={e=>{setRouteId(e.target.value);setPlan(null);}} disabled={!data}><option value="all">All Blacksburg routes</option>{routes.map(r=><option key={r.id} value={r.id}>{r.shortName} · {r.name}</option>)}</select>
          {activeRoute&&<div className="tf-route-callout"><RouteLine route={activeRoute}/><div><strong>{activeRoute.name}</strong><small>{activeRoute.stopIds.length} listed stops · {activeRoute.shapeKind==='published'?'GTFS route shape':'Stop locations only'}</small></div></div>}
          {selected&&<div className="tf-stop-focus"><div className="tf-stop-focus-title"><PinIcon/><strong>{selected.name}</strong></div><p>Routes: {selected.routeIds.filter(id=>routeIndex.has(id)).map(id=>routeIndex.get(id)?.shortName).join(', ')||'Unlisted'}</p><p>Wheelchair boarding: {selected.wheelchair==='unknown'?'Not specified in the published feed':selected.wheelchair==='yes'?'Listed as accessible':'Listed as not accessible'}</p><div><button type="button" onClick={()=>chooseStop(selected.id,'from')}>Start here</button><button type="button" onClick={()=>chooseStop(selected.id,'to')}>Go here</button></div></div>}
        </div>
        <div className="tf-side-section"><div className="tf-stephead"><h3>Plan a bus trip</h3></div>
          <form onSubmit={searchTrip} className="tf-trip-form"><label htmlFor="tf-from">Starting stop</label><select id="tf-from" value={from} onChange={e=>chooseStop(e.target.value,'from')} disabled={!data} required><option value="">Choose a bus stop</option>{stops.map(s=><option key={s.id} value={s.id}>{stopLabel(s)}</option>)}</select>
            <button type="button" className="tf-swap" onClick={()=>{setFrom(to);setTo(from);setPlan(null);}} disabled={!from&&!to} aria-label="Swap start and destination">⇅ Swap direction</button>
            <label htmlFor="tf-to">Destination stop</label><select id="tf-to" value={to} onChange={e=>chooseStop(e.target.value,'to')} disabled={!data} required><option value="">Choose destination</option>{stops.map(s=><option key={s.id} value={s.id}>{stopLabel(s)}</option>)}</select>
            <div className="tf-date-grid"><div><label htmlFor="tf-date">Travel date</label><input id="tf-date" type="date" value={date} onChange={e=>{setDate(e.target.value);setPlan(null);}} required/></div><div><label htmlFor="tf-time">Leave after · ET</label><input id="tf-time" type="time" value={time} onChange={e=>{setTime(e.target.value);setPlan(null);}} required/></div></div>
            <button className="tf-plan-button" type="submit" disabled={planning||!data}>{planning?'Finding scheduled trips…':'Find bus routes'}<span aria-hidden="true">↗</span></button>
          </form>
          {planError&&<p className="tf-alert" role="alert">{planError}</p>}
          {plan&&<div className="tf-results" aria-live="polite"><div className="tf-results-title"><h4>{plan.options.length?`${plan.options.length} scheduled option${plan.options.length>1?'s':''}`:'No itinerary found'}</h4><small>{date} · {time} ET</small></div><p className="tf-plan-message">{plan.message}</p>
            {plan.options.map((opt,i)=><button type="button" key={`${opt.departure}-${i}`} className={`tf-trip-option ${selectedOption===i?'is-selected':''}`} aria-pressed={selectedOption===i} onClick={()=>setSelectedOption(i)}><span className="tf-option-top"><strong>{opt.departure} – {opt.arrival}</strong><span>{opt.durationMin} min · {opt.transfers===0?'Direct':`${opt.transfers} transfer`}</span></span><span className="tf-leg-tags">{opt.legs.map((leg,idx)=><span key={`${leg.routeId}-${idx}`} style={{borderColor:leg.color}}>{leg.routeName.split(' · ')[0]}</span>)}</span></button>)}
            {chosen&&<ol className="tf-directions">{chosen.legs.map((leg,i)=><li key={`${leg.routeId}-${i}`}><span className="tf-directions-number">{i+1}</span><div><strong>{leg.routeName}</strong><p>Board {leg.fromName} at {leg.departure}, ride to {leg.toName}, arriving {leg.arrival}.</p></div></li>)}</ol>}
          </div>}
        </div>
      </div>
      <div className="tf-map-column"><div className="tf-map-top"><div><span>BLACKSBURG, VIRGINIA</span><strong>{chosen?'Your selected journey':activeRoute?`${activeRoute.shortName} · ${activeRoute.name}`:'Explore the network'}</strong></div><button type="button" onClick={locate} disabled={locating} title="Find nearby bus stops">{locating?'Locating…':'◎ Near me'}</button></div>
        {selected&&<div className="tf-map-stop-card" aria-live="polite"><strong>{selected.name}</strong><div><button type="button" onClick={()=>chooseStop(selected.id,'from')}>Start here</button><button type="button" onClick={()=>chooseStop(selected.id,'to')}>Go here</button></div></div>}
        <div className="tf-geographic-map" ref={div} role="region" aria-label="Interactive OpenStreetMap showing Blacksburg Transit routes and bus stops. Use the stop search and selection controls to access stops without the map."/>
        {!data&&<div className="tf-map-overlay"><div>{loading?<><strong>Loading the Blacksburg network</strong><p>Reading official routes and stops…</p></>:<><strong>Couldn’t load published bus data</strong><p>{problem}</p><button type="button" onClick={()=>void reload()}>Try again</button><a href={BT_SCHEDULES} target="_blank" rel="noopener noreferrer">Open official schedule ↗</a></>}</div></div>}
        {locationError&&<p className="tf-location-error" role="status">{locationError}</p>}
        <div className="tf-map-bottom"><span>Drag to pan · Use + / − to zoom · Select a stop to see details</span><button type="button" onClick={()=>{setRouteId('all');setSelectedStop(null);map.current?.setView(MAP_CENTER,13);}}>Reset view</button></div>
        <div className="tf-route-strip"><strong>Route key</strong><div>{topRoutes.slice(0,allStops?24:6).map(r=><button type="button" key={r.id} className="tf-chip" onClick={()=>setRouteId(r.id)}><i style={{background:r.color}}/>{r.shortName}</button>)}</div>{routeId==='all'&&routes.length>6&&<button className="tf-more" onClick={()=>setAllStops(!allStops)} type="button">{allStops?'Show fewer':'Show all routes'}</button>}</div>
      </div>
    </div>
    <footer className="tf-disclaimer"><strong>What this map can—and cannot—tell you.</strong><p>Routes, stops, shapes, and scheduled trips are read from Blacksburg Transit’s published GTFS feed. Lines depict representative published patterns; actual trips and detours may differ. Route planning supports stops on the same bus or a single transfer at the same stop. There are no real-time bus locations, delay predictions, walking directions, or verified service alerts. Always check <a href={BT_SCHEDULES} target="_blank" rel="noopener noreferrer">Blacksburg Transit’s official schedules</a> before travel. Map tiles © OpenStreetMap contributors.</p><span>Independent design project · Not affiliated with Blacksburg Transit</span></footer>
  </section>;
}
