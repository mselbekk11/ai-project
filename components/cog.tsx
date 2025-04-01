"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef, useState } from "react";
import cogAnimation from "../assets/cog-two.json";

export default function Cog({
  mode = "loop",
  size = "w-9 h-9",
  className = "",
}: {
  mode?: "loop" | "hover" | "click" | "morph" | "morph-click";
  size?: string;
  className?: string;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const handleMouseEnter = () => {
    if (mode === "hover" || mode === "morph") {
      if (lottieRef.current) {
        lottieRef.current.setDirection(1);
        lottieRef.current.play();
      }
    }
  };

  const handleMouseLeave = () => {
    if (mode === "hover") {
      if (lottieRef.current) {
        lottieRef.current.stop();
      }
    } else if (mode === "morph") {
      if (lottieRef.current) {
        lottieRef.current.setDirection(-1);
        lottieRef.current.play();
      }
    }
  };

  const handleClick = () => {
    if (mode === "click") {
      if (lottieRef.current) {
        lottieRef.current.setDirection(1);
        lottieRef.current.play();
      }
    } else if (mode === "morph-click") {
      if (lottieRef.current) {
        const newDirection = direction === 1 ? -1 : 1;
        lottieRef.current.setDirection(newDirection);
        lottieRef.current.play();
        setDirection(newDirection as 1 | -1);
      }
    }
  };

  return (
    <div
      className={`${size} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={cogAnimation}
        loop={mode === "loop"}
        autoplay={mode === "loop"}
      />
    </div>
  );
}
