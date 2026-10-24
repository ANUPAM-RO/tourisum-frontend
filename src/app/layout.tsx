import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { DEFAULT_SETTINGS, withDefaults } from "@/lib/siteSettings";
import type { SiteSettings } from "@/types";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

async function loadSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return DEFAULT_SETTINGS;
    return withDefaults((await res.json()).data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteName, tagline, description } = await loadSettings();
  const title = `${siteName} - ${tagline}`;
  return {
    title: { default: title, template: `%s | ${siteName}` },
    description,
    keywords: [siteName, 'India tourism', 'travel', 'tourist places', 'incredible india', 'destinations'],
    authors: [{ name: siteName }],
    openGraph: { title, description, type: 'website', locale: 'en_IN', siteName },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
