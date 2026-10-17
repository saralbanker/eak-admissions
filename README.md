# EAK International School: Admissions Landing Page (Session 2027-28)

A responsive, accessible, frontend-only admissions landing page for **EAK International School**.
No backend or database is needed. Forms validate and confirm on the client, and data is kept in `localStorage` for the demo.

## 1. Setup and run

The compiled output is committed, so there is nothing to install just to view it:

1. Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari), **or** serve the folder: `npx serve .`

To change the source and rebuild (Node 18+):

```bash
npm install
npm run build        # fonts -> CSS -> JS bundle -> prospectus PDF
npm run watch:css    # optional: rebuild Tailwind on change
```

| Script | What it does |
| --- | --- |
| `build:css` | Compiles + purges Tailwind (`src/input.css` -> `css/styles.css`, ~8 KB gzipped) |
| `build:js` | Concatenates + minifies `src/js/*` into `js/app.min.js` (~15 KB gzipped) |
| `build:fonts` | Copies the self-hosted Inter / Merriweather woff2 files into `assets/fonts` |
| `build:pdf` | Generates `assets/EAK-Prospectus-2027-28.pdf` from the same data the page uses |

**Preview any point in the admission cycle:** add `?today=YYYY-MM-DD` to the URL
(e.g. `index.html?today=2027-01-10`). Date badges, the countdown and the highlighted process step all recalculate.

## 2. Project structure

```
index.html              Page skeleton: header, hero, section shells, footer, enquiry <dialog>
src/input.css           Tailwind entry + design-token components (.btn, .card, .field-input ...)
src/js/
  data.js               ALL content: copy, fees, dates, FAQs, dialog modes (edit here, not in markup)
  icons.js              Inline SVG icon set
  dates.js              Pure date logic: status, countdown, current step, .ics export
  render.js             One template per card type -> fills the section mount points
  forms.js              Declarative validation, submit pipeline, hero form, <dialog> modal
  ui.js                 Menu, scroll-spy, back-to-top, FAQ, fee estimator, checklist, calendar
  main.js               Entry point
css/styles.css          Built output
js/app.min.js           Built output
assets/                 Images (responsive sizes), fonts, favicon, generated prospectus PDF
scripts/                Build scripts
```

## 3. The 12 required sections

Each section is a `<section>` with its own `id` and `aria-labelledby`, in PRD order.

| # | Section | id | Notes |
| - | --- | --- | --- |
| 01 | Hero | `#hero` | Badge, value proposition, Apply / Schedule a Visit / Enquire CTAs, live deadline chip, fast-track form that downloads a real prospectus |
| 02 | Why choose us | `#why-us` | 6 differentiators with icons |
| 03 | Academic programs | `#programs` | Primary, Middle, Secondary, Senior Secondary; ages, features, pre-filled enquiry CTA |
| 04 | School highlights | `#highlights` | 25+ years, 12,500+ alumni, 180+ faculty, 35+ activities |
| 05 | Facilities | `#facilities` | 6 image cards (responsive `srcset`, explicit dimensions) |
| 06 | Admission process | `#admission-process` | 5 connected steps (arrows on desktop, timeline on mobile) with a live "Open now / Completed" state |
| 07 | Important dates | `#dates` | Status per milestone, deadline countdown + progress bar, "Add all to calendar" (.ics) |
| 08 | Required documents | `#documents` | Check-icon checklist that is also interactive: progress saved locally, printable |
| 09 | Fee information | `#fees` | Fee table (Rs. 45,000 / 8,000, 58,000 / 10,000, 72,000 / 12,000), expandable breakdown, first-year cost estimator |
| 10 | Testimonials | `#testimonials` | 3 reviews; swipeable on phones |
| 11 | FAQ | `#faq` | 6 questions, animated accordion, full keyboard support, `FAQPage` JSON-LD |
| 12 | Final CTA | `#final-cta` | "Give Your Child a Future-Ready Education" + Apply Now / Book a Campus Visit / Talk to Our Admissions Team |

## 4. Technologies

- **HTML5** semantic landmarks (`header`, `nav`, `main`, `section`, `article`, `footer`, native `<dialog>`).
- **Tailwind CSS 3** compiled with the CLI (no runtime CDN script), with a small component layer in `src/input.css`.
- **Vanilla JavaScript (classic scripts, no framework)**, so the page opens from `file://` without a server.
- **Self-hosted fonts** (Inter, Merriweather), so there is no render-blocking third-party stylesheet.

## 5. Quality notes

**Accessibility:** skip link; one `h1` and a logical heading outline; labelled fields with inline, `aria-describedby`-linked error messages;
native `<dialog>` (focus trap, Esc, inert background, focus returns to the trigger); `aria-live` confirmations; roving arrow-key FAQ navigation;
`aria-current` scroll-spy; visible focus rings (light variant on dark surfaces); `prefers-reduced-motion` respected; contrast checked on dark and light sections.

**Responsive:** checked for horizontal overflow at 320 / 360 / 412 / 768 / 1024 / 1440 px (hamburger below 1024 px, full nav above). The fee table turns into stacked cards on phones; a sticky Apply / Call / WhatsApp bar appears on mobile.
Anchor jumps account for the sticky header (`scroll-padding-top`).

**Forms:** per-field validation (Indian mobile format, email, required grade, no past or Sunday visit dates), busy state on submit, a confirmation with reference ID.
The `submitEnquiry()` function in `src/js/forms.js` is the single place to swap in a real API call.

**SEO / sharing:** meta description, Open Graph / Twitter tags, favicon, `EducationalOrganization` and `FAQPage` structured data.

**Measured (Lighthouse, local server):**

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Mobile | 97 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

CLS 0 on both; LCP 2.4 s (mobile, throttled) / 0.7 s (desktop).

## 6. Externally hosted assets / credits

- Imagery: royalty-free photos from [Unsplash](https://unsplash.com), downloaded, optimised and **self-hosted** in `assets/img` (descriptive `alt` text on each).
  They are placeholders for real campus photography.
- Fonts: [Inter](https://rsms.me/inter/) and [Merriweather](https://github.com/SorkinType/Merriweather) (SIL OFL) via `@fontsource`.
- Nothing is loaded from a CDN at runtime.

## 7. Content notes

All statistics, fees, dates, testimonials, phone numbers and the WhatsApp number are **sample content** for this exercise (stated in the page footer).
Replace them in `src/js/data.js` (and the contact links in `index.html`) before any real use.

## 8. How AI was used

- **Baseline:** an AI-generated single-file page (one 900-line HTML file, Tailwind CDN, inline `onclick` handlers, copy-pasted cards) covering all 12 sections.
- **Review against the PRD rubric:** I audited it for code structure, PRD completeness, responsiveness, accessibility and polish, and listed 10 improvements.
- **Implementation (AI-assisted, human-reviewed):** split into source/build structure; content moved into a data file with one template per card; Tailwind compiled instead of CDN;
  content contradictions fixed (e.g. FAQ said Grades 1-9 and 11 while the page offered 1-12); process stepper, live date logic, checklist, fee estimator, validation and dialog rebuilt;
  accessibility and SEO layer added.
- **Verification, not just generation:** I ran the page in a real browser, exercised every form and widget through scripted checks (empty / invalid / valid submits, Sunday rejection,
  dialog focus and scroll-lock, accordion keyboard use, estimator maths, simulated dates via `?today=`), checked for horizontal overflow at 360 px, and ran Lighthouse before and after.
  The first audit found a colour-contrast failure, an accessible-name mismatch, render-blocking fonts and a layout shift. All four were fixed.
