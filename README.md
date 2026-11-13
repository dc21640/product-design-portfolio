# Product Design Portfolio — Evidence-led release V8

This release keeps the four functioning MVPs and adds deeper **Clarity AI** and **Muse** case studies, a local-first usability-study kit for each, improved source citation inspection, and visual Muse PNG export.

## New pages

- `/projects/clarity-ai` — design framing, reconstructed alternatives, working interaction path, self-critique iterations, testing plan, contribution and AI disclosure.
- `/projects/muse` — same depth for visual discovery and spatial moodboards.
- `/study/clarity-ai` and `/study/muse` — consent checkbox, facilitator tasks, anonymous local session notes, completion statuses, CSV export. **No invented participants or results.**
- `/lab/clarity-ai` — opens the *matching* evidence passage when a citation is selected, with optional full-document expansion.
- `/lab/muse` — exports a high-resolution PNG of the board or editable JSON data.

## Evidence standards

The design alternatives are simplified, reconstructed diagrams explaining options; they are **not** user-tested variants or dated original sketches. Iterations documented in the case studies come from design self-critique, not fabricated user observations. The test pages begin empty in every browser; no sessions have been claimed or stored on a server. After conducting actual studies, synthesize the observations and update the case studies yourself.

Read [the usability research protocol](docs/USABILITY-RESEARCH-PROTOCOL.md), [the portfolio interview walkthrough](docs/INTERVIEW-WALKTHROUGH.md), and [the safe deployment checklist](docs/DEPLOY-CHECKLIST.md).

## Local development

```bash
npm install
npm run test:case-study
npm run test:creative
npm run test:design
npm run test:gtfs
npm run lint
npm run build
npm run dev
```

The update is prepared against the supplied V7 package. It was statically checked and unit tests were run; a production build requires dependency installation and a working Next.js environment. No claim of live Vercel deployment is made here.

---

# Product design portfolio — Four functional MVPs

