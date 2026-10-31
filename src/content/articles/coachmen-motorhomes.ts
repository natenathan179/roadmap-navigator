import type { Article } from "@/lib/articles";

export const coachmenMotorhomes: Article = {
  slug: "coachmen-motorhomes",
  title: "Coachmen Motorhomes: Top RV Models for Families and Travelers",
  metaTitle: "Coachmen Motorhomes: Top Models for Families",
  metaDescription:
    "Coachmen motorhomes explained: Freelander, Leprechaun, Pursuit, Mirada, Euro and Class B vans, with real prices on the Coachmen motorhomes on our lot.",
  excerpt:
    "Coachmen builds some of the most popular family motorhomes. Here's the lineup and real prices on the Coachmen units on our lot.",
  category: "Motorhomes",
  cover: "/blog/coachmen-motorhomes.jpg",
  coverAlt: "New 2026 Coachmen Freelander 31MB Class C",
  publishedAt: "2026-10-31",
  updatedAt: "2026-10-31",
  keyTakeaways: [
    "Coachmen is a Forest River division and builds Class A, Class C and Class B motorhomes.",
    "The Freelander and Leprechaun are popular family Class Cs.",
    "The Pursuit and Mirada are gas Class As; the Euro is a compact Mercedes-based coach.",
    "Coachmen motorhomes on our lot range from $84,995 to $129,995.",
  ],
  blocks: [
    {
      type: "p",
      text: "**Coachmen** has built RVs since the 1960s and is now part of Forest River. Its motorhomes are favorites with families. Here's the lineup.",
    },

    { type: "h2", text: "Coachmen Motorhome Lineup" },
    {
      type: "table",
      caption: "Recent model lines; check Coachmen's current lineup.",
      head: ["Model", "Type", "Best for"],
      rows: [
        ["Freelander", "Class C (Ford or Chevy)", "Value family travel"],
        ["Leprechaun", "Class C (Ford or Chevy)", "Family layouts with more features"],
        ["Prism / Concord", "Mercedes or Ford compact C", "Couples"],
        ["Pursuit", "Gas Class A", "Value Class A"],
        ["Mirada", "Gas Class A", "Family Class A"],
        ["Euro", "Compact Mercedes-based coach", "Couples, fuel economy"],
        ["Galleria / Nova / Beyond", "Class B", "Van travel"],
      ],
    },

    { type: "h2", text: "Coachmen Motorhomes on Our Lot" },
    {
      type: "table",
      head: ["Model", "Highlights", "Price"],
      rows: [
        [
          "2026 Freelander 27QB (Chevy 3500)",
          "30 ft, sleeps 6, bunk over cab",
          "$84,995 (MSRP $128,441)",
        ],
        [
          "2026 Freelander 31MB",
          "32 ft 11 in, 7.3L V8, 2 slides, outdoor kitchen, sleeps 8",
          "$99,995 (MSRP $162,224)",
        ],
        ["2025 Pursuit 31TS (used)", "Gas Class A, triple slide, auto leveling", "$90,995"],
        [
          "2026 Euro 25TB",
          "28 ft 4 in Mercedes diesel, king bed, 200 W solar",
          "$129,995 (MSRP $219,065)",
        ],
      ],
    },
    {
      type: "inventory",
      title: "Coachmen motorhomes in stock",
      q: "Coachmen",
      limit: 6,
    },
    {
      type: "p",
      text: "Read our [Coachmen Leprechaun guide](/guides/coachmen-leprechaun) and [Forest River motorhomes guide](/guides/forest-river-motorhomes), or [contact us](/contact).",
    },
  ],
  faqs: [
    {
      q: "Who owns Coachmen RV?",
      a: "Coachmen is a division of Forest River, which is owned by Berkshire Hathaway.",
    },
    {
      q: "Are Coachmen motorhomes good?",
      a: "Coachmen offers strong value and popular family floor plans, with wide dealer support through Forest River.",
    },
    {
      q: "What is the difference between the Freelander and Leprechaun?",
      a: "Both are Coachmen Class Cs. The Freelander is the value line; the Leprechaun adds more standard features.",
    },
  ],
  related: ["coachmen-leprechaun", "forest-river-motorhomes", "best-motorhomes-under-100000"],
};
