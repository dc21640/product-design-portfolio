import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { site } from "@/lib/site";

export function Footer() {
  return <footer className="site-footer" id="contact">
    <div className="shell footer-grid">
      <div>
        <p className="kicker kicker-light">HAVE A PROJECT OR OPPORTUNITY IN MIND?</p>
        <h2>Let’s talk about<br/><em>what’s next.</em></h2>
        <a className="footer-email" href={`mailto:${site.email}`}>{site.email}<ArrowUpRight size={23}/></a>
      </div>
      <div className="footer-aside">
        <span>Explore</span>
        <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer">Résumé (PDF) <ArrowUpRight size={16}/></a>
        <Link href="/about">About me <ArrowUpRight size={16}/></Link>
      </div>
    </div>
    <div className="shell footer-bottom">
      <span>© {new Date().getFullYear()} {site.name}</span>
      <span>Designed and built with care.</span>
      <a href="#top">Back to top ↑</a>
    </div>
  </footer>;
}
