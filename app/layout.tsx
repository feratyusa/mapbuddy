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
    default: "SIMFAS JOKER - Manajemen Fasilitas Keselamatan Jalan",
    template: "%s | SIMFAS JOKER"
  },
  description: "Sistem Informasi Manajemen Fasilitas Keselamatan Jalan wilayah Jombang dan Mojokerto. Platform digital untuk pemetaan dan pengelolaan fasilitas keselamatan jalan.",
  keywords: [
    "SIMFAS JOKER",
    "Fasilitas Keselamatan Jalan",
    "Jombang",
    "Mojokerto",
    "Manajemen Fasilitas",
    "Web GIS",
    "Peta Keselamatan",
    "Sistem Informasi Geografis",
    "Lalu Lintas"
  ],
  authors: [{ name: "SIMFAS JOKER Dev" }],
  creator: "SIMFAS JOKER",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://simfas-joker.site",
    title: "SIMFAS JOKER ",
    description: "Sistem Informasi Manajemen Fasilitas Keselamatan Jalan wilayah Jombang dan Mojokerto. Platform digital untuk pemetaan dan pengelolaan fasilitas keselamatan jalan.",
    siteName: "SIMFAS JOKER",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIMFAS JOKER ",
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
