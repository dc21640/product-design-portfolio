import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: { default: `${site.name} — Product Design`, template: `%s — ${site.name}` },
  description: "A selection of product design explorations by Daven Corrielus. Thoughtful interfaces, engineering, and emerging technology.",
  openGraph: { title: `${site.name} — Product Design`, description: "Selected product design projects and interactive prototypes." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body id="top"><a className="skip-link" href="#main">Skip to content</a><Navigation/>{children}<Footer/></body></html>;
}
