-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','staff'))
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- INVENTORY
CREATE TABLE public.rvs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_number text NOT NULL UNIQUE,
  year int NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  rv_class text NOT NULL,
  condition text NOT NULL DEFAULT 'used',
  fuel_type text NOT NULL DEFAULT 'Diesel',
  engine text,
  price numeric(12,2) NOT NULL,
  mileage int NOT NULL DEFAULT 0,
  length_ft numeric(5,1),
  sleeps int,
  slides int,
  vin text,
  location text NOT NULL DEFAULT 'Bend, OR',
  description text,
  features text[] NOT NULL DEFAULT '{}',
  photos text[] NOT NULL DEFAULT '{}',
  video_url text,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'available',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rvs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rvs TO authenticated;
GRANT ALL ON public.rvs TO service_role;
ALTER TABLE public.rvs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published RVs are public" ON public.rvs FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Staff manage RVs" ON public.rvs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER rvs_updated_at BEFORE UPDATE ON public.rvs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- LEADS
CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'general',
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  rv_id uuid REFERENCES public.rvs(id) ON DELETE SET NULL,
  rv_of_interest text,
  preferred_date date,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiries" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff manage inquiries" ON public.inquiries FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.financing_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text,
  employment text,
  annual_income numeric(12,2),
  desired_rv text,
  down_payment numeric(12,2),
  credit_range text,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.financing_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financing_applications TO authenticated;
GRANT ALL ON public.financing_applications TO service_role;
ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can apply" ON public.financing_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff manage applications" ON public.financing_applications FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.trade_in_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  year int,
  make text,
  model text,
  mileage int,
  condition text,
  vin text,
  asking_value numeric(12,2),
  location text,
  photos text[] NOT NULL DEFAULT '{}',
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.trade_in_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trade_in_requests TO authenticated;
GRANT ALL ON public.trade_in_requests TO service_role;
ALTER TABLE public.trade_in_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit trade-ins" ON public.trade_in_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff manage trade-ins" ON public.trade_in_requests FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service_type text NOT NULL,
  rv_details text,
  preferred_date date,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.service_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request service" ON public.service_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff manage service requests" ON public.service_requests FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.delivery_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  rv_of_interest text,
  delivery_type text NOT NULL DEFAULT 'local',
  destination text,
  target_date date,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.delivery_quotes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_quotes TO authenticated;
