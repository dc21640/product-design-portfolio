# Portfolio V9: homepage typography + Muse restoration

## What changed
- Replaced the oversized mixed serif/italic homepage heading with two balanced sans-serif lines.
- Reduced the heading size and tightened the hero's negative space, body text width, and call-to-action placement.
- Added a compact project index linking directly to **all four** projects (Clarity AI, TransitFlow, Muse, Exposure).
- Added anchor targets on the cards so the index is keyboard-accessible and useful.
- Kept the complete Muse case study, working `/lab/muse` editor, creative sample assets, Exposure, Clarity AI, TransitFlow, and resume.
- Added styles in `app/hero-refinement.css`, imported last from `app/layout.tsx`.

## How to apply the *patch* if V8 already works locally

1. Keep a backup or commit your current changes first.
2. Open the original Git-connected `product-design-portfolio` folder in VS Code.
3. Unzip `product-design-portfolio-v9-hero-muse-patch.zip` **into that folder**. It does not contain a `.git` directory or secrets.
4. Run:

```bash
npm run test:case-study
npm run test:creative
npm run test:design
npm run test:gtfs
npm run build
```

5. Confirm `http://localhost:3000` (or your dev server's actual port) shows the new heading and the Muse link, then:

```bash
git status
git add app/page.tsx app/layout.tsx app/hero-refinement.css components/project-preview.tsx
git commit -m "Refine homepage hero and restore Muse discovery"
git push origin main
```

## If Muse itself is missing from your local code

Use the **full** V9 ZIP, not just the patch. Extract it into a temporary folder, then copy the *contents* of its `product-design-portfolio` folder into your original Git-connected folder. Preserve your original `.git` folder, `.env.local`, and other private settings. Then build and push.

## Validation

- Four existing project suites passed.
- TSX syntax parsed across 31 source files, without errors.
- Desktop and narrow-screen static hero layout checks showed no horizontal overflow.
- Full Next.js production build was **not** run here because the npm registry could not be reached (`EAI_AGAIN`). Run `npm run build` on your Mac before pushing.

These changes do not deploy themselves. Your existing Vercel site updates after you push to the linked GitHub repository and Vercel completes a successful deployment.
