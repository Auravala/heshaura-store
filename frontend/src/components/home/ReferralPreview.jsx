import { toast } from "sonner";
import { Copy, Gift } from "lucide-react";
import { BRAND } from "../../data/content";
import { Reveal } from "../Reveal";

const REFERRAL_LINK = "https://heshaura.com/r/AURA333";

export const ReferralPreview = () => {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
      toast.success("Referral link copied.", { description: "Share it to start earning wallet credit." });
    } catch {
      toast.error("Couldn't copy — long-press to copy the link.");
    }
  };

  return (
    <section id="referral" className="bg-brand-orange py-16 sm:py-24" data-testid="referral-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-cream/80">Share the Aura</p>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-brand-cream sm:text-4xl lg:text-5xl text-balance">
              Refer a Friend → Earn {BRAND.referralReward} HESHAURA Wallet.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-brand-cream/85">
              When your friend's first qualifying order is paid, delivered and past its return
              window, {BRAND.referralReward} lands in your wallet. No caps on good taste — or good friends.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="bg-brand-cream p-6 sm:p-8" data-testid="referral-card">
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-brand-orange" />
                <p className="text-sm font-semibold text-brand-charcoal">Your referral link</p>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <code className="flex-1 truncate border border-brand-sand bg-brand-surface px-4 py-3 text-sm text-brand-charcoal" data-testid="referral-link-text">
                  {REFERRAL_LINK}
                </code>
                <button
                  type="button"
                  onClick={copyLink}
                  data-testid="referral-copy-button"
                  className="inline-flex items-center justify-center gap-2 bg-brand-charcoal px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
              </div>
              <p className="mt-4 text-xs text-brand-stone">
                Reward is credited after the referred order completes its return period. Self-referrals
                and duplicate rewards are not eligible.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
