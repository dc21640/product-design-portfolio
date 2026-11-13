# V10 — Remove decorative project and section numbers

All presentation-only 01 / 02 / 03 / 04 labels are removed across the homepage, project covers, case studies, the transit map sidebar, Muse studio header, study kit, and Exposure photo tiles. Project names, headings, navigational links and the sequence of workflow content are preserved.

Real values such as schedule times, dates, project counts, photo ratings, internal IDs, and ZIP filename ordering remain unchanged.

## Apply to your current V9 folder

1. Unzip `product-design-portfolio-v10-no-numbers-patch.zip` into the **root of your existing Git-connected portfolio folder**, not the parent folder. Keep `.git` and `.env.local`.
2. Run `npm run lint` and `npm run build`.
3. Run `git add . && git commit -m "Remove decorative numbering throughout portfolio" && git push origin main`.
4. On Vercel, confirm the deployment is Ready and hard refresh your browser.

This change does not modify application data storage or API credentials.
