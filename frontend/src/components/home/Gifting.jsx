import { useState } from "react";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { ImageSlot } from "../ImageSlot";
import { IMAGES } from "../../data/images";

export const Gifting = () => {
  const [noteOn, setNoteOn] = useState(true);

  return (
    <section id="gifting" className="bg-brand-cream py-16 sm:py-24 lg:py-32" data-testid="gifting-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="relative">
              <ImageSlot
                name="gifting-box"
                label="Signature gift box"
                src={IMAGES.gifting.box.src}
                alt={IMAGES.gifting.box.alt}
                ratio="aspect-[4/3]"
              />
              {noteOn && (
                <div className="absolute -bottom-6 left-4 right-4 bg-brand-surface p-5 shadow-[0_20px_40px_-20px_rgba(28,25,23,0.35)] sm:left-8 sm:right-auto sm:w-72" data-testid="gift-note-preview">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-orange">Handwritten Note</p>
                  <p className="mt-2 font-serif text-sm italic leading-relaxed text-brand-charcoal">
                    “For the light you carry — wear a little of mine.”
                  </p>
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <SectionHeading
              overline="The Gifting Experience"
              title="Wrapped like it matters. Because it does."
              text="Every order can ship in our signature keepsake box with a handwritten note and an optional digital gift card — at no extra cost."
            />
            <div className="mt-8 flex items-center gap-4">
              <button
                type="button"
                role="switch"
                aria-checked={noteOn}
                onClick={() => setNoteOn((v) => !v)}
                data-testid="gifting-toggle-note"
                className={`relative h-7 w-12 rounded-full transition-colors ${noteOn ? "bg-brand-orange" : "bg-brand-sand"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-brand-surface transition-all ${noteOn ? "left-6" : "left-1"}`}
                />
              </button>
              <span className="text-sm text-brand-charcoal">Include a handwritten note</span>
            </div>
            <ul className="mt-8 space-y-3 text-sm text-brand-stone">
              <li className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />Signature keepsake box in HESHAURA orange</li>
              <li className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />Digital gift cards from ₹1,000, delivered instantly</li>
              <li className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />Discreet pricing — receipts never travel with gifts</li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
