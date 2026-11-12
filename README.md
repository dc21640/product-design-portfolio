# Daven Corrielus — Product Design Portfolio

An editorial, responsive product design portfolio built with **Next.js 15**, **React 19**, TypeScript, and plain CSS. No UI template or additional component library is required.

## Included pages

| Route | Purpose |
| --- | --- |
| `/` | Selected work and concise introduction |
| `/projects/clarity-ai` | Clarity AI product design case study |
| `/projects/transitflow` | TransitFlow product design case study |
| `/lab/clarity-ai` | Clarity AI clickable prototype (scripted demo) |
| `/lab/transitflow` | TransitFlow route-comparison prototype (sample data) |
| `/about` | Background, interests, and experience |
| `/resume.pdf` | The supplied resume, served from `public/resume.pdf` |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Before deploying, confirm the production build:

```bash
npm run build
```

## Update an EXISTING GitHub/Vercel portfolio

This ZIP is a complete source snapshot. **Do not delete or overwrite your existing `.git` directory.** Also keep any local environment files and uncommitted work you want to preserve.

1. Extract the ZIP to a temporary folder.
2. Open the extracted `product-design-portfolio` folder.
3. Copy its `app/`, `components/`, `lib/`, `public/`, `package.json`, `next.config.ts`, `tsconfig.json`, and `README.md` **into your existing Git working directory**, replacing matching files. Keep your existing `.git`, `node_modules`, and `.env*` files.
4. Run `npm install` and `npm run build` inside your existing repository.
5. If the build succeeds, publish:

```bash
git status
git add .
git commit -m "Redesign product portfolio and refine case studies"
git push origin main
```

Your existing Vercel project should redeploy automatically if connected to `main`.

If your project differs from this version, review `git diff` **before** committing. You can undo an uncommitted change via Git rather than deleting the repository.

## Editing content

- **Name, email, LinkedIn, resume path:** `lib/site.ts`
- **Project summaries, design decisions, testing plans:** `lib/site.ts`
- **Homepage:** `app/page.tsx`
- **About page:** `app/about/page.tsx`
- **Case study layout:** `app/projects/[slug]/page.tsx`
- **Design tokens and responsive styles:** `app/globals.css`
- **Interactive prototypes:** `components/clarity-lab.tsx` and `components/transit-lab.tsx`

## Design principles

- Warm neutral canvas, restrained green accent, dark high-contrast text.
- Compact, content-first layouts without oversized empty spacers.
- System typography for reliable loading; a restrained serif italic for emphasis.
- Responsive content hierarchy, readable paragraph widths, and mobile navigation.
- Visible keyboard focus states, semantic headings, link labels, and reduced-motion support.
- Prototype labels are explicit: **no fabricated research, launched features, or live data**.

## Transparency about the work

Clarity AI currently uses hard-coded example questions, responses, and source excerpts. It does not use live AI or upload files. TransitFlow uses illustrative journeys and a stylized map; it does not use real-time data or directions. The accompanying research tasks are planned, not completed or measured.

To make either case study interview-ready, add actual user interviews, usability observations, iteration records, and real outcomes *after* completing them.

## About QA

The source and responsive visual layout have been inspected with a browser-based render at desktop and mobile sizes, including 320–1440px viewport checks. The full Next.js production build could not be completed in this execution environment because the package installation did not complete; run `npm run build` on your Mac before pushing.
