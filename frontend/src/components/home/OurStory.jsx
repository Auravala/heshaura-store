import { Reveal } from "../Reveal";
import { Overline } from "../SectionHeading";
import { ImageSlot } from "../ImageSlot";
import { IMAGES } from "../../data/images";

export const OurStory = () => (
  <section id="our-story" className="bg-brand-surface py-16 sm:py-24 lg:py-32" data-testid="our-story-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <ImageSlot
            name="story-founder"
            label="Founder at the workbench"
            src={IMAGES.story.founder.src}
            alt={IMAGES.story.founder.alt}
            ratio="aspect-[3/4]"
          />
        </Reveal>
        <div className="lg:col-span-7 lg:py-8">
          <Reveal>
            <Overline>Our Story</Overline>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-brand-charcoal sm:text-4xl lg:text-5xl text-balance">
              Born at a single bench, kept there on purpose.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-brand-stone">
              <p>
                HESHAURA began with a borrowed torch, a block of reclaimed silver, and a belief
                that jewellery should mean something before it shines. What started as one
                artisan's evening practice is now a small studio of master goldsmiths — and
                we have kept it small on purpose.
              </p>
              <p>
                Every collection is forged in limited runs, numbered and hallmarked, using
                techniques that take decades to learn and hours to execute. We preserve
                traditional hand-chasing and stone-setting not out of nostalgia, but because
                no machine has yet learned to put soul into metal.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-brand-sand pt-8">
              {[
                ["12", "Master artisans"],
                ["100%", "Recycled silver"],
                ["1", "Bench per piece"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-serif text-3xl text-brand-orange sm:text-4xl">{num}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-brand-stone">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);
