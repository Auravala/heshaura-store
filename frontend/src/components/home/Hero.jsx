import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BRAND } from "../../data/content";
import { IMAGES } from "../../data/images";
import { ImageSlot } from "../ImageSlot";

export const Hero = () => (
  <section id="top" className="relative overflow-hidden bg-brand-cream" data-testid="hero-section">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
      <div className="lg:col-span-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            data-testid="hero-offer-badge"
            className="inline-flex items-center border border-brand-orange/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-orange"
          >
            {BRAND.offer}
          </span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-brand-charcoal sm:text-6xl lg:text-7xl">
            JEWELLERY
            <br />
            WITH A <span className="italic text-brand-orange">SOUL.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-brand-stone sm:text-lg">
            {BRAND.tagline} Hand-forged in small batches from recycled silver and
            responsibly sourced gold — pieces that carry meaning, not just shine.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#bestsellers"
              data-testid="hero-primary-cta"
              className="group inline-flex items-center justify-center gap-2 bg-brand-orange px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange-hover"
            >
              Shop Bestsellers
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#craftsmanship"
              data-testid="hero-secondary-cta"
              className="inline-flex items-center justify-center border border-brand-charcoal/25 px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-charcoal transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              Explore Craftsmanship
            </a>
          </div>
        </motion.div>
      </div>
      <div className="lg:col-span-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <ImageSlot
            name="hero"
            label="Hero editorial portrait"
            src={IMAGES.hero.src}
            alt={IMAGES.hero.alt}
            ratio="aspect-[4/5] sm:aspect-[5/5]"
            className="shadow-[0_40px_80px_-40px_rgba(28,25,23,0.35)]"
          />
          <div className="absolute -bottom-5 -left-5 hidden bg-brand-surface px-6 py-4 shadow-[0_16px_40px_-16px_rgba(28,25,23,0.3)] sm:block">
            <p className="font-serif text-2xl text-brand-charcoal">300+</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-stone">Artisan hours per drop</p>
          </div>
        </motion.div>
      </div>
    </div>
    <div className="overflow-hidden border-y border-brand-sand bg-brand-surface py-3" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-12">
            {["Hand-Forged", "Recycled 925 Silver", "Fair-Trade Gemstones", "Small Batch", "Heirloom Grade", "Zero-Waste Studio"].map((t) => (
              <span key={t} className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-stone">
                <span className="h-1 w-1 rounded-full bg-brand-orange" />
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);
