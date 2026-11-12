# Product Design Portfolio — Daven Corrielus

An editable, responsive Next.js App Router portfolio featuring two work-in-progress concept case studies: **Clarity AI** and **TransitFlow**.

## Run locally

Install Node.js 20.9+ (Node.js 22 recommended), then:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To verify the project:

```bash
npm run lint
npm run build
```

## Customize

- **Name, contact email, and links:** `lib/site.ts` → `site` object. Contact is intentionally disabled until a real email is supplied.
- **Project content:** `lib/site.ts` → `projects` array. Keep only verified facts, activities, and outcomes.
- **Homepage:** `app/page.tsx`
- **About page:** `app/about/page.tsx`
- **Case study template:** `app/projects/[slug]/page.tsx`
- **Illustrative project mockups:** `components/project-preview.tsx`. These are built with HTML/CSS and clearly marked as concept previews.
- **Colors, layout, and responsiveness:** `app/globals.css`.

## Deploy

Push this folder to a GitHub repository, import it into [Vercel](https://vercel.com/new), and select the Next.js framework preset. Add your real email to `lib/site.ts` first, and update any project descriptions to reflect completed work. Optional: add a custom domain in Vercel.

## Integrity of portfolio claims

The interface previews are **not** live apps. There are **no invented user studies, metrics, clients, usability results, or production releases**. As you conduct user interviews and design the actual products, replace the current process plans with documented evidence and finished designs.

## Notes

This starter intentionally uses regular CSS rather than Tailwind so it can be customized quickly without additional styling configuration. No third-party image services or credentials are required.
