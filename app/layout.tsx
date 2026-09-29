import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

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
  title: "A Sala dos Buscadores",
  description: "Um portal que organiza tradições religiosas, espirituais e filosóficas em Salas comparáveis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${gambetta.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
