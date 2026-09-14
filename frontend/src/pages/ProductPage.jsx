import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ChevronRight, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ShopProductCard } from "../components/shop/ShopProductCard";
import { Overline } from "../components/SectionHeading";
import { Reveal } from "../components/Reveal";
import { ImageSlot } from "../components/ImageSlot";
import { CATEGORY_LABEL } from "../data/products";
import { fetchProductBySlug, fetchProducts } from "../services/api";
import { getProductImage } from "../data/images";
import { formatINR } from "../data/content";
import { POLICIES, NON_AUTHORITATIVE_NOTE } from "../data/policies";
import { useCart } from "../context/CartContext";
import { PDP } from "../constants/testIds/shop";

const Loading = () => (
  <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal" data-testid="pdp-loading">
    <AnnouncementBar />
    <Header />
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
      <p className="font-serif text-4xl text-brand-charcoal">Loading the piece…</p>
    </div>
    <Footer />
  </div>
);

const LoadError = ({ onRetry }) => (
  <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal" data-testid="pdp-error">
    <AnnouncementBar />
    <Header />
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
      <p className="font-serif text-4xl text-brand-charcoal">Something went wrong</p>
      <p className="mt-4 text-brand-stone">We couldn't load this piece right now.</p>
      <button
        type="button"
        onClick={onRetry}
        data-testid="pdp-retry-button"
        className="mt-8 bg-brand-charcoal px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange"
      >
        Try again
      </button>
    </div>
    <Footer />
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal">
    <AnnouncementBar />
    <Header />
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
      <p className="font-serif text-4xl text-brand-charcoal">Piece not found</p>
      <p className="mt-4 text-brand-stone">This bracelet may have sold out or moved.</p>
      <Link
        to="/shop"
        className="mt-8 bg-brand-charcoal px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange"
      >
        Back to Shop
      </Link>
    </div>
    <Footer />
  </div>
);

