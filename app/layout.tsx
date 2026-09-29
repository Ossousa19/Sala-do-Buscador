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

export const metadata: Metadata = {
  title: site.meta.title,
  description: site.meta.description,
  openGraph: { title: site.meta.title, description: site.meta.description, images: [site.meta.ogImage], locale: "pt_BR", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${gambetta.variable} ${inter.variable}`}>
      <body><SmoothScroll>{children}</SmoothScroll></body>
    </html>
  );
}
