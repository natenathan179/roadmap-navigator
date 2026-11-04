-- Rebrand listing copy from "Summit Ridge RV, Bend, Oregon" to "RV MotorHomes Dealership, Michigan".
-- Rewrites location, descriptions, SEO fields, photo alt text, highlights and specs on every RV,
-- plus the old dealership name in review text. Safe to re-run: every pattern is gone after one pass.

CREATE OR REPLACE FUNCTION pg_temp.relocate(t text) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT
    replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(t,
      'Summit Ridge RV, Bend Oregon', 'RV MotorHomes Dealership, Michigan'),
      'Summit Ridge RV in Bend, Oregon', 'RV MotorHomes Dealership in Michigan'),
      'Summit Ridge RV', 'RV MotorHomes Dealership'),
      'Summit Ridge', 'RV MotorHomes Dealership'),
      'Central Oregon''s high-desert and forest campgrounds', 'Michigan''s state forest and Great Lakes campgrounds'),
      'Oregon''s high-desert and coastal campgrounds', 'Michigan''s lakeshore and forest campgrounds'),
      'Cascade Lakes weekends, Oregon Coast road trips', 'Great Lakes weekends, Lake Michigan shoreline road trips'),
      'from Bend to all 48 states', 'from Michigan to all 48 states'),
      'Bend, Oregon', 'Michigan'),
      'Bend Oregon', 'Michigan'),
      'Bend, OR', 'Michigan'),
      'Central Oregon', 'Michigan'),
      'Pacific Northwest', 'Great Lakes region'),
      'Oregon', 'Michigan')
$$;

-- SEO titles were cut to a fixed length, so some end mid-word ("...for Sale in Bend, Ore", "...| Summit R").
CREATE OR REPLACE FUNCTION pg_temp.relocate_title(t text) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT pg_temp.relocate(
    regexp_replace(
      regexp_replace(
        regexp_replace(t, ' for Sale( i(n( B[a-zA-Z]*(,( O[a-zA-Z]*)?)?)?)?)? ?$', ' for Sale in Michigan'),
        ' f(o(r( S(a(l(e)?)?)?)?)?)? ?$', ' for Sale in Michigan'),
      ' \|( S[A-Za-z ]*)? ?$', ' | RV MotorHomes Dealership'))
$$;

UPDATE public.rvs SET
  location        = pg_temp.relocate(location),
  description     = pg_temp.relocate(description),
  seo_title       = pg_temp.relocate_title(seo_title),
  seo_description = pg_temp.relocate(seo_description),
  photo_alts      = ARRAY(SELECT pg_temp.relocate(a) FROM unnest(photo_alts) WITH ORDINALITY AS u(a, i) ORDER BY i),
  highlights      = ARRAY(SELECT pg_temp.relocate(h) FROM unnest(highlights) WITH ORDINALITY AS u(h, i) ORDER BY i),
  specs           = pg_temp.relocate(specs::text)::jsonb;

ALTER TABLE public.rvs ALTER COLUMN location SET DEFAULT 'Michigan';

UPDATE public.reviews SET body = pg_temp.relocate(body) WHERE body LIKE '%Summit Ridge%';
