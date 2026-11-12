import Link from "next/link";
export default function NotFound() { return <main id="main" className="shell not-found"><p className="eyebrow">404 / NOT FOUND</p><h1>Nothing here.<br/><em>Yet.</em></h1><p>That page doesn’t exist.</p><Link href="/" className="text-link">Return to homepage ↗</Link></main>; }
