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
                // Wait longer to let the user soak in the full layout
                gsap.delayedCall(3.5, exitPreloader);
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

        // Slow down the reversal significantly for a heavy, deliberate exit (0.5 speed)
        timelineRef.current.timeScale(0.5).reverse();

        // Final smooth dissolve after the reverse animation has completed most of its work
        gsap.delayedCall(4, () => {
            gsap.to(preloaderRef.current, {
                opacity: 0,
                duration: 2.5, // Ultra slow, premium fade out
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
            `}</style>

            <AnimatePresence>
                {isVisible && (
                    <div
                        ref={preloaderRef}
                        className="fixed inset-0 z-[99999] bg-[#111] flex items-center justify-center p-[--preloader-gutter] font-['Oswald',sans-serif] overflow-hidden"
                    >
                        <div
                            ref={preloaderMainRef}
                            className="flex flex-col md:flex-row items-center justify-center gap-[max(1rem,10px)] md:gap-[max(2rem,20px)]"
                        >
                            <h1
                                ref={studioWordRef}
                                className="m-0 text-[max(2.4rem,24px)] md:text-[max(3.6rem,32px)] font-semibold tracking-[-0.05em] whitespace-nowrap leading-none text-white order-1 md:order-none opacity-0"
                            >
                                {word1}
                            </h1>

                            <div
                                ref={ctaWrapRef}
                                className="overflow-hidden w-0 opacity-0 flex items-center justify-center order-3 md:order-none"
                            >
                                <div
                                    ref={ctaTextRef}
                                    className="whitespace-nowrap flex items-center justify-center px-4 py-2 border-l border-r border-white/10 mt-[0.2em] md:mt-[0.3em]"
                                >
                                    <p className="text-white text-[9px] md:text-[11px] tracking-[0.4em] font-bold text-center leading-none opacity-80">
                                        We Summon The World That Eats Reality
                                    </p>
                                </div>
                            </div>

                            <h1
                                ref={lumioWordRef}
                                className="m-0 text-[max(2.4rem,24px)] md:text-[max(3.6rem,32px)] font-semibold tracking-[-0.05em] whitespace-nowrap leading-none text-white order-2 md:order-none opacity-0"
                            >
                                {word2}
                            </h1>
                        </div>

                        <p
                            ref={preloaderTextRef}
                            className="absolute left-1/2 bottom-[calc(var(--preloader-gutter)+max(12vh,60px))] -translate-x-1/2 w-full max-w-[35ch] text-[max(10px,1rem)] font-semibold leading-[1.2] text-center tracking-[-0.02em] text-white opacity-0 pointer-events-none"
                        >
                            DESIGN AND DEVELOPMENT IN HARMONY —
                            DIGITAL EXPERIENCES CRAFTED WITH EMOTION,
                            INTENTION, AND PRECISION.
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
