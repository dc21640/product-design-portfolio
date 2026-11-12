export const site = {
  name: "Daven Corrielus",
  initials: "DC",
  title: "Product Designer & Developer",
  location: "Blacksburg, Virginia",
  email: "dc21640@vt.edu",
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
  iterations: { before: string; after: string; why: string }[];
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
      { step: "01", title: "Choose a question", description: "Clear suggested questions give users a focused entry point instead of an empty AI prompt." },
      { step: "02", title: "Read the response", description: "Short, structured answers include citations near the claims they support." },
      { step: "03", title: "Inspect the evidence", description: "Selecting a citation reveals the relevant source excerpt without leaving the workspace." },
    ],
    decisions: [
      { title: "Keep context on screen", description: "An evidence panel sits alongside the response, reducing the need to switch between tabs.", tradeoff: "Three columns add density, so the layout collapses on narrower screens." },
      { title: "Make evidence actionable", description: "Citations are buttons that open source excerpts, not decorative reference numbers.", tradeoff: "This prototype uses short sample excerpts rather than full-length PDFs." },
      { title: "Design for uncertainty", description: "The interface labels responses and sources as examples rather than implying verified AI output.", tradeoff: "Live model integration is deliberately out of scope at this stage." },
    ],
    iterations: [
      { before: "Source buttons appeared below the entire response.", after: "Citations now sit directly beside the individual claims they support.", why: "Reduce the work of matching evidence to a statement." },
      { before: "A static document list exposed every sample equally.", after: "A searchable source panel highlights the document currently being inspected.", why: "Make the current reading context easier to understand." },
      { before: "Saving an insight only changed the button label.", after: "Saved insights have a dedicated view with a working return path to each answer.", why: "Close the loop on the action and let the user find what they saved." },
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
    headline: "From local routes to clear journeys.",
    summary: "An interactive exploration of real Blacksburg Transit corridors, service patterns, and the details riders need before boarding.",
    year: "2026",
    status: "Independent concept · In progress",
    role: "Product design, information architecture, frontend prototype",
    tools: "Figma explorations, React, Next.js, AI-assisted development",
    timeline: "2026 — ongoing",
    question: "How might we make real local bus routes easier to understand before riders need to rely on a timetable?",
    approach: "I grounded the prototype in Blacksburg Transit route names and published corridors. Origin and service-period controls let riders explore a realistic journey, followed by a simple route schematic and clear boarding steps.",
    experience: [
      { step: "01", title: "Choose a real origin", description: "Pick a Blacksburg neighborhood or campus area with published BT service." },
      { step: "02", title: "Check the service pattern", description: "Switch service windows to see when the published example changes from HWA or HWB to HWC, or from HXP to HXS." },
      { step: "03", title: "Follow the corridor", description: "See named streets, boarding guidance and the destination loop beside a route schematic." },
    ],
    decisions: [
      { title: "Make route details predictable", description: "Each example presents the bus code, destination loop, published corridor and service caveat in a consistent order.", tradeoff: "I removed invented trip durations rather than implying timetable precision the prototype cannot support." },
      { title: "Put preferences in context", description: "The time-of-service switch changes which real route is presented for Hethwood and Oak Lane riders.", tradeoff: "An editable service-period selector is a prototype, not an official trip planner or accessibility assessment." },
      { title: "Reveal detail progressively", description: "The journey summary and step-by-step boarding guidance appear beside a schematic of its corridor.", tradeoff: "Schematic corridors are not street-level geometry; no live location or ETA is implied." },
    ],
    iterations: [
      { before: "Generic names such as ‘Campus Connector’ obscured whether a trip was real.", after: "The planner uses official Blacksburg Transit line names and published corridors.", why: "Build confidence through recognizable, verifiable information." },
      { before: "A decorative loop-shaped map had no meaningful relationship to route selection.", after: "A route schematic now updates with the chosen origin, destination loop and corridor landmarks.", why: "Keep the visualization tied to the task while avoiding claims of geographic accuracy." },
      { before: "Users compared invented trip durations and walking times.", after: "The demo focuses on service-window changes, boarding steps and a link to official schedules.", why: "Show only decision criteria supported by the available prototype data." },
    ],
    testing: "I plan to test whether riders understand where a line operates, which service pattern to check, and where it arrives on campus.",
    testTasks: ["Choose an origin and identify its bus line", "Switch the service period and notice a line change", "Explain the route corridor and campus arrival loop"],
    boundaries: "Route names and corridors are grounded in Blacksburg Transit’s published 2026 information; the diagram is schematic, not geographic. There is no live timetable, real-time arrival, trip-time estimate, or verified stop-level navigation. Riders should confirm service with BT.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