export default function ProductPage() {
  const { slug } = useParams();
  const { addItem, openCart } = useCart();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [selections, setSelections] = useState({});
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    setProduct(null);
    Promise.all([fetchProductBySlug(slug), fetchProducts().catch(() => [])])
      .then(([p, list]) => {
        if (!active) return;
        setProduct(p);
        setAllProducts(list);
      })
      .catch((err) => {
        if (!active) return;
        if (err?.response?.status !== 404) {
          setLoadError("We couldn't load this piece right now.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, reloadKey]);

  const hasVariants = Array.isArray(product?.variants) && product.variants.length > 0;
  const soldOut = product ? product.stock <= 0 : true;

  const priceDelta = useMemo(
    () => Object.values(selections).reduce((d, o) => d + (o.priceDelta || 0), 0),
    [selections],
  );

  if (loading) return <Loading />;
  if (loadError) return <LoadError onRetry={() => setReloadKey((k) => k + 1)} />;
  if (!product) return <NotFound />;

  const img = getProductImage(product.image, product.name);
  const effectivePrice = product.price + priceDelta;
  const savings = product.mrp ? product.mrp - product.price : 0;
  const related = allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 3);

  const selectOption = (variant, option) => {
    if (option.stock === 0) return;
    setError("");
    setSelections((prev) => ({
      ...prev,
      [variant.type]: { ...option, variantLabel: variant.label },
    }));
  };

  const handleAdd = () => {
    if (soldOut) return;
    if (hasVariants) {
      const missing = product.variants.find((v) => !selections[v.type]);
      if (missing) {
        setError(`Please select ${missing.label.toLowerCase()}.`);
        toast.error(`Select ${missing.label.toLowerCase()} to continue.`);
        return;
      }
    }
    addItem(product, selections, qty);
    toast.success(`${product.name} added to your bag.`);
    openCart();
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal" data-testid={PDP.page}>
      <AnnouncementBar />
      <Header />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-stone">
            <Link to="/" className="transition-colors hover:text-brand-orange">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/shop" className="transition-colors hover:text-brand-orange">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/shop?category=${product.category}`} className="transition-colors hover:text-brand-orange">
              {CATEGORY_LABEL[product.category]}
            </Link>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Gallery */}
            <div data-testid={PDP.gallery}>
              <ImageSlot name={`pdp-${product.slug}`} label={product.name} src={img.src} alt={img.alt} ratio="aspect-[4/5]" />
              <div className="mt-4 grid grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((n) => (
                  <ImageSlot
                    key={n}
                    name={`pdp-${product.slug}-thumb-${n}`}
                    label={`View ${n + 1}`}
                    src={img.src}
                    alt={`${product.name} view ${n + 1}`}
                    ratio="aspect-square"
                  />
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="lg:pt-4">
              <Overline>{CATEGORY_LABEL[product.category]}</Overline>
              <h1 className="mt-3 font-serif text-3xl tracking-tight text-brand-charcoal sm:text-4xl" data-testid={PDP.name}>
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-2xl font-semibold text-brand-charcoal" data-testid={PDP.price}>
                  {formatINR(effectivePrice)}
                </span>
                {product.mrp && (
                  <span className="text-base text-brand-stone line-through" data-testid={PDP.mrp}>
                    {formatINR(product.mrp)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-orange">
                    Save {formatINR(savings)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.15em]" data-testid={PDP.stock}>
                {soldOut ? (
                  <span className="text-brand-stone">Out of stock</span>
                ) : product.stock <= 8 ? (
                  <span className="text-brand-orange">Only {product.stock} left — handcrafted in small batches</span>
                ) : (
                  <span className="text-brand-stone">In stock</span>
                )}
              </p>

              <p className="mt-6 max-w-prose text-sm leading-relaxed text-brand-stone">
                A hand-finished HESHAURA bracelet, made to be worn every day and handed down. Adjustable fit, packed
                in our signature gift-ready box.
              </p>

              {/* Variants */}
              {hasVariants &&
                product.variants.map((variant) => (
                  <div key={variant.type} className="mt-8" data-testid={PDP.variant}>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-charcoal">
                        {variant.label}
                      </p>
                      {selections[variant.type] && (
                        <span className="text-xs text-brand-stone">{selections[variant.type].label}</span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {variant.options.map((opt) => {
                        const active = selections[variant.type]?.id === opt.id;
                        const optSoldOut = opt.stock === 0;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            disabled={optSoldOut}
                            onClick={() => selectOption(variant, opt)}
                            data-testid={`pdp-variant-option-${variant.type}-${opt.id}`}
                            className={`min-w-[3.5rem] border px-4 py-2.5 text-sm transition-colors ${
                              active
                                ? "border-brand-orange bg-brand-orange text-brand-cream"
                                : "border-brand-sand bg-brand-surface text-brand-charcoal hover:border-brand-orange"
                            } ${optSoldOut ? "cursor-not-allowed line-through opacity-40" : ""}`}
                          >
                            {opt.label}
                            {typeof opt.priceDelta === "number" && opt.priceDelta !== 0 && (
                              <span className="ml-1 text-xs">
                                ({opt.priceDelta > 0 ? "+" : ""}
                                {formatINR(opt.priceDelta)})
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

              {error && (
                <p className="mt-4 text-sm font-medium text-destructive" data-testid="pdp-variant-error">
                  {error}
                </p>
              )}

              {/* Quantity + Add to cart */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center border border-brand-sand">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={soldOut}
                    aria-label="Decrease quantity"
                    data-testid={PDP.qtyDec}
                    className="flex h-12 w-12 items-center justify-center text-brand-charcoal transition-colors hover:text-brand-orange disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-base font-semibold" data-testid={PDP.qtyValue}>
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                    disabled={soldOut || qty >= product.stock}
                    aria-label="Increase quantity"
                    data-testid={PDP.qtyInc}
                    className="flex h-12 w-12 items-center justify-center text-brand-charcoal transition-colors hover:text-brand-orange disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={soldOut}
                  data-testid={PDP.addToCart}
                  className="flex flex-1 items-center justify-center gap-2 bg-brand-charcoal py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange disabled:cursor-not-allowed disabled:bg-brand-stone"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {soldOut ? "Sold Out" : "Add to Bag"}
                </button>
              </div>

              {/* Assurances */}
              <div className="mt-8 grid gap-3 border-t border-brand-sand pt-6 text-sm text-brand-stone">
                <p className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-brand-orange" /> Free shipping preview — calculated at checkout
                </p>
                <p className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-brand-orange" /> Handcrafted in small batches
                </p>
              </div>

              {/* Non-authoritative offer note */}
              <div className="mt-6 bg-brand-surface p-4 text-xs text-brand-stone">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
                  {POLICIES.firstOrderDiscount}% off your first order
                </p>
                <p className="mt-2 leading-relaxed">{NON_AUTHORITATIVE_NOTE}</p>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-20 border-t border-brand-sand pt-14">
              <Overline>You may also like</Overline>
              <h2 className="mt-3 font-serif text-3xl text-brand-charcoal">More from {CATEGORY_LABEL[product.category]}</h2>
              <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6">
                {related.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 0.06}>
                    <ShopProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
