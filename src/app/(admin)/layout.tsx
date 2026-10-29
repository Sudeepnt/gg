import type { Metadata } from "next";
import { Montagu_Slab, Bai_Jamjuree } from "next/font/google";
import "./admin.css";

const montaguSlab = Montagu_Slab({ subsets: ["latin"], variable: "--font-montagu", display: "swap" });
const baiJamjuree = Bai_Jamjuree({ weight: ["200", "300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-bai", display: "swap" });

export const metadata: Metadata = { title: "Admin · Gattabara Games", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montaguSlab.variable} ${baiJamjuree.variable} antialiased`}>{children}</body>
    </html>
  );
}
