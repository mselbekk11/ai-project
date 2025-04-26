import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Open_Sans } from "next/font/google"; // Import Open Sans
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClerkUserSync from "@/components/ConvexClerkUserSync";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";

const openSans = Open_Sans({
  // Initialize Open Sans
  variable: "--font-open-sans",
  subsets: ["latin"],
});

// Metadata for SEO
export const metadata: Metadata = {
  metadataBase: new URL("https://trizzy.ai"),
  title: "Trizzy",
  description: "Try on clothes before you buy, using AI",
  openGraph: {
    type: "website",
    title: "Trizzy",
    description: "Try on clothes before you buy, using AI",
    images: "/og-image.png",
    url: "https://trizzy.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trizzy",
    description: "Try on clothes before you buy, using AI",
    images: "/og-image-twitter.png",
  },
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
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            {children}
            <Toaster />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
