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
    summary: "A working source-first research MVP for asking questions of your notes, checking supporting evidence, and saving useful answers.",
    year: "2026",
    status: "Independent MVP · In progress",
    role: "Product design, interaction design, frontend prototype",
    tools: "Figma explorations, React, Next.js, AI-assisted development",
    timeline: "2026 — ongoing",
    question: "How might a research tool help students move from an answer to the evidence behind it, without losing their place?",
    approach: "The first working MVP supports importing or pasting text sources, asking a question, reading evidence snippets, and saving an answer in the browser. An optional server-side Claude integration synthesizes source-grounded responses.",
    experience: [
      { step: "01", title: "Choose a question", description: "Example questions help users begin; a free-form input accepts their own research questions." },
      { step: "02", title: "Read the response", description: "An evidence-search mode works without an API key; optional Claude synthesis uses source IDs and excerpt retrieval." },
      { step: "03", title: "Inspect the evidence", description: "Selecting an evidence card reveals the matching document without leaving the workspace." },
    ],
    decisions: [
      { title: "Keep context on screen", description: "An evidence panel sits alongside the response, reducing the need to switch between tabs.", tradeoff: "Three columns add density, so the layout collapses on narrower screens." },
      { title: "Make evidence actionable", description: "Evidence cards reveal the associated source text; AI-generated answers include source IDs when configured.", tradeoff: "The MVP accepts text and small text files; PDF ingestion and automatic source pagination are not yet built." },
      { title: "Design for uncertainty", description: "The UI distinguishes quoted evidence-search results from model-generated synthesis and labels all sample notes as fictional.", tradeoff: "Claude synthesis is conditional on a configured backend key, and AI claims still require human verification." },
    ],
    iterations: [
      { before: "Source buttons appeared below the entire response.", after: "With Claude configured, citation IDs are interactive inside the answer; evidence cards also open the selected source.", why: "Let readers inspect the source without leaving the answer context." },
      { before: "A static document list exposed every sample equally.", after: "A searchable source panel highlights the document currently being inspected.", why: "Make the current reading context easier to understand." },
      { before: "Saving an insight only changed the button label.", after: "Saved insights have a dedicated view with a working return path to each answer.", why: "Close the loop on the action and let the user find what they saved." },
    ],
    testing: "I plan to test whether people can locate the source supporting a claim, understand the connection, and return to the answer without guidance.",
    testTasks: ["Locate the evidence behind a sample claim", "Explain what the excerpt does—and does not—support", "Save an insight and return to another question"],
    boundaries: "The MVP handles user-pasted text or small TXT/MD/CSV/JSON uploads, real questions, evidence retrieval, and browser-local saved answers. Optional Claude synthesis requires a server-side key. It does not yet parse PDFs, support accounts, or claim user-testing outcomes. Sample notes are fictional.",
  },
  {
    slug: "transitflow",
    index: "02",
    title: "TransitFlow",
    category: "Mobility · Web experience",
    headline: "A useful map, not just another transit diagram.",
    summary: "A Blacksburg transit explorer with real GTFS stop locations, published line geometry, and scheduled stop-to-stop trip planning.",
    year: "2026",
    status: "Independent MVP · In progress",
    role: "Product design, information architecture, frontend and API implementation",
    tools: "React, Next.js, Leaflet, OpenStreetMap, GTFS, TypeScript, AI-assisted development",
    timeline: "2026 — ongoing",
    question: "How might we make local bus service easier to find, interpret, and plan around—without confusing scheduled data with live predictions?",
    approach: "I replaced a curated route-example screen with an interactive street map fed by Blacksburg Transit’s published GTFS. Routes use published geographic shapes, stops are searchable by name, and the journey planner finds scheduled direct trips or one-transfer trips between actual stop IDs.",
    experience: [
      { step: "01", title: "Find your stop on the real map", description: "Pan and zoom around Blacksburg, search published stop names, or request browser location to discover a nearby stop." },
      { step: "02", title: "Inspect a published bus line", description: "Filter by route and view actual stop coordinates and a representative GTFS shape. Select a marker to set a start or destination." },
      { step: "03", title: "Compare scheduled trips", description: "Choose two published stops and a date/time. Review direct or single-transfer itinerary options with scheduled boarding and arrival times, never invented ETAs." },
    ],
    decisions: [
      { title: "Ground the map in an agency feed", description: "The server reads GTFS stops, shapes, routes, trips, calendars and stop times, and exposes a compact JSON interface to the client.", tradeoff: "The agency feed can be temporarily unavailable or expire; the UI provides a transparent failure state and links to official schedules." },
      { title: "Separate location, route and trip", description: "Stop discovery, line filtering and trip planning have distinct controls. Clicking a map marker reveals explicit Start here and Go here actions.", tradeoff: "The interface is more purposeful than a single conversational prompt, but it requires a small amount of upfront input." },
      { title: "Treat uncertainty as part of the product", description: "Every itinerary is labeled scheduled. Accessibility information is shown only when explicitly present, and transfers require an actual shared stop ID.", tradeoff: "This conservative approach will sometimes omit valid walking connections; it avoids claiming routing data we do not have." },
    ],
    iterations: [
      { before: "The original prototype showed six fixed origin areas and a linear corridor diagram.", after: "Riders can now inspect a zoomable street map and search actual stop coordinates from the agency’s feed.", why: "Geographic context is essential when deciding where to board." },
      { before: "Example routes depended on manually selected time windows and generic boarding advice.", after: "Date- and time-specific searches use calendar rules and ordered GTFS stop times for direct or one-transfer schedules.", why: "Show evidence-backed journey options rather than generic approximations." },
      { before: "The initial concept could not distinguish scheduled and live information.", after: "The map explicitly states that times are scheduled, includes a data-range boundary and links to official BT updates.", why: "Reliable product design includes clear limits, not just a polished interface." },
    ],
    testing: "Next I plan to observe students searching for a stop, choosing a route and identifying whether a time is scheduled or live. No user-testing outcomes are claimed yet.",
    testTasks: ["Find Newman Library or another familiar stop on the map", "Plan a trip between two published stops for a selected date", "Explain whether a displayed bus departure is live or scheduled", "Recover when the feed is temporarily unavailable"],
    boundaries: "Built with OpenStreetMap and Blacksburg Transit’s public GTFS feed. This is a working scheduled transit explorer, not a certified navigation app. Its line overlays show representative route patterns; it does not include real-time bus tracking, delay predictions, pedestrian directions, multiple-transfer routing, or guaranteed accessibility. Agency data availability is outside this independent project's control.",
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
