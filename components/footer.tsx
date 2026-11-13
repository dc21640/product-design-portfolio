import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowUpRight } from "./icons";

export function Footer() {
  return <footer className="site-footer" id="contact">
    <div className="shell footer-main">
      <p className="eyebrow light-eyebrow">HAVE SOMETHING IN MIND?</p>
      <h2>Let’s make something<br/><em>thoughtful.</em></h2>
      {site.email ? <a className="footer-cta" href={`mailto:${site.email}`}>Say hello <ArrowUpRight size={18}/></a> : <p className="footer-placeholder">Contact email coming soon — add yours in <code>lib/site.ts</code>.</p>}
    </div>
    <div className="shell footer-bottom"><span>© {new Date().getFullYear()} {site.name}</span><span>Designed with intention. Built with curiosity.</span><Link href="/">Back to top ↑</Link></div>
  </footer>;
}
