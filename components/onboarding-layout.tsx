import React from "react";
// import { InfiniteSliderVertical } from "./InfiniteSliderVertical";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function OnboardingLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative bg-muted bg-purple-700 flex flex-col items-center justify-center">
        {/* <InfiniteSliderVertical /> */}
      </div>
      <div className="flex flex-col gap-4 p-6 bg-shapes-pattern">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
