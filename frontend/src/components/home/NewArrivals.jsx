import { NEW_ARRIVALS } from "../../data/content";
import { ProductCard } from "./ProductCard";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export const NewArrivals = () => (
  <section id="new-arrivals" className="bg-brand-cream py-16 sm:py-24 lg:py-32" data-testid="new-arrivals-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          overline="Just Off the Bench"
          title="New arrivals, still warm."
          text="The latest hand-forged releases — each one limited by the hours of the artisan who made it."
        />
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {NEW_ARRIVALS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <ProductCard product={p} badge={p.badge} />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
