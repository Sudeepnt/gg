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
    const [hasPlayed, setHasPlayed] = useState(false);

    const isFormPage = pathname === '/form';
    const isAdminPage = pathname?.startsWith('/admingg');

    useEffect(() => {
        // If we are on form page, mark as played immediately
        if (isFormPage || isAdminPage) {
            sessionStorage.setItem('splashPlayed', 'true');
            setHasPlayed(true);
            setIsSplashVisible(false);
        }

        // Check if splash has already played in this session
        const played = sessionStorage.getItem('splashPlayed');
        if (played) {
            setIsSplashVisible(false);
            setHasPlayed(true);
        }
    }, [isFormPage, isAdminPage]);

    useEffect(() => {
        if (isSplashVisible && !isFormPage && !isAdminPage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isSplashVisible, isFormPage, isAdminPage]);

    const handleSplashComplete = () => {
        setIsSplashVisible(false);
        setHasPlayed(true);
        sessionStorage.setItem('splashPlayed', 'true');
    };

    return (
        <SmoothScrollProvider>
            {!hasPlayed && !isFormPage && !isAdminPage && (
                <SplashScreen onComplete={handleSplashComplete} />
            )}
            {!isFormPage && !isAdminPage && <CustomCursor />}
            {!isFormPage && !isAdminPage && <Starfield />}
            {!isAdminPage && !isFormPage && <Header />}
            <div className={`relative z-10 w-full min-h-screen ${isFormPage ? 'bg-white' : ''}`}>
                {children}
            </div>
            {!isAdminPage && !isFormPage && <Footer />}
        </SmoothScrollProvider>
    );
}