import type { Article } from "@/lib/articles";

export const bestMotorhomeTires: Article = {
  slug: "best-motorhome-tires",
  title: "Best RV Motorhome Tires: How to Choose the Right Ones",
  metaTitle: "Best Motorhome Tires: How to Choose the Right Ones",
  metaDescription:
    "How to choose motorhome tires: reading sizes and load ranges, tire age and DOT codes, inflation by weight, TPMS and when to replace RV tires.",
  excerpt:
    "Tires carry your whole motorhome. Here's how to choose the right ones, read the sidewall and know when to replace them.",
  category: "Maintenance",
  cover: "/blog/best-motorhome-tires.webp",
  coverAlt: "Front tire and wheel of a used 2025 Coachmen Pursuit 31TS",
  publishedAt: "2026-10-31",
  updatedAt: "2026-10-31",
  keyTakeaways: [
    "Always match the size and load range listed on your coach's tire placard.",
    "Replace RV tires about every 5–7 years, regardless of tread.",
    "Set pressure based on actual axle weights, not just the sidewall maximum.",
    "A TPMS is the best protection against blowouts.",
  ],
  blocks: [
    {
      type: "p",
      text: "Motorhome tires age out long before they wear out. Here's **how to choose the right motorhome tires** and keep them safe.",
    },

    { type: "h2", text: "Reading Your Tire Sidewall" },
    {
      type: "table",
      head: ["Marking", "Meaning", "Example"],
      rows: [
        ["Size", "Width, aspect ratio, construction and rim size", "275/80R22.5 (our Dutch Star)"],
        [
          "Load range / index",
          "How much weight each tire carries",
          "Must meet or exceed the placard",
        ],
        ["Speed rating", "Maximum rated speed", "Match or exceed original"],
        ["DOT date code", "Week and year of manufacture", '"2324" = 23rd week of 2024'],
      ],
    },

    { type: "h2", text: "Choosing Replacement Tires" },
    {
      type: "ol",
      items: [
        "**Match the placard** — size, load range and pressure are listed near the driver's seat.",
        "**Choose reputable commercial or RV-rated tires** from established brands.",
        "**Check the DOT date** — don't accept tires that are already a year or more old.",
        "**Replace in sets by axle** for even handling.",
        "**Use a qualified shop** with the right equipment for large coach tires.",
      ],
    },

    { type: "h2", text: "Inflation and Weight" },
    {
      type: "p",
      text: "The pressure on the sidewall is a maximum, not the correct setting. Weigh your loaded motorhome by axle (or corner), then use the tire maker's load and inflation table to set pressures. Check them cold before every travel day.",
    },
    {
      type: "callout",
      title: "Add a TPMS",
      text: "A tire pressure monitoring system warns you of slow leaks and heat before they become blowouts. It's one of the best safety upgrades for any motorhome.",
    },
    {
      type: "inventory",
      title: "Motorhomes in stock",
      rvClass: "Class A",
      limit: 6,
    },
    {
      type: "p",
      text: "More tips in [common motorhome problems](/guides/common-motorhome-problems) and [how to prepare for a long road trip](/guides/prepare-motorhome-for-road-trip).",
    },
  ],
  faqs: [
    {
      q: "How often should I replace motorhome tires?",
      a: "Most experts recommend every 5–7 years, even if the tread looks good, because rubber breaks down with age and sun.",
    },
    {
      q: "What PSI should my motorhome tires be?",
      a: "It depends on the actual weight on each axle. Weigh the coach and use the tire maker's load/inflation chart.",
    },
    {
      q: "Can I use regular truck tires on a motorhome?",
      a: "Only if they match the size, load range and speed rating required on your coach's placard.",
    },
  ],
  related: [
    "common-motorhome-problems",
    "prepare-motorhome-for-road-trip",
    "how-often-to-service-a-motorhome",
  ],
};
