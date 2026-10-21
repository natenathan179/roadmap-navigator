# RV MotorHomes Dealership — roadmap

## Done
- Design system (navy/charcoal/green, Montserrat + Inter), header, footer, mobile sticky CTAs
- Database: rvs, inquiries, financing_applications, trade_in_requests, service_requests, delivery_quotes, reviews, blog_posts, quote_requests, user_roles (RLS + grants)
- 162 RVs imported from bellcampersales.com with rewritten SEO content + owned photos (private rv-photos bucket, served via /api/public/media/)
- 35 published reviews with avatars
- Pages: home, inventory (URL-synced filters + sort), new/used RVs, RV detail (slug URLs, gallery, JSON-LD), financing, trade-in, services, delivery, about, reviews, guides, contact, privacy, terms, cart
- Inquiry modal (info/viewing/checkout modes), cart + quote-request checkout, FormSubmit + Supabase dual submit
- Login-only /auth + authenticated /admin CRUD dashboard (inventory, leads, reviews, blogs, image upload)
- SEO metadata per route, JSON-LD (AutoDealer, Product, AggregateRating)
- E2E verified 2026-10-21: 22/22 public checks (home, inventory, detail, JSON-LD, galleries, inquiry modal, cart, reviews, media route, all content pages, zero console errors); 7/7 admin checks (login, dashboard, create/delete RV, checkout modal); photo upload + removal; leads confirmed saved in DB; typecheck + build OK

## Pending (blocked on user)
- [x] Real FormSubmit recipient email (sales@rvmotorhomesdealership.com — confirm FormSubmit activation email on first submission)
