import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return <main id="main" className="about-page shell">
    <Link className="back-link" href="/"><ArrowLeft size={17}/> Back to home</Link>
    <div className="about-grid"><div><p className="eyebrow">A LITTLE ABOUT ME</p><h1>Equal parts<br/><em>logic & intuition.</em></h1></div><div className="about-copy"><p className="about-lead">I'm {site.name}, an engineering student at Virginia Tech with a growing focus on product design.</p><p>I’m interested in what happens when technical thinking meets clear, accessible, and genuinely useful digital experiences. My engineering background has taught me to approach messy problems methodically; photography has helped me pay attention to composition, context, and the story behind an image.</p><p>Now I’m exploring digital product design through independent concepts, including Clarity AI and TransitFlow. These projects are opportunities to practice user research, interaction design, and prototyping as I develop my portfolio.</p><p>I’m especially curious about AI interfaces, creative tools, mobility, and products that help people make better decisions.</p><div className="about-details"><div><span>CURRENTLY</span><strong>Virginia Tech · Engineering</strong></div><div><span>EXPLORING</span><strong>Product design · UX · AI</strong></div><div><span>LOOKING FOR</span><strong>Summer 2027 design internships</strong></div></div><Link className="text-link" href="/#work">See my work <ArrowUpRight size={18}/></Link></div></div>
  </main>;
}
