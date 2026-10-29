import type { Metadata, Viewport } from "next";
import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=DotGothic16&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
