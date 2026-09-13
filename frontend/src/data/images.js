// Central image registry for HESHAURA.
// Every image slot on the site resolves through this file.
// To go live: drop the real HESHAURA photo URL (or imported asset) into the
// matching `src` field — components render it automatically, no other changes needed.

export const IMAGES = {
  hero: {
    src: null,
    alt: "HESHAURA editorial portrait — model wearing hand-forged gold jewellery",
  },
  collections: {
    "solace-rings": { src: null, alt: "Solace Rings collection" },
    "kinship-bangles": { src: null, alt: "Kinship Bangles collection" },
    "ethereal-necklaces": { src: null, alt: "Ethereal Necklaces collection" },
    "aura-earrings": { src: null, alt: "Aura Earrings collection" },
    "heirloom-sets": { src: null, alt: "Artisanal Heirloom Sets collection" },
  },
  products: {
    "solace-signet-ring": { src: null, alt: "Solace Signet Ring" },
    "kinship-cuff-bangle": { src: null, alt: "Kinship Cuff Bangle" },
    "ethereal-chain-necklace": { src: null, alt: "Ethereal Chain Necklace" },
    "aura-drop-earrings": { src: null, alt: "Aura Drop Earrings" },
    "ember-stacking-ring": { src: null, alt: "Ember Stacking Ring" },
    "lumen-pearl-pendant": { src: null, alt: "Lumen Pearl Pendant" },
    "terra-link-bracelet": { src: null, alt: "Terra Link Bracelet" },
    "halo-stud-earrings": { src: null, alt: "Halo Stud Earrings" },
  },
  craftsmanship: {
    studio: { src: null, alt: "Inside the HESHAURA artisan studio" },
    hands: { src: null, alt: "Goldsmith hands shaping metal" },
  },
  story: {
    founder: { src: null, alt: "HESHAURA founder at the workbench" },
  },
  gifting: {
    box: { src: null, alt: "HESHAURA signature gift box" },
  },
  megaMenu: {
    featured: { src: null, alt: "Featured seasonal piece" },
  },
};
