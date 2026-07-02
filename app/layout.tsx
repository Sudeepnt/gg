import type { Metadata } from "next";
import { Montagu_Slab, Bai_Jamjuree, Bebas_Neue } from "next/font/google";
import "./globals.css";

const montaguSlab = Montagu_Slab({
  subsets: ["latin"],
  variable: "--font-montagu",
  display: "swap",
});

const baiJamjuree = Bai_Jamjuree({
  weight: ["200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-bai",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gattabara Games",
    template: "%s | Gattabara Games",
  },
  description: "Gattabara Games is a video game company and creative studio based in Bengaluru, India.",
  keywords: ["video games", "game studio", "creative studio", "Bengaluru", "India", "Gattabara Games", "indie games"],
  authors: [{ name: "Gattabara Games" }],
  creator: "Gattabara Games",
  publisher: "Gattabara Games",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.gattabaragames.com",
    siteName: "Gattabara Games",
    title: "Gattabara Games",
    description: "Gattabara Games is a video game company and creative studio based in Bengaluru, India.",
    images: [
      {
        url: "/logos/logo1black.png",
        width: 1200,
        height: 630,
        alt: "Gattabara Games Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gattabara Games",
    description: "Gattabara Games is a video game company and creative studio based in Bengaluru, India.",
    images: ["/logos/logo1black.png"],
  },
  icons: {
    icon: "/logos/logo1black.png",
    apple: "/logos/logo1black.png",
  },
};

import ClientLayout from "./client-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montaguSlab.variable} ${baiJamjuree.variable} ${bebasNeue.variable} font-sans antialiased`}>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
