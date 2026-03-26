# bakery-site

## Purpose
A static promotional experience for an artisanal confectionery, built to highlight curated menu items, services, and special events with a minimal single-page flow. The landing page (`index.html:1`) blends a hero carousel, collection highlights, and contact-focused footer copy to guide visitors toward the menu and events sections.

## Requirements
- Modern browsers with JavaScript and DOM capabilities so the shared script (`assets/js/scripts.js:1`) can manage the carousel, filters, and cart interactions.
- Any static site hosting or simple HTTP server (GitHub Pages, Vercel, `python -m http.server`, `npx serve`, etc.) that serves the repo root and the `/assets/` directory.

## Installation
1. Clone or unzip the repository into your local environment.
2. No package managers are required—there are three HTML entries (`index.html`, `produtos/index.html`, `eventos/index.html`), a stylesheet (`assets/css/styles.css:1`), and a JavaScript bundle (`assets/js/scripts.js:1`).

## Run
1. Launch a static server from the repo root, for example:
   ```bash
   python -m http.server 4173
   ```
   or
   ```bash
   npx serve .
   ```
2. Visit `http://localhost:4173/` (or the deployed URL) to see the landing page, then switch to `/produtos/` or `/eventos/` to explore the menu and events content.

## Real-world usage
- The landing page (`index.html:1`) introduces collections (gelatos, tortas, panificados), summarizes services (kits, event pricing, delivery), and surfaces contact information for inquiries.
- `/produtos/index.html:103` implements a searchable, filterable grid of product cards whose `data-*` attributes provide names and descriptions that feed the shared cart when visitors click “Adicionar ao carrinho.”
- `/eventos/index.html:90` highlights a featured tasting event with scheduling details, a WhatsApp CTA, and practical visit/contact copy at the bottom (`eventos/index.html:189`).
- The cart modal persists selections in localStorage, updates totals, and opens WhatsApp with a templated message via `assets/js/scripts.js:1` when checking out.

## Architecture
- Each HTML entry reuses the same navigation, cart modal, and footer structure, ensuring visual consistency while allowing page-specific content blocks.
- `assets/css/styles.css:1` delivers serif typography, the fixed blurred navbar, responsive grids, hero/carousel styling, and cart modal states.
- `assets/js/scripts.js:1` handles cart persistence, mobile menu toggling, the hero carousel, navbar scroll effects, and the filtering/search logic for products. Data attributes in `.produtos-card` elements (`produtos/index.html:136`) keep behaviors data-driven without extra tooling.

## Environment configuration
- There are no environment variables; updates are made directly in the HTML files (hero copy in `index.html:90`, menu cards and filters in `produtos/index.html:103`, event schedule/contact info in `eventos/index.html:90 & 189`).
- Host the `/assets/` directory at the root path expected by the HTML files, or adjust the asset references if you serve the site from a subpath.

## Testing
- Testing is manual: open the landing, products, and events pages, interact with the carousel, search/filter the menu grid, add/remove items from the cart, and confirm the WhatsApp template opens when “FINALIZAR COMPRA” is clicked.
- Verify the mobile navigation toggle works and the cart badge/state persist after page reloads thanks to localStorage.

## Limitations
- This repo is purely static—there is no backend, pricing engine, or order fulfillment beyond the WhatsApp message opened by the cart (`assets/js/scripts.js:1`).
- Cart entries only store item names/descriptions with no quantity, pricing, or delivery metadata.
- Accessibility and localization are confined to the existing Portuguese copy; no automated accessibility checks accompany the project.
