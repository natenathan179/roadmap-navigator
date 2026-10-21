export const DEALER = {
  name: "RV MotorHomes Dealership",
  tagline: "RV Sales, Service & Delivery",
  // Street, city and ZIP are blank until the dealership's street address is confirmed;
  // fill them in and every address, map and Google listing picks them up.
  street: "",
  city: "",
  state: "MI",
  stateName: "Michigan",
  zip: "",
  /** Short place name for copy, e.g. "Lansing, Michigan" or just "Michigan". */
  get location() {
    return this.city ? `${this.city}, ${this.stateName}` : this.stateName;
  },
  get address() {
    return this.street ? `${this.street}, ${this.city}, ${this.state} ${this.zip}` : `${this.location}, USA`;
  },
  phone: "(517) 429-8283",
  phoneHref: "tel:+15174298283",
  email: "sales@rvmotorhomesdealership.com",
  /** Address every website form is emailed to via FormSubmit. */
  formEmail: "sales@rvmotorhomesdealership.com",
  hours: [
    { days: "Monday – Friday", time: "8:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 5:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  get mapQuery() {
    return encodeURIComponent(this.address);
  },
} as const;

export const RV_CLASSES = [
  "Travel Trailer",
  "Fifth Wheel",
  "Toy Hauler",
  "Truck Camper",
  "Pop-Up Camper",
  "Class A",
  "Class B",
  "Class C",
  "Super C",
] as const;
export const FUEL_TYPES = ["Towable", "Diesel", "Gas"] as const;
export const CONDITIONS = ["new", "used"] as const;

export const SERVICE_CATEGORIES = [
  { name: "RV Inspection", description: "NRVIA-style multi-point inspections before you buy or sell." },
  { name: "Preventive Maintenance", description: "Scheduled chassis, coach and seal service to keep small issues small." },
  { name: "Mechanical Service", description: "Engine, transmission, brakes, suspension and chassis diagnostics." },
  { name: "Generator Service", description: "Onan and Cummins generator servicing, load testing and repair." },
  { name: "Electrical Service", description: "Inverters, converters, lithium upgrades, solar and 12V troubleshooting." },
  { name: "HVAC Service", description: "Roof air units, furnaces, hydronic and Aqua-Hot systems." },
  { name: "Plumbing", description: "Fresh, grey and black systems, water heaters, pumps and leaks." },
  { name: "Roof Inspection", description: "Membrane, seam and sealant inspection with full resealing." },
  { name: "Detailing", description: "Wash, wax, ceramic coating, interior deep clean and ozone treatment." },
  { name: "Winterization", description: "Full winterize and de-winterize service before Michigan winters." },
  { name: "Warranty Service", description: "Manufacturer and extended warranty claims handled in-house." },
] as const;
