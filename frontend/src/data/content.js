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
    material: "Recycled 925 Silver · 18K Gold",
    stock: 6,
  },
  {
    id: "kinship-cuff-bangle",
    name: "Kinship Cuff Bangle",
    price: 6200,
    mrp: 8900,
    material: "Hand-chased Sterling Silver",
    stock: 4,
  },
  {
    id: "ethereal-chain-necklace",
    name: "Ethereal Chain Necklace",
    price: 9400,
    mrp: 12500,
    material: "18K Gold Vermeil",
    stock: 3,
  },
  {
    id: "aura-drop-earrings",
    name: "Aura Drop Earrings",
    price: 3950,
    mrp: 5600,
    material: "Recycled Silver · Citrine",
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
    text: "Recycled silver and gold are chased, hammered and annealed until the metal holds its story.",
  },
  {
    step: "03",
    title: "Ethical Stone Setting",
    text: "Fair-trade stones are set one at a time, under magnification, by a single artisan's hands.",
  },
  {
    step: "04",
    title: "Aura Polishing",
    text: "A final hand-polish gives each piece the warm, lived-in glow HESHAURA is known for.",
  },
];

export const MATERIALS = [
  {
    title: "Recycled 925 Sterling Silver",
    text: "Refined from reclaimed metal, assayed and hallmarked in-house.",
  },
  {
    title: "18K Solid Gold Accents",
    text: "Responsibly sourced gold, worked in small studio batches.",
  },
  {
    title: "Fair-Trade Natural Gemstones",
    text: "Traceable stones from audited, small-scale mines.",
  },
  {
    title: "Zero-Waste Artisanal Studio",
    text: "Every filing is reclaimed. Every offcut is reforged.",
  },
];

export const formatINR = (n) => `₹${n.toLocaleString("en-IN")}`;
