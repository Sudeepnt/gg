# Gattabara Games — website

The approved design for gattabaragames.com. It is a minimal, black-and-white "Japanese portal" with a light retro-cyberpunk layer:

- **Window-stack scroll:** each chapter slides in as a window over the last one, and the header tab follows along.
- **Hero montage:** the hero is a halftone montage reel.
- **Press kits:** every title opens as a press kit with real file downloads.
- **Machine view:** a plain-text version of the site for agents and crawlers.

It is plain HTML, CSS and JavaScript with no framework, built with Vite.

- **Build size:** about 37 KB of JS, 14 KB of CSS and 9.5 KB of HTML, all gzipped.
- **External packages:** one, Lenis, for smooth scrolling on desktop.
- **Brand rule:** black and white only. Colour (`--R` red, `--B` cyan) appears **only inside glitch effects**; never use it as a UI colour.

---

## 1. Run it

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # production build → dist/
npm run preview   # serve the production build locally
```

`dist/` is fully static and can go on any static host (Vercel, Netlify, Cloudflare Pages, S3 with CloudFront). The only server-side piece is the form endpoint (§6).

---

## 2. Project structure

```
gattabara-website/
├── index.html        All markup: header, 13 chapter <section>s, press-kit overlay, roster modal, Machine view shell
├── src/
│   ├── main.js       Entry. Imports vendor.js, then styles.css, then app.js (order matters)
│   ├── vendor.js     Puts Lenis on window. app.js falls back to native scroll without it
│   ├── app.js        All behaviour and all editable content arrays
│   └── styles.css    All styles, grouped by /* ---------- BANNER ---------- */ comments
└── public/           Copied as-is to the site root
    ├── llms.txt      Plain-text summary for AI agents (same as Machine view › /llms.txt)
    ├── favicon.svg
    ├── robots.txt
    └── sitemap.xml
```

---

## 3. How the page works

### 3.1 Window stack (the core interaction)
This lives in the `WINDOW STACK ENGINE` block of `app.js`, in the functions `measure()`, `frame()`, `setActiveW()` and `go()`.

- **Structure:** every chapter is a `<section class="win pad tD|tL" data-name data-no>`.
  - `tD` / `tL` set the dark or light tone. They alternate.
  - Each section is `position: sticky` with an increasing z-index.
- **`measure()`:** caches each window's top `T[i]` and sets its sticky `top`, so a tall chapter scrolls fully before it pins.
- **`frame()`:** runs once per scroll frame and computes `p` from 0 to 1 for each window. `p` drives three things:
  - the incoming window opens from slightly narrower to full width (`clip-path`);
  - the previous window scales to 0.96 and dims through `.shade`;
  - the title bar's segmented loading bar fills via `--p`.
- **`setActiveW()`:** runs when a window passes 55%.
  - **Desktop:** the header underline (`#ind`) slides to the matching tab.
  - **Phone:** the header label (`#slotv`) flips and the right rail lights up.
  - The heading glitches in once, the title-bar name decodes, and the URL hash updates.
- **`go(id)`:** use this for all navigation. Plain `#id` links are intercepted automatically.
- **Mapping chapters to tabs:** `NAVMAP` decides which header tab each chapter lights up. For example, Network lights up GG Productions, and Message, Leadership and Clients light up Company.

**To add a chapter:**
1. Copy a `<section class="win pad …">` block and give it a unique `id`, `data-name` and `data-no`.
2. Add it to `SECS` (the menu list) and to `NAVMAP`.
3. Keep the tones alternating.

The title bar, rail and progress are all generated automatically.

### 3.2 Chapters (in order)
| # | id | What's inside |
|---|----|---------------|
| 00 | `top` | Hero montage reel (WebGL halftone), headline, clip timeline, news ticker |
| 01 | `news` | Filterable, expandable dated list |
| 02 | `philosophy` | Mission, vision, four values, doctrine line that lights word by word |
| 03 | `games` | Title cards. Each opens a press kit |
| 04 | `business` | Three lines of business with hover previews |
| 05 | `production` | GG Productions: services accordion, reel monitor, specialty bars, four-step process |
| 06 | `network` | Canvas globe and ringing "Global roster" call that opens the roster modal |
| 07 | `message` | Founders' letter (numbered principles) |
| 08 | `leadership` | Minimal list with small halftone portraits. Click a name to expand it |
| 09 | `clients` | Uniform logo grid plus a "Your studio" call to action |
| 10 | `recruit` | Hero and job list |
| 11 | `pitch` | Pitch Us: rules plus a four-step form (Project → Proof → Team → Review) |
| 12 | `contact` | Three-step inquiry form (Input → Confirm → Complete) |

