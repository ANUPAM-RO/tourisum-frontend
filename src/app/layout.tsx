import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "India Tourism - Explore Incredible India",
    template: "%s | India Tourism",
  },
  description: "Discover the beauty of India. Explore tourist destinations, plan your trips, and create unforgettable memories across India.",
  keywords: ["India tourism", "travel", "tourist places", "incredible india", "destinations"],
  authors: [{ name: "India Tourism" }],
  openGraph: {
    title: "India Tourism - Explore Incredible India",
    description: "Discover the beauty of India. Explore tourist destinations, plan your trips.",
    type: "website",
    locale: "en_IN",
    siteName: "India Tourism",
  },
  twitter: {
    card: "summary_large_image",
    title: "India Tourism - Explore Incredible India",
    description: "Discover the beauty of India.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
