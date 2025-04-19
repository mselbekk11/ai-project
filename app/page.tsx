"use client";

import BentoTwo from "@/components/bento-two";
import { Cta } from "@/components/cta";
import { Faq } from "@/components/FAQ";
import Features from "@/components/features-1";
import { FooterTwo } from "@/components/footer-two";
import HeroSectionTwo from "@/components/hero-section-two";
import { InfiniteSliderHoverSpeed } from "@/components/infinite-slider";
// import { InfiniteSliderHoverSpeedTwo } from "@/components/infinite-slider-two";
import PricingTwo from "@/components/pricing-two";
import Video from "@/components/video";

export default function Home() {
  return (
    <main className="flex flex-col h-100vh">
      <HeroSectionTwo />
      <Features />
      <BentoTwo />
      <Video />
      <InfiniteSliderHoverSpeed />
      {/* <InfiniteSliderHoverSpeedTwo /> */}
      <PricingTwo />
      <Faq />
      <Cta />
      <FooterTwo />
    </main>
  );
}
