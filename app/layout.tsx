import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

const gambetta = localFont({
  src: [
    { path: "./fonts/Gambetta-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Gambetta-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-gambetta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Open Graph URLs need the real origin: NEXT_PUBLIC_SITE_URL, else Vercel's production domain.
// Left undefined otherwise (Next then falls back to localhost in dev only).
function siteUrl(): URL | undefined {
  if (process.env.NEXT_PUBLIC_SITE_URL) return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  return undefined;
}

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: site.meta.title,
  description: site.meta.description,
  openGraph: { title: site.meta.title, description: site.meta.description, images: [{ url: site.meta.ogImage, width: 1200, height: 630, alt: site.meta.title }], locale: "pt_BR", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${gambetta.variable} ${inter.variable}`}>
      <body><SmoothScroll>{children}</SmoothScroll></body>
    </html>
  );
}
