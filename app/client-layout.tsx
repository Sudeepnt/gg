"use client";

import SmoothScrollProvider from "./animations/SmoothScroll";
import CustomCursor from "./animations/CustomCursor";
import Starfield from "./animations/Starfield";
import Header from "./animations/Header";
import Footer from "./animations/Footer";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScrollProvider>
            <CustomCursor />
            <Starfield />
            <Header />
            <div className="relative z-10 w-full min-h-screen">
                {children}
            </div>
            <Footer />
        </SmoothScrollProvider>
    );
}