import Link from "next/link";
import { InteractiveWork } from "@/components/interactive-work";
import { ArrowRight, ArrowUpRight, Layers, Sparkle } from "@/components/icons";
import { site } from "@/lib/site";

export default function Home() {
  return <main id="main">
    <section className="hero shell interactive-hero">
      <div className="hero-top"><span className="availability"><i/> OPEN TO SUMMER 2027 OPPORTUNITIES</span><span className="hero-loc">{site.location}</span></div>
      <div className="hero-content"><p className="eyebrow">HELLO, I'M DAVEN <span className="asterisk">✳</span></p><h1>Designing for<br/><span className="hero-serif">clarity</span><span className="hero-period">.</span> Building<br/>with <span className="hero-italic">purpose.</span></h1><div className="hero-description"><p>I'm an engineering student exploring the space between <strong>complex systems</strong> and <strong>simple, human experiences.</strong></p><Link className="text-link" href="#work">Explore selected work <ArrowRight size={19}/></Link></div></div>
      <div className="hero-bottom"><span>PRODUCT DESIGN / UX / CREATIVE TECHNOLOGY</span><span>SCROLL TO EXPLORE <span className="scroll-bounce">↓</span></span></div>
    </section>
    <section className="work-section reveal-on-scroll" id="work"><div className="shell"><div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Ideas in <em>progress.</em></h2></div><p>Two concept projects exploring how thoughtful product design can make complex tasks feel effortless.</p></div><InteractiveWork/></div></section>
    <section className="approach-section shell reveal-on-scroll"><div className="approach-intro"><p className="eyebrow">02 / HOW I THINK</p><h2>A little analytical.<br/><em>A lot curious.</em></h2><p>I care about the details that turn complicated technology into products people actually want to use. My approach brings an engineering mindset together with visual storytelling and a curiosity for how people think.</p><Link className="text-link" href="/about">More about me <ArrowUpRight size={18}/></Link></div><div className="approach-stack"><div className="approach-item"><span className="approach-icon"><Layers/></span><div><h3>Systems thinking</h3><p>Understanding constraints, relationships, and the bigger picture before drawing screens.</p></div><span className="approach-number">01</span></div><div className="approach-item"><span className="approach-icon"><Sparkle/></span><div><h3>Thoughtful interactions</h3><p>Making interfaces feel clear, considered, and approachable.</p></div><span className="approach-number">02</span></div><div className="approach-item"><span className="approach-icon"><span style={{fontSize:23}}>↗</span></span><div><h3>Building to learn</h3><p>Using prototypes and AI-assisted development to test ideas instead of leaving them on a canvas.</p></div><span className="approach-number">03</span></div></div></section>
    <section className="closing-strip"><div className="shell closing-inner"><span>DESIGN IS HOW IT WORKS.</span><span>CURIOUS BY DEFAULT. ↗</span></div></section>
  </main>;
}
