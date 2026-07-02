"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getCMSData } from "../actions/cmsActions";

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [content, setContent] = useState({
        text: "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. For more information, please visit our",
        button: "Accept"
    });

    useEffect(() => {
        setMounted(true);

        const fetchContent = async () => {
            try {
                const cmsData = await getCMSData();
                if (cmsData && cmsData.home) {
                    setContent({
                        text: cmsData.home.cookieText || content.text,
                        button: cmsData.home.cookieButton || content.button
                    });
                }
            } catch (e) { }
        };
        fetchContent();

        // Check if user has already accepted cookies
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Show potential delay or immediately
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "true");
        setIsVisible(false);
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="fixed bottom-4 left-4 right-4 z-[9999] border border-white/10 bg-black/70 backdrop-blur-md p-3 md:p-4 flex flex-col gap-3 shadow-2xl"
                >
                    <p className="text-[10px] md:text-xs font-medium text-white/80 leading-relaxed text-left">
                        {content.text}{" "}
                        <Link href="/privacy-statement" className="text-white underline hover:text-white/80 transition-colors">
                            Privacy Statement
                        </Link>.
                    </p>

                    <button
                        onClick={handleAccept}
                        className="self-end border border-white/10 bg-white text-black hover:bg-white/90 px-6 py-2 text-[10px] md:text-xs font-bold tracking-wide transition-colors"
                    >
                        {content.button}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
