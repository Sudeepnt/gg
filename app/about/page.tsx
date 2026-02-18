"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start px-[6vw] md:px-[12vw] pt-20 md:pt-32 pb-20">
            <div className="w-full text-left">
                {/* HERO MANIFESTO */}
                <section className="max-w-6xl">
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0, x: -50 },
                            show: {
                                opacity: 1,
                                x: 0,
                                transition: {
                                    staggerChildren: 0.15,
                                    duration: 0.8,
                                    ease: [0.16, 1, 0.3, 1]
                                }
                            }
                        }}
                        className="flex flex-col"
                    >
                        {[
                            "At Gattabara Games, craft is not decoration, it is the foundation.",
                            "We prototype fast, test honestly, and refine relentlessly until the experience feels inevitable.",
                            "We don’t separate dreamers from builders because authorship creates accountability.",
                            "Every mechanic must justify itself. Every frame must carry weight.",
                            "We build original games with distinctive design and disciplined production, games remembered not for noise, but for depth."
                        ].map((point, index) => (
                            <motion.p
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, x: -50 },
                                    show: { opacity: 1, x: 0 }
                                }}
                                className="text-white text-xl md:text-[27px] font-bold leading-[1.4] tracking-tight mb-8 md:mb-12 max-w-5xl"
                            >
                                {point}
                            </motion.p>
                        ))}
                    </motion.div>
                </section>
            </div>
        </div>
    );
}
