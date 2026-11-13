"use client";

import { useEffect, useState } from "react";

export function ExperienceEffects() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      setScrolled(window.scrollY > 650);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    if (!reduced) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      }), { threshold: 0.12 });
      document.querySelectorAll(".reveal-on-scroll").forEach(el => observer.observe(el));
      return () => { observer.disconnect(); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
    }
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <><div className="reading-progress" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true"/><button className={`back-to-top ${scrolled ? "show" : ""}`} type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })} aria-label="Back to top">↑</button></>;
}
