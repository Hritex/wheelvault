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

## 7. Known placeholders / next steps

- Hero and brand-card imagery currently uses solid colour swatches
  (`heroColor` per model) rather than real photography — drop `<img>` tags into
  the relevant component templates once you have licensed photos per model.
- Only 2–3 flagship models are seeded per brand. Extend each
  `src/assets/data/models/*.json` file with more models as needed — no code
  changes required.
- A brand's `modelCount` field in `brands.json` is informational only; update it
  if you want the number shown anywhere in future UI to match the real count.
- Search and side-by-side comparison pages are not built yet — the data model
  already supports them since every model is a flat JSON object.
