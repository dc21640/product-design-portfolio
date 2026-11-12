import {strFromU8, unzipSync} from 'fflate';
import type {MapRoute,MapStop,NetworkResponse,PlanResponse,Point,TripLeg,TripOption} from './gtfs-public';

const FEED_URLS=[
  'https://www.bt4uclassic.org/gtfs/google_transit.zip',
  'http://www.bt4uclassic.org/gtfs/google_transit.zip',
];

type RecordRow=Record<string,string>;
type STrip={id:string;routeId:string;serviceId:string;shapeId:string;headsign:string;stops:STime[]};
type STime={stopId:string;arrival:number;departure:number;sequence:number};
type Cal={days:boolean[];start:string;end:string};
type ParsedFeed={network:NetworkResponse;trips:STrip[];shapes:Map<string,Point[]>;routes:Map<string,MapRoute>;stops:Map<string,MapStop>;calendars:Map<string,Cal>;exceptions:Map<string,Map<string,boolean>>;tripByStop:Map<string,STrip[]>;};
let memo:Promise<ParsedFeed>|null=null;let created=0;

function csv(text:string):RecordRow[]{
  // Handles commas, quoted fields, escaped quotes and CRLF in the GTFS CSV format.
  const rows:string[][]=[];let fields:string[]=[];let cell='';let quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
    else if(c===','&&!quoted){fields.push(cell);cell='';}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;fields.push(cell);if(fields.some(Boolean))rows.push(fields);fields=[];cell='';}
    else cell+=c;
  }
  fields.push(cell);if(fields.some(Boolean))rows.push(fields);
  const headers=(rows.shift()??[]).map(x=>x.trim().replace(/^\ufeff/,''));
  return rows.map(values=>Object.fromEntries(headers.map((h,i)=>[h,(values[i]??'').trim()])));
}
const day=(d:string)=>d.replaceAll('-','');
const iso=(d:string)=> /^\d{8}$/.test(d)?`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6)}`:null;
const mins=(hms:string)=>{const [h,m]=hms.split(':').map(Number);return Number.isFinite(h)&&Number.isFinite(m)?h*60+m:-1;};
function fmt(minutes:number){const h=Math.floor(minutes/60);const m=minutes%60;return `${String(h%24).padStart(2,'0')}:${String(m).padStart(2,'0')}${h>=24?' +1 day':''}`;}
const safeHex=(color:string,fallback:string)=>/^[0-9a-fA-F]{6}$/.test(color)?`#${color}`:fallback;

function simplify(points:Point[], minGap=0.00013):Point[]{
  if(points.length<=3)return points;
  const out:Point[]=[points[0]];let last=points[0];
  for(let i=1;i<points.length-1;i++){
    const p=points[i];const latDist=p[0]-last[0];const lonDist=(p[1]-last[1])*0.81;
    if(latDist*latDist+lonDist*lonDist>=minGap*minGap){out.push(p);last=p;}
  }
  out.push(points[points.length-1]);return out;
}

async function download():Promise<{files:Record<string,Uint8Array>;url:string}>{
  let last='';
  for(const url of FEED_URLS){
    try{
      const res=await fetch(url,{signal:AbortSignal.timeout(18000),headers:{'User-Agent':'TransitFlow-Portfolio/1.0 (GTFS demo; source ridebt.org)'}});
      if(!res.ok)throw Error(`HTTP ${res.status}`);
      const bytes=new Uint8Array(await res.arrayBuffer());
      if(bytes.length>24_000_000)throw Error('Unexpected feed size');
      const files=unzipSync(bytes);
      if(!files['stops.txt']||!files['routes.txt']||!files['trips.txt']||!files['stop_times.txt'])throw Error('Required GTFS files missing');
      return {files,url};
    }catch(err){last=err instanceof Error?err.message:'Network error';}
  }
  throw Error(`Blacksburg Transit's schedule download is unavailable (${last}). Open ridebt.org/schedules for current service information.`);
}
function activeService(feed:ParsedFeed,service:string,date:string):boolean{
  const key=day(date);const override=feed.exceptions.get(service)?.get(key);if(override!==undefined)return override;
  const cal=feed.calendars.get(service);if(!cal||key<cal.start||key>cal.end)return false;
  // Javascript UTC day: Sunday=0, Monday=1; GTFS Monday=0.
  const dateObj=new Date(`${date}T12:00:00Z`);if(Number.isNaN(dateObj.valueOf()))return false;
  return cal.days[(dateObj.getUTCDay()+6)%7];
}

