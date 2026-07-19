# WheelVault

Every car on Indian roads, decoded — ex-showroom & on-road prices, down payment /
EMI guidance, owner reviews, and spare parts info, organised by brand and model.

Built with **Angular 18 (standalone components)**, deployed as a static site via
**GitHub Pages**. All content lives in plain JSON files — no backend, no database.

---

## 1. Quick start (local development)

```bash
npm install
npm start          # ng serve — open http://localhost:4200
```

```bash
npm run build:local   # production build without the /wheelvault/ base-href, for local preview
npm run build          # production build with /wheelvault/ base-href, matches GitHub Pages
```

---

## 2. Project structure

```
src/
  assets/
    data/
      brands.json              # the 4 brands shown on the site
      models/
        maruti-suzuki.json     # every Maruti Suzuki model + full detail
        hyundai.json
        tata-motors.json
        mahindra.json
    img/
      wheelvault-logo.svg       # wordmark used in header + footer
  app/
    core/
      models/car.model.ts       # TypeScript interfaces — the shape of the JSON
      services/car-data.service.ts   # fetches the JSON, no other code needs to change
    shared/
      components/
        header/                 # sticky nav + mobile menu
        footer/
        emi-calculator/          # down payment / EMI widget, reused on every car page
        faq-accordion/
        rating-stars/
      pipes/
        inr.pipe.ts              # ₹14,50,000-style Indian number formatting
        titlecase-slug.pipe.ts
    pages/
      home/                      # landing page
      brand-list/                 # /brands — all manufacturers
      brand-detail/                # /brands/:brandSlug — models under one brand
      car-detail/                   # /brands/:brandSlug/:modelSlug — the main content page
      not-found/
```

**This is a content site with almost no logic.** Nearly everything you'll want to
change lives in the JSON files under `src/assets/data/`, not in the Angular code.

---

## 3. Adding a new car model (most common update)

1. Open the relevant brand's file, e.g. `src/assets/data/models/hyundai.json`.
2. Copy an existing model object (e.g. the `"venue"` entry) as a template.
3. Update every field — see the field reference below.
4. Make sure `"slug"` is unique within that brand's file and URL-safe
   (lowercase, hyphens, no spaces) — it becomes part of the page URL:
   `/brands/hyundai/your-new-slug`.
5. Save, commit, push to `main`. GitHub Actions rebuilds and redeploys automatically
   (see §6). No other file needs to change — the app reads whatever is in the JSON.

### Field reference for a model entry

| Field | Type | Notes |
|---|---|---|
| `slug` | string | URL segment, unique per brand |
| `brandSlug` | string | Must match a `slug` in `brands.json` |
| `name`, `bodyType`, `launchYear` | string / number | Shown in the hero |
| `rating`, `reviewCount` | number | Out of 5, and total review count |
| `heroColor` | string (hex) | Background colour behind the hero name |
| `exShowroomMin` / `exShowroomMax` | number | Lowest/highest variant price, plain rupees (no commas) |
| `onRoadApproxDelhi` | number | Feeds the EMI calculator's default on-road price |
| `downPaymentSuggested` | number | Used to pre-fill the EMI calculator's slider |
| `emiApprox`, `emiTenureMonths` | number | Currently informational; the live calculator computes its own EMI |
| `specs` | object | Engine, power, torque, mileage, transmission, fuelType, seating, bootSpace, safety |
| `variants` | array of `{ name, exShowroomPrice }` | Powers the pricing table |
| `colors` | array of strings | Shown as tags |
| `reviews` | array of `{ author, location, rating, title, text, date }` | Owner reviews section |
| `spareParts` | object | `authorizedServiceNote` (string), `commonParts` (array of `{ name, priceRange }`), `tip` (string) |
| `faqs` | array of `{ q, a }` | FAQ accordion at the bottom of the page |

> **Data accuracy:** the pricing, specs and review content shipped in this repo
> are **illustrative placeholders** written to demonstrate the site's structure —
> not scraped or verified real-world figures. Before publishing this publicly,
> replace them with current, verified data from manufacturer websites, and keep
> the "indicative only" disclaimers in the UI regardless (prices change often —
> the disclaimers protect you from stale-data complaints).

---

## 4. Adding a new brand

1. Add an entry to `src/assets/data/brands.json` (copy an existing one as a template).
   `slug` must be unique and URL-safe.
2. Create `src/assets/data/models/<your-brand-slug>.json` containing an array of
   model objects (same shape as §3). An empty array `[]` is fine to start.
3. That's it — `/brands/<your-brand-slug>` and every model under it work
   automatically; no routing or component code needs to change.

---

## 5. Changing the design

Almost all visual tokens (colour, type, spacing, grid) live in one file:
`src/styles.scss`. Component-specific styles live inline inside each
component's `.ts` file (Angular standalone components use inline
`template`/`styles` here to keep the file count low — search for `styles: [` in
any file under `src/app`).

- **Colours** — CSS variables at the top of `styles.scss` (`--wv-black`,
  `--wv-accent`, etc.). Change once, it updates everywhere.
- **Fonts** — loaded via `<link>` tags in `src/index.html` (Archivo Expanded for
  display type, Inter for body/UI). Swapping fonts means changing both the
  `<link>` href and the `--wv-font-display` / `--wv-font-body` variables.
- **Logo** — `src/assets/img/wheelvault-logo.svg`, referenced by the header and
  footer components. Edit the SVG directly, or regenerate it and keep the same
  filename.

---

## 6. Deployment (GitHub Pages)

