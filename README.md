# Gattabara Games website

Next.js (App Router) site with a built-in content editor. No database is needed yet.

## Run

```bash
npm install
npm run dev        # http://localhost:3000  (use -- -p 3100 for another port)
npm run build && npm start
```

## Editing content (for the client)

Open **/admingg** and log in (default password `gg5656`; set `ADMIN_PASSWORD` and `ADMIN_SECRET` to change it).
Every tab uses the same words as the website. Lists (news, games, people, clients, jobs, factsheet rows, features...)
have **Add**, **Remove** and reorder. **All other text** covers every remaining heading, button and label, grouped by section.
Images and videos upload to the Cloudflare R2 bucket.

Everything is stored in one file: `src/content/site-content.json`.

- **Local / normal server:** *Save All Changes* writes that file and the site updates.
- **Vercel (read-only disk):** use **Export**, replace `src/content/site-content.json` in the project, commit and redeploy.
  A database can replace the file later: only `saveSiteContent` / `getSiteContent` in `src/app/actions/adminActions.ts` change.

## Project map

| Path | What it is |
|---|---|
| `src/content/site-content.json` | All editable content |
| `src/content/page-texts.json` | Index of the page's static text (for the *All other text* tab). Rebuild with `npm run texts` after changing the markup |
| `src/content/pageTextRules.js` | Which text is editable and how edits are applied |
| `src/app/(site)/` | Public site: `page.tsx`, `markup.ts` (the HTML), `globals.css` |
| `src/app.js` | All site behaviour (window stack, hero, press kits, Machine view) |
| `src/pitch.js`, `src/inquiries.js` | Pitch form and form submissions |
| `src/app/(admin)/admingg/` | Admin login and dashboard (Tailwind, isolated from the site's CSS) |
| `src/app/actions/adminActions.ts` | Admin server actions: login, load, save, upload |
| `public/reels/` | Lean 720p copies of the showreel (the original upload is large and slow to load) |

## Environment variables

`.env.local` (never committed): `CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`,
`CLOUDFLARE_R2_BUCKET_NAME`, `CLOUDFLARE_R2_PUBLIC_BASE_URL` (uploads from the admin).
Optional: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (only used by the public Contact and Pitch forms to store submissions),
`NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`.

## Known limits

- Uploads through the admin are limited to ~4.5 MB on Vercel (platform limit); larger files upload fine on a normal server.
- The Machine view text and the press-kit page's fixed headings (Factsheet, Description, ...) are not editable.
