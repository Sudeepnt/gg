"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ClientProject {
    name: string;
    image: string;
}

const CLIENTS: ClientProject[] = [
    { name: "The Machine", image: "/clients/Machine.png" },
    { name: "Orbitals Environment", image: "/clients/Orbitals Environment 2.png" },
    { name: "TankHead", image: "/clients/TankHead 2025-11-16 21-26-46_666.png" },
    { name: "Kitchen Concept", image: "/clients/copie-de-kitchen_1920x1080.png" },
    { name: "Expedition 33", image: "/clients/expedition33-screenshots-01.jpg" },
    { name: "Flintlock", image: "/clients/flintlock_gamescom22-screenshot_select_028.png" }
];

export default function ClientCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % CLIENTS.length);
        }, 3000); // Change every 3 seconds
        return () => clearInterval(timer);
    }, []);

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
                            <img
                                src={CLIENTS[index].image}
                                alt={CLIENTS[index].name}
                                className="w-full h-full object-cover opacity-80"
                            />
                            {/* Dark overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                        </div>

                        {/* Client Name */}
                        <div className="relative z-10 text-center px-4">
                            <h3 className="text-xs font-bold tracking-wide text-white uppercase">
                                {CLIENTS[index].name}
                            </h3>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

