import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${site.name} — Product Design`, template: `%s — ${site.name}` },
  description: "Product design explorations at the intersection of thoughtful interfaces, engineering, and emerging technology.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Navigation/>{children}<Footer/></body></html>;
}
