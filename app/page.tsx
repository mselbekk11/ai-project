"use client";

import Features from "@/components/features-1";
import HeroSectionTwo from "@/components/hero-section-two";

export default function Home() {
  return (
    <main className="flex flex-col h-100vh">
      <HeroSectionTwo />
      <Features />
    </main>
  );
}
