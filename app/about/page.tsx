import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };
export default function About() {
  return <main id="main" className="about-page shell">
    <Link className="back-link" href="/#work"><ArrowLeft size={17}/> Selected work</Link>
    <div className="about-layout">
      <div className="about-heading"><p className="kicker">ABOUT / DAVEN CORRIELUS</p><h1>Engineer by training.<br/><em>Designer by curiosity.</em></h1></div>
      <div className="about-copy">
        <p className="about-lead">I like finding the simple idea inside a complicated problem.</p>
        <p>I'm studying Industrial & Systems Engineering with a minor in Computer Science at Virginia Tech. My academic work has shaped how I think about constraints, systems, and the people who use them.</p>
        <p>Photography sharpened my eye for composition and storytelling. Product design brings those interests together: understanding what matters to people, making deliberate interface decisions, and building something you can actually try.</p>
        <p>I'm currently developing four independent projects: Clarity AI, an exploration of trustworthy AI research interactions, and TransitFlow, a clearer approach to comparing transit journeys. They're works in progress, with interactive prototypes and testing still ahead.</p>
        <div className="about-info">
          <div><span>EDUCATION</span><strong>Virginia Tech</strong><p>B.S. Industrial & Systems Engineering; Computer Science minor · Expected May 2028</p></div>
          <div><span>INTERESTS</span><strong>AI products, information design, mobility</strong><p>Plus photography and tools that make creative work easier.</p></div>
          <div><span>OPPORTUNITIES</span><strong>Summer 2027</strong><p>Product design and design engineering internships.</p></div>
        </div>
        <div className="about-actions"><a className="button-primary" href={site.resumeUrl} target="_blank" rel="noopener noreferrer">Read my résumé <ArrowUpRight size={17}/></a><a className="button-text" href={`mailto:${site.email}`}>Get in touch <ArrowUpRight size={17}/></a></div>
      </div>
    </div>
  </main>;
}
