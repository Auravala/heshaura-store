// HESHAURA — Shop catalog mock data (Account 2, frontend-only phase).
//
// TEMPORARY MOCK DATA. Replace with real HESHAURA product photos, names,
// prices and stock later. The shape is deliberately flat and serializable so
// it maps 1:1 to a future product API response with no component changes.
//
// Product shape:
//   id        unique string id
//   slug      URL slug (used by /product/:slug)
//   name      display name
//   price     selling price in ₹ (integer)
//   mrp       original price in ₹ (integer, for strike-through)
//   stock     units available (0 = out of stock)
//   flags     { featured, bestseller, newArrival } booleans
//   category  category id (see CATEGORIES)
//   image     key into src/data/images.js -> IMAGES.products[image]
//   materials []  stays EMPTY unless a material id is explicitly assigned.
//                 Nothing is auto-assigned. Product cards never show materials.
//   createdAt numeric recency key (higher = newer) — used by "Newest" sort
//   variants? optional: [{ type, label, options: [{ id, label, priceDelta?, stock? }] }]
//             Products without `variants` render as normal single-SKU items.

export const CATEGORIES = [
  { id: "evil-eye", label: "Evil Eye Bracelets" },
  { id: "beaded", label: "Beaded Bracelets" },
  { id: "thread", label: "Thread Bracelets" },
  { id: "charm", label: "Charm Bracelets" },
  { id: "couple", label: "Couple Bracelets" },
  { id: "gift-sets", label: "Gift Sets" },
];

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

export const PRODUCTS = [
  {
    id: "p-evil-eye-classic",
    slug: "classic-evil-eye-bracelet",
    name: "Classic Evil Eye Bracelet",
    price: 599,
    mrp: 899,
    stock: 12,
    flags: { featured: true, bestseller: true, newArrival: false },
    category: "evil-eye",
    image: "classic-evil-eye-bracelet",
    materials: [],
    createdAt: 3,
    variants: [
      {
        type: "color",
        label: "Colour",
        options: [
          { id: "blue", label: "Blue", stock: 6 },
          { id: "black", label: "Black", stock: 4 },
          { id: "white", label: "White", stock: 2 },
        ],
      },
    ],
  },
  {
    id: "p-evil-eye-nazar",
    slug: "nazar-charm-evil-eye-bracelet",
    name: "Nazar Charm Evil Eye Bracelet",
    price: 699,
    mrp: 999,
    stock: 7,
    flags: { featured: false, bestseller: true, newArrival: false },
    category: "evil-eye",
    image: "nazar-charm-evil-eye-bracelet",
    materials: [],
    createdAt: 2,
  },
  {
    id: "p-beaded-wooden",
    slug: "wooden-bead-bracelet",
    name: "Wooden Bead Bracelet",
    price: 499,
    mrp: 799,
    stock: 20,
    flags: { featured: false, bestseller: false, newArrival: false },
    category: "beaded",
    image: "wooden-bead-bracelet",
    materials: [],
    createdAt: 1,
  },
  {
    id: "p-beaded-lava",
    slug: "lava-stone-beaded-bracelet",
    name: "Lava Stone Beaded Bracelet",
    price: 749,
    mrp: 1099,
    stock: 5,
    flags: { featured: false, bestseller: false, newArrival: true },
    category: "beaded",
    image: "lava-stone-beaded-bracelet",
    materials: [],
    createdAt: 9,
    variants: [
      {
        type: "size",
        label: "Bracelet Size",
        options: [
          { id: "s", label: "Small", stock: 1 },
          { id: "m", label: "Medium", stock: 3 },
          { id: "l", label: "Large", stock: 1 },
        ],
      },
    ],
  },
  {
    id: "p-thread-red",
    slug: "red-protection-thread-bracelet",
    name: "Red Protection Thread Bracelet",
    price: 299,
    mrp: 499,
    stock: 40,
    flags: { featured: false, bestseller: true, newArrival: false },
    category: "thread",
    image: "red-protection-thread-bracelet",
    materials: [],
    createdAt: 1,
  },
  {
    id: "p-thread-black",
    slug: "adjustable-black-thread-bracelet",
    name: "Adjustable Black Thread Bracelet",
    price: 349,
    mrp: 599,
    stock: 0,
    flags: { featured: false, bestseller: false, newArrival: false },
    category: "thread",
    image: "adjustable-black-thread-bracelet",
    materials: [],
    createdAt: 1,
  },
  {
    id: "p-charm-heart",
    slug: "heart-charm-bracelet",
    name: "Heart Charm Bracelet",
    price: 649,
    mrp: 949,
    stock: 9,
    flags: { featured: true, bestseller: false, newArrival: false },
    category: "charm",
    image: "heart-charm-bracelet",
    materials: [],
    createdAt: 4,
    variants: [
      {
        type: "charm",
        label: "Charm",
        options: [
          { id: "heart", label: "Heart" },
          { id: "star", label: "Star" },
          { id: "moon", label: "Moon" },
        ],
      },
    ],
  },
  {
    id: "p-charm-infinity",
    slug: "infinity-charm-bracelet",
    name: "Infinity Charm Bracelet",
    price: 699,
    mrp: 999,
    stock: 3,
    flags: { featured: false, bestseller: false, newArrival: true },
    category: "charm",
    image: "infinity-charm-bracelet",
    materials: [],
    createdAt: 8,
  },
  {
    id: "p-couple-his-hers",
    slug: "his-and-hers-couple-bracelet-set",
    name: "His & Hers Couple Bracelet Set",
    price: 1199,
    mrp: 1799,
    stock: 6,
    flags: { featured: true, bestseller: true, newArrival: false },
    category: "couple",
    image: "his-and-hers-couple-bracelet-set",
    materials: [],
    createdAt: 5,
    variants: [
      {
        type: "color",
        label: "Colour",
        options: [
          { id: "black", label: "Black", stock: 4 },
          { id: "brown", label: "Brown", stock: 2 },
        ],
      },
    ],
  },
  {
    id: "p-couple-magnetic",
    slug: "magnetic-couple-bracelets",
    name: "Magnetic Couple Bracelets",
    price: 999,
    mrp: 1499,
    stock: 4,
    flags: { featured: false, bestseller: false, newArrival: true },
    category: "couple",
    image: "magnetic-couple-bracelets",
    materials: [],
    createdAt: 7,
  },
  {
    id: "p-gift-aura-set",
    slug: "aura-gift-set",
    name: "Aura Gift Set",
    price: 1499,
    mrp: 2199,
    stock: 5,
    flags: { featured: true, bestseller: false, newArrival: false },
    category: "gift-sets",
    image: "aura-gift-set",
    materials: [],
    createdAt: 6,
  },
  {
    id: "p-gift-blessings-box",
    slug: "blessings-gift-box",
    name: "Blessings Gift Box",
    price: 1999,
    mrp: 2999,
    stock: 2,
    flags: { featured: false, bestseller: true, newArrival: false },
    category: "gift-sets",
    image: "blessings-gift-box",
    materials: [],
    createdAt: 6,
  },
];

export const getProductBySlug = (slug) => PRODUCTS.find((p) => p.slug === slug);

export const priceBounds = () => {
  const prices = PRODUCTS.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};
