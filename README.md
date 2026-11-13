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

## Interactive experience (v2)

This update adds a list/grid toggle for Selected Work, desktop pointer-following project previews, scroll reveal animations, a reading progress indicator, a back-to-top control, animated hero accents, and accessible keyboard-focus states. Motion is disabled or reduced when visitors opt into reduced motion.

### Update your existing GitHub/Vercel project

1. Back up your current portfolio folder, then copy the contents of this ZIP's `product-design-portfolio` folder into your existing local folder, replacing the matching files. **Do not copy over your local `.git` directory.**
2. Run `npm install` and `npm run dev`, test locally, and review both case studies.
3. Run `git add . && git commit -m "Add interactive portfolio experience" && git push` in the portfolio repository; Vercel will redeploy automatically if linked.

You can customize contact details in `lib/site.ts`. Both case studies intentionally remain marked **concept in progress**; do not present illustrative interfaces as shipped product work.
