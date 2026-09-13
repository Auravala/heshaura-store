import { toast } from "sonner";
import { Eye, ShoppingBag } from "lucide-react";
import { formatINR } from "../../data/content";
import { IMAGES } from "../../data/images";
import { ImageSlot } from "../ImageSlot";

export const ProductCard = ({ product, badge, onQuickView }) => {
  const img = IMAGES.products[product.id] || { src: null, alt: product.name };
  return (
    <article className="group" data-testid="bestseller-product-card">
      <div className="relative">
        <ImageSlot
          name={`product-${product.id}`}
          label={product.name}
          src={img.src}
          alt={img.alt}
          ratio="aspect-[4/5]"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {badge && (
          <span className="absolute left-3 top-3 bg-brand-orange px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-cream">
            {badge}
          </span>
        )}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              data-testid="quick-view-button"
              className="flex flex-1 items-center justify-center gap-2 bg-brand-surface/95 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-charcoal transition-colors hover:bg-brand-surface"
            >
              <Eye className="h-3.5 w-3.5" /> Quick View
            </button>
          )}
          <button
            type="button"
            onClick={() => toast.success(`${product.name} added to your bag.`, { description: "Cart arrives in Account 3 — this is a preview." })}
            data-testid="add-to-bag-button"
            aria-label={`Add ${product.name} to bag`}
            className="flex flex-1 items-center justify-center gap-2 bg-brand-charcoal py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
          </button>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-serif text-lg text-brand-charcoal transition-colors group-hover:text-brand-orange">
          {product.name}
        </h3>
        {product.material && <p className="mt-1 text-xs text-brand-stone">{product.material}</p>}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-brand-charcoal">{formatINR(product.price)}</span>
          {product.mrp && (
            <span className="text-xs text-brand-stone line-through">{formatINR(product.mrp)}</span>
          )}
        </div>
        {product.stock != null && product.stock <= 8 && (
          <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-orange">
            Only {product.stock} hand-forged left
          </p>
        )}
      </div>
    </article>
  );
};
