"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getCMSData } from "../actions/cmsActions";
import ComingSoonLiquid from '../animations/ComingSoonLiquid';

export default function GamesPage() {
    const [games, setGames] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const cmsData = await getCMSData();
                if (cmsData && cmsData.projects) {
                    setGames(cmsData.projects);
                }
            } catch (error) {
                console.error("Failed to fetch CMS data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (isLoading) return null;

    if (games.length === 0) {
        return <ComingSoonLiquid />;
    }

    return (
        <div className="min-h-screen pt-[13vh] md:pt-32 pb-24">
            <div className="w-full px-[6vw] md:px-[12vw]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-10 md:gap-y-32">
                    {games.map((game, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col gap-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link href={`/games/${game.title.toLowerCase().replace(/\s+/g, '-')}`} className="block group cursor-pointer">
                                <h2 className="text-white text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase opacity-80 mb-6">
                                    {game.title}
                                </h2>
                                <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/5 mb-3 md:mb-6">
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
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}