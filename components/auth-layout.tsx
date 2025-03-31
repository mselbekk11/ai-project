import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-shapes-pattern w-full">
      {children}
    </div>
  );
}
