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

Content is stored in **Supabase**, table `cms_settings` (a table that only allows row 1): the live content is `data.site` and the version before
the last save is `data.site_backup` (the **Restore previous** button puts it back). All other keys in that row belong to the previous site and are preserved.

- **Save All Changes** writes to the database and the website updates immediately (the public page is also refreshed every minute).
- If two people edit at once, the second save is refused with a message instead of overwriting the first.
- If Supabase can't be reached, the public site falls back to the content bundled in `src/content/site-content.json`.
- Without Supabase configured (local development), saving writes `src/content/site-content.json` instead.
- **Export / Import** still produce and load that JSON file.

Form submissions (Contact, Pitch us) are saved in the `inquiries` table and listed in **Inquiries** / **Applications** in the admin.

## Project map

| Path | What it is |
|---|---|
| `src/content/site-content.json` | Shipped default content (the database holds the live copy) |
| `src/lib/content.ts`, `src/lib/supabaseRest.ts` | Reading content from Supabase, merge with defaults, fallback |
| `supabase/setup.sql` | One-time bucket + security setup for Supabase (read its header first) |
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
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`): content, forms. Recommended: `SUPABASE_SERVICE_ROLE_KEY` (server only) so the tables can be locked with `supabase/setup.sql`.
Optional:
`NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`.

## Image and video uploads (one-time Cloudflare step)

The admin sends files straight from the browser to the R2 bucket (no 4.5 MB Vercel limit; images up to 25 MB, videos up to 600 MB).
For that, the bucket needs a CORS rule: Cloudflare dashboard -> R2 -> your bucket -> Settings -> CORS policy -> Add -> paste `cloudflare/r2-cors.json`.
The same rule lets the press-kit download buttons save uploaded files. Until it is added, only images under ~4 MB can be uploaded (they go through the server).
For fast video playback also connect a custom domain to the bucket (R2 -> Settings -> Custom Domains) and set `CLOUDFLARE_R2_PUBLIC_BASE_URL` to it: the default `r2.dev` link is slow and rate-limited.

## Known limits

- The Machine view text and the press-kit page's fixed headings (Factsheet, Description, ...) are not editable.
