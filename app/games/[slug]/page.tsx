"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "../../animations/Header";
import Link from "next/link";


interface GameData {
    title: string;
    image?: string;
    description: string;
    developedBy?: string;
    followOn?: Array<{ label: string; url: string }>;
    wishlistOn?: Array<{ label: string; url: string }>;
    availableOn?: Array<{ label: string; url: string }>;
    screenshots?: string[];
    video?: string;
    sub?: string;
}

// Temporary data store since we don't have the json file yet
// This mirrors the structure in games/page.tsx but adds extra fields for the detail view
const gamesData: GameData[] = [
    {
        title: "ORBITALS",
        sub: "ORBITALS",
        image: "/clients/Orbitals Environment 2.png",
        description: "Step into a lovingly crafted retro anime world as explorers Maki and Omura brave the deadly Storm Wall and the perils beyond, all to save their home. In this 2-player co-op puzzle adventure, only brains, heart and unyielding resolve will open the path forward.",
        developedBy: "Gattabara Games",
        wishlistOn: [{ label: "Steam", url: "#" }],
        followOn: [{ label: "Twitter", url: "#" }],
        screenshots: ["/clients/Orbitals Environment 2.png"]
    },
    {
        title: "ONTOS",
        sub: "ONTOS",
        image: "/clients/Machine.png",
        description: "A sci-fi mystery set on the repurposed moon hotel Samsara. Uncover cryptic experiments, face unsettling encounters, and piece together a mind-bending narrative. The deeper you go, the more the truth unravels as you confront the ultimate question: What is reality?",
        developedBy: "Gattabara Games",
        wishlistOn: [{ label: "Steam", url: "#" }],
        followOn: [{ label: "Twitter", url: "#" }],
        screenshots: ["/clients/Machine.png"]
    },
    {
        title: "TANKRAT",
        sub: "TANKRAT",
        image: "/clients/TankHead 2025-11-16 21-26-46_666.png",
        description: "A dying world, flesh given way to steel. Swarms of corrupted mech-monsters roam a desolate land. Search and destroy, scavenge and dismantle, rebuild yourself from the wreckage. What you take becomes what you are. Survive the wasteland. Make it to Highpoint.",
        developedBy: "Gattabara Games",
        wishlistOn: [{ label: "Steam", url: "#" }],
        followOn: [{ label: "Twitter", url: "#" }],
        screenshots: ["/clients/TankHead 2025-11-16 21-26-46_666.png"]
    },
    {
        title: "CLAIR OBSCUR",
        sub: "CLAIR OBSCUR",
        image: "/clients/expedition33-screenshots-01.jpg",
        description: "Lead the members of Expedition 33 on their quest to destroy the Paintress so that she can never paint death again. Explore a world of wonders inspired by Belle Époque France and battle unique enemies in this turn-based RPG with real-time mechanics.",
        developedBy: "Sandfall Interactive",
        wishlistOn: [{ label: "Steam", url: "#" }],
        followOn: [{ label: "Twitter", url: "#" }],
        screenshots: ["/clients/expedition33-screenshots-01.jpg"]
    }
];

