import type { Metadata, Viewport } from "next";
import "./globals.css";
import Consent from "./Consent";
import { getRuntimeContent } from "@/lib/content";

/* the page title and descriptions are edited in the admin (Page title & 404 tab); the defaults are in src/content/site-content.json */
export async function generateMetadata(): Promise<Metadata> {
  const c = await getRuntimeContent();
  const S = (c.seo || {}) as Record<string, string>;
  const title = S.title || "Gattabara Games — We summon worlds that eat reality";
  const description = S.description || "Gattabara Games is a video game company and creative studio in Bengaluru, India.";
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://gattabaragames.com"),
    title,
    description,
    icons: { icon: "/logos/logo1black.png", apple: "/logos/logo1black.png" },
    alternates: { types: { "text/plain": [{ url: "/llms.txt", title: "llms.txt" }] } },
    openGraph: { type: "website", title: S.shareTitle || "Gattabara Games", description: S.shareDescription || description, images: ["/logos/logo1black.png"] },
  };
}

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
