import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pribumargames.com"),
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [
    "top up game",
    "pribumar games",
    "top up mlbb murah",
    "diamond mlbb",
    "voucher game jonggol",
    "top up legal",
    "steam wallet murah",
    "free fire max",
  ],
  authors: [{ name: "Pribumar Games Owner" }],
  creator: "Pribumar Games",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://pribumargames.com",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: `${siteConfig.name} Mascot Logo`,
      },
    ],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`dark ${plusJakarta.variable} ${inter.variable}`}>
      <body className="bg-surface text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
