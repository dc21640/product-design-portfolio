import {NextResponse} from 'next/server';
import {getNetwork} from '@/lib/gtfs-server';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){try{return NextResponse.json(await getNetwork(),{headers:{'Cache-Control':'public, s-maxage=900, stale-while-revalidate=900'}});}catch(err){return NextResponse.json({error:err instanceof Error?err.message:'The schedule feed is unavailable.'},{status:503});}}
