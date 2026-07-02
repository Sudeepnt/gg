"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Project {
    title: string;
    image: string;
}

export default function ClientCarousel({ projects = [] }: { projects?: Project[] }) {
    const [index, setIndex] = useState(0);

    const items = projects.length > 0 ? projects.map(p => ({
        name: p.title,
        image: p.image
    })) : [
        { name: "The Machine", image: "/clients/Machine.png" },
        { name: "Orbitals Environment", image: "/clients/Orbitals Environment 2.png" },
        { name: "TankHead", image: "/clients/TankHead 2025-11-16 21-26-46_666.png" }
    ];

    useEffect(() => {
        if (items.length <= 1) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 3000); // Change every 3 seconds
        return () => clearInterval(timer);
    }, [items.length]);

    return (
        <div className="w-full h-full relative overflow-hidden text-white">
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={index}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 bg-black"
                >
                    <div
                        className="flex flex-col items-center justify-center w-full h-full relative"
                    >
                        {/* Client Image */}
                        <div className="absolute inset-0">
                            {items[index].image ? (
                                <img
                                    src={items[index].image}
                                    alt={items[index].name}
                                    className="w-full h-full object-cover opacity-80"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                    <span className="text-[10px] text-white/20 uppercase tracking-widest">No Image</span>
                                </div>
                            )}
                            {/* Dark overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                        </div>

                        {/* Client Name */}
                        <div className="relative z-10 text-center px-4">
                            <h3 className="text-xs font-bold tracking-wide text-white uppercase">
                                {items[index].name}
                            </h3>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

