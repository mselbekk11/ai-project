"use client";
import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navigation from "./navigation";

export default function HeroSectionThree() {
  const [menuState, setMenuState] = React.useState(false);

  return (
    <>
      <main className="overflow-hidden">
        <section className="relative bg-white border-b-2 border-b-gray-300 dark:border-gray-800">
          <div className="relative py-24 lg:pt-48 lg:pb-48 bgpink">
            <div className="mx-auto max-w-7xl px-6 md:px-12">
              <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
                <div className="mt-8 flex items-center gap-4 justify-center">
                  <Button size="lg" variant="default">
                    <Link href="#">Start Building</Link>
                  </Button>
                  <Button size="lg" variant="outline">
                    <Link href="#">Watch Demo</Link>
                  </Button>

                </div>
              </div>
              
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
