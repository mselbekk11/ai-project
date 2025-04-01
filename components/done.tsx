"use client";

import Lottie, { LottieRefCurrentProps } from "lottie-react";
import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import doneAnimation from "../assets/done.json";

// Define types for the exposed methods
export type DoneRef = {
  playOnce: () => void;
};

const Done = forwardRef<
  DoneRef,
  {
    mode?: "once" | "loop" | "hover" | "click" | "morph" | "morph-click";
    size?: string;
    className?: string;
    autoplay?: boolean;
  }
>(
  (
    { mode = "once", size = "w-9 h-9", className = "", autoplay = true },
    ref,
  ) => {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [direction, setDirection] = useState<1 | -1>(1);

    // Play once when component mounts if mode is "once" and autoplay is true
    useEffect(() => {
      if (mode === "once" && autoplay && lottieRef.current) {
        lottieRef.current.setDirection(1);
        lottieRef.current.play();
      }
    }, [mode, autoplay]);

    // Play the animation once programmatically
    const playOnce = () => {
      if (lottieRef.current) {
        lottieRef.current.goToAndStop(0, true);
        lottieRef.current.setDirection(1);
        lottieRef.current.play();
      }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      playOnce,
    }));

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
      if (mode === "click" || mode === "once") {
        if (lottieRef.current) {
          // For "once" mode, ensure we always start from the beginning
          if (mode === "once") {
            lottieRef.current.goToAndStop(0, true);
          }
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
          animationData={doneAnimation}
          loop={mode === "loop"}
          autoplay={mode === "loop"}
        />
      </div>
    );
  },
);

// Add display name for better debugging
Done.displayName = "Done";

export default Done;
