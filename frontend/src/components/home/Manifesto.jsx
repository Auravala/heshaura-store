import { Reveal } from "../Reveal";

export const Manifesto = () => (
  <section className="bg-brand-charcoal py-20 sm:py-28 lg:py-36" data-testid="manifesto-section">
    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">The HESHAURA Manifesto</p>
        <blockquote className="mt-8 font-serif text-3xl leading-snug text-brand-cream sm:text-4xl lg:text-5xl text-balance">
          “We don't manufacture. We forge stories, layer by layer,
          in silver and fire.”
        </blockquote>
        <p className="mt-8 text-sm leading-relaxed text-brand-cream/60">
          Every HESHAURA piece passes through one pair of hands, one bench, one flame.
          Slow by intention — because a piece of your aura deserves more than a production line.
        </p>
      </Reveal>
    </div>
  </section>
);
