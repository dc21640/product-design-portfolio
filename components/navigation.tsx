"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { site } from "@/lib/site";

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);
  const onWork = pathname === "/" || pathname.startsWith("/projects/") || pathname.startsWith("/lab/");

  return <header className="site-header">
    <div className="shell nav-inner">
      <Link href="/" className="wordmark" aria-label="Daven Corrielus — home" onClick={() => setOpen(false)}>
        <span className="wordmark-monogram" aria-hidden="true">dc<span>.</span></span>
        <span className="wordmark-name">Daven Corrielus</span>
      </Link>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>
        <span>{open ? "Close" : "Menu"}</span><span className="menu-icon" aria-hidden="true">{open ? "×" : "+"}</span>
      </button>
      <nav id="primary-navigation" className={`nav-links ${open ? "nav-open" : ""}`} aria-label="Main navigation">
        <Link className={onWork ? "active" : ""} aria-current={onWork ? "page" : undefined} href="/#work" onClick={() => setOpen(false)}>Work</Link>
        <Link className={pathname === "/about" ? "active" : ""} aria-current={pathname === "/about" ? "page" : undefined} href="/about" onClick={() => setOpen(false)}>About</Link>
        <a href={site.resumeUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Résumé <span className="nav-external" aria-hidden="true">↗</span></a>
        <a className="nav-contact" href={`mailto:${site.email}`} onClick={() => setOpen(false)}>Contact <ArrowUpRight size={16}/></a>
      </nav>
    </div>
  </header>;
}
