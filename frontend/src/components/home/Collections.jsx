import { COLLECTIONS } from "../../data/content";
import { IMAGES } from "../../data/images";
import { ImageSlot } from "../ImageSlot";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

const spanClass = {
  tall: "sm:row-span-2 aspect-[4/5] sm:aspect-auto",
  wide: "sm:col-span-2 aspect-[4/5] sm:aspect-[2/1]",
  square: "aspect-[4/5] sm:aspect-square",
};

export const Collections = () => (
  <section id="collections" className="bg-brand-cream py-16 sm:py-24 lg:py-32" data-testid="collections-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          overline="The Collections"
          title="Five worlds, one fire."
          text="Each collection is an exploration — of form, of memory, of the metal itself. Begin where your eye rests."
        />
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:grid-rows-2 sm:gap-5 lg:mt-16">
        {COLLECTIONS.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08} className={c.span === "tall" ? "sm:row-span-2" : c.span === "wide" ? "sm:col-span-2" : ""}>
            <a
              href="#bestsellers"
              data-testid={`collection-card-${c.id}`}
              className="group relative block h-full overflow-hidden"
            >
              <ImageSlot
                name={`collection-${c.id}`}
                label={c.name}
                src={IMAGES.collections[c.id].src}
                alt={IMAGES.collections[c.id].alt}
                ratio={spanClass[c.span]}
                className="h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-charcoal/70 to-transparent p-5 sm:p-6">
                <h3 className="font-serif text-xl text-brand-cream sm:text-2xl">{c.name}</h3>
                <p className="mt-1 text-xs text-brand-cream/80">{c.note}</p>
                <span className="mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore →
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