### 3.3 Hero montage
The `CLIPS` array in `app.js` defines the reel. Each clip has these fields:

| Field | Meaning |
|---|---|
| `ids` | Which halftone scene(s) to show: 0 Pen Fight, 1 Auto Rush, 2 Classified 01, 3 Classified 02, 4 Roster globe |
| `t` | Layout: 0 = full screen, 1 = split in two (rows on portrait screens), 2 = four-way grid |
| `cam` | `[cx0, cy0, scale0, cx1, cy1, scale1]`. The camera move across the clip |
| `d` | Duration in seconds |
| `lb`, `sb` | The caption |
| `g` | Index of the game whose press kit opens on click |
| `k` | Which `KICK` line shows above the headline |
| `src` | **Optional:** an `.mp4` URL. When set, real footage plays for that clip instead of the shader, with a grayscale filter to keep the brand rule |

The shader is `FS`, and it lowers its own resolution if the frame rate drops below about 36 fps. It pauses when the hero is off screen or covered.

### 3.4 Press kits (title pages)
`openDp(i)` renders a press kit into the `#dp` overlay. Deep links work as `#title/<id>`.

- **Sections:** Factsheet, Description, Media (trailer, logos, 6 screenshots, 3 store capsules), About the developer, Contact.
- **Downloads are generated in the browser:**
  - PNG screenshots at 1920×1080, rendered by the offscreen WebGL renderer `REN`;
  - logo PNGs (`logoCanvas`);
  - capsules at 1232×706, 748×896 and 462×174 (`capCanvas`);
  - the studio logo as SVG and PNG;
  - a factsheet `.md`;
  - "Download all", which builds a .zip with `zip()`. That is a small, dependency-free zip writer that stores files uncompressed.
- **Sealed titles:** these are the entries with `sealed:1` in `GAMES`. They show redacted facts, embargoed media and hold-to-decrypt.
- **Replacing the generated art with real captures:** add your own image URLs and render them as `<img>`. The two places to change are `pkPreviews()` (the previews) and `pkDownload()` (the files). The trailer slot is the `.trl` block in `openDp`.

### 3.5 Machine view
Open it with the HUMAN/MACHINE switch in the header (≥1400 px wide) or with "Machine view" in the menu and footer. It is a plain-text document styled like basement.studio/ai, with a text logo, `── BANNERS ──` and dot-leader key/values.

- **Pages:** `/home /games /games/<id> /productions /network /people /letter /careers /pitch /contact /agents /console`, plus the files `/llms.txt /profile.json /schema.jsonld /sitemap.md`.
- **Where the pages are defined:** the `MP` map in `app.js`. Each page is an array of Markdown lines. `mdl()` renders one line, and `[text](/route)` or `[text](human:<id>)` become links.
- **Copy .md / Save:** these give the current page as Markdown, JSON or text.
- **Keyboard:** `←` / `→` move between pages, `/` opens the console, `Esc` returns to the human site.
- **Structured data:** `DATA` (the profile) and `LD` (the schema.org graph) are built from the content arrays. `LD` is also injected into `<script type="application/ld+json" id="ldjson">` for SEO.

### 3.6 Retro layer (deliberately minimal)
This is the `RETRO LAYER` block in both `styles.css` and `app.js`.

- **Pixel font:** DotGothic16 is used **only for system labels**: title bars, the hero readout and the phone section label.
- **Segmented bars:** the title-bar loading bars fill in segments.
- **Blinking cursors:** on section captions, plus one after the title-bar name on landing.
- **Scanlines:** on media only (hero, game cards, press-kit images). The hero also has a slow refresh band.
- **Hover:**
  - corner brackets on cards and client tiles;
  - a 300 ms text decode on nav items, buttons and links (`scramble()`), fine pointers only.
- **Live clock:** Bengaluru time in the hero (`#clk`).
- **Start-up lines:** BIOS-style lines on the loader (`#bios`).
- **Footer glitch:** an occasional slice glitch on the footer wordmark.

**Rule:** never put scanlines, glitch or scramble over body copy. Readability comes first.

`prefers-reduced-motion` turns off the motion: the montage stops on its first clip, and glitches, scramble and blinking are disabled.

---

## 4. Editing content

All copy that isn't in `index.html` lives in arrays near the top of `src/app.js`:

