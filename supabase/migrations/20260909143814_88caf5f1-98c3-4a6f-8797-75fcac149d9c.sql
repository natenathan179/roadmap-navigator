-- 1. Extend rvs
ALTER TABLE public.rvs
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS brand text,
  ADD COLUMN IF NOT EXISTS rv_type text NOT NULL DEFAULT 'Travel Trailer',
  ADD COLUMN IF NOT EXISTS msrp numeric,
  ADD COLUMN IF NOT EXISTS highlights text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS photo_alts text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS dry_weight integer,
  ADD COLUMN IF NOT EXISTS gvwr integer,
  ADD COLUMN IF NOT EXISTS fresh_water integer,
  ADD COLUMN IF NOT EXISTS ext_color text,
  ADD COLUMN IF NOT EXISTS int_color text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text;

UPDATE public.rvs SET slug = lower(regexp_replace(year || '-' || make || '-' || model || '-' || stock_number, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
ALTER TABLE public.rvs ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS rvs_slug_key ON public.rvs (slug);
ALTER TABLE public.rvs ALTER COLUMN price DROP NOT NULL;

-- 2. Reviews extras
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS title text;

-- 3. Quote requests (cart checkout)
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  city text,
  state text,
  financing_interest boolean NOT NULL DEFAULT false,
  trade_in boolean NOT NULL DEFAULT false,
  message text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a quote" ON public.quote_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Signed-in accounts manage quotes" ON public.quote_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Replace role-gated management policies with plain authenticated access
DROP POLICY IF EXISTS "Staff manage RVs" ON public.rvs;
CREATE POLICY "Signed-in accounts manage RVs" ON public.rvs FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff manage reviews" ON public.reviews;
CREATE POLICY "Signed-in accounts manage reviews" ON public.reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff manage posts" ON public.blog_posts;
CREATE POLICY "Signed-in accounts manage posts" ON public.blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff manage inquiries" ON public.inquiries;
CREATE POLICY "Signed-in accounts manage inquiries" ON public.inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff manage applications" ON public.financing_applications;
CREATE POLICY "Signed-in accounts manage applications" ON public.financing_applications FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff manage trade-ins" ON public.trade_in_requests;
CREATE POLICY "Signed-in accounts manage trade-ins" ON public.trade_in_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff manage service requests" ON public.service_requests;
CREATE POLICY "Signed-in accounts manage service requests" ON public.service_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Staff manage delivery quotes" ON public.delivery_quotes;
CREATE POLICY "Signed-in accounts manage delivery quotes" ON public.delivery_quotes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Storage policies for the private rv-photos bucket
CREATE POLICY "Signed-in accounts read rv photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'rv-photos');
CREATE POLICY "Signed-in accounts upload rv photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'rv-photos');
CREATE POLICY "Signed-in accounts update rv photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'rv-photos') WITH CHECK (bucket_id = 'rv-photos');
CREATE POLICY "Signed-in accounts delete rv photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'rv-photos');