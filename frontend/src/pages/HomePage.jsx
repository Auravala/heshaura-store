import { AnnouncementBar } from "../components/layout/AnnouncementBar";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/home/Hero";
import { Collections } from "../components/home/Collections";
import { Bestsellers } from "../components/home/Bestsellers";
import { Manifesto } from "../components/home/Manifesto";
import { Craftsmanship } from "../components/home/Craftsmanship";
import { Materials } from "../components/home/Materials";
import { NewArrivals } from "../components/home/NewArrivals";
import { WalletPreview } from "../components/home/WalletPreview";
import { ReferralPreview } from "../components/home/ReferralPreview";
import { Gifting } from "../components/home/Gifting";
import { OurStory } from "../components/home/OurStory";
import { Newsletter } from "../components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-cream font-sans text-brand-charcoal" data-testid="homepage">
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Collections />
        <Bestsellers />
        <Manifesto />
        <Craftsmanship />
        <Materials />
        <NewArrivals />
        <WalletPreview />
        <ReferralPreview />
        <Gifting />
        <OurStory />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
