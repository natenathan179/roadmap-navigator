import type { Article } from "@/lib/articles";

export const prepareMotorhomeForRoadTrip: Article = {
  slug: "prepare-motorhome-for-road-trip",
  title: "How to Prepare Your Motorhome for a Long Road Trip",
  metaTitle: "How to Prepare Your Motorhome for a Long Trip",
  metaDescription:
    "How to prepare a motorhome for a long road trip: chassis service, tires, roof and seals, generator, propane, safety checks and a pre-departure checklist.",
  excerpt:
    "A pre-trip check prevents most roadside breakdowns. Here's how to get your motorhome ready for a long road trip.",
  category: "Maintenance",
  cover: "/blog/prepare-motorhome-for-road-trip.jpg",
  coverAlt: "Cockpit of a new 2026 Coachmen Euro 25TB motorhome",
  publishedAt: "2026-10-31",
  updatedAt: "2026-10-31",
  keyTakeaways: [
    "Service the engine and chassis before a long trip.",
    "Check tire age, pressure and condition — including the inside duals.",
    "Inspect the roof, seals and slides for leaks.",
    "Test every system and run through a departure checklist.",
  ],
  blocks: [
    {
      type: "p",
      text: "Most motorhome breakdowns can be prevented with a few hours of preparation. Here's **how to prepare your motorhome for a long road trip**.",
    },

    { type: "h2", text: "Two to Four Weeks Before" },
    {
      type: "ol",
      items: [
        "**Chassis service:** oil and filters, fluids, belts, hoses and brakes.",
        "**Tires:** check date codes, cracks and pressure (cold). Replace tires older than about 5–7 years — see [best motorhome tires](/guides/best-motorhome-tires).",
        "**Generator:** change oil and run it under load.",
        "**Roof and seals:** inspect sealant and slide seals.",
        "**Batteries:** test house and chassis batteries.",
        "**Propane:** check for leaks and fill tanks.",
      ],
    },

    { type: "h2", text: "The Week Before" },
    {
      type: "ul",
      items: [
        "Sanitize and fill the fresh water tank.",
        "Test the A/C, furnace, water heater, fridge and pumps.",
        "Test smoke, CO and LP detectors.",
        "Check the leveling system, slides and awning.",
        "Stock emergency and tool kits.",
      ],
    },

    { type: "h2", text: "Departure Checklist" },
    {
      type: "table",
      head: ["Check", "Done?"],
      rows: [
        ["Slides in, awning stowed, jacks up", "☐"],
        ["Antennas and satellite down", "☐"],
        ["Steps retracted, doors and bays locked", "☐"],
        ["Cords, hoses and chocks stowed", "☐"],
        ["Fridge and cabinets latched", "☐"],
        ["Tow car connected and lights tested", "☐"],
        ["Tire pressures checked", "☐"],
      ],
    },
    {
      type: "inventory",
      title: "Motorhomes ready for the road",
      rvClass: "Class A",
      limit: 6,
    },
    {
      type: "p",
      text: "Plan your route with [how to plan a motorhome road trip](/guides/plan-a-motorhome-road-trip), and see our [RV maintenance checklist](/guides/rv-maintenance-checklist). Our [service team](/services) can do a pre-trip inspection.",
    },
  ],
  faqs: [
    {
      q: "What should I check before a long RV trip?",
      a: "Engine and chassis service, tires, brakes, roof and seals, generator, propane, batteries and all appliances and safety detectors.",
    },
    {
      q: "How often should RV tires be replaced?",
      a: "Most experts recommend replacing RV tires every 5–7 years, regardless of tread depth.",
    },
    {
      q: "Should I get a pre-trip inspection?",
      a: "For long trips, a professional inspection is a smart investment, especially on older coaches.",
    },
  ],
  related: ["plan-a-motorhome-road-trip", "best-motorhome-tires", "rv-maintenance-checklist"],
};
