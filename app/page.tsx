"use client";

// import ContentSection from "@/components/content-1";
// import ButtonsPage from "@/components/test";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
// import HeroSectionThree from "@/components/hero-section-three";
import HeroSectionTwo from "@/components/hero-section-two";
import { InfiniteSliderHoverSpeed } from "@/components/infinite-slider";

export default function Home() {
  return (
    <main className="flex flex-col h-100vh">
      <HeroSectionTwo />
      {/* <HeroSectionThree /> */}
      <Features />
      <InfiniteSliderHoverSpeed />
      <FooterSection />
      {/* <ContentSection /> */}
    </main>
  );
}