GRANT ALL ON public.delivery_quotes TO service_role;
ALTER TABLE public.delivery_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request delivery quotes" ON public.delivery_quotes FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff manage delivery quotes" ON public.delivery_quotes FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  body text NOT NULL,
  reviewed_on date NOT NULL DEFAULT current_date,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published reviews are public" ON public.reviews FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Staff manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- BLOG
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  body text NOT NULL,
  cover_image text,
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are public" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Staff manage posts" ON public.blog_posts FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED INVENTORY
INSERT INTO public.rvs (stock_number, year, make, model, rv_class, condition, fuel_type, engine, price, mileage, length_ft, sleeps, slides, vin, location, description, features, photos, featured, status) VALUES
('RV12345', 2023, 'Newmar', 'Dutch Star 4369', 'Class A', 'used', 'Diesel', 'Cummins ISL 450 HP', 429995, 18450, 43.0, 6, 4, '4UZFCFDT9NCNL1234', 'Bend, OR', 'A flagship diesel pusher in exceptional condition. The Dutch Star 4369 pairs a bath-and-a-half floorplan with a full-wall slide, Newmar''s Comfort Drive steering and a Spartan K3 chassis. One owner, always garaged, complete service records from new.', ARRAY['Full-wall slide','Comfort Drive steering','Residential refrigerator','8kW diesel generator','Heated tile flooring','Washer/dryer','King bed','Exterior entertainment center'], ARRAY['/rv/class-a-ext.jpg','/rv/interior-living.jpg','/rv/interior-kitchen.jpg','/rv/interior-bedroom.jpg','/rv/cockpit.jpg'], true, 'available'),
('RV12346', 2022, 'Tiffin', 'Allegro Bus 45OP', 'Class A', 'used', 'Diesel', 'Cummins X12 500 HP', 389995, 18450, 45.0, 4, 4, '4UZFCFDT2NCNL2345', 'Bend, OR', 'The Allegro Bus 45OP is Tiffin''s luxury diesel flagship. Powered glass entry door, tile shower, and a rear king suite. Inspected, serviced and road-ready.', ARRAY['Powered glass entry door','Tile shower','In-motion satellite','Aqua-Hot heating','Power sun visors','Under-chassis storage','Awnings with LED lighting'], ARRAY['/rv/class-a-ext.jpg','/rv/interior-living.jpg','/rv/interior-kitchen.jpg','/rv/interior-bedroom.jpg'], true, 'available'),
('RV12347', 2024, 'Entegra', 'Cornerstone 45F', 'Class A', 'new', 'Diesel', 'Cummins X15 605 HP', 764995, 12, 45.0, 4, 4, '4UZFCFDT4RCNL3456', 'Bend, OR', 'Brand new Cornerstone 45F with the 605 HP X15 and Spartan K3 chassis. The pinnacle of Entegra''s Class A line — hand-laid tile, hardwood cabinetry and a 360-degree camera system.', ARRAY['605 HP Cummins X15','360-degree camera system','Hydronic heat','Dishwasher drawer','Theater seating','Power cord reel'], ARRAY['/rv/class-a-ext.jpg','/rv/interior-living.jpg','/rv/interior-kitchen.jpg','/rv/cockpit.jpg'], true, 'available'),
('RV12348', 2021, 'Winnebago', 'Adventurer 35F', 'Class A', 'used', 'Gas', 'Ford V8 7.3L', 179995, 26800, 36.0, 6, 3, '1F66F5DY9MLA45678', 'Bend, OR', 'A well-kept gas Class A on the Ford F53 chassis. Great value family coach with bunk-capable dinette and a huge rear bath.', ARRAY['Ford F53 chassis','Powered patio awning','Backup and side cameras','Solar prep','Outside kitchen'], ARRAY['/rv/class-a-ext.jpg','/rv/interior-living.jpg','/rv/interior-kitchen.jpg'], false, 'available'),
('RV12349', 2023, 'Thor', 'Palazzo 33.5', 'Class A', 'used', 'Diesel', 'Cummins 6.7L 340 HP', 209995, 9400, 34.5, 6, 2, '4UZAAHDT8PCNL4567', 'Bend, OR', 'Compact diesel pusher that drives like a much smaller coach. Low miles, bunk-over-sofa layout ideal for families.', ARRAY['Drop-down overhead bunk','Diesel generator','Frameless windows','Automatic leveling jacks'], ARRAY['/rv/class-a-ext.jpg','/rv/interior-living.jpg','/rv/interior-bedroom.jpg'], false, 'available'),
('RV12350', 2024, 'Airstream', 'Interstate 19', 'Class B', 'new', 'Diesel', 'Mercedes 3.0L V6', 199995, 34, 19.5, 2, 0, 'W1X8E33Y5RN123456', 'Bend, OR', 'New Interstate 19 on the Mercedes Sprinter 4x4 chassis. The most capable touring coach Airstream builds — fits in a standard parking space, goes almost anywhere.', ARRAY['Mercedes 4x4 chassis','Lithium power system','Wet bath','Induction cooktop','Power awning','Rear cargo/bike storage'], ARRAY['/rv/class-b-ext.jpg','/rv/class-b-int.jpg','/rv/interior-kitchen.jpg'], true, 'available'),
('RV12351', 2022, 'Winnebago', 'Revel 44E', 'Class B', 'used', 'Diesel', 'Mercedes 3.0L V6 4x4', 164995, 21300, 19.7, 2, 0, 'W1Y4EDHY1NT234567', 'Bend, OR', 'The go-anywhere Revel with the power lift bed, gear garage and 320Ah lithium system. Perfect Pacific Northwest adventure rig.', ARRAY['4x4 Sprinter chassis','Power lift bed','320Ah lithium','Truma Combi eco plus','Gear garage','Roof rack'], ARRAY['/rv/class-b-ext.jpg','/rv/class-b-int.jpg'], true, 'available'),
('RV12352', 2023, 'Coachmen', 'Galleria 24Q', 'Class B', 'used', 'Diesel', 'Mercedes 3.0L V6', 149995, 14200, 24.6, 4, 0, 'W1Z4NFVY7PT345678', 'Bend, OR', 'A comfortable twin-bed Galleria with the Volta lithium power system. Ideal for couples who want full-time boondocking capability.', ARRAY['Volta lithium system','Twin beds','Truma water heater','Rear screen doors','Solar panels'], ARRAY['/rv/class-b-ext.jpg','/rv/class-b-int.jpg'], false, 'available'),
('RV12353', 2024, 'Jayco', 'Greyhawk 27U', 'Class C', 'new', 'Gas', 'Ford V8 7.3L', 149995, 21, 29.0, 7, 2, '1FDXE4FN6RDC12345', 'Bend, OR', 'Brand new Greyhawk 27U — a family Class C with bunk beds, a full rear bath and the reliable Ford E-450 chassis.', ARRAY['Bunk beds','Cab-over bunk','Ford E-450 chassis','Powered awning','Backup camera','Outside TV'], ARRAY['/rv/class-c-ext.jpg','/rv/interior-living.jpg','/rv/interior-bedroom.jpg'], true, 'available'),
('RV12354', 2021, 'Thor', 'Chateau 31EV', 'Class C', 'used', 'Gas', 'Ford V8 7.3L', 98995, 32100, 32.0, 8, 1, '1FDXE4FS8MDC23456', 'Bend, OR', 'Great entry-level family motorhome. Sleeps eight with bunks and a cab-over. Fresh service, new tires.', ARRAY['New tires','Sleeps 8','Bunk beds','Generator','Ducted A/C'], ARRAY['/rv/class-c-ext.jpg','/rv/interior-living.jpg'], false, 'available'),
('RV12355', 2022, 'Winnebago', 'View 24D', 'Class C', 'used', 'Diesel', 'Mercedes 3.0L V6', 139995, 19750, 25.5, 4, 1, 'W1X8E33Y2NN456789', 'Bend, OR', 'Sprinter-based View 24D with the murphy bed floorplan. Diesel efficiency in an easy-to-drive footprint.', ARRAY['Mercedes Sprinter chassis','Murphy bed','Solar package','Full wet bath','Frameless windows'], ARRAY['/rv/class-c-ext.jpg','/rv/interior-kitchen.jpg','/rv/interior-bedroom.jpg'], false, 'available'),
('RV12356', 2023, 'Renegade', 'Valencia 38RB', 'Super C', 'used', 'Diesel', 'Freightliner Cummins 360 HP', 329995, 11600, 38.0, 6, 3, '4UZAAHDT1PCNL5678', 'Bend, OR', 'Super C built on a Freightliner M2 chassis — heavy-duty towing and luxury living in one package. Tows up to 20,000 lbs.', ARRAY['Freightliner M2 chassis','20,000 lb tow rating','Air ride suspension','Residential appliances','Fireplace'], ARRAY['/rv/super-c-ext.jpg','/rv/interior-living.jpg','/rv/interior-kitchen.jpg','/rv/cockpit.jpg'], true, 'available'),
('RV12357', 2024, 'Dynamax', 'DX3 37TS', 'Super C', 'new', 'Diesel', 'Freightliner Cummins 360 HP', 419995, 47, 39.0, 6, 3, '4UZAAHDT3RCNL6789', 'Bend, OR', 'New DX3 37TS with the full paint package and theater seating. The Super C for owners who tow big.', ARRAY['Full body paint','Theater seating','Onan diesel generator','Hydraulic leveling','Heated holding tanks'], ARRAY['/rv/super-c-ext.jpg','/rv/interior-living.jpg','/rv/cockpit.jpg'], false, 'available'),
('RV12358', 2020, 'Tiffin', 'Phaeton 40IH', 'Class A', 'used', 'Diesel', 'Cummins ISB 360 HP', 274995, 41200, 40.0, 4, 3, '4UZFCFDT6LCNL7890', 'Bend, OR', 'A well-loved Phaeton with higher miles and a correspondingly strong price. Recent chassis service, new house batteries and fresh tires at 39k.', ARRAY['New tires at 39k','New house batteries','King bed','Stack washer/dryer','Powered sun shades'], ARRAY['/rv/class-a-ext.jpg','/rv/interior-living.jpg','/rv/interior-bedroom.jpg'], false, 'sold');

