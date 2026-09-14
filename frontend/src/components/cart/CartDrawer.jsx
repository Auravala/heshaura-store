import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatINR } from "../../data/content";
import { getProductImage } from "../../data/images";
import { POLICIES, NON_AUTHORITATIVE_NOTE } from "../../data/policies";
import { ImageSlot } from "../ImageSlot";
import { useCart } from "../../context/CartContext";
import { CART } from "../../constants/testIds/shop";

const LineItem = ({ line }) => {
  const { setQty, removeItem } = useCart();
  const img = getProductImage(line.image, line.name);
  return (
    <div className="flex gap-4 py-5" data-testid={CART.item}>
      <div className="w-20 shrink-0">
        <ImageSlot name={`cart-${line.key}`} label={line.name} src={img.src} alt={img.alt} ratio="aspect-[4/5]" />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              to={`/product/${line.slug}`}
              className="font-serif text-base leading-tight text-brand-charcoal transition-colors hover:text-brand-orange"
            >
              {line.name}
            </Link>
            {line.variantLabels?.length > 0 && (
              <p className="mt-1 text-xs text-brand-stone">
                {line.variantLabels.map((v) => `${v.label}: ${v.optionLabel}`).join(" · ")}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeItem(line.key)}
            aria-label={`Remove ${line.name}`}
            data-testid={CART.itemRemove}
            className="flex h-8 w-8 items-center justify-center text-brand-stone transition-colors hover:text-brand-orange"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-brand-sand">
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty - 1)}
              aria-label="Decrease quantity"
              data-testid={CART.itemDec}
              className="flex h-8 w-8 items-center justify-center text-brand-charcoal transition-colors hover:text-brand-orange"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-brand-charcoal" data-testid={CART.itemQty}>
              {line.qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(line.key, line.qty + 1)}
              disabled={line.qty >= (line.maxStock || 99)}
              aria-label="Increase quantity"
              data-testid={CART.itemInc}
              className="flex h-8 w-8 items-center justify-center text-brand-charcoal transition-colors hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm font-semibold text-brand-charcoal">{formatINR(line.unitPrice * line.qty)}</span>
        </div>
      </div>
    </div>
  );
};

export const CartDrawer = () => {
  const { items, subtotal, itemCount, isOpen, closeCart, clear } = useCart();

  // Preview-only figures — clearly labelled non-authoritative.
  const previewDiscount = Math.round((subtotal * POLICIES.firstOrderDiscount) / 100);
  const previewTotal = Math.max(subtotal - previewDiscount, 0);
  const belowMin = subtotal > 0 && subtotal < POLICIES.minOrderValue;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] bg-brand-charcoal/50"
          onClick={closeCart}
          data-testid="cart-overlay"
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-brand-cream shadow-[0_0_60px_-15px_rgba(28,25,23,0.5)]"
            data-testid={CART.drawer}
          >
            <div className="flex items-center justify-between border-b border-brand-sand px-5 py-4 sm:px-6">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-orange">Your Bag</span>
                <span className="text-xs text-brand-stone">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close bag"
                data-testid={CART.close}
                className="flex h-9 w-9 items-center justify-center text-brand-charcoal transition-colors hover:text-brand-orange"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div
                className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"
                data-testid={CART.empty}
              >
                <ShoppingBag className="h-10 w-10 text-brand-sand" />
                <p className="font-serif text-2xl text-brand-charcoal">Your bag is empty</p>
                <p className="max-w-xs text-sm text-brand-stone">
                  Handcrafted bracelets, forged in small batches. Find the piece that carries your aura.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="mt-2 bg-brand-charcoal px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange"
                >
                  Explore the Shop
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-brand-sand overflow-y-auto px-5 sm:px-6">
                  {items.map((line) => (
                    <LineItem key={line.key} line={line} />
                  ))}
                  <div className="py-4">
                    <button
                      type="button"
                      onClick={clear}
                      className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-stone transition-colors hover:text-brand-orange"
                    >
                      Clear bag
                    </button>
                  </div>
                </div>

                <div className="border-t border-brand-sand bg-brand-surface px-5 py-5 sm:px-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-brand-stone">Subtotal</span>
                    <span className="text-lg font-semibold text-brand-charcoal" data-testid={CART.subtotal}>
                      {formatINR(subtotal)}
                    </span>
                  </div>

                  {/* Non-authoritative preview summary */}
                  <div className="mt-3 space-y-1.5 border-t border-dashed border-brand-sand pt-3 text-xs">
                    <div className="flex items-center justify-between text-brand-stone">
                      <span>First-order discount ({POLICIES.firstOrderDiscount}%) — preview</span>
                      <span>-{formatINR(previewDiscount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-brand-stone">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="flex items-center justify-between text-brand-stone">
                      <span>Wallet credit (up to {POLICIES.walletMaxUsage}%)</span>
                      <span>Applied at checkout</span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1 text-brand-charcoal">
                      <span className="font-semibold">Estimated total</span>
                      <span className="font-semibold">{formatINR(previewTotal)}</span>
                    </div>
                  </div>

                  {belowMin && (
                    <p className="mt-3 bg-brand-orange/10 px-3 py-2 text-[11px] text-brand-orange">
                      Minimum order value of {formatINR(POLICIES.minOrderValue)} applies at checkout.
                    </p>
                  )}

                  <p className="mt-3 text-[10px] leading-relaxed text-brand-stone/80">{NON_AUTHORITATIVE_NOTE}</p>

                  <button
                    type="button"
                    onClick={() =>
                      toast("Checkout arrives in a later phase.", {
                        description: "This bag is a frontend preview — no payment is taken.",
                      })
                    }
                    data-testid={CART.checkout}
                    className="mt-4 w-full bg-brand-orange py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange-hover"
                  >
                    Checkout — Preview
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
