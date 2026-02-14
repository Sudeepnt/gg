import type { Metadata } from "next";
import { Libre_Baskerville, Montserrat, Bebas_Neue } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ATit Capital",
  description: "ATit Capital operates at the intersection of people, capital, and land in India.",
  icons: {
    icon: "/logos/logo1white.png",
    apple: "/logos/logo1white.png",
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
      <body className={`${libreBaskerville.variable} ${montserrat.variable} ${bebasNeue.variable} font-sans antialiased`}>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