-- SEED REVIEWS
INSERT INTO public.reviews (customer_name, rating, body, reviewed_on) VALUES
('Dana R.', 5, 'The entire process was smooth from start to finish. The RV was exactly as described, and the team was extremely helpful.', '2026-07-18'),
('Michael T.', 5, 'We drove up from Sacramento to see a Dutch Star and they had it detailed, warmed up and ready. No pressure, no games, just straight answers about the coach.', '2026-06-02'),
('Karen and Bill S.', 5, 'Third RV we have bought from Summit Ridge. Their service department is the reason we keep coming back.', '2026-05-21'),
('Jorge M.', 4, 'Financing took a couple of days longer than I hoped but the rate they found beat my credit union by a full point.', '2026-04-09'),
('Ellen W.', 5, 'They gave us an honest trade-in number on our old Class C — higher than two other dealers — and applied it the same day.', '2026-03-14'),
('Rick P.', 5, 'The pre-delivery inspection report was 14 pages. I have never seen a dealer be that transparent about a used coach.', '2026-02-27'),
('Sofia L.', 5, 'Delivered our Revel to Boise on a Saturday and walked us through every system in the driveway. Outstanding.', '2026-01-30'),
('Tom H.', 4, 'Great buying experience. Only wish they had more Class B inventory — they sell fast.', '2025-12-11');