A Next.js portfolio with **four independently designed product prototypes**: Clarity AI, TransitFlow, Muse, and Exposure. The most recent update replaces TransitFlow's static route diagram with a **real interactive Blacksburg map** based on [Blacksburg Transit's public GTFS schedule feed](https://drpt.virginia.gov/data/gtfs-feed-clearinghouse/). The visual interface is an independent portfolio project, not an official Blacksburg Transit product.

## What's included

| URL | Feature |
| --- | --- |
| `/` | Portfolio and featured projects |
| `/projects/clarity-ai` | Clarity AI case study |
| `/lab/clarity-ai` | Document-aware research MVP |
| `/projects/transitflow` | TransitFlow case study |
| `/lab/transitflow` | Geographic transit map, GTFS bus stops and schedules |
| `/projects/muse` | Muse case study: visual collection → spatial synthesis |
| `/lab/muse` | Working Muse discovery library and moodboard canvas |
| `/projects/exposure` | Exposure case study: image editing → proofing → delivery |
| `/lab/exposure` | Working photo culling, client-review simulation and ZIP export |
| `/about` | About and resume link |
| `/resume.pdf` | Original uploaded resume |

## Run locally

Node.js 20+ is recommended.

```bash
npm install
npm run dev
```

Open <http://localhost:3000> or go directly to `/lab/muse` and `/lab/exposure`.

Before deploying:

```bash
npm run test:gtfs
npm run lint
npm run build
```

A local build and browser run must be verified on your Mac before pushing. This packaged update was syntax-checked and its GTFS timetable parser tested with fixtures, but its **production build and real-feed network fetch have not been verified** in the packaging environment.

## TransitFlow: actual map functionality

The map uses [Leaflet](https://leafletjs.com/) with [OpenStreetMap tiles](https://www.openstreetmap.org/copyright). Server endpoints retrieve and parse the public static GTFS ZIP:

- `GET /api/transit/network` — bus routes, **published geometry**, stops, accessible-boarding data when specified, and feed service coverage.
- `GET /api/transit/plan?from=<GTFS_STOP_ID>&to=<GTFS_STOP_ID>&date=YYYY-MM-DD&time=HH:MM` — scheduled direct or one-transfer itineraries with trips and stop times filtered through `calendar.txt` and `calendar_dates.txt`.
- The map can pan/zoom, filter by bus route, click/search stops, choose boarding/alighting locations, show a stop's routes, plot the selected bus itinerary, and request the browser's approximate location on demand.
- Data is downloaded **server-side**, cached in the application for 30 minutes, and not embedded as invented coordinates or geometries.
- The map limits its route picker to Blacksburg service lines and excludes Two Town Trolley / Explorer routes to keep the scope centered on town and campus.

**Important limitations:** This is **scheduled** public transit data, not real-time tracking. There are no live vehicle positions, delay predictions, detour updates, walking directions, or turn-by-turn navigation. The schedule planner supports a direct bus or one transfer at an *identical* GTFS stop ID, within a six-hour departure window. This intentionally omits some possible nearby-stop walking connections. Map overlays display one **representative published trip shape per route**; individual service variants may differ. Stop wheelchair accessibility is only shown as known if declared in the published GTFS feed. Not every schedule date is covered, and the app refuses to invent service outside feed dates.

Data sources: [Virginia DRPT GTFS clearinghouse](https://drpt.virginia.gov/data/gtfs-feed-clearinghouse/), [Blacksburg Transit published schedules](https://ridebt.org/schedules). Standard street tiles are © OpenStreetMap contributors. The public OSM tile service has its own [usage policy](https://operations.osmfoundation.org/policies/tiles/) and is suitable for low-volume demonstration; switch to a dedicated tile provider before scaling.

The first API load requires the feed URL to be reachable by the Vercel server. On feed errors, the UI shows a clear error and links to the official timetable instead of substituting fictitious bus locations.

## Clarity AI

The Clarity research MVP supports local source text, evidence retrieval, saved answers, and optional Claude-powered synthesis. To enable Claude, create `.env.local` using the entries in `.env.example`. **Never add your API key to GitHub.** Add authentication, quotas and billing limits before exposing a paid model key on a public site.

## Update an already connected Vercel site

1. Download/extract this ZIP.
2. Back up your existing repo, then copy the **contents** of the extracted `product-design-portfolio` into your existing Git-connected `product-design-portfolio` directory. Keep its hidden `.git` directory, `.env.local`, and `node_modules` untouched. Do **not** create a nested project folder.
3. In VS Code Terminal, in that original Git repository, run:

```bash
npm install
npm run test:gtfs
npm run lint
npm run build

git status
git add .
git commit -m "Add Muse and Exposure product design applications"
git push origin main
```

4. Check the Vercel Deployments page and visit `<your-existing-vercel-url>/lab/transitflow`. If Vercel returns a fetch error, consult the server logs and verify the agency feed is reachable from the deployment environment.

## Source file guide

- `components/transit-map.tsx` — rider interface, Leaflet rendering, and interactive controls.
- `lib/gtfs-server.ts` — GTFS ZIP parser, schedule/calendar service evaluation and one-transfer itinerary search.
- `lib/gtfs-public.ts` — shared network and trip types.
- `app/api/transit/network/route.ts` — public network endpoint.
- `app/api/transit/plan/route.ts` — scheduled itinerary endpoint.
- `app/globals.css` — map styling and responsive behavior.
- `tests/gtfs-fixture.cjs` — deterministic tests of core schedule operations.

## Portfolio integrity

TransitFlow is a demonstrable independent MVP. User interviews, real-world transit performance gains, accessibility guarantees, and live-tracking features must **not** be claimed without actual evidence. Its case study explains what was built and what remains unverified.

## V5.1 deployment hotfix

V5.1 corrects a client-side map initialization typo (`requestAnimation` → `window.requestAnimationFrame`). The incorrect name prevents TypeScript from passing the production build.

For an existing GitHub-connected project on macOS, copy the updated **contents** into the existing local repository, preserve `.git` and `.env.local`, then run:

```bash
npm install
npm run test:gtfs
npm run lint
npm run build
git add .
git commit -m "Fix TransitFlow map build error"
git push origin main
```

If a fresh Vercel build still fails, open that deployment's **Build Logs**, copy the first error block, and inspect the Vercel project's repository, root-directory, and Node settings. Vercel uses the version pushed to GitHub, not downloaded ZIP files.


## V6 — Muse and Exposure creative applications

These are **interactive local-first MVPs**, not static visual mockups. They introduce **no new npm dependencies** beyond those already present in V5.1.

### Muse — `/lab/muse`

- Curated discovery gallery with category filters, keyword search and a direct **Save to board** action.
- Two example moodboards with preview images, editable spatial canvas, repositionable image cards and notes.
- Drag cards with mouse or touch. Focus a card and press **arrow keys** to nudge it; **Delete/Backspace** removes it from the board.
- Create and rename boards, delete a board, and edit notes in the inspector.
- Import JPG, PNG and other browser-supported image types; imports are resized into smaller JPEGs and stored **only in localStorage** with the board data. Browser storage limits apply.
- Export a moodboard as structured JSON that includes references and layout positions. This is **not** a publicly hosted, collaborative or image-rendered export.

### Exposure — `/lab/exposure`

- Image-first asset library with filename search, filtering by selection/rating/approval, and sorting.
- Import up to 40 images per import operation (each below 24 MB); original uploaded **file blobs live only in this browser's IndexedDB**. The server does not receive the imported photos.
- Full-size Review mode with filmstrip, **Left/Right** navigation, **1–5** for ratings, and **P** to toggle a pick.
- Local proofing preview: approve or request changes and attach comments. This is not a real external client account or shared live gallery.
- Export a CSV manifest of all images and **a real ZIP** of selected original image files, plus a manifest and readme. This is assembled client-side using existing `fflate`.
- Remove imported files individually or restore the entire sample session through Reset demo.

### Demo-media attribution

The `public/demo-media/` folder includes **six original editorial graphic compositions authored for this project** and a **small set of photography/texture demonstration assets derived from `scikit-image` sample data** (`astronaut`, `coffee`, `chelsea`/cat, `rocket`, `hubble_deep_field`, `camera`, `brick`, `grass`, `colorwheel`). These samples are for UI demonstration and **are not the portfolio owner's photography or claimed client deliverables**. Some dataset photographs originate from NASA. See scikit-image data documentation and each sample's credits for source details. Replace demo assets with images you own or are licensed to distribute before using either product commercially.

### Privacy, limits, and access

- No authentication, multi-device sync, cloud uploads, payment processing or live collaboration.
- Reloading normally preserves the current browser's work. Incognito mode, clearing site data, or exceeding browser storage limits can remove saved content.
- User images are never transmitted to the portfolio backend by Muse or Exposure. Exposure ZIP export happens in the browser and can consume memory with many large files.
- The case studies clearly identify independent prototype work and plans for usability testing; none claim research participants or unverified performance gains.

### Quick regression checklist

After `npm install`, run `npm run lint`, `npm run test:gtfs`, `npm run test:creative`, and `npm run build`.

In the browser, try:

1. Muse → Discover → Save → choose a board → Studio → drag a card → add/edit a note → export board data.
2. Muse → import a personal JPG → save it to a newly created board → reload the page and verify it remains.
3. Exposure → Library → open a photo → rate it using `5` → press `P` to select → open Proofing and approve.
4. Exposure → export selected images to ZIP and inspect the contents, then export the CSV manifest.
5. Exposure → import a JPG/PNG → reload and verify the image remains; remove it afterwards.
6. Check each application at phone width and keyboard-only operation.

**Package verification:** The source was TSX-syntax checked; the new asset and route contract checks passed. Full TypeScript type-checking and a production Next.js build could not be completed in the packaging environment because npm package installation timed out. Run `npm run build` on your Mac before deployment and share the first failing build-log error if needed.


## V7 — creative-product refinement

This iteration polishes the existing Muse and Exposure products without changing their local-first architecture.

- **Project covers:** Redesigned as two-column editorial compositions with a dedicated, high-contrast title area and separate imagery. The mobile versions stack text before media, rather than letting photos obscure the product names.
- **Muse:** Discover now has a contextual start card and an Open Studio action. Selecting a visual opens its enlarged image, category, descriptive tags and source attribution; users can save directly from that detail view. Boards and keyboard-enabled spatial composition remain intact.
- **Exposure:** A four-step workflow guide makes import, rating, client preview and export distinct. Review can jump to the next unrated frame. Proofing only includes selected photos and explains how to get started when there are none.
- **Accessibility:** Larger operational text and touch targets, clearer keyboard focus, readable labels on the covers and responsive behavior at 320px–1440px.

Run `npm run test:design` for the dependency-free integration checks in addition to the existing tests. A local production build (`npm run build`) is required before deployment. These iterations are designer-led reviews; no user-test results or commercial usage are claimed.

## V9 — Homepage typography and Muse restoration

The homepage now uses a consistent sans-serif headline and restrained responsive spacing. Its project index links directly to all four products, including Muse, and each project retains its own case study and app route. See [docs/UPDATE-V9.md](docs/UPDATE-V9.md) for the minimal update instructions, testing notes, and Vercel deployment steps.
