# Summit Ridge RV — Dealership Website

A premium RV dealership site: cinematic inventory browsing, lead capture on every page, and a staff admin dashboard. Built in phases so you see a working site quickly.

Defaults I'm assuming (easy to change later): dealership name **Summit Ridge RV**, located in **Bend, Oregon**, phone **(541) 555-0142**, email **sales@summitridgerv.com**. RV photography will be AI-generated cinematic imagery until you supply real unit photos.

## Design direction

- Palette: deep navy #0B1F33 nav/footer, charcoal #252A2E, white and #F4F6F7 surfaces, outdoor green #4F7D5A accent for CTAs.
- Montserrat headings, Inter body.
- Large photography, generous white space, premium vehicle cards, subtle hover/scroll motion. Luxury automotive dealership meets outdoor adventure brand.

## Phase 1 — Public site with real backend inventory

Enable Lovable Cloud (database + auth + storage) up front so inventory and leads are real data, not hardcoded.

Data model:
- `rvs` — year, make, model, class, condition (new/used), engine/fuel, price, mileage, length, sleeps, slides, stock number, VIN, location, description, featured flag, status (available/pending/sold), photo list, video URL.
- `inquiries` — general and per-listing information requests, viewing requests.
- `financing_applications`, `trade_in_requests`, `service_requests`, `delivery_quotes`.
- `reviews` — name, rating, text, date, published flag.
- `blog_posts` — buying-guide articles.
- `user_roles` (separate table + `has_role` function) for staff admin access.
- Public read policies for published inventory/reviews/posts; inserts allowed for lead forms; staff-only reads on all lead tables.
- Seeded with ~14 realistic motorhomes (Tiffin, Newmar, Winnebago, Thor, Entegra, Coachmen) across Class A/B/C/Super C, plus reviews and a few guide articles.

Pages:
- **Home** — full-bleed hero, quick inventory search bar, featured units, browse by RV type, why choose us, financing CTA, trade-in CTA, reviews, buying guides, location/contact, footer.
- **Inventory** (`/inventory`) — the centerpiece. Faceted filters (condition, class, fuel, make, model, year, price, mileage, length, sleeps, slides, location), sort (newest, price asc/desc, mileage, featured), URL-synced filter state so results are shareable, grid/list toggle, pagination.
- **New RVs** / **Used RVs** — pre-filtered inventory views with their own SEO copy.
- **RV detail** (`/inventory/$stock`) — price/status/stock header, swipeable HD gallery with video support, spec table, description, inline Request Info / Schedule Viewing / Apply for Financing forms, similar units.
- **Financing** — explainer plus full application form with lender-approval disclaimer.
- **Trade-In** — valuation request form with photo upload.
- **Services** — service categories plus Schedule Service form.
- **Delivery & Pickup** — options explained plus delivery quote form.
- **About** — story, why choose us, staff, certifications.
- **Reviews** — full testimonial listing.
- **Buying Guide** (`/guides`, `/guides/$slug`) — 10 SEO articles from your list.
- **Contact** — address, hours, map, inquiry form.
- **Privacy Policy**, **Terms**, cookie/financing disclaimers.

Mobile: sticky Call Now + Get Financing bar, swipeable galleries, drawer filters, one-tap directions.

SEO: per-route titles/descriptions/OG tags, single H1 per page, semantic markup, JSON-LD (AutoDealer, Vehicle on listings, Article on guides), lazy images, canonical tags, sitemap and robots.

## Phase 2 — Staff admin dashboard

Auth-gated `/admin` (staff role required):
- Inventory CRUD with photo/video upload to storage, price edits, mark sold, toggle featured.
- Lead inboxes: inquiries, financing applications, trade-ins, service and delivery requests, with status tracking.
- Review moderation and blog publishing.

## Phase 3 — Location SEO pages

Location landing pages (Motorhomes for Sale in Bend, Used RVs in Oregon, Class A Motorhomes in Oregon) once you confirm the areas you genuinely serve.

## Technical notes

TanStack Start with file-based routes; inventory reads via TanStack Query with URL search-param filter state; forms submit through server functions with Zod validation and honeypot/rate-limit spam protection; Lovable Cloud for Postgres, auth, and image storage; roles stored in a dedicated `user_roles` table checked by a security-definer function (never client-side).
