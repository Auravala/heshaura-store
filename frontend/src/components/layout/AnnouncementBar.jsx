import { Sparkles } from "lucide-react";
import { BRAND } from "../../data/content";

export const AnnouncementBar = () => (
  <div
    data-testid="announcement-bar"
    className="flex items-center justify-center gap-2 bg-brand-orange px-4 py-2 text-center"
  >
    <Sparkles className="h-3.5 w-3.5 text-brand-cream" aria-hidden="true" />
    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-cream">
      {BRAND.offer} · Handcrafted in small batches
    </p>
  </div>
);