export default function GameDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [game, setGame] = useState<GameData | null>(null);
    const [allGames, setAllGames] = useState<GameData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating fetch from local data
        const loadGame = () => {
            setAllGames(gamesData);

            // Find the item by converting title to slug format
            const foundItem = gamesData.find((g: GameData) =>
                g.title.toLowerCase().replace(/\s+/g, '-') === slug
            );

            if (foundItem) {
                setGame(foundItem);
            }
            setLoading(false);
        };

        loadGame();
    }, [slug]);

    if (loading) {
        return (
            <div className="relative w-full min-h-screen bg-black text-white">
                <div className="fixed top-0 left-0 w-full z-50">
                    <Header />
                </div>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="relative w-full min-h-screen bg-black text-white">
                <div className="fixed top-0 left-0 w-full z-50">
                    <Header />
                </div>
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <p className="text-white text-xl">Game not found</p>
                    <Link href="/games" className="text-white underline">Back to Games</Link>
                </div>
            </div>
        );
    }

    // Filter out current game from "Other Games"
    const otherGames = allGames.filter(g => g.title !== game.title);

    return (
        <div
            className="relative w-full min-h-screen text-white"
            style={{ "--selection-bg": "#ffffff", "--selection-text": "#000000" } as React.CSSProperties}
        >
            <main className="pt-32 pb-20">
                {/* Hero Video/Image Section - 80vh with 12vw margins like gg-productions */}
                <section className="relative w-full px-[12vw]">
                    <div className="relative h-[60vh] md:h-[80vh] overflow-hidden border border-white/10 rounded-sm">
                        {game.video ? (
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                            >
                                <source src={game.video} type="video/mp4" />
                            </video>
                        ) : game.image ? (
                            <img
                                src={game.image}
                                alt={game.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                            />
                        ) : null}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                        {/* Game Title - Centered */}
                        <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                            <motion.h1
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-center"
                                style={{ fontFamily: "var(--font-bebas)" }}
                            >
                                {game.title}
                            </motion.h1>
                        </div>
                    </div>
                </section>

                <div className="w-full">
                    {/* Synopsis Section */}
                    <section className="px-[12vw] py-20 w-full">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-8 text-[10px] tracking-[0.2em]">Synopsis</h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-3xl leading-relaxed text-white font-semibold"
                        >
                            {game.description}
                        </motion.p>
                    </section>

                    {/* Game Details Section */}
                    <section className="px-[12vw] py-16 w-full border-t border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Developed By */}
                            {game.developedBy && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 text-[10px] tracking-[0.2em]">Developed By</h3>
                                    <p className="text-white font-bold text-lg">{game.developedBy}</p>
                                </div>
                            )}

                            {/* Follow On */}
                            {game.followOn && game.followOn.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 text-[10px] tracking-[0.2em]">Follow On</h3>
                                    <div className="flex flex-col gap-2">
                                        {game.followOn.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white hover:text-gray-300 transition-colors font-bold flex items-center gap-2"
                                            >
                                                {link.label} <span className="text-[10px]">↗</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Wishlist On */}
                            {game.wishlistOn && game.wishlistOn.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 text-[10px] tracking-[0.2em]">Wishlist On</h3>
                                    <div className="flex flex-col gap-2">
                                        {game.wishlistOn.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white hover:text-gray-300 transition-colors font-bold flex items-center gap-2"
                                            >
                                                {link.label} <span className="text-[10px]">↗</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Available On */}
                            {game.availableOn && game.availableOn.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 text-[10px] tracking-[0.2em]">Available On</h3>
                                    <div className="flex flex-col gap-2">
                                        {game.availableOn.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white hover:text-gray-300 transition-colors font-bold flex items-center gap-2"
                                            >
                                                {link.label} <span className="text-[10px]">↗</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Screenshots Section */}
                    {game.screenshots && game.screenshots.length > 0 && (
                        <section className="py-20 border-t border-white/10">
                            <div className="px-[12vw] w-full mb-10">
                                <h2 className="text-sm font-bold text-gray-500 uppercase text-[10px] tracking-[0.2em]">Screenshots showcase</h2>
                            </div>
                            <div className="overflow-x-auto scrollbar-hide">
                                <div className="flex gap-6 px-[12vw] pb-8 w-max">
                                    {game.screenshots.map((screenshot, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-shrink-0 w-[80vw] md:w-[600px] aspect-video overflow-hidden border border-white/10 bg-white/5"
                                        >
                                            <img
                                                src={screenshot}
                                                alt={`Screenshot ${idx + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Other Games Section */}
                    {otherGames.length > 0 && (
                        <section className="px-[12vw] py-32 w-full border-t border-white/10">
                            <h2 className="text-sm font-bold text-gray-400 uppercase mb-16 text-[10px] tracking-[0.2em]">Other Games</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {otherGames.map((otherGame, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/games/${otherGame.title.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="group flex flex-col gap-4"
                                    >
                                        <div className="relative aspect-video overflow-hidden border border-white/10 bg-white/5">
                                            {otherGame.image && (
                                                <img
                                                    src={otherGame.image}
                                                    alt={otherGame.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold uppercase tracking-widest text-white mb-2 group-hover:text-gray-300 transition-colors">
                                                {otherGame.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
                                                {otherGame.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
