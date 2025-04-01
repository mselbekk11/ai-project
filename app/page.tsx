"use client";

// import ContentSection from "@/components/content-1";
// import ButtonsPage from "@/components/test";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
import HeroSectionTwo from "@/components/hero-section-two";

export default function Home() {
  return (
    <main className="flex flex-col h-100vh">
      <HeroSectionTwo />
      <Features />
      <FooterSection />
      {/* <ContentSection /> */}
    </main>
  );
}
