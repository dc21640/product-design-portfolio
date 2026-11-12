const fs=require('fs');const path=require('path');const ts=require('typescript');const assert=require('node:assert/strict');
const filepath=path.join(__dirname,'../lib/gtfs-server.ts');
const src=fs.readFileSync(filepath,'utf8')+'\nexport function __testParse(files,url){return parse(files,url)};export function __testSet(value){memo=Promise.resolve(value);created=Date.now()}';
const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const testModule={exports:{}};const load=(id)=>id==='server-only'?{}:id==='fflate'?{strFromU8:(bytes)=>Buffer.from(bytes).toString('utf8'),unzipSync(){throw Error('Not used by fixture')}}:require(id);
new Function('require','module','exports',js)(load,testModule,testModule.exports);
const api=testModule.exports;
const files={};function add(name,rows){files[name]=Buffer.from(rows.join('\n')+'\n');}
add('feed_info.txt',['feed_publisher_name,feed_start_date,feed_end_date','BT,20261101,20261231']);
add('routes.txt',['route_id,route_short_name,route_long_name,route_color,route_text_color','R1,HWA,Hethwood A,226699,FFFFFF','R2,HWB,Hethwood B,CC5500,FFFFFF']);
add('stops.txt',['stop_id,stop_name,stop_lat,stop_lon,wheelchair_boarding','A,Stop A,37.21,-80.42,1','B,Stop B,37.22,-80.42,','C,Stop C,37.23,-80.42,','D,Stop D,37.24,-80.42,']);
add('trips.txt',['route_id,service_id,trip_id,trip_headsign,shape_id','R1,ALL,T1,Campus,S1','R1,ALL,T1B,Campus,S1','R2,ALL,T2,Downtown,S2']);
add('stop_times.txt',['trip_id,arrival_time,departure_time,stop_id,stop_sequence','T1,09:00:00,09:00:00,A,1','T1,09:20:00,09:20:00,B,2','T1,09:25:00,09:25:00,C,3','T1B,10:00:00,10:00:00,A,1','T1B,10:20:00,10:20:00,C,2','T2,09:32:00,09:32:00,C,1','T2,09:42:00,09:42:00,D,2']);
add('shapes.txt',['shape_id,shape_pt_lat,shape_pt_lon,shape_pt_sequence','S1,37.21,-80.42,1','S1,37.22,-80.42,2','S1,37.23,-80.42,3','S2,37.23,-80.42,1','S2,37.24,-80.42,2']);
add('calendar.txt',['service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date','ALL,1,1,1,1,1,1,1,20261101,20261231']);
async function main(){const parsed=api.__testParse(files,'https://example.test/gtfs.zip');api.__testSet(parsed);assert.equal(parsed.network.stops.length,4);assert.equal(parsed.network.routes.length,2);assert.equal(parsed.network.routes[0].shapeKind,'published');
 const direct=await api.planTrip({from:'A',to:'C',date:'2026-11-12',time:'09:30'});assert.equal(direct.options[0].departure,'10:00');assert.equal(direct.options[0].transfers,0);
 const transfer=await api.planTrip({from:'A',to:'D',date:'2026-11-12',time:'08:55'});assert.equal(transfer.options[0].transfers,1);assert.equal(transfer.options[0].arrival,'09:42');
 const fail=await api.planTrip({from:'D',to:'A',date:'2026-11-12',time:'08:00'});assert.equal(fail.options.length,0);
 const out=await api.planTrip({from:'A',to:'B',date:'2027-01-20',time:'09:00'});assert.match(out.message,/covers/);
 console.log('GTFS fixture tests passed: published geometry, 4 stops, direct service, single transfer, unavailable direction, stale-date boundary.');}
main().catch(e=>{console.error(e);process.exit(1)});
