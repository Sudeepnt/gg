import type { Metadata, Viewport } from "next";
import "./globals.css";
import Consent from "./Consent";
import { getRuntimeContent } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gattabaragames.com"),
  title: "Gattabara Games — We summon worlds that eat reality",
  description:
    "Gattabara Games is a video game company and creative studio in Bengaluru, India. Original IP, co-owned IP and production services through GG Productions.",
  icons: { icon: "/logos/logo1black.png", apple: "/logos/logo1black.png" },
  alternates: { types: { "text/plain": [{ url: "/llms.txt", title: "llms.txt" }] } },
  openGraph: {
    type: "website",
    title: "Gattabara Games",
    description: "We summon worlds that eat reality. Original IP, co-owned IP and GG Productions, from Bengaluru.",
    images: ["/logos/logo1black.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getRuntimeContent();
  return (
    <html lang="en">
      <head>
        {/* the headline font and the body font start loading with the HTML */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/BarlowCondensed-800-latin.woff2" crossOrigin="" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/AnkaCoder-Regular.woff2" crossOrigin="" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/Barlow-500-latin.woff2" crossOrigin="" />
      </head>
      <body>
        {children}
        <Consent text={content.cookieBanner} />
      </body>
    </html>
  );
}
