import Link from "next/link";
import type { Metadata } from "next";
import { TransitLab } from "@/components/transit-lab";
import { ArrowLeft, ArrowUpRight } from "@/components/icons";
export const metadata: Metadata = { title: "TransitFlow — Prototype", description: "An interactive route-comparison concept using illustrative sample data." };
export default function Page() {
  return <main id="main" className="lab-page"><div className="shell lab-intro"><Link className="back-link" href="/projects/transitflow"><ArrowLeft size={17}/> TransitFlow case study</Link><p className="kicker">INTERACTIVE PROTOTYPE / 02</p><div className="lab-intro-row"><h1>Make the next move <em>clear.</em></h1><p>Compare sample journeys, turn on a less-walking preference, and inspect a route. Times and locations are illustrative—not real-time transit information.</p></div></div><div className="shell lab-stage"><TransitLab/></div><div className="shell lab-after"><p><strong>A focused interaction study.</strong> This prototype tests route-comparison hierarchy and preference controls. It isn't connected to live maps, transit feeds, or navigation services.</p><Link className="inline-link" href="/projects/transitflow">Read the full case study <ArrowUpRight size={17}/></Link></div></main>;
}