function parse(files:Record<string,Uint8Array>,url:string):ParsedFeed{
  const read=(f:string)=>files[f]?csv(strFromU8(files[f])):[];
  const rowsRoutes=read('routes.txt');const rowsStops=read('stops.txt');const rowsTrips=read('trips.txt');const rowsTimes=read('stop_times.txt');
  const rowsShape=read('shapes.txt');const rowsCalendar=read('calendar.txt');const rowsExceptions=read('calendar_dates.txt');
  const rowsInfo=read('feed_info.txt');
  const shapesUnsorted=new Map<string,{coord:Point;order:number}[]>();
  for(const r of rowsShape){const lat=Number(r.shape_pt_lat),lon=Number(r.shape_pt_lon);if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
    if(!shapesUnsorted.has(r.shape_id))shapesUnsorted.set(r.shape_id,[]);
    shapesUnsorted.get(r.shape_id)!.push({coord:[lat,lon],order:Number(r.shape_pt_sequence)||0});}
  const shapes=new Map<string,Point[]>();for(const [id,pts] of shapesUnsorted){pts.sort((a,b)=>a.order-b.order);shapes.set(id,simplify(pts.map(p=>p.coord)));}
  const routes=new Map<string,MapRoute>();for(const r of rowsRoutes)routes.set(r.route_id,{id:r.route_id,shortName:r.route_short_name||r.route_id,name:r.route_long_name||r.route_short_name||'Bus route',color:safeHex(r.route_color,'316C91'),textColor:safeHex(r.route_text_color,'FFFFFF'),shape:[],stopIds:[],shapeKind:'unavailable'});
  const stops=new Map<string,MapStop>();for(const r of rowsStops){const lat=Number(r.stop_lat),lon=Number(r.stop_lon);if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;
    stops.set(r.stop_id,{id:r.stop_id,name:r.stop_name||'Bus stop',lat,lon,wheelchair:r.wheelchair_boarding==='1'?'yes':r.wheelchair_boarding==='2'?'no':'unknown',routeIds:[]});}
  const trips=new Map<string,STrip>();for(const r of rowsTrips){if(!routes.has(r.route_id))continue;trips.set(r.trip_id,{id:r.trip_id,routeId:r.route_id,serviceId:r.service_id,shapeId:r.shape_id,headsign:r.trip_headsign||'',stops:[]});}
  for(const r of rowsTimes){const trip=trips.get(r.trip_id);if(!trip||!stops.has(r.stop_id))continue;const arrival=mins(r.arrival_time),departure=mins(r.departure_time);if(arrival<0||departure<0)continue;
    trip.stops.push({stopId:r.stop_id,arrival,departure,sequence:Number(r.stop_sequence)||0});}
  const frequency=new Map<string,Map<string,number>>();const routeStopIds=new Map<string,Set<string>>();const routeIdForStop=new Map<string,Set<string>>();const tripByStop=new Map<string,STrip[]>();
  for(const t of trips.values()){
    t.stops.sort((a,b)=>a.sequence-b.sequence);
    if(t.shapeId){if(!frequency.has(t.routeId))frequency.set(t.routeId,new Map());const counts=frequency.get(t.routeId)!;counts.set(t.shapeId,(counts.get(t.shapeId)||0)+1);}
    if(!routeStopIds.has(t.routeId))routeStopIds.set(t.routeId,new Set());
    for(const row of t.stops){routeStopIds.get(t.routeId)!.add(row.stopId);if(!routeIdForStop.has(row.stopId))routeIdForStop.set(row.stopId,new Set());routeIdForStop.get(row.stopId)!.add(t.routeId);
      if(!tripByStop.has(row.stopId))tripByStop.set(row.stopId,[]);tripByStop.get(row.stopId)!.push(t);}
  }
  for(const r of routes.values()){
    r.stopIds=Array.from(routeStopIds.get(r.id)||[]);
    const mostCommon=Array.from(frequency.get(r.id)||[]).sort((a,b)=>b[1]-a[1])[0]?.[0];
    if(mostCommon&&shapes.has(mostCommon)){r.shape=shapes.get(mostCommon)!;r.shapeKind='published';}
  }
  for(const s of stops.values())s.routeIds=Array.from(routeIdForStop.get(s.id)||[]);
  const calendars=new Map<string,Cal>();for(const r of rowsCalendar){calendars.set(r.service_id,{start:r.start_date,end:r.end_date,days:['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(k=>r[k]==='1')});}
  const exceptions=new Map<string,Map<string,boolean>>();for(const r of rowsExceptions){if(!exceptions.has(r.service_id))exceptions.set(r.service_id,new Map());exceptions.get(r.service_id)!.set(r.date,r.exception_type==='1');}
  const dateKeys=[...rowsCalendar.map(r=>r.start_date),...rowsExceptions.map(r=>r.date)].filter(v=>/^\d{8}$/.test(v));
  const endKeys=[...rowsCalendar.map(r=>r.end_date),...rowsExceptions.map(r=>r.date)].filter(v=>/^\d{8}$/.test(v));
  const start=iso(dateKeys.sort()[0]||'');const end=iso(endKeys.sort().at(-1)||'');
  const network:NetworkResponse={agency:'Blacksburg Transit',routes:Array.from(routes.values()),stops:Array.from(stops.values()).sort((a,b)=>a.name.localeCompare(b.name)),calendarStart:start,calendarEnd:end,feedUpdatedAt:new Date().toISOString(),sourceUrl:url,notice:'Scheduled GTFS data from Blacksburg Transit. No live bus positions, arrival predictions, service alerts, or pedestrian routing.'};
  return {network,trips:Array.from(trips.values()),shapes,routes,stops,calendars,exceptions,tripByStop};
}
export async function getFeed():Promise<ParsedFeed>{
  if(!memo||Date.now()-created>1000*60*30){created=Date.now();memo=download().then(({files,url})=>parse(files,url)).catch(e=>{memo=null;throw e;});}
  return memo;
}
export async function getNetwork():Promise<NetworkResponse>{return (await getFeed()).network;}

function leg(t:STrip,from:number,to:number,feed:ParsedFeed):TripLeg{
 const a=t.stops[from],b=t.stops[to],r=feed.routes.get(t.routeId)!;
 return {routeId:r.id,routeName:`${r.shortName} · ${r.name}`,color:r.color,fromStopId:a.stopId,toStopId:b.stopId,fromName:feed.stops.get(a.stopId)!.name,toName:feed.stops.get(b.stopId)!.name,departure:fmt(a.departure),arrival:fmt(b.arrival),departureMinutes:a.departure,arrivalMinutes:b.arrival,shape:feed.shapes.get(t.shapeId)||r.shape};
}
export async function planTrip(params:{from:string;to:string;date:string;time:string}):Promise<PlanResponse>{
 const feed=await getFeed();const {from,to,date,time}=params;const min=mins(`${time}:00`);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time)||min<0||min>=1440)throw Error('Choose a valid date and time.');
 if(!feed.stops.has(from)||!feed.stops.has(to)||from===to)throw Error('Choose two different bus stops from the map.');
 const start=feed.network.calendarStart,end=feed.network.calendarEnd;
 if((start&&date<start)||(end&&date>end))return {options:[],date,requestedTime:time,dataStart:start,dataEnd:end,message:`The published schedule dataset covers ${start||'?'} to ${end||'?'}. Select a covered date or consult BT for updated service.`,scheduledOnly:true};
 const active=new Set<string>();for(const t of feed.trips)if(activeService(feed,t.serviceId,date))active.add(t.id);
 const first:{trip:STrip;index:number;departure:number}[]=[];
 for(const t of feed.tripByStop.get(from)||[]){if(!active.has(t.id))continue;
  for(let i=0;i<t.stops.length-1;i++)if(t.stops[i].stopId===from&&t.stops[i].departure>=min&&t.stops[i].departure<=min+360)first.push({trip:t,index:i,departure:t.stops[i].departure});}
 first.sort((a,b)=>a.departure-b.departure);
 const results:TripOption[]=[];const seen=new Set<string>();
 function add(legs:TripLeg[]){const d=legs[0].departureMinutes,a=legs.at(-1)!.arrivalMinutes;
  const key=legs.map(l=>`${l.routeId}:${l.fromStopId}:${l.toStopId}:${l.departureMinutes}`).join('|');if(seen.has(key)||a<d) return;seen.add(key);
  results.push({legs,transfers:legs.length-1,departure:fmt(d),arrival:fmt(a),durationMin:a-d});}
 for(const item of first.slice(0,180)){
  const {trip,index}=item;
  for(let j=index+1;j<trip.stops.length;j++){
   const tstop=trip.stops[j];if(tstop.arrival>item.departure+190)break;
   if(tstop.stopId===to)add([leg(trip,index,j,feed)]);
  }
 }
 // A transfer must occur at the identical published stop ID, not a guessed pedestrian connection.
 if(results.length<5){
  for(const item of first.slice(0,90)){
   const {trip,index}=item;
   for(let j=index+1;j<trip.stops.length;j++){
    const x=trip.stops[j];if(x.arrival>item.departure+85)break;
    for(const next of feed.tripByStop.get(x.stopId)||[]){
      if(next.id===trip.id||!active.has(next.id))continue;
      const boarding=next.stops.findIndex(s=>s.stopId===x.stopId&&s.departure>=x.arrival+2&&s.departure<=x.arrival+65);
      if(boarding<0)continue;
      for(let k=boarding+1;k<next.stops.length;k++){
       if(next.stops[k].arrival>item.departure+210)break;
       if(next.stops[k].stopId===to)add([leg(trip,index,j,feed),leg(next,boarding,k,feed)]);
      }
    }
   }
  }
 }
 results.sort((a,b)=>a.legs.at(-1)!.arrivalMinutes-b.legs.at(-1)!.arrivalMinutes||a.transfers-b.transfers);
 return {options:results.slice(0,5),date,requestedTime:time,dataStart:start,dataEnd:end,message:results.length?'Scheduled trips found. Times are from the published timetable, not live predictions.':'No matching direct or one-transfer scheduled trip was found within the next six hours at these exact stops. This is not proof that no service exists.',scheduledOnly:true};
}