Deployment is fully automated via `.github/workflows/deploy.yml`:

1. Push to the `main` branch (or run the workflow manually from the **Actions** tab).
2. The workflow installs dependencies, builds the app with the correct
   `--base-href` for your repository name, adds a `404.html` fallback (needed so
   deep links like `/brands/tata-motors/nexon` work on Pages, since GitHub Pages
   has no server-side routing), and publishes `dist/wheelvault/browser`.
3. In your repository settings: **Settings → Pages → Source → GitHub Actions**
   (one-time setup — the workflow handles everything after that).

If you rename the repository, you don't need to touch the workflow — it reads
`github.event.repository.name` automatically for the base href.

For **local** production builds (not for Pages), use `npm run build:local`
instead, which skips the `/wheelvault/` base-href.

---

## 7. Adding real car photos and brand logos

The site has full image support wired in — brand logos, car hero images, and a
gallery all render automatically once files exist at the right path, and
degrade gracefully (falling back to the monogram / colour swatch) if a file is
missing. **I didn't hard-code actual manufacturer photos or logos into this repo
myself**, and that's a deliberate choice worth explaining rather than a gap:

- Car photography from Google Images results is almost always copyrighted —
  owned by the manufacturer, a press agency, or a photographer — and scraping it
  into a public GitHub Pages site isn't something I can do for you.
- Brand logos (Maruti Suzuki, Hyundai, Tata Motors, Mahindra) are registered
  trademarks. Even logo-download sites that let you grab a PNG or SVG typically
  say outright that usage still requires the trademark owner's permission —
  downloading it doesn't grant you a licence to publish it.

**What to use instead, in order of safety:**

1. **Official newsroom / media pages** — most manufacturers publish approved
   logos and car photos specifically for press/editorial use, sometimes with
   usage guidelines attached:
   - Maruti Suzuki: marutisuzuki.com → Corporate → Media
   - Hyundai India: hyundai.com/in → About Us → Media / Newsroom
   - Tata Motors: tatamotors.com → Media
   - Mahindra: mahindra.com → Media / Newsroom
   Check each one's usage terms before publishing — "editorial use" often still
   excludes commercial use.
2. **Wikimedia Commons** for simple wordmark logos (e.g. search
   "File:Maruti Suzuki logo.svg") — many are hosted under a fair-use rationale
   for brand identification, which is standard practice on comparison/review
   sites, but double-check the file's own licence tag before relying on it.
3. **Your own photos**, if you have access to showroom cars — no licensing
   question at all.
4. **Licensed stock** (e.g. a stock photo subscription) for generic car imagery
   where you don't need a specific real model shot.

### Where files go

```
src/assets/img/brands/<brand-slug>.svg        e.g. maruti-suzuki.svg
src/assets/img/cars/<brand-slug>/<model-slug>-1.jpg
src/assets/img/cars/<brand-slug>/<model-slug>-2.jpg
```

The JSON already points at these exact paths (`logoPath` in `brands.json`,
`images` in each model file) — just drop a correctly-named file into the
folder and it appears on the site automatically, no code changes needed. Until
a file exists, the brand monogram / colour swatch placeholder keeps showing, so
nothing breaks.

---

## 8. Light / dark mode

A theme toggle (sun/moon icon, top-right of the header) switches the whole site
between light and dark. It respects the visitor's OS preference on first visit,
remembers their choice in `localStorage`, and applies before Angular even
bootstraps (a small inline script in `index.html`) so there's no flash of the
wrong theme.

Almost every colour in the site is a CSS variable (see `src/styles.scss`), and
dark mode is implemented by overriding those variables under
`:root[data-theme='dark']` — components never check the theme directly. If you
add new UI, use the existing `--wv-*` variables rather than hard-coded colours
and it will support dark mode automatically. The footer, mobile nav overlay, and
test-drive form panel intentionally stay dark in both modes (they use separate
`--wv-panel-*` tokens) to match the reference design's persistent dark accent
panels.

**Logo note:** the WheelVault wordmark is rendered by
`src/app/shared/components/logo/logo.component.ts` as *inline* SVG, not an
`<img src="...svg">`. This matters — when an SVG is loaded via `<img>`, it
renders in its own opaque context, so `currentColor` inside it resolves to the
SVG's own default (black) regardless of the surrounding page's theme, which is
why the logo disappeared in dark mode originally. Inlining it lets `currentColor`
follow `--wv-black` (theme-aware) or `--wv-panel-text` (fixed light, via
`variant="inverse"`, used in the footer) like everything else. The standalone
file at `src/assets/img/wheelvault-logo.svg` still exists for use outside the
app (social previews, external docs) but is no longer what renders on the site.

---

## 9. Test-drive / enquiry form

The "Start your test drive" form on every car page is currently **front-end
only** — GitHub Pages can't run server code, so submitting shows a confirmation
message but doesn't send anywhere yet. To make it actually deliver enquiries,
wire `onSubmit()` in
`src/app/shared/components/enquiry-form/enquiry-form.component.ts` to a form
backend such as Formspree, Getform, or a small serverless function — all of
these accept a plain `fetch()` POST from a static site.

---

## 10. Other known placeholders / next steps

- Only 2–3 flagship models are seeded per brand. Extend each
  `src/assets/data/models/*.json` file with more models as needed — no code
  changes required.
- A brand's `modelCount` field in `brands.json` is informational only; update it
  if you want the number shown anywhere in future UI to match the real count.
- Search and side-by-side comparison pages are not built yet — the data model
  already supports them since every model is a flat JSON object.
