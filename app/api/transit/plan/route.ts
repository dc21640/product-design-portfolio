import {NextRequest,NextResponse} from 'next/server';
import {planTrip} from '@/lib/gtfs-server';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:NextRequest){const q=req.nextUrl.searchParams;
 try{return NextResponse.json(await planTrip({from:q.get('from')||'',to:q.get('to')||'',date:q.get('date')||'',time:q.get('time')||''}),{headers:{'Cache-Control':'no-store'}});}
 catch(err){return NextResponse.json({error:err instanceof Error?err.message:'Trip could not be planned.'},{status:400});}}
