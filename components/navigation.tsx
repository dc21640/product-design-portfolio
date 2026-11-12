"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [{ href: "/#work", label: "Work" }, { href: "/about", label: "About" }];
  return (
    <header className="site-header">
      <div className="shell nav-inner">
        <Link href="/" className="wordmark" aria-label={`${site.name}, home`} onClick={() => setOpen(false)}>
          <span className="wordmark-symbol">{site.initials}<span className="wordmark-dot">.</span></span>
          <span className="wordmark-name">{site.name}</span>
        </Link>
        <button className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span aria-hidden="true">{open ? "×" : "+"}</span></button>
        <nav id="primary-navigation" className={`nav-links ${open ? "nav-open" : ""}`} aria-label="Main navigation">
          {links.map(link => <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link className="nav-contact" href="/#contact" onClick={() => setOpen(false)}>Get in touch <span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
    </header>
  );
}
