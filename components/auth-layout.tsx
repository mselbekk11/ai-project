import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-svh lg:grid-cols-3">
      <div className="relative hidden bg-muted lg:block bg-purple-700 col-span-1"></div>
      <div className="flex flex-col gap-4 p-6 col-span-2 bg-shapes-pattern">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
