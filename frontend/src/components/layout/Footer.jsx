import { Instagram, Facebook, Youtube } from "lucide-react";
import { BRAND } from "../../data/content";

const COLUMNS = [
  {
    title: "Shop",
    links: ["Rings", "Necklaces", "Bangles", "Earrings", "Heirloom Sets", "Gift Cards"],
  },
  {
    title: "The House",
    links: ["Our Story", "Craftsmanship", "Materials & Craft", "Journal", "Careers"],
  },
  {
    title: "Care",
    links: ["Contact Us", "Shipping & Delivery", "Returns & Exchange", "Size Guide", "Jewellery Care"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Wallet Terms", "Referral Terms", "Offer Terms"],
  },
];

export const Footer = () => (
  <footer className="border-t border-brand-sand bg-brand-surface" data-testid="footer">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-serif text-2xl tracking-[0.3em] text-brand-charcoal">{BRAND.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-stone">{BRAND.tagline}</p>
          <div className="mt-6 flex gap-2">
            {[
              { icon: Instagram, label: "Instagram", testid: "social-instagram" },
              { icon: Facebook, label: "Facebook", testid: "social-facebook" },
              { icon: Youtube, label: "YouTube", testid: "social-youtube" },
            ].map(({ icon: Icon, label, testid }) => (
              <a
                key={label}
                href="#top"
                aria-label={label}
                data-testid={testid}
                className="flex h-10 w-10 items-center justify-center border border-brand-sand text-brand-charcoal transition-colors hover:border-brand-orange hover:text-brand-orange"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-[11px] uppercase tracking-[0.18em] text-brand-stone">
            Handcrafted jewellery · Made in small batches
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-charcoal">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-sm text-brand-stone transition-colors hover:text-brand-orange">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-14 select-none overflow-hidden" aria-hidden="true">
        <p className="whitespace-nowrap text-center font-serif text-[18vw] leading-none tracking-[0.1em] text-brand-sand/60 lg:text-[11rem]">
          {BRAND.name}
        </p>
      </div>
      <div className="flex flex-col items-center justify-between gap-3 border-t border-brand-sand pt-6 text-xs text-brand-stone sm:flex-row">
        <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        <p>Wallet credit is promotional store credit — non-transferable, non-withdrawable.</p>
      </div>
    </div>
  </footer>
);
