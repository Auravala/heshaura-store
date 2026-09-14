import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ShopProductCard } from "../components/shop/ShopProductCard";
import { Overline } from "../components/SectionHeading";
import { Reveal } from "../components/Reveal";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, PRODUCTS, priceBounds } from "../data/products";
import { formatINR } from "../data/content";
import { SHOP } from "../constants/testIds/shop";

const FLAGS = [
  { id: "featured", label: "Featured" },
  { id: "bestseller", label: "Bestseller" },
  { id: "newArrival", label: "New Arrival" },
];

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

const bounds = priceBounds();

const FilterSection = ({ title, children }) => (
  <div className="border-b border-brand-sand py-6">
    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-charcoal">{title}</p>
    <div className="mt-4">{children}</div>
  </div>
);

const FiltersPanel = ({
  categories,
  toggleCategory,
  flags,
  toggleFlag,
  inStock,
  setInStock,
  price,
  setPrice,
  onClear,
}) => (
  <div>
    <div className="flex items-center justify-between">
      <p className="font-serif text-xl text-brand-charcoal">Refine</p>
      <button
        type="button"
        onClick={onClear}
        data-testid={SHOP.clearFilters}
        className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>

    <FilterSection title="Category">
      <div className="space-y-3" data-testid={SHOP.categoryFilter}>
        {CATEGORIES.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-3 text-sm text-brand-charcoal">
            <Checkbox
              checked={categories.includes(c.id)}
              onCheckedChange={() => toggleCategory(c.id)}
              data-testid={`shop-filter-category-${c.id}`}
            />
            {c.label}
          </label>
        ))}
      </div>
    </FilterSection>

    <FilterSection title="Price">
      <div data-testid={SHOP.priceSlider}>
        <Slider
          min={bounds.min}
          max={bounds.max}
          step={50}
          value={price}
          onValueChange={setPrice}
          className="mt-2"
        />
        <div className="mt-4 flex items-center justify-between text-xs text-brand-stone">
          <span>{formatINR(bounds.min)}</span>
          <span className="font-semibold text-brand-charcoal">Up to {formatINR(price[0])}</span>
        </div>
      </div>
    </FilterSection>

    <FilterSection title="Availability">
      <label className="flex cursor-pointer items-center gap-3 text-sm text-brand-charcoal">
        <Checkbox checked={inStock} onCheckedChange={setInStock} data-testid={SHOP.inStockFilter} />
        In stock only
      </label>
    </FilterSection>

    <FilterSection title="Edits">
      <div className="space-y-3" data-testid={SHOP.flagFilter}>
        {FLAGS.map((f) => (
          <label key={f.id} className="flex cursor-pointer items-center gap-3 text-sm text-brand-charcoal">
            <Checkbox
              checked={flags.includes(f.id)}
              onCheckedChange={() => toggleFlag(f.id)}
              data-testid={`shop-filter-flag-${f.id}`}
            />
            {f.label}
          </label>
        ))}
      </div>
    </FilterSection>
  </div>
);

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [categories, setCategories] = useState(
    initialCategory && CATEGORIES.some((c) => c.id === initialCategory) ? [initialCategory] : [],
  );
  const [flags, setFlags] = useState([]);
  const [inStock, setInStock] = useState(false);
  const [price, setPrice] = useState([bounds.max]);
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && CATEGORIES.some((c) => c.id === cat)) setCategories([cat]);
  }, [searchParams]);

  const toggle = (setter) => (id) =>
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const clearAll = () => {
    setCategories([]);
    setFlags([]);
    setInStock(false);
    setPrice([bounds.max]);
    setSort("featured");
  };

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (categories.length && !categories.includes(p.category)) return false;
      if (flags.length && !flags.every((f) => p.flags?.[f])) return false;
      if (inStock && p.stock <= 0) return false;
      if (p.price > price[0]) return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort((a, b) => b.createdAt - a.createdAt);
        break;
      default:
        list = [...list].sort((a, b) => Number(b.flags?.featured) - Number(a.flags?.featured));
    }
    return list;
  }, [categories, flags, inStock, price, sort]);

  const filterProps = {
    categories,
    toggleCategory: toggle(setCategories),
    flags,
    toggleFlag: toggle(setFlags),
    inStock,
    setInStock,
    price,
    setPrice,
    onClear: clearAll,
  };

  return (
    <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal" data-testid={SHOP.page}>
      <AnnouncementBar />
      <Header />
      <main>
        {/* Page intro */}
        <section className="border-b border-brand-sand bg-brand-surface">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <Overline>The Shop</Overline>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-brand-charcoal sm:text-5xl lg:text-6xl">
              Bracelets with a soul.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-stone">
              Evil eye, beaded, thread, charm and couple bracelets — handcrafted in small batches. Filter by what
              speaks to you.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">
            {/* Sidebar filters (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <FiltersPanel {...filterProps} />
              </div>
            </aside>

            <div>
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-sand pb-5">
                <p className="text-sm text-brand-stone" data-testid={SHOP.resultCount}>
                  {results.length} {results.length === 1 ? "piece" : "pieces"}
                </p>
                <div className="flex items-center gap-3">
                  <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-stone sm:block">
                    Sort
                  </span>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger
                      className="w-[190px] rounded-none border-brand-sand bg-brand-surface text-sm"
                      data-testid={SHOP.sortSelect}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {SORTS.map((s) => (
                        <SelectItem key={s.id} value={s.id} data-testid={`shop-sort-${s.id}`}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mobile filters */}
              <div className="mt-6 lg:hidden">
                <details className="border border-brand-sand bg-brand-surface px-4 py-3">
                  <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-charcoal">
                    Filters
                  </summary>
                  <div className="mt-4">
                    <FiltersPanel {...filterProps} />
                  </div>
                </details>
              </div>

              {/* Grid */}
              {results.length === 0 ? (
                <div className="py-24 text-center" data-testid={SHOP.empty}>
                  <p className="font-serif text-2xl text-brand-charcoal">Nothing matches those filters.</p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange underline-offset-4 hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div
                  className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-x-6"
                  data-testid={SHOP.grid}
                >
                  {results.map((p, i) => (
                    <Reveal key={p.id} delay={(i % 3) * 0.06}>
                      <ShopProductCard product={p} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
