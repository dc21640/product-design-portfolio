# Product design portfolio — Clarity AI + TransitFlow

A Next.js portfolio with two product projects. The most recent update replaces TransitFlow's static route diagram with a **real interactive Blacksburg map** based on [Blacksburg Transit's public GTFS schedule feed](https://drpt.virginia.gov/data/gtfs-feed-clearinghouse/). The visual interface is an independent portfolio project, not an official Blacksburg Transit product.

## What's included

| URL | Feature |
| --- | --- |
| `/` | Portfolio and featured projects |
| `/projects/clarity-ai` | Clarity AI case study |
| `/lab/clarity-ai` | Document-aware research MVP |
| `/projects/transitflow` | TransitFlow case study |
| `/lab/transitflow` | Geographic transit map, GTFS bus stops and schedules |
| `/about` | About and resume link |
| `/resume.pdf` | Original uploaded resume |

## Run locally

Node.js 20+ is recommended.

```bash
npm install
npm run dev
```

Open <http://localhost:3000/lab/transitflow>.

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
git commit -m "Build real Blacksburg GTFS transit map and trip planner"
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
