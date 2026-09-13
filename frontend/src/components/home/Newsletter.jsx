import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { BRAND } from "../../data/content";
import { Reveal } from "../Reveal";

export const Newsletter = () => {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Welcome to the Inner Circle.", {
      description: "You're on the list — studio stories and private previews, first.",
    });
    setEmail("");
  };

  return (
    <section className="border-t border-brand-sand bg-brand-cream py-16 sm:py-24" data-testid="newsletter-section">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-orange">The Inner Circle</p>
          <h2 className="mt-4 font-serif text-3xl tracking-tight text-brand-charcoal sm:text-4xl text-balance">
            Join the Inner Circle for first word on new drops.
          </h2>
          <p className="mt-4 text-sm text-brand-stone">
            First word on new drops, studio stories, and private previews. No noise — we make jewellery, not spam.
          </p>
          <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row" data-testid="newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              data-testid="newsletter-email-input"
              className="flex-1 border border-brand-sand bg-brand-surface px-5 py-4 text-sm text-brand-charcoal placeholder:text-brand-stone/60 focus:border-brand-orange focus:outline-none"
            />
            <button
              type="submit"
              data-testid="newsletter-submit-button"
              className="group inline-flex items-center justify-center gap-2 bg-brand-orange px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-brand-cream transition-colors hover:bg-brand-orange-hover"
            >
              Subscribe
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};