| Constant | What it is |
|---|---|
| `GAMES` | Titles. Each has `t, code, st, short, intro, desc[], tags[], feat[], tbl[], shots[]` (screenshot captions). Sealed titles have `sealed:1` and `intel` |
| `NEWS` | `[date, category, title, body]` |
| `SVC`, `SK` | GG Productions services and the six specialties with their scores |
| `DISC`, `TIER`, `PPL` | Roster disciplines, quality tiers and the **sample** contractor list |
| `CREW` | Leadership: `[name, role, one-line bio, id]` |
| `CLIENTS` | `{n, logo}`. Put a logo file URL in `logo` and it replaces the wordmark. Logos are shown in grayscale and inverted on dark tiles. Use SVG or a transparent PNG |
| `JOBS` | Job list |
| `TYPES` | Contact inquiry types |
| `PITCH_RULES`, `PLATS`, `STAGES`, `NEEDS` | Pitch Us copy and options |
| `CLIPS`, `KICK` | Hero montage (§3.3) |
| `FAQ` | Machine view FAQ |

These are in `index.html` instead: the hero headline, the philosophy text, the founders' letter (`#msgbody`), the section sub-captions and the footer.

> After changing content, regenerate `public/llms.txt`: open Machine view › `/agents` › `llms.txt` › **Copy .md**, and paste the result into the file.

---

## 5. Downloads inside a sandbox
`saveFile()` uses the hosting platform's download API when one exists (`window.claude.use('downloads')`). Otherwise it falls back to a normal `<a download>`. On your own domain the fallback is what runs. No change is needed.

---

## 6. Launch checklist

**Must do**
- [ ] **Form backend.** Both forms send through one function, `submitForm(kind, data)`, in the `FORM BACKEND` block of `app.js`. Today it only simulates success.
  - Replace its body with a real request (Formspree, Resend, HubSpot or a serverless function).
  - `kind` is `'contact'` or `'pitch'`.
  - Resolve `{ok:true, ref?}` on success and `{ok:false}` on failure. The forms already show a failure toast.
  - Then remove the "demonstration build" sentences in the two `.done` blocks in `index.html`.
- [ ] **Client logos:** fill in `CLIENTS[].logo`.
- [ ] **Leadership photos:** these are currently generated halftone silhouettes, drawn in the `.lr canvas` loop. Replace them with `<img>` (52 px, grayscale), or draw the real photo into the canvas to keep the halftone treatment.
- [ ] **Real media:**
  - hero clips (`CLIPS[].src`);
  - press-kit screenshots, trailers and logos (§3.4);
  - the GG Productions reel. `#reel` is a canvas mock; swap it for `<video>`.
- [ ] **Sample data:** the roster list `PPL` and the job list `JOBS` are samples (the page says so). Replace them or keep the note.
- [ ] **Founders' letter:** confirm the wording and the signature.
- [ ] **SEO files:** add `og:image` (1200×630), `og:url` and a canonical URL in `index.html`. Confirm the domain in `robots.txt` and `sitemap.xml`.
- [ ] **Analytics,** plus a cookie notice if one is required.

**Nice to have**
- [ ] Self-host the fonts (`@fontsource/*`) to remove the Google Fonts request.
- [ ] Move the content arrays into `src/content.json` or a headless CMS so non-developers can edit copy.
- [ ] A 404 page in the same style.

---

## 7. Performance and accessibility
- **Smooth scroll:** touch devices use native scroll. Lenis runs only for fine pointers.
- **Hot paths:** the hero shader and the window-stack engine. The shader adapts its resolution and pauses off screen, when the tab is hidden, or when it is covered by the next window. The globe and radar loops pause off screen.
- **Thumbnails:** game key art is rendered once at load into JPEGs. Press-kit previews render lazily, one per frame, when a kit opens.
- **Escape key:** `Esc` closes the menu, the roster modal, Machine view and press kits. Focus is restored without jumping the scroll.
- **Decorative layers:** all are `aria-hidden` and `pointer-events: none`.
- **No WebGL:** if WebGL is unavailable, the hero falls back to line art.
- **Header breakpoint:** the tabs show at ≥1221 px. Below that, the header shows the current chapter name plus the menu. The HUMAN/MACHINE switch shows at ≥1400 px.

Test on a mid-range Android phone before launch.

## 8. Browser support
Supported: the latest Chrome, Edge and Firefox, and Safari 16+. The code uses `clip-path`, `position: sticky`, `overflow-x: clip`, `:has()`, WebGL 1 and `Intl.DateTimeFormat`.
