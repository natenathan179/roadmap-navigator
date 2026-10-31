import type { Article } from "@/lib/articles";

export const coachmenLeprechaun: Article = {
  slug: "coachmen-leprechaun",
  title: "Coachmen Leprechaun Motorhome: Everything Buyers Need to Know",
  metaTitle: "Coachmen Leprechaun: What Buyers Need to Know",
  metaDescription:
    "Coachmen Leprechaun Class C guide: 230FS and 260DS floor plans, Ford and Chevy chassis, 2026 MSRP vs sale prices, Leprechaun vs Freelander and buying tips.",
  excerpt:
    "The Leprechaun is one of the best-selling family Class Cs. Here are its floor plans, chassis, real prices and buying tips.",
  category: "Motorhomes",
  cover: "/blog/coachmen-leprechaun.jpg",
  coverAlt: "Coachmen Class C on our lot: 2026 Coachmen Freelander 27QB",
  publishedAt: "2026-10-31",
  updatedAt: "2026-10-31",
  keyTakeaways: [
    "The Leprechaun is Coachmen's popular family Class C, built on Ford and Chevrolet chassis.",
    "The 230FS (one slide, Ford 7.3L V8) sold for about $90,000–$100,000 in 2026 against a ≈$138,686 MSRP.",
    "The 260DS on the Ford E-450 sold for about $126,000 against a ≈$158,083 MSRP.",
    "Our Coachmen Freelander Class Cs start at $84,995 if you want a lower price.",
  ],
  blocks: [
    {
      type: "p",
      text: "The **Coachmen Leprechaun** is a family Class C known for practical floor plans and good features for the money. Here's everything buyers need to know.",
    },

    { type: "h2", text: "Popular Leprechaun Floor Plans" },
    {
      type: "table",
      caption: "From 2026 dealer listings; confirm with Coachmen's spec sheet.",
      head: ["Model", "Chassis", "Highlights", "Price guide"],
      rows: [
        [
          "230FS",
          "Ford E-350/350 with 7.3L V8",
          "Compact, one slide, rear bed",
          "MSRP ≈$138,686; sale ≈$90,000–$100,000",
        ],
        ["260DS", "Ford E-450", "Family layout with slides", "MSRP ≈$158,083; sale ≈$126,466"],
        ["311FS (Premier)", "Ford", "Larger family plan in earlier years", "Varies"],
      ],
    },

    { type: "h2", text: "Leprechaun vs Freelander" },
    {
      type: "table",
      head: ["", "Leprechaun", "Freelander"],
      rows: [
        ["Position", "More standard features", "Value-focused"],
        ["Chassis", "Ford and Chevy", "Ford and Chevy"],
        ["Our prices", "Not in stock", "$84,995 (27QB) and $99,995 (31MB)"],
      ],
    },
    {
      type: "inventory",
      title: "Coachmen Class C motorhomes in stock",
      rvClass: "Class C",
      limit: 6,
    },

    { type: "h2", text: "Buying Tips" },
    {
      type: "ol",
      items: [
        "Check the cab-over for leaks on used units.",
        "Compare Ford E-Series vs Chevrolet chassis options.",
        "Look at slide seals and the roof.",
        "Compare out-the-door prices — Leprechaun discounts vary widely.",
      ],
    },
    {
      type: "p",
      text: "See [Coachmen motorhomes](/guides/coachmen-motorhomes), [Thor Chateau](/guides/thor-chateau) and our [Class C buyer's guide](/guides/class-c-motorhome-buyers-guide).",
    },
  ],
  faqs: [
    {
      q: "What chassis is the Coachmen Leprechaun on?",
      a: "Leprechauns are built on Ford E-Series chassis (such as the E-450) and select Chevrolet chassis.",
    },
    {
      q: "How much is a Coachmen Leprechaun?",
      a: "In 2026, the 230FS sold for about $90,000–$100,000 and the 260DS for about $126,000, well below MSRP.",
    },
    {
      q: "Is the Leprechaun a good motorhome?",
      a: "It's one of the most popular family Class Cs, with practical layouts and wide service support.",
    },
  ],
  related: ["coachmen-motorhomes", "thor-chateau", "class-c-motorhome-buyers-guide"],
};
