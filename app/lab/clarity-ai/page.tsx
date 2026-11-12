import Link from "next/link";
import type { Metadata } from "next";
import { ClarityLab } from "@/components/clarity-lab";
import { ArrowLeft, ArrowUpRight } from "@/components/icons";
export const metadata: Metadata = { title: "Clarity AI — Prototype", description: "A source-first AI research interaction prototype using scripted example content." };
export default function Page() {
  return <main id="main" className="lab-page">
    <div className="shell lab-intro"><Link className="back-link" href="/projects/clarity-ai"><ArrowLeft size={17}/> Clarity AI case study</Link><p className="kicker">INTERACTIVE PROTOTYPE / 01</p><div className="lab-intro-row"><h1>Follow the <em>evidence.</em></h1><p>Select a sample question, inspect a citation, and explore an example research workspace. This demo uses scripted responses and sample documents—not a live AI model.</p></div></div>
    <div className="shell lab-stage"><ClarityLab/></div>
    <div className="shell lab-after"><p><strong>A focused interaction study.</strong> This prototype explores how answers, citations, and source excerpts can work together. It doesn't upload files or generate real AI responses.</p><Link className="inline-link" href="/projects/clarity-ai">Read the full case study <ArrowUpRight size={17}/></Link></div>
  </main>;
}
