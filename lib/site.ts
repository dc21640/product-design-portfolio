export const site = {
  name: "Daven Corrielus",
  initials: "DC",
  title: "Product designer & engineering student",
  location: "Virginia Tech · Blacksburg, VA",
  // Add your real contact details before publishing.
  email: "",
  linkedin: "",
  resumeUrl: "",
};

export type Project = {
  slug: "clarity-ai" | "transitflow";
  number: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  summary: string;
  year: string;
  tags: string[];
  status: string;
  challenge: string;
  direction: string;
  focus: string[];
  nextSteps: string[];
};

export const projects: Project[] = [
  {
    slug: "clarity-ai",
    number: "01",
    title: "Clarity AI",
    eyebrow: "AI / RESEARCH / WEB APP",
    subtitle: "Making research feel less overwhelming.",
    summary: "A concept for an AI-assisted research workspace that helps students collect sources, ask better questions, and stay grounded in evidence.",
    year: "2026 — Ongoing",
    tags: ["Product design", "AI interactions", "Web app"],
    status: "Concept in progress",
    challenge: "Research often happens across browser tabs, PDFs, notes, and disconnected tools. How might a single workspace help students understand information while keeping sources visible and verifiable?",
    direction: "Explore a calm, source-first interface where people can organize material, ask questions about their documents, and trace responses back to the original evidence.",
    focus: ["Source-first AI responses", "Readable document organization", "Clear trust and citation patterns"],
    nextSteps: ["Interview students about their research workflows", "Map tasks and prioritize the first-use experience", "Prototype document upload and cited answers", "Test clarity, trust, and navigation with users"],
  },
  {
    slug: "transitflow",
    number: "02",
    title: "TransitFlow",
    eyebrow: "MOBILITY / WAYFINDING / MOBILE",
    subtitle: "A calmer way to get from A to B.",
    summary: "A transit-planning app concept designed to make route choices, transfers, and arrival information easier to understand at a glance.",
    year: "2026 — Ongoing",
    tags: ["Mobile UX", "Information design", "Accessibility"],
    status: "Concept in progress",
    challenge: "Choosing a transit route can require balancing arrival times, transfers, walking, and uncertainty. How might an interface make the tradeoffs understandable without overwhelming the rider?",
    direction: "Explore a route-first experience with clear travel options, visible transfer details, and accessible wayfinding that supports confident decisions.",
    focus: ["Route comparison at a glance", "Accessible transit information", "Helpful transfer and arrival details"],
    nextSteps: ["Talk with commuters about their route-planning frustrations", "Diagram trip-planning and transfer journeys", "Prototype route comparison and trip detail screens", "Run usability tests on key navigation tasks"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
