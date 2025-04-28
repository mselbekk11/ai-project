"use client";

import BentoTwo from "@/components/bento-two";
import { Cta } from "@/components/cta";
import { Faq } from "@/components/FAQ";
import Features from "@/components/features-1";
import { FooterTwo } from "@/components/footer-two";
// import HeroGrid from "@/components/hero-grid";
import HeroSectionTwo from "@/components/hero-section-two";
import { InfiniteSliderHoverSpeed } from "@/components/infinite-slider";
// import InfiniteSliderMasonry from "@/components/infinite-slider-masonry";
import Masonry from "@/components/masonry";
// import { InfiniteSliderHoverSpeedTwo } from "@/components/infinite-slider-two";
import PricingTwo from "@/components/pricing-two";
import Video from "@/components/video";

export default function Home() {
  return (
    <main className="flex flex-col h-100vh">
      <HeroSectionTwo />
      {/* <InfiniteSliderMasonry /> */}
      <Masonry />
      <Features />
      {/* <BentoTwo /> */}
      <Video />
      <InfiniteSliderHoverSpeed />
      <PricingTwo />
      <Faq />
      <Cta />
      <FooterTwo />
    </main>
  );
}
