import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShoppingBag, SlidersHorizontal } from "lucide-react";
import { formatINR } from "../../data/content";
import { getProductImage } from "../../data/images";
import { ImageSlot } from "../ImageSlot";
import { useCart } from "../../context/CartContext";
import { SHOP } from "../../constants/testIds/shop";

// Shop catalog card. Shows ONLY name, price, MRP and stock (no material labels).
export const ShopProductCard = ({ product }) => {
  const img = getProductImage(product.image, product.name);
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const soldOut = product.stock <= 0;
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    if (hasVariants) {
      // Variant-required products must be configured on the PDP.
      toast("Choose your options first.", { description: product.name });
      navigate(`/product/${product.slug}`);
      return;
    }
    addItem(product, {}, 1);
    toast.success(`${product.name} added to your bag.`);
    openCart();
  };

  return (
    <article className="group" data-testid={SHOP.card}>
      <Link
        to={`/product/${product.slug}`}
        data-testid={SHOP.cardLink}
        className="block"
        aria-label={product.name}
      >
        <div className="relative">
          <ImageSlot
            name={`product-${product.slug}`}
            label={product.name}
            src={img.src}
            alt={img.alt}
            ratio="aspect-[4/5]"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          {soldOut && (
            <span className="absolute left-3 top-3 bg-brand-charcoal px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-cream">
              Sold Out
            </span>
          )}
          {!soldOut && product.flags?.bestseller && (
            <span className="absolute left-3 top-3 bg-brand-orange px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-cream">
              Bestseller
            </span>
          )}
          {!soldOut && !product.flags?.bestseller && product.flags?.newArrival && (
            <span className="absolute left-3 top-3 bg-brand-gold px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-charcoal">
              New
            </span>
          )}
          <div className="absolute inset-x-3 bottom-3 flex translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleAdd}
              disabled={soldOut}
              data-testid={SHOP.cardAdd}
              aria-label={hasVariants ? `Choose options for ${product.name}` : `Add ${product.name} to bag`}
              className="flex flex-1 items-center justify-center gap-2 bg-brand-charcoal py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange disabled:cursor-not-allowed disabled:opacity-40"
            >
              {soldOut ? (
                "Sold Out"
              ) : hasVariants ? (
                <>
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Choose Options
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
                </>
              )}
            </button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-serif text-lg text-brand-charcoal transition-colors group-hover:text-brand-orange">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-brand-charcoal">{formatINR(product.price)}</span>
            {product.mrp && (
              <span className="text-xs text-brand-stone line-through">{formatINR(product.mrp)}</span>
            )}
          </div>
          {soldOut ? (
            <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-stone">
              Out of stock
            </p>
          ) : product.stock <= 8 ? (
            <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-orange">
              Only {product.stock} left
            </p>
          ) : (
            <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-stone">
              In stock
            </p>
          )}
        </div>
      </Link>
    </article>
  );
};
