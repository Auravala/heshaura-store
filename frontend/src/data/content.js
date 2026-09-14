// Static homepage content for HESHAURA (Account 1).
// Structured so later accounts can swap these for API/CMS data without touching components.

export const BRAND = {
  name: "HESHAURA",
  tagline: "A Piece of Soul. A Part of Your Aura.",
  offer: "33% OFF FIRST ORDER",
  referralReward: "₹333",
};

export const NAV_LINKS = [
  { label: "Shop", href: "#collections", mega: true },
  { label: "Collections", href: "#collections" },
  { label: "Our Story", href: "#our-story" },
  { label: "Gifting", href: "#gifting" },
];

export const MEGA_MENU = {
  categories: [
    { label: "Rings", href: "#collections" },
    { label: "Necklaces", href: "#collections" },
    { label: "Bangles", href: "#collections" },
    { label: "Earrings", href: "#collections" },
    { label: "Heirloom Sets", href: "#collections" },
    { label: "Fine Gemstones", href: "#collections" },
  ],
  edits: [
    { label: "Bestsellers", href: "#bestsellers" },
    { label: "New Arrivals", href: "#new-arrivals" },
    { label: "Under ₹5,000", href: "#bestsellers" },
    { label: "Gifting", href: "#gifting" },
  ],
  featured: {
    title: "The Solstice Edit",
    note: "Hand-forged in small batches for the season of light.",
    cta: "Discover the Edit",
    href: "#new-arrivals",
  },
};

export const COLLECTIONS = [
  {
    id: "solace-rings",
    name: "Solace Rings",
    note: "Sculpted bands that hold quiet meaning.",
    span: "tall",
  },
  {
    id: "kinship-bangles",
    name: "Kinship Bangles",
    note: "Cuffs forged for the wrists of your people.",
    span: "wide",
  },
  {
    id: "ethereal-necklaces",
    name: "Ethereal Necklaces",
    note: "Chains and pendants that catch the light.",
    span: "tall",
  },
  {
    id: "aura-earrings",
    name: "Aura Earrings",
    note: "Drops and studs with a soft, warm glow.",
    span: "square",
  },
  {
    id: "heirloom-sets",
    name: "Artisanal Heirloom Sets",
    note: "Pieces made to be handed down, not worn out.",
    span: "square",
  },
];

export const BESTSELLERS = [
  {
    id: "solace-signet-ring",
    name: "Solace Signet Ring",
    price: 4850,
    mrp: 7200,
    materials: [],
    stock: 6,
  },
  {
    id: "kinship-cuff-bangle",
    name: "Kinship Cuff Bangle",
    price: 6200,
    mrp: 8900,
    materials: [],
    stock: 4,
  },
  {
    id: "ethereal-chain-necklace",
    name: "Ethereal Chain Necklace",
    price: 9400,
    mrp: 12500,
    materials: [],
    stock: 3,
  },
  {
    id: "aura-drop-earrings",
    name: "Aura Drop Earrings",
    price: 3950,
    mrp: 5600,
    materials: [],
    stock: 8,
  },
];

export const NEW_ARRIVALS = [
  {
    id: "ember-stacking-ring",
    name: "Ember Stacking Ring",
    price: 2950,
    badge: "New Drop",
  },
  {
    id: "lumen-pearl-pendant",
    name: "Lumen Pearl Pendant",
    price: 7800,
    badge: "Limited Release",
  },
  {
    id: "terra-link-bracelet",
    name: "Terra Link Bracelet",
    price: 5400,
    badge: "New Drop",
  },
  {
    id: "halo-stud-earrings",
    name: "Halo Stud Earrings",
    price: 3250,
    badge: "Limited Release",
  },
];

export const CRAFT_STAGES = [
  {
    step: "01",
    title: "Hand-wax Moulding",
    text: "Every piece begins as a wax form, carved entirely by hand — never cast from a machine library.",
  },
  {
    step: "02",
    title: "Chased Metal Sculpting",
    text: "Silver and gold are chased, hammered and annealed until the metal holds its story.",
  },
  {
    step: "03",
    title: "Stone Setting",
    text: "Each stone is set one at a time, with care, by a single artisan's hands.",
  },
  {
    step: "04",
    title: "Aura Polishing",
    text: "A final hand-polish gives each piece the warm, lived-in glow HESHAURA is known for.",
  },
];

// Brand-level materials storytelling (shown in the Materials & Craft section).
// These double as the assignable material catalog for products: a product only
// displays a material when its id is explicitly listed in that product's
// `materials` array — nothing is applied to products automatically.
// Later accounts can manage these assignments from the Admin/CMS.
export const MATERIALS = [
  {
    id: "silver-925",
    title: "925 Sterling Silver",
    text: "A timeless, durable metal with a soft, luminous finish.",
  },
  {
    id: "gold-accents",
    title: "Gold Accents",
    text: "Warm gold detailing, worked in small studio batches.",
  },
  {
    id: "natural-gemstones",
    title: "Natural Gemstones",
    text: "Stones chosen for their colour, character and depth.",
  },
  {
    id: "artisanal-studio",
    title: "Artisanal Studio",
    text: "Every piece is finished by hand, one bench at a time.",
  },
];

export const MATERIAL_CATALOG = Object.fromEntries(MATERIALS.map((m) => [m.id, m.title]));

export const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;
