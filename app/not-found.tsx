import Link from "next/link";
import { ArrowLeft } from "@/components/icons";
export default function NotFound() {
  return <main id="main" className="not-found shell"><p className="kicker">404 / PAGE NOT FOUND</p><h1>This page<br/>isn't here.</h1><p>It might have moved, or the address could be wrong.</p><Link className="button-primary" href="/"><ArrowLeft size={17}/> Back to the portfolio</Link></main>;
}
