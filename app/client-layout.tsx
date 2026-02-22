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

    useEffect(() => {
        // If we are on form page, mark as played immediately
        if (isFormPage) {
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
    }, []);

    useEffect(() => {
        if (isSplashVisible && !isFormPage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isSplashVisible, isFormPage]);

    const handleSplashComplete = () => {
        setIsSplashVisible(false);
        setHasPlayed(true);
        sessionStorage.setItem('splashPlayed', 'true');
    };

    return (
        <SmoothScrollProvider>
            {!hasPlayed && !isFormPage && (
                <SplashScreen onComplete={handleSplashComplete} />
            )}
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