"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "../../animations/Header";
import Link from "next/link";


import { getCMSDataClient } from "../../lib/cmsClient";

export default function GameDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [game, setGame] = useState<any | null>(null);
    const [allGames, setAllGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGame = async () => {
            try {
                const data = await getCMSDataClient();
                const ipProjects = data.projects || [];
                const ggProjects = data.ggProductions?.projects || [];

                // Combine both lists for searching and for "Other Games"
                const combinedProjects = [...ipProjects, ...ggProjects];

                setAllGames(combinedProjects);

                const foundItem = combinedProjects.find((g: any) => {
                    if (!g.title) return false;
                    const gameSlug = g.title.toLowerCase().trim().replace(/\s+/g, '-');
                    return gameSlug === slug;
                });

                if (foundItem) {
                    setGame(foundItem);
                }
            } catch (error) {
                console.error("Failed to load game details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadGame();
    }, [slug]);

    // No explicit loading screen - we want navigation to feel instant

    if (!game) {
        if (loading) return (
            <div className="relative w-full min-h-screen bg-black">
                <div className="fixed top-0 left-0 w-full z-50">
                    <Header />
                </div>
            </div>
        );

        return (
            <div className="relative w-full min-h-screen bg-black text-white">
                <div className="fixed top-0 left-0 w-full z-50">
                    <Header />
                </div>
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <p className="text-white text-xl">Project not found</p>
                    <Link href="/games" className="text-white underline">Back to Portfolio</Link>
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
                <section className="relative w-full px-[6vw] md:px-[12vw]">
                    <div className="relative aspect-video w-full overflow-hidden border border-white/10 rounded-sm shadow-2xl bg-black">
                        {/* Centered Video/Image Container to ensure 16:9 content fit */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {game.video ? (
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover opacity-80"
                                >
                                    <source src={game.video} type="video/mp4" />
                                </video>
                            ) : game.image ? (
                                <img
                                    src={game.image}
                                    alt={game.title}
                                    className="w-full h-full object-cover opacity-80"
                                />
                            ) : null}
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    </div>

                    {/* Game Title - Outside under video */}
                    <div className="mt-8 md:mt-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-xl md:text-4xl font-bold uppercase tracking-tight text-left leading-[0.9]"
                            style={{ fontFamily: "var(--font-bai)" }}
                        >
                            {game.title}
                        </motion.h1>
                    </div>
                </section>

                <div className="w-full">
                    {/* Synopsis Section */}
                    <section className="px-[6vw] md:px-[12vw] py-20 w-full">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-8 text-[10px] tracking-[0.2em]">Synopsis</h3>
                        <motion.p
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-xl md:text-3xl leading-relaxed text-white font-semibold"
                        >
                            {game.description}
                        </motion.p>
                    </section>

                    {/* Game Details Section */}
                    <section className="px-[6vw] md:px-[12vw] py-16 w-full border-t border-white/10">
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
                                        {game.followOn?.filter((l: any) => l.url).map((link: any, idx: number) => (
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
                                        {game.wishlistOn?.filter((l: any) => l.url).map((link: any, idx: number) => (
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
                                        {game.availableOn?.filter((l: any) => l.url).map((link: any, idx: number) => (
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
                            <div className="px-[6vw] md:px-[12vw] w-full mb-10">
                                <h2 className="text-sm font-bold text-gray-500 uppercase text-[10px] tracking-[0.2em]">Screenshots showcase</h2>
                            </div>
                            <div className="overflow-x-auto scrollbar-hide">
                                <div className="flex gap-6 px-[6vw] md:px-[12vw] pb-8 w-max">
                                    {game.screenshots?.filter((s: any) => s).map((screenshot: any, idx: number) => (
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
                        <section className="px-[6vw] md:px-[12vw] py-32 w-full border-t border-white/10">
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
