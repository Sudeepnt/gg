"use client";

import SmoothScrollProvider from "./animations/SmoothScroll";
import CustomCursor from "./animations/CustomCursor";
import Starfield from "./animations/Starfield";
import Header from "./animations/Header";
import Footer from "./animations/Footer";
import SplashScreen from "./animations/SplashScreen";

import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSplashVisible, setIsSplashVisible] = useState(true);

    const isFormPage = pathname === '/form';

    useEffect(() => {
        if (isSplashVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isSplashVisible]);

    return (
        <SmoothScrollProvider>
            {!isFormPage && <SplashScreen onComplete={() => setIsSplashVisible(false)} />}
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