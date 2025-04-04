import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Open_Sans } from "next/font/google"; // Import Open Sans
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClerkUserSync from "@/components/ConvexClerkUserSync";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";

const openSans = Open_Sans({
  // Initialize Open Sans
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trizzy",
  description: "Try clothes before you buy, using AI ",
  // icons: {
  //   icon: "/convex.svg",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${openSans.variable} antialiased`}
      >
        <ClerkProvider dynamic>
          <ConvexClientProvider>
            <ConvexClerkUserSync />
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              // forcedTheme="dark"
            >
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              {children}
              <Toaster />
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
