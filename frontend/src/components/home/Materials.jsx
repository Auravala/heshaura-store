import { MATERIALS } from "../../data/content";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export const Materials = () => (
  <section id="materials" className="border-y border-brand-sand bg-brand-surface py-16 sm:py-24" data-testid="materials-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          overline="Materials & Ethics"
          title="What we work with — and what we refuse to."
          align="center"
        />
      </Reveal>
      <div className="mt-12 grid grid-cols-1 gap-px border border-brand-sand bg-brand-sand sm:grid-cols-2 lg:grid-cols-4">
        {MATERIALS.map((m, i) => (
          <Reveal key={m.title} delay={i * 0.08}>
            <div className="flex h-full flex-col bg-brand-surface p-8 transition-colors hover:bg-brand-cream" data-testid={`material-card-${i}`}>
              <span className="font-serif text-2xl text-brand-orange">0{i + 1}</span>
              <h3 className="mt-4 font-serif text-lg text-brand-charcoal">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-stone">{m.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
