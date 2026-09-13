import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { BRAND } from "../../data/content";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export const WalletPreview = () => (
  <section id="wallet" className="bg-brand-surface py-16 sm:py-24 lg:py-32" data-testid="wallet-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <SectionHeading
            overline="HESHAURA Wallet"
            title="Store credit with a soul of its own."
            text="A promotional wallet that grows as you share the aura. Credit is earned through referrals — never purchased, never withdrawn, always yours to spend here."
          />
          <ul className="mt-8 space-y-4">
            {[
              "Earned through referrals and special promotions",
              `${BRAND.referralReward} for every friend whose first order is delivered`,
              "Applies automatically at checkout — up to 25% of your cart",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-sm text-brand-stone">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange" />
                {t}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => toast("Wallet unlocks with your HESHAURA account.", { description: "Accounts arrive in Account 4 — this is a preview." })}
            data-testid="wallet-claim-button"
            className="mt-10 bg-brand-charcoal px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange"
          >
            Join the Inner Circle
          </button>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-3 border border-brand-orange/30" aria-hidden="true" />
            <div className="relative bg-brand-charcoal p-8 sm:p-10" data-testid="wallet-card-preview">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm tracking-[0.35em] text-brand-cream">{BRAND.name}</span>
                <Wallet className="h-5 w-5 text-brand-gold" />
              </div>
              <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-brand-cream/50">Available Credit</p>
              <p className="mt-2 font-serif text-5xl text-brand-cream">{BRAND.referralReward}</p>
              <div className="mt-10 flex items-end justify-between border-t border-brand-cream/15 pt-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-cream/50">Tier</p>
                  <p className="mt-1 text-sm font-semibold text-brand-gold">Inner Circle</p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-brand-cream/40">Store credit only</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
