"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import SplitType from "split-type";

interface SplashScreenProps {
    onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    // Refs for DOM elements
    const preloaderRef = useRef<HTMLDivElement>(null);
    const studioWordRef = useRef<HTMLHeadingElement>(null);
    const lumioWordRef = useRef<HTMLHeadingElement>(null);
    const ctaWrapRef = useRef<HTMLDivElement>(null);
    const ctaTextRef = useRef<HTMLDivElement>(null);
    const preloaderMainRef = useRef<HTMLDivElement>(null);
    const preloaderTextRef = useRef<HTMLParagraphElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    const word1 = "Gattabara";
    const word2 = "Games";

    useEffect(() => {
        if (!isVisible) return;

        // Ensure we are working with fresh refs
        if (!studioWordRef.current || !lumioWordRef.current) return;

        // Initialize SplitType
        const studioSplit = new SplitType(studioWordRef.current, {
            types: "chars",
            charClass: "char",
        });
        const lumioSplit = new SplitType(lumioWordRef.current, {
            types: "chars",
            charClass: "char",
        });
        const chars = [...(studioSplit.chars || []), ...(lumioSplit.chars || [])];

        // Initial setup - hide everything immediately via GSAP to prevent flicker
        // Note: The main h1 wrappers have opacity-0 in HTML to prevent flash,
        // but we need them at opacity 1 so characters inside can be seen.
        gsap.set([studioWordRef.current, lumioWordRef.current], { opacity: 1 });
        gsap.set(chars, { opacity: 0 });
        gsap.set(ctaTextRef.current, { opacity: 0, y: 20 });
        gsap.set(ctaWrapRef.current, { width: 0, opacity: 0 });
        gsap.set(preloaderTextRef.current, { opacity: 0 });

        // Build Timeline
        const tl = gsap.timeline({
            delay: 0.5,
            defaults: {
                duration: 1.35,
                ease: "power4.inOut",
            },
            onComplete: () => {
                // Reduced pause (3.5s -> 2s)
                gsap.delayedCall(2, exitPreloader);
            }
        });
        timelineRef.current = tl;

        // Flicker Animation for Characters
        chars.forEach((charEl) => {
            const charTimeline = gsap.timeline();
            const flickerCount = Math.floor(4 * Math.random()) + 3;
            const charOffset = 0.3 * Math.random();

            for (let i = 0; i < flickerCount; i++) {
                const randomOpacity = 0.6 * Math.random() + 0.1;
                const randomDuration = 0.12 * Math.random() + 0.04;
                charTimeline.to(charEl, {
                    opacity: randomOpacity,
                    duration: randomDuration,
                    ease: "none",
                });
            }

            charTimeline.to(charEl, {
                opacity: 1,
                duration: 0.15,
                ease: "power2.out",
            });

            tl.add(charTimeline, charOffset + 0.5);
        });

        // Main Sequence
        tl.set(preloaderRef.current, { pointerEvents: "auto" })
            .to(ctaWrapRef.current, {
                width: "auto",
                opacity: 1,
            }, ">")
            .from(preloaderMainRef.current, {
                gap: "1.5rem",
            }, "<")
            .to(preloaderTextRef.current, {
                opacity: 0.8,
            }, "<")
            .to(ctaTextRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, "<+0.2");

        return () => {
            if (tl) tl.kill();
            studioSplit.revert();
            lumioSplit.revert();
        };
    }, [isVisible]);

    const exitPreloader = () => {
        if (!timelineRef.current) {
            revealPage();
            return;
        }

        // Snappier reversal (0.8 speed)
        timelineRef.current.timeScale(0.8).reverse();

        // Final smooth dissolve (Reduced 4s -> 2.4s)
        gsap.delayedCall(2.4, () => {
            gsap.to(preloaderRef.current, {
                opacity: 0,
                duration: 1.5, // Faster fade
                ease: "power2.inOut",
                onComplete: revealPage,
            });
        });
    };

    const revealPage = () => {
        setIsVisible(false);
        if (onComplete) onComplete();
    };

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&display=swap');

                :root {
                    --preloader-black: #111111;
                    --preloader-white: #ffffff;
                    --preloader-accent: #e4ff4e;
                    --preloader-gutter: max(15px, 3rem);
                }

                .preloader-main h1 .char {
                    opacity: 0;
                    will-change: opacity;
                }

                .splash-heading {
                    font-family: 'NT Brick Sans', sans-serif !important;
                    font-weight: 400 !important;
                }
            `}</style>

            <AnimatePresence>
                {isVisible && (
                    <div
                        ref={preloaderRef}
                        className="fixed inset-0 z-[99999] bg-[#111] flex items-center justify-center p-[--preloader-gutter] font-['Oswald',sans-serif] overflow-hidden"
                    >
                        <div
                            ref={preloaderMainRef}
                            className="flex flex-col md:flex-row items-center justify-center gap-[max(1.5rem,15px)] md:gap-[max(2rem,20px)]"
                        >
                            <div className="flex flex-row items-center gap-[0.3em] md:contents">
                                <h1
                                    ref={studioWordRef}
                                    className="m-0 text-[max(1.8rem,18px)] md:text-[max(3.6rem,32px)] splash-heading whitespace-nowrap leading-none text-white opacity-0"
                                >
                                    {word1}
                                </h1>

                                <h1
                                    ref={lumioWordRef}
                                    className="m-0 text-[max(1.8rem,18px)] md:text-[max(3.6rem,32px)] splash-heading whitespace-nowrap leading-none text-white md:order-3 opacity-0"
                                >
                                    {word2}
                                </h1>
                            </div>

                            <div
                                ref={ctaWrapRef}
                                className="overflow-hidden w-0 opacity-0 flex items-center justify-center md:order-2"
                            >
                                <div
                                    ref={ctaTextRef}
                                    className="whitespace-nowrap flex items-center justify-center px-4 py-4 border border-white/10 mt-[0.2em] md:mt-[0.3em]"
                                >
                                    <p className="text-white text-[9px] md:text-[11px] tracking-[0.4em] font-bold text-center leading-none opacity-80">
                                        We Summon Worlds That Eat Reality
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
