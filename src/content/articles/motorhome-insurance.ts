import type { Article } from "@/lib/articles";

export const motorhomeInsurance: Article = {
  slug: "motorhome-insurance",
  title: "RV Motorhome Insurance: What Every Owner Should Know",
  metaTitle: "Motorhome Insurance: What Every Owner Should Know",
  metaDescription:
    "Motorhome insurance explained: liability, collision and comprehensive, total loss, belongings, full-timer coverage and ways to save.",
  excerpt:
    "Motorhome insurance is different from car insurance. Here's what coverage you need and how to keep costs down.",
  category: "Buying Guides",
  cover: "/blog/motorhome-insurance.jpg",
  coverAlt: "Front of a new 2026 Forest River Georgetown 3 Series Class A",
  publishedAt: "2026-10-31",
  updatedAt: "2026-10-31",
  keyTakeaways: [
    "Motorhomes need specialized RV insurance that covers both the vehicle and the living space.",
    "Key coverages: liability, collision, comprehensive, personal belongings and roadside assistance.",
    "Full-timers need full-timer coverage similar to homeowners liability.",
    "Your premium depends on the coach's value, use, location and driving record.",
  ],
  blocks: [
    {
      type: "p",
      text: "A motorhome is both a vehicle and a home, so standard auto insurance often isn't enough. Here's **what every motorhome owner should know about RV insurance**. Coverage and requirements vary by state and insurer.",
    },

    { type: "h2", text: "Common Motorhome Coverages" },
    {
      type: "table",
      head: ["Coverage", "What it does"],
      rows: [
        ["Liability", "Injuries and damage you cause to others — required by law"],
        ["Collision", "Damage to your motorhome from an accident"],
        ["Comprehensive", "Theft, fire, weather, falling objects, animals"],
        ["Uninsured/underinsured motorist", "Protects you if the other driver lacks coverage"],
        ["Total loss replacement", "Replaces a newer coach with a new one after a total loss"],
        ["Personal belongings", "Your stuff inside the RV"],
        ["Roadside assistance", "Towing large coaches is expensive — make sure it's covered"],
        ["Vacation / full-timer liability", "Liability while parked at the campsite"],
      ],
    },

    { type: "h2", text: "What Affects Your Premium" },
    {
      type: "ul",
      items: [
        "Motorhome type, age and value",
        "How often you use it — recreational vs full-time",
        "Where you live and store it",
        "Your driving record and experience",
        "Deductibles and coverage limits",
      ],
    },

    { type: "h2", text: "Ways to Save" },
    {
      type: "ol",
      items: [
        "Bundle with your auto or home policy.",
        "Choose a higher deductible if you can afford it.",
        "Take an RV driving safety course.",
        "Use storage or lay-up coverage for months you don't travel.",
        "Install safety and anti-theft devices.",
      ],
    },
    {
      type: "inventory",
      title: "Motorhomes in stock",
      rvClass: "Class A",
      limit: 6,
    },
    {
      type: "p",
      text: "Insurance is one of the [hidden costs of owning a motorhome](/guides/hidden-costs-of-owning-a-motorhome). Full-timers should also read [living full-time in a motorhome](/guides/living-full-time-in-a-motorhome). Get a quote before you finalize your [financing](/financing).",
    },
  ],
  faqs: [
    {
      q: "Do you need special insurance for a motorhome?",
      a: "Yes. RV insurance covers the vehicle plus living-space risks like personal belongings and campsite liability.",
    },
    {
      q: "Is motorhome insurance expensive?",
      a: "It depends on the coach's value, how you use it and your driving record. Recreational use usually costs less than full-time.",
    },
    {
      q: "Does my lender require full coverage?",
      a: "If you finance, lenders usually require collision and comprehensive coverage until the loan is paid off.",
    },
  ],
  related: [
    "hidden-costs-of-owning-a-motorhome",
    "living-full-time-in-a-motorhome",
    "rv-financing-guide",
  ],
};
