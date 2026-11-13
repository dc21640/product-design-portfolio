import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isFocusProject, focusEvidence } from '@/lib/design-evidence';
import { UsabilityStudy } from '@/components/usability-study';

type Props = { params: Promise<{slug:string}> };
export function generateStaticParams(){return [{slug:'clarity-ai'},{slug:'muse'}];}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;return {title:`${isFocusProject(slug)?focusEvidence[slug].title:'Project'} — Usability study kit`,robots:{index:false,follow:false}};}
export default async function StudyPage({params}:Props){
 const {slug}=await params;
 if(!isFocusProject(slug))notFound();
 return <main id="main" className="study-page"><div className="shell study-top"><Link href={`/projects/${slug}`}>← Back to case study</Link><span>Independent study kit · Local-only notes</span></div><div className="shell"><UsabilityStudy slug={slug}/></div></main>;
}
