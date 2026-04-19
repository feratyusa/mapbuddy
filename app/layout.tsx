import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SIMFAST JOKER - Manajemen Fasilitas Keselamatan Jalan",
    template: "%s | SIMFAST JOKER"
  },
  description: "Sistem Informasi Manajemen Fasilitas Keselamatan Jalan wilayah Jombang dan Mojokerto. Platform digital untuk pemetaan dan pengelolaan fasilitas keselamatan jalan.",
  keywords: [
    "SIMFAST JOKER",
    "Fasilitas Keselamatan Jalan",
    "Jombang",
    "Mojokerto",
    "Manajemen Fasilitas",
    "Web GIS",
    "Peta Keselamatan",
    "Sistem Informasi Geografis",
    "Lalu Lintas"
  ],
  authors: [{ name: "SIMFAST JOKER Dev" }],
  creator: "SIMFAST JOKER",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://simfast-joker.site",
    title: "SIMFAST JOKER ",
    description: "Sistem Informasi Manajemen Fasilitas Keselamatan Jalan wilayah Jombang dan Mojokerto. Platform digital untuk pemetaan dan pengelolaan fasilitas keselamatan jalan.",
    siteName: "SIMFAST JOKER",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIMFAST JOKER ",
    description: "Sistem Informasi Manajemen Fasilitas Keselamatan Jalan wilayah Jombang dan Mojokerto. Platform digital untuk pemetaan dan pengelolaan fasilitas keselamatan jalan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
