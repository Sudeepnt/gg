"use client";

import SmoothScrollProvider from "./animations/SmoothScroll";
import CustomCursor from "./animations/CustomCursor";
import Starfield from "./animations/Starfield";
import Header from "./animations/Header";
import Footer from "./animations/Footer";

import { usePathname } from 'next/navigation';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isFormPage = pathname === '/form';

    return (
        <SmoothScrollProvider>
            {!isFormPage && <CustomCursor />}
            {!isFormPage && <Starfield />}
            {!isFormPage && <Header />}
            <div className={`relative z-10 w-full min-h-screen ${isFormPage ? 'bg-white' : ''}`}>
                {children}
            </div>
            {!isFormPage && <Footer />}
        </SmoothScrollProvider>
    );
}