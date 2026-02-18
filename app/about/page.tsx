"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start px-[6vw] md:px-[12vw] pt-[13vh] md:pt-32 pb-20">
            {/* HERO MANIFESTO */}
            <section className="max-w-6xl mx-auto flex flex-col items-center">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.8,
                                ease: [0.16, 1, 0.3, 1]
                            }
                        }
                    }}
                    className="flex flex-col items-center text-center"
                >
                    <Quote className="text-white w-6 h-6 md:w-9 h-9 mb-8 md:mb-12 opacity-60" fill="currentColor" />

                    <p className="text-white text-xl md:text-[27px] font-bold leading-[1.6] tracking-tight max-w-5xl mb-6 md:mb-8">
                        At Gattabara Games, craft is not decoration, it is the foundation.
                        We prototype fast, test honestly, and refine relentlessly until the experience feels inevitable.
                        We don’t separate dreamers from builders because authorship creates accountability.
                        Every mechanic must justify itself. Every frame must carry weight.
                        We build original games with distinctive design and disciplined production, games remembered not for noise, but for depth.
                    </p>

                    <span className="text-white text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase opacity-40">
                        Gattabara Games
                    </span>
                </motion.div>
            </section>
        </div>
    );
}
