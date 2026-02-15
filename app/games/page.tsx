'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const games = [
    {
        title: "ORBITALS",
        image: "/clients/Orbitals Environment 2.png",
        description: "Step into a lovingly crafted retro anime world as explorers Maki and Omura brave the deadly Storm Wall and the perils beyond, all to save their home. In this 2-player co-op puzzle adventure, only brains, heart and unyielding resolve will open the path forward."
    },
    {
        title: "ONTOS",
        image: "/clients/Machine.png",
        description: "A sci-fi mystery set on the repurposed moon hotel Samsara. Uncover cryptic experiments, face unsettling encounters, and piece together a mind-bending narrative. The deeper you go, the more the truth unravels as you confront the ultimate question: What is reality?"
    },
    {
        title: "TANKRAT",
        image: "/clients/TankHead 2025-11-16 21-26-46_666.png",
        description: "A dying world, flesh given way to steel. Swarms of corrupted mech-monsters roam a desolate land. Search and destroy, scavenge and dismantle, rebuild yourself from the wreckage. What you take becomes what you are. Survive the wasteland. Make it to Highpoint."
    },
    {
        title: "CLAIR OBSCUR",
        image: "/clients/expedition33-screenshots-01.jpg",
        description: "Lead the members of Expedition 33 on their quest to destroy the Paintress so that she can never paint death again. Explore a world of wonders inspired by Belle Époque France and battle unique enemies in this turn-based RPG with real-time mechanics."
    }
];

export default function GamesPage() {
    return (
        <div className="min-h-screen pt-40 pb-24 px-2 md:px-6">
            <div className="w-full mx-auto px-[12vw]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 md:gap-x-6 gap-y-20 md:gap-y-32">
                    {games.map((game, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col gap-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-white text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase opacity-80">
                                {game.title}
                            </h2>
                            <div className="relative aspect-[16/9] w-full overflow-hidden group bg-white/5">
                                <Image
                                    src={game.image}
                                    alt={game.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                />
                                {/* Subtle overlay on hover */}
                                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-500" />
                            </div>
                            <p className="text-white text-sm md:text-[15px] leading-relaxed font-medium max-w-xl">
                                {game.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
