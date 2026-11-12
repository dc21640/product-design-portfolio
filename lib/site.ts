export const site = {
  name: "Daven Corrielus",
  initials: "DC",
  title: "Product Designer & Developer",
  location: "Blacksburg, Virginia",
  email: "dc21640@vt.edu",
  linkedin: "https://www.linkedin.com/in/daven-corrielus/",
  resumeUrl: "/resume.pdf",
};

export type Project = {
  slug: "clarity-ai" | "transitflow";
  index: string;
  title: string;
  category: string;
  headline: string;
  summary: string;
  year: string;
  status: string;
  role: string;
  tools: string;
  timeline: string;
  question: string;
  approach: string;
  experience: { step: string; title: string; description: string }[];
  decisions: { title: string; description: string; tradeoff: string }[];
  testing: string;
  testTasks: string[];
  boundaries: string;
};

export const projects: Project[] = [
  {
    slug: "clarity-ai",
    index: "01",
    title: "Clarity AI",
    category: "AI tools · Web experience",
    headline: "Research with the evidence in view.",
    summary: "An interactive concept for a research workspace that keeps AI-assisted answers connected to their sources.",
    year: "2026",
    status: "Independent concept · In progress",
    role: "Product design, interaction design, frontend prototype",
    tools: "Figma explorations, React, Next.js, AI-assisted development",
    timeline: "2026 — ongoing",
    question: "How might a research tool help students move from an answer to the evidence behind it, without losing their place?",
    approach: "Rather than designing another chat window, I focused the first prototype on a single task: ask a question, follow a citation, and inspect its source alongside the answer.",
    experience: [
      { step: "01", title: "Choose a question", description: "A small set of sample prompts gives people a clear starting point instead of an empty input." },
      { step: "02", title: "Read the response", description: "Short, structured answers include citations near the claims they support." },
      { step: "03", title: "Inspect the evidence", description: "Selecting a citation reveals the relevant source excerpt without leaving the workspace." },
    ],
    decisions: [
      { title: "Keep context on screen", description: "An evidence panel sits alongside the response, reducing the need to switch between tabs.", tradeoff: "Three columns add density, so the layout collapses on narrower screens." },
      { title: "Make evidence actionable", description: "Citations are buttons that open source excerpts, not decorative reference numbers.", tradeoff: "This prototype uses short sample excerpts rather than full-length PDFs." },
      { title: "Design for uncertainty", description: "The interface labels responses and sources as examples rather than implying verified AI output.", tradeoff: "Live model integration is deliberately out of scope at this stage." },
    ],
    testing: "I plan to test whether people can locate the source supporting a claim, understand the connection, and return to the answer without guidance.",
    testTasks: ["Locate the evidence behind a sample claim", "Explain what the excerpt does—and does not—support", "Save an insight and return to another question"],
    boundaries: "The interactive prototype runs on scripted questions, responses, and documents. It does not upload files, generate live answers, or claim results from user interviews.",
  },
  {
    slug: "transitflow",
    index: "02",
    title: "TransitFlow",
    category: "Mobility · Mobile experience",
    headline: "Choose a route with confidence.",
    summary: "A transit-planning concept that makes the tradeoffs between duration, walking, and transfers easier to compare.",
    year: "2026",
    status: "Independent concept · In progress",
    role: "Product design, information architecture, frontend prototype",
    tools: "Figma explorations, React, Next.js, AI-assisted development",
    timeline: "2026 — ongoing",
    question: "How might route planning explain the differences between journeys at a glance, especially when the fastest option is not the easiest?",
    approach: "I designed route selection around a small number of consistent attributes: total trip time, walking effort, and transfers. The interface lets riders compare first and inspect the detailed journey second.",
    experience: [
      { step: "01", title: "Review the journey", description: "Origin and destination are kept visible, using clearly labeled sample locations." },
      { step: "02", title: "Compare alternatives", description: "Each route presents the same three decision factors in a predictable order." },
      { step: "03", title: "Check the details", description: "Selecting a route reveals its steps; a walking preference narrows the options." },
    ],
    decisions: [
      { title: "Compare like with like", description: "Routes use consistent labels and measurements so differences can be understood quickly.", tradeoff: "Only a few criteria are shown initially to avoid overwhelming the comparison." },
      { title: "Put preferences in context", description: "The less-walking option lives beside the route list, where its effect is immediately visible.", tradeoff: "A simple toggle is a starting point; actual accessibility needs require research." },
      { title: "Reveal detail progressively", description: "Step-by-step directions appear after a route is chosen, not before.", tradeoff: "The map is illustrative and intentionally makes no real-time location claims." },
    ],
    testing: "I plan to observe whether riders can choose a route based on a stated preference and accurately explain the reason for their choice.",
    testTasks: ["Find the fastest sample trip", "Choose the route with the least walking", "Explain the steps and transfers for the chosen route"],
    boundaries: "Routes, travel times, and the map are illustrative examples. There is no live transit feed, geocoding, real-world navigation, or validated accessibility outcome.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