-- SEED GUIDES
INSERT INTO public.blog_posts (slug, title, excerpt, cover_image, body) VALUES
('how-to-choose-the-right-motorhome', 'How to Choose the Right Motorhome', 'Class, length, chassis and budget — a practical framework for picking the motorhome that fits how you actually travel.', '/rv/class-a-ext.jpg', E'Choosing a motorhome starts with how you travel, not with the coach itself.\n\n## Start with your trips\nWeekend trips within a few hours of home point toward a Class B or C. Multi-month snowbird routes point toward a diesel Class A. Full-timing points toward length, storage and tank capacity.\n\n## Then choose the class\nClass A gives you the most living space and storage. Class B is the easiest to drive and park. Class C splits the difference and usually sleeps the most people per dollar. Super C adds heavy towing capacity to a Class A-style interior.\n\n## Match length to where you will park\nMost national park campgrounds cap out around 35 feet. If public campgrounds are your main destination, buying a 45-foot coach will quietly narrow your options for years.\n\n## Budget beyond the purchase price\nPlan for insurance, storage, tires every five to seven years, and roughly one to two percent of the purchase price per year in maintenance.\n\n## Drive before you decide\nNothing on paper substitutes for sitting in the seat. Schedule a viewing and drive at least two classes back to back.'),
('class-a-vs-class-b-vs-class-c', 'Class A vs Class B vs Class C RVs', 'The real differences in space, drivability, fuel economy and cost between the three main motorhome classes.', '/rv/class-c-ext.jpg', E'## Class A\nBuilt on a bus or truck chassis, 29 to 45 feet. The most interior space, the largest holding tanks and the most basement storage. Diesel pushers ride better and last longer; gas Class A coaches cost far less up front.\n\n## Class B\nA camper van, 17 to 24 feet. Fits in a standard parking space, gets 16 to 22 MPG, and can be your only vehicle. The trade-off is a wet bath and limited counter space.\n\n## Class C\nBuilt on a cutaway van chassis with the signature cab-over. 22 to 35 feet, usually the best value per sleeping spot, and familiar to drive because the cab is a van cab.\n\n## Quick comparison\nSpace: A > C > B. Drivability: B > C > A. Fuel economy: B > C > A. Purchase price: B and C overlap heavily; A spans the widest range of any class.'),
('how-much-does-an-rv-cost', 'How Much Does an RV Cost?', 'Realistic price ranges by class and condition, plus the ownership costs most first-time buyers underestimate.', '/rv/super-c-ext.jpg', E'## Purchase price by class\nUsed Class C: $60,000 to $150,000. New Class C: $120,000 to $220,000. Class B: $130,000 to $250,000. Gas Class A: $120,000 to $250,000. Diesel Class A: $250,000 to $800,000 and beyond.\n\n## Annual ownership costs\nInsurance runs $1,200 to $3,000 a year for a motorhome. Covered storage is $100 to $400 a month. Tires are a real line item — a set for a diesel pusher can exceed $5,000 and should be replaced on age, not tread.\n\n## Depreciation\nThe steepest drop happens in years one through three. Buying a two- to four-year-old coach with low miles is consistently the best value in the market.\n\n## Financing\nRV loans commonly run 10 to 20 years. Longer terms lower the payment but you can stay upside down for years — put down as much as you comfortably can.'),
('best-motorhomes-for-families', 'Best Motorhomes for Families', 'Bunk models, seat-belted seating and the floorplan features that actually matter when you travel with kids.', '/rv/interior-living.jpg', E'## Count seat belts, not beds\nEveryone traveling needs a belted seat. Many coaches sleep eight but only belt four. This is the single most-missed detail on a family purchase.\n\n## Look for a bunkhouse\nBunk models give kids their own space and keep bedtime from ending the evening for everyone else. Cab-over bunks in a Class C add a sleeping spot without adding length.\n\n## Bathroom layout matters\nA bath-and-a-half or a split bath saves real friction on morning departures.\n\n## Strong family floorplans\nJayco Greyhawk 27U, Thor Chateau 31EV and Winnebago Adventurer 35F all pair bunks with belted seating and plenty of storage.'),
('buying-a-used-rv-complete-guide', 'Buying a Used RV: Complete Guide', 'From listing to delivery: how to evaluate a used motorhome, what to demand from the seller, and where the money hides.', '/rv/class-a-ext.jpg', E'## Ask for records first\nA coach with complete chassis and generator service records is worth paying more for. No records is not an automatic no, but it changes the price.\n\n## Inspect for water\nWater intrusion destroys more RVs than engines do. Check the roof seams, the corners of every slide, around every window, and under the bed and dinette.\n\n## Run every system\nRun the generator under load. Test both air conditioners, the furnace, the water heater on gas and electric, the fridge on all modes, every slide, and the leveling jacks.\n\n## Check the tires\nRead the DOT date code. Tires older than seven years need replacing regardless of tread.\n\n## Get a third-party inspection\nAn NRVIA-certified inspection costs $500 to $1,500 and routinely finds thousands in issues. On a six-figure purchase this is not optional.'),
('rv-financing-guide', 'RV Financing Guide', 'Terms, rates, down payments and credit tiers — how RV lending actually works.', '/rv/interior-kitchen.jpg', E'## How RV loans differ\nRV loans are secured, longer than auto loans, and priced on both credit and collateral. A newer coach borrows on better terms than a 15-year-old one.\n\n## Typical terms\n10 to 20 years depending on loan amount. Most lenders want 10 to 20 percent down. Rates tier sharply around the 700 and 740 credit marks.\n\n## Full-timer loans\nIf the RV will be your primary residence, tell the lender. Full-timer loans exist but underwrite differently — hiding it causes problems at closing.\n\n## Improve your terms\nA larger down payment, a shorter term, and a coach under five years old all move the rate. Applying through a dealer with multiple lender relationships usually beats a single bank quote.\n\nFinancing is subject to lender approval and terms.'),
('what-to-inspect-before-buying-a-used-rv', 'What to Inspect Before Buying a Used RV', 'A walkthrough checklist you can take to any dealership or private seller.', '/rv/cockpit.jpg', E'## Exterior\nRoof membrane and all sealant seams. Sidewall delamination — sight down the wall in raking light. Slide seals and toppers. Tire DOT dates. Underside for fluid leaks and frame rust.\n\n## Interior\nSoft spots in the floor. Water staining on ceilings and in cabinet corners. Window and vent operation. Cabinet doors and drawers. Any musty smell at all.\n\n## Systems\nGenerator start and load test. Both roof air units. Furnace ignition. Water heater on gas and electric. Fridge on propane and shore power. Fresh, grey and black tank valves. Inverter and battery state of health.\n\n## Chassis\nCold start. Warning lights. Engine and transmission fluid condition. Brake feel on the test drive. Air leak-down on air-brake coaches. Steering wander at highway speed.'),
('diesel-vs-gas-motorhomes', 'Diesel vs Gas Motorhomes', 'Purchase price, ride quality, towing, maintenance and resale — where each powertrain wins.', '/rv/class-a-ext.jpg', E'## Where diesel wins\nRear-engine diesel pushers ride quieter and flatter, hold speed on grades, tow far more, use air brakes and air ride, and routinely reach 300,000 miles.\n\n## Where gas wins\nA gas Class A can cost $100,000 less than a comparable diesel. Routine maintenance is cheaper and any shop can work on it. If you travel a few thousand miles a year, you will never recoup the diesel premium in fuel.\n\n## The honest rule\nUnder 5,000 miles a year and flat terrain: gas. Long trips, mountains, or towing a vehicle over 5,000 lbs: diesel.'),
('how-many-miles-is-too-many-for-an-rv', 'How Many Miles Is Too Many for an RV?', 'Why mileage matters less than maintenance on a motorhome, and the numbers that should still give you pause.', '/rv/class-a-ext.jpg', E'## Mileage is a weak signal\nMotorhomes are damaged far more by sitting than by driving. Seals dry, tires flat-spot, and fluids degrade. A 60,000-mile coach that traveled every year is often healthier than a 20,000-mile coach that sat.\n\n## Rough guidance\nDiesel pusher: 100,000 to 200,000 miles is mid-life with records. Gas Class A: 100,000 miles is high but serviceable. Class B and C on van chassis: 150,000 miles is the point where major drivetrain work becomes likely.\n\n## What to look at instead\nService records, roof and seal condition, tire dates, generator hours (roughly 100 hours equals 4,000 road miles), and how the coach was stored.'),
('rv-maintenance-checklist', 'RV Maintenance Checklist', 'Monthly, seasonal and annual tasks that keep a motorhome out of the shop.', '/rv/class-b-ext.jpg', E'## Monthly\nRun the generator under load for two hours. Check tire pressure cold. Inspect roof seams. Test smoke, CO and propane detectors.\n\n## Seasonally\nWash and wax the exterior. Lubricate slide mechanisms. Clean A/C filters. Sanitize the fresh water system. Inspect and reseal any cracked caulk.\n\n## Annually\nChassis oil and filters. Generator oil and air filter. Repack wheel bearings where applicable. Full roof reseal inspection. Propane system leak test. Battery load test.\n\n## Before storage\nWinterize the water system, top the fuel tank with stabilizer, disconnect or maintain batteries, cover the tires, and leave vents cracked to prevent moisture buildup.');