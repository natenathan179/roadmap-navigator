import type { Article } from "@/lib/articles";

export const dieselMotorhomeMaintenance: Article = {
  slug: "diesel-motorhome-maintenance",
  title: "How to Maintain a Diesel Motorhome for Long-Term Performance",
  metaTitle: "How to Maintain a Diesel Motorhome",
  metaDescription:
    "Diesel motorhome maintenance: oil and fuel filters, coolant, DEF and emissions, air brakes, generator and a diesel pusher service schedule.",
  excerpt:
    "Diesel pushers can run for hundreds of thousands of miles with the right care. Here's how to maintain a diesel motorhome.",
  category: "Maintenance",
  cover: "/blog/diesel-motorhome-maintenance.webp",
  coverAlt: "Used 2008 Newmar Dutch Star 4320 diesel pusher",
  publishedAt: "2026-10-31",
  updatedAt: "2026-10-31",
  keyTakeaways: [
    "Change engine oil and filters on schedule — usually yearly or by mileage, whichever comes first.",
    "Fuel filters and water separators are critical on diesels.",
    "Newer diesels need DEF and emissions-system care.",
    "Don't forget the air system, brakes, chassis lube and the generator.",
  ],
  blocks: [
    {
      type: "p",
      text: "Diesel engines are built to last, but only with consistent care. Here's **how to maintain a diesel motorhome** for long-term performance. Always follow your engine and chassis manufacturer's schedule first.",
    },

    { type: "h2", text: "Diesel Motorhome Maintenance Schedule" },
    {
      type: "table",
      caption: "General guide — your engine and chassis manuals take priority.",
      head: ["Item", "Typical interval"],
      rows: [
        ["Engine oil and filter", "Yearly or per the engine maker's mileage interval"],
        ["Fuel filters / water separator", "Yearly, or sooner if water is detected"],
        ["Air filter", "Check yearly; replace by restriction indicator"],
        ["Coolant", "Test yearly; replace per manufacturer"],
        ["Transmission fluid and filters", "Per the transmission maker's schedule"],
        ["Chassis lubrication", "Yearly or per chassis manual"],
        ["Air dryer cartridge", "Every 1–2 years"],
        ["Generator oil and filters", "By generator hours"],
        ["DEF system (newer engines)", "Keep DEF topped up; service filters per schedule"],
      ],
    },

    { type: "h2", text: "Diesel-Specific Tips" },
    {
      type: "ul",
      items: [
        "**Exercise the engine and generator** — monthly runs under load prevent problems in storage.",
        "**Use quality fuel** and watch for water in the fuel.",
        "**Let the turbo cool** briefly before shutting down after hard climbs.",
        "**Drain air tanks** if your coach lacks automatic drains.",
        "**Use the exhaust brake** on long descents to save your service brakes.",
        "**Consider oil analysis** to catch issues early.",
      ],
    },
    {
      type: "callout",
      title: "Find a diesel shop",
      text: "Diesel pushers often need a truck or coach service center rather than a regular RV shop. Know where to find service along your routes.",
    },
    {
      type: "inventory",
      title: "Diesel motorhomes in stock",
      rvClass: "Diesel Pusher",
      limit: 4,
    },
    {
      type: "p",
      text: "See [best diesel motorhomes](/guides/best-diesel-motorhomes), [how often to service a motorhome](/guides/how-often-to-service-a-motorhome) and our [RV maintenance checklist](/guides/rv-maintenance-checklist).",
    },
  ],
  faqs: [
    {
      q: "How often should you change the oil in a diesel motorhome?",
      a: "Many owners change it yearly or at the engine maker's mileage interval, whichever comes first. Follow your engine manual.",
    },
    {
      q: "Are diesel motorhomes expensive to maintain?",
      a: "Routine service costs more than on a gas coach, but diesel engines can last much longer with good care.",
    },
    {
      q: "Should I run my diesel motorhome during storage?",
      a: "Many owners run the engine and generator under load monthly to keep seals lubricated and batteries charged.",
    },
  ],
  related: [
    "best-diesel-motorhomes",
    "how-often-to-service-a-motorhome",
    "rv-maintenance-checklist",
  ],
};
