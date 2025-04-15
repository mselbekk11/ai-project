"use client";

import Bento from "@/components/bento";
import { Cta } from "@/components/cta";
import { Faq } from "@/components/FAQ";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
import HeroSectionTwo from "@/components/hero-section-two";
import { InfiniteSliderHoverSpeed } from "@/components/infinite-slider";
// import Grid from "@/components/grid";
// import Pricing from "@/components/pricing";
import PricingHome from "@/components/pricing-home";
// import SplitTwo from "@/components/split-two";
import Video from "@/components/video";

export default function Home() {
  return (
    <main className="flex flex-col h-100vh">
      <HeroSectionTwo />
      <Features />
      <InfiniteSliderHoverSpeed />
      <Video />
      <Bento />
      <PricingHome />
      <Faq />
      <Cta />
      <FooterSection />
    </main>
  );
}
