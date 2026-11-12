import Link from "next/link";
import type { Metadata } from "next";
import { TransitLab } from "@/components/transit-lab";
import { ArrowLeft, ArrowUpRight } from "@/components/icons";
export const metadata: Metadata = { title: "TransitFlow — Prototype", description: "Explore published Blacksburg Transit routes in an interactive interface with a conceptual route diagram." };
export default function Page() {
  return <main id="main" className="lab-page"><div className="shell lab-intro"><Link className="back-link" href="/projects/transitflow"><ArrowLeft size={17}/> TransitFlow case study</Link><p className="kicker">INTERACTIVE PROTOTYPE / 02</p><div className="lab-intro-row"><h1>Make the next move <em>clear.</em></h1><p>Choose a real Blacksburg origin, switch the service period, and inspect a published BT bus corridor. The map is a schematic—not a live tracker or official trip planner.</p></div></div><div className="shell lab-stage"><TransitLab/></div><div className="shell lab-after"><p><strong>A focused interaction study.</strong> The route names and corridors come from Blacksburg Transit’s published service information. This design prototype is not connected to live arrival data and its diagram is conceptual. Check BT schedules before traveling.</p><Link className="inline-link" href="/projects/transitflow">Read the full case study <ArrowUpRight size={17}/></Link></div></main>;
}
