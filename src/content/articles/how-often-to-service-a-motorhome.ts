import type { Article } from "@/lib/articles";

export const howOftenToServiceAMotorhome: Article = {
  slug: "how-often-to-service-a-motorhome",
  title: "How Often Should You Service an RV Motorhome?",
  metaTitle: "How Often Should You Service a Motorhome?",
  metaDescription:
    "How often to service a motorhome: chassis, engine, generator, roof, slides, appliances and tires, with a simple service schedule for gas and diesel RVs.",
  excerpt:
    "A motorhome is a vehicle and a house. Here's how often to service each part, with a simple schedule for gas and diesel coaches.",
  category: "Maintenance",
  cover: "/blog/how-often-to-service-a-motorhome.webp",
  coverAlt: "Ford 7.3L V8 badge on a used 2025 Coachmen Pursuit 31TS",
  publishedAt: "2026-10-31",
  updatedAt: "2026-10-31",
  keyTakeaways: [
    "Service the chassis like a heavy truck: oil and filters at least yearly or by mileage.",
    "Service the house side — roof, seals, appliances, water heater — at least once a year.",
    "Generators are serviced by hours and should be exercised monthly.",
    "Check tires before every trip and replace every 5–7 years.",
  ],
  blocks: [
    {
      type: "p",
      text: "Motorhomes need two kinds of maintenance: the **chassis** (engine, brakes, transmission) and the **house** (roof, plumbing, appliances). Here's **how often to service an RV motorhome**.",
    },

    { type: "h2", text: "Motorhome Service Schedule" },
    {
      type: "table",
      caption: "General guide — follow your chassis, engine and appliance manuals.",
      head: ["System", "How often"],
      rows: [
        ["Engine oil and filter (gas)", "Per Ford/Chevy schedule, at least yearly"],
        ["Engine oil and filters (diesel)", "Yearly or per engine maker's mileage"],
        ["Brakes, fluids, belts, hoses", "Yearly inspection"],
        ["Generator", "Exercise monthly; service by hours"],
        ["Roof and sealant", "Inspect every 6 months"],
        ["Slide-out seals and mechanisms", "Every 6 months"],
        ["Water heater (anode/flush)", "Yearly"],
        ["Furnace, A/C, fridge", "Yearly check and cleaning"],
        ["LP system leak test", "Yearly"],
        ["Smoke, CO, LP detectors", "Test before each trip"],
        ["Tires", "Check pressure before each trip; replace every 5–7 years"],
        ["Winterizing and de-winterizing", "Each fall and spring in cold climates"],
      ],
    },
    {
      type: "inventory",
      title: "Motorhomes in stock",
      rvClass: "Class A",
      limit: 6,
    },

    { type: "h2", text: "Signs You Need Service Now" },
    {
      type: "ul",
      items: [
        "Water stains or soft spots",
        "Slides that move slowly or unevenly",
        "Warning lights or unusual engine noises",
        "Generator surging or not starting",
        "Propane smell — leave the coach and shut off the tank",
      ],
    },
    {
      type: "p",
      text: "Diesel owners should also read [how to maintain a diesel motorhome](/guides/diesel-motorhome-maintenance). See our [RV maintenance checklist](/guides/rv-maintenance-checklist), or book with our [service team](/services).",
    },
  ],
  faqs: [
    {
      q: "How often should a motorhome be serviced?",
      a: "At least once a year for both chassis and house systems, plus roof and seal checks every six months and pre-trip checks.",
    },
    {
      q: "How often should I change the oil in my motorhome?",
      a: "Follow the chassis or engine manual. Many owners change it yearly even with low mileage.",
    },
    {
      q: "How much does motorhome service cost per year?",
      a: "Many owners budget about 1–3% of the coach's value per year. See hidden costs of owning a motorhome.",
    },
  ],
  related: [
    "diesel-motorhome-maintenance",
    "common-motorhome-problems",
    "rv-maintenance-checklist",
  ],
};
