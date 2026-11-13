import Link from 'next/link';
import type {Metadata} from 'next';
import {TransitMap} from '@/components/transit-map';
import {ArrowLeft} from '@/components/icons';
export const metadata:Metadata={title:'TransitFlow — Blacksburg transit map',description:'An interactive Blacksburg Transit map with actual GTFS bus stops, published route shapes and timetable-based trip planning.'};
export default function Page(){return <main id="main" className="lab-page"><div className="shell lab-intro"><Link className="back-link" href="/projects/transitflow"><ArrowLeft size={17}/> TransitFlow case study</Link><p className="kicker">FUNCTIONAL GTFS TRANSIT MAP</p></div><div className="shell tf-stage"><TransitMap/></div><div className="shell lab-after"><p><strong>Real places, real network data.</strong> The map shows published Blacksburg Transit stop coordinates, route geometries and scheduled trips. It is not a real-time arrival app, and timetable data can become outdated.</p><Link className="inline-link" href="/projects/transitflow">Read the design case study ↗</Link></div></main>}
