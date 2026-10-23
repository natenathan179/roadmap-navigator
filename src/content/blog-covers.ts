/**
 * Cover photos for guides written in /admin, taken from real inventory photos and
 * saved in public/blog so they survive the unit selling. A cover set in /admin wins,
 * except the old generated /rv/ placeholder images, which are replaced.
 */
const DB_GUIDE_COVERS: Record<string, { src: string; alt: string }> = {
  "diesel-vs-gas-motorhomes": {
    src: "/blog/diesel-vs-gas-motorhomes.webp",
    alt: "2008 Newmar Dutchstar Spartan m-4320 425 hp Diesel Pusher",
  },
  "how-to-choose-the-right-motorhome": {
    src: "/blog/how-to-choose-the-right-motorhome.jpg",
    alt: "2026 Coachmen Euro 25TB Class A",
  },
  "class-a-vs-class-b-vs-class-c": {
    src: "/blog/class-a-vs-class-b-vs-class-c.jpg",
    alt: "2026 Forest River Georgetown 5 Series 34H5 Class A",
  },
  "how-many-miles-is-too-many-for-an-rv": {
    src: "/blog/how-many-miles-is-too-many-for-an-rv.webp",
    alt: "2008 Newmar Dutchstar Spartan m-4320 425 hp Diesel Pusher",
  },
  "best-motorhomes-for-families": {
    src: "/blog/best-motorhomes-for-families.jpg",
    alt: "2026 Forest River Georgetown 3 Series 29S3 Class A",
  },
  "how-much-does-an-rv-cost": {
    src: "/blog/how-much-does-an-rv-cost.jpg",
    alt: "2026 Forest River Work and Play 27KB Toy Hauler",
  },
  "buying-a-used-rv-complete-guide": {
    src: "/blog/buying-a-used-rv-complete-guide.webp",
    alt: "2025 Coachmen Shasta Oasis 525BHS Travel Trailer",
  },
  "rv-financing-guide": {
    src: "/blog/rv-financing-guide.jpg",
    alt: "2026 Venture Stratus SR262VFK Travel Trailer",
  },
  "what-to-inspect-before-buying-a-used-rv": {
    src: "/blog/what-to-inspect-before-buying-a-used-rv.jpg",
    alt: "2026 Coachmen Shasta Oasis 526BH Travel Trailer",
  },
  "rv-maintenance-checklist": {
    src: "/blog/rv-maintenance-checklist.jpg",
    alt: "2026 Winnebago Thrive 26FKD Travel Trailer",
  },
};

const FALLBACKS = Object.values(DB_GUIDE_COVERS);

export function guideCover(slug: string, cover: string | null, title: string) {
  if (cover && !cover.startsWith("/rv/")) return { src: cover, alt: title };
  const known = DB_GUIDE_COVERS[slug];
  if (known) return known;
  // New guides without a cover get a stable pick from the pool, keyed on the slug.
  const hash = [...slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return (
    FALLBACKS[hash % FALLBACKS.length] ?? {
      src: "/blog/rv-motorhomes-for-sale-buyers-guide.jpg",
      alt: title,
    }
  );
}
