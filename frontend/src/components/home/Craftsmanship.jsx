import { CRAFT_STAGES } from "../../data/content";
import { IMAGES } from "../../data/images";
import { ImageSlot } from "../ImageSlot";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export const Craftsmanship = () => (
  <section id="craftsmanship" className="bg-brand-cream py-16 sm:py-24 lg:py-32" data-testid="craftsmanship-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeading
              overline="The Ritual"
              title="Four stages. One pair of hands."
              text="From wax to aura polish, every HESHAURA piece follows the same unhurried ritual our artisans have practised for decades."
            />
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <ImageSlot
              name="craftsmanship-studio"
              label="Artisan studio"
              src={IMAGES.craftsmanship.studio.src}
              alt={IMAGES.craftsmanship.studio.alt}
              ratio="aspect-[4/3]"
            />
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <div className="divide-y divide-brand-sand border-y border-brand-sand">
            {CRAFT_STAGES.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.08}>
                <div className="group flex gap-6 py-8 transition-colors sm:gap-10" data-testid={`craft-stage-${s.step}`}>
                  <span className="font-serif text-3xl text-brand-orange/50 transition-colors group-hover:text-brand-orange sm:text-4xl">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-brand-charcoal sm:text-2xl">{s.title}</h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-brand-stone">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
