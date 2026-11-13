# Safe update to the existing GitHub + Vercel project

The archive includes the `product-design-portfolio/` directory. The files must land **inside** the existing Git-connected folder, not alongside it or nested inside it.

## Backup

In Terminal on your Mac, open the existing portfolio folder:

```bash
pwd
git remote -v
git status
```

Confirm that `origin` points to `https://github.com/dc21640/product-design-portfolio.git` and the directory ends in `product-design-portfolio`.

Commit any unrelated work first. You can then make a quick backup branch:

```bash
git branch backup-before-case-study-update
```

Copy the update ZIP's files into your existing working tree, replacing only matching files. Preserve `.git`, `.env.local`, and your locally installed `node_modules`.

## Check the release

```bash
npm install
npm run test:creative
npm run test:design
npm run test:gtfs
npm run test:case-study
npm run lint
npm run build
npm run dev
```

Open `http://localhost:3000/projects/clarity-ai`, `/projects/muse`, `/study/clarity-ai`, and `/study/muse`, plus both application routes. Confirm citation inspection, PNG download, task forms, and mobile layout.

## Publish

```bash
git status
git add .
git commit -m "Add evidence-led case studies and usability research tools"
git push origin main
```

Then open Vercel → your portfolio project → Deployments. Wait for the new deployment to show **Ready**. Compare its commit hash against `git rev-parse --short HEAD`. If it fails, read the **first actual error in Build Logs**, not just the summary. Do not claim the site has been updated before the deployment is Ready.

## Security and limitations

- Keep `.env.local` and any Anthropic key out of Git.
- Consider rate limits, user authentication and budget controls before putting a paid AI key behind a public demo.
- The study tool keeps anonymous notes in **localStorage**; they are not shared across browsers or devices. Export CSV after sessions.
- Keep participant data private. Do not publish unverified counts, quotes, or outcomes.
- The published repository might have changes not present in an older ZIP. Review `git diff` before committing and preserve unrelated work.
