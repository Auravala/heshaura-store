import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "sonner";
import { BESTSELLERS, formatINR, MATERIAL_CATALOG } from "../../data/content";
import { ProductCard } from "./ProductCard";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

const QuickView = ({ product, onClose }) => (
  <AnimatePresence>
    {product && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-brand-charcoal/50 p-0 sm:items-center sm:p-6"
        onClick={onClose}
        data-testid="quick-view-modal"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-brand-surface p-6 sm:p-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-orange">Quick View</p>
              <h3 className="mt-2 font-serif text-2xl text-brand-charcoal">{product.name}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              data-testid="quick-view-close-button"
              className="flex h-9 w-9 items-center justify-center text-brand-charcoal hover:text-brand-orange"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {product.materials?.length > 0 && (
            <p className="mt-3 text-sm text-brand-stone" data-testid="quick-view-materials">
              {product.materials.map((id) => MATERIAL_CATALOG[id]).filter(Boolean).join(" · ")}
            </p>
          )}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl font-semibold text-brand-charcoal">{formatINR(product.price)}</span>
            <span className="text-sm text-brand-stone line-through">{formatINR(product.mrp)}</span>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
              Save {formatINR(product.mrp - product.price)}
            </span>
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-brand-orange">
            Only {product.stock} hand-forged left
          </p>
          <button
            type="button"
            onClick={() => {
              toast.success(`${product.name} added to your bag.`);
              onClose();
            }}
            data-testid="quick-view-add-to-bag"
            className="mt-6 w-full bg-brand-orange py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange-hover"
          >
            Add to Bag
          </button>
          <p className="mt-3 text-center text-xs text-brand-stone">Full product pages arrive in Account 2.</p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const Bestsellers = () => {
  const [quickView, setQuickView] = useState(null);
  return (
    <section id="bestsellers" className="bg-brand-surface py-16 sm:py-24 lg:py-32" data-testid="bestsellers-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              overline="Most Loved"
              title="Bestsellers, forged again."
              text="The pieces our collectors return for — reforged in small batches as long as the metal allows."
            />
            <a
              href="#collections"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange underline-offset-4 hover:underline"
            >
              View All →
            </a>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {BESTSELLERS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProductCard product={p} onQuickView={setQuickView} />
            </Reveal>
          ))}
        </div>
      </div>
      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
};
