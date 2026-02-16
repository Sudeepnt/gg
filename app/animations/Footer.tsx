'use client';

import { useState, useRef } from 'react';
import { Play, ArrowUpRight, Instagram, Twitter, Linkedin, Mail, X, Volume2, Pause, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ClientCarousel from './ClientCarousel';

export default function Footer() {
    const pathname = usePathname();
    const isHome = pathname === '/';

    const [showVideo, setShowVideo] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            if (total > 0) {
                setProgress((current / total) * 100);
            }
        }
    };

    const SocialLinks = ({ className = "" }: { className?: string }) => {
        return (
            <div className={`flex gap-2 md:gap-3 ${className}`}>
                <a href="#" className={`flex-1 lg:flex-none aspect-square w-10 h-10 border flex items-center justify-center relative overflow-hidden transition-[background-size,color] duration-300 bg-no-repeat bg-right hover:bg-left 
                    border-white/10 text-white hover:text-black bg-gradient-to-r from-white to-white bg-[length:0%_100%] hover:bg-[length:100%_100%]`}>
                    <Instagram size={16} strokeWidth={1.5} className="relative z-10" />
                </a>
                <a href="#" className={`flex-1 lg:flex-none aspect-square w-10 h-10 border flex items-center justify-center relative overflow-hidden transition-[background-size,color] duration-300 bg-no-repeat bg-right hover:bg-left 
                    border-white/10 text-white hover:text-black bg-gradient-to-r from-white to-white bg-[length:0%_100%] hover:bg-[length:100%_100%]`}>
                    <Twitter size={16} strokeWidth={1.5} className="relative z-10" />
                </a>
                <a href="#" className={`flex-1 lg:flex-none aspect-square w-10 h-10 border flex items-center justify-center relative overflow-hidden transition-[background-size,color] duration-300 bg-no-repeat bg-right hover:bg-left 
                    border-white/10 text-white hover:text-black bg-gradient-to-r from-white to-white bg-[length:0%_100%] hover:bg-[length:100%_100%]`}>
                    <Linkedin size={16} strokeWidth={1.5} className="relative z-10" />
                </a>
                <a href="#" className={`flex-1 lg:flex-none aspect-square w-10 h-10 border flex items-center justify-center relative overflow-hidden transition-[background-size,color] duration-300 bg-no-repeat bg-right hover:bg-left 
                    border-white/10 text-white hover:text-black bg-gradient-to-r from-white to-white bg-[length:0%_100%] hover:bg-[length:100%_100%]`}>
                    <Mail size={16} strokeWidth={1.5} className="relative z-10" />
                </a>
            </div>
        );
    };

    return (
        <>
            <footer className="fixed bottom-0 left-0 w-full z-50 px-2 md:px-6 py-4 pointer-events-none">
                <div className="w-full max-w-[1800px] mx-auto pointer-events-auto">
                    {isHome ? (
                        <div className="grid grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                            {/* Card 1: Client Carousel - Half width on mobile */}
                            <div className="col-span-2 lg:col-span-1 border border-white/10 h-36 md:h-auto flex flex-col justify-between relative overflow-hidden order-1 group">
                                <ClientCarousel />
                                <div className="absolute bottom-2 right-3 z-20">
                                    <Link href="/games" className="relative overflow-hidden border border-white/10 transition-[background-size,color] duration-300 bg-no-repeat bg-right hover:bg-left bg-black text-white hover:text-black bg-gradient-to-r from-white to-white bg-[length:0%_100%] hover:bg-[length:100%_100%] px-3 py-1.5 flex items-center gap-2">
                                        <span className="relative z-10 text-[9px] md:text-[11px] font-bold tracking-widest leading-none">Games</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Card 2: Play Reel - Half width on mobile */}
                            <div
                                onClick={() => {
                                    setShowVideo(true);
                                    setIsPlaying(true);
                                }}
                                className="col-span-2 lg:col-span-1 bg-[#13343e] h-36 md:h-auto flex flex-col justify-between relative overflow-hidden order-2 cursor-pointer"
                            >
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                >
                                    <source src="/reel/26619-359604050_tiny.mp4" type="video/mp4" />
                                </video>
                                <div className="absolute bottom-2 right-3">
                                    <div className="relative overflow-hidden border border-white/10 transition-[background-size,color] duration-300 bg-no-repeat bg-right hover:bg-left bg-black text-white hover:text-black bg-gradient-to-r from-white to-white bg-[length:0%_100%] hover:bg-[length:100%_100%] px-3 py-1.5 flex items-center gap-2">
                                        <span className="relative z-10 text-[9px] md:text-[11px] font-bold tracking-widest leading-none">Play Reel</span>
                                        <Play size={10} fill="currentColor" className="relative z-10" />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Socials - 4 boxes on mobile */}
                            <SocialLinks className="col-span-4 lg:col-span-1 order-3 lg:justify-center self-end" />

                            {/* Card 4: Description - Full width on mobile */}
                            <div className="col-span-4 lg:col-span-2 border border-white/10 p-1.5 md:p-3 flex flex-col gap-2 relative order-4">
                                <div className="z-10">
                                    <h3 className="text-[11.5px] md:text-xs font-bold text-white opacity-90 max-w-full tracking-tight leading-relaxed">
                                        Gattabara Games is a video game company and creative studio based in Bengaluru, India, developing and partnering on original titles where experimental design meets distinctive art direction — guided by disciplined production and shared governance.
                                    </h3>
                                </div>
                                <div className="self-end mt-0 z-10">
                                    <Link href="/contact" className="relative overflow-hidden border border-white/10 transition-[background-size,color] duration-300 bg-no-repeat bg-right hover:bg-left bg-white text-black hover:text-white bg-gradient-to-r from-black to-black bg-[length:0%_100%] hover:bg-[length:100%_100%] px-3 py-1.5 text-[9px] md:text-[11px] font-bold tracking-widest whitespace-nowrap leading-none flex items-center gap-2">
                                        <span className="relative z-10">Contact Us</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <SocialLinks className="justify-start" />
                    )}
                </div>
            </footer>

            {/* Premium Video Modal */}
            <AnimatePresence>
                {showVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-12 overflow-hidden"
                    >
                        {/* Background Starfield/Ambience */}
                        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]" />

                        <div className="flex flex-col items-center gap-6 w-full max-w-5xl">
                            {/* The Main Video Container */}
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-full aspect-video bg-black shadow-2xl relative overflow-hidden flex items-center justify-center group border border-white/10 cursor-pointer"
                                onClick={togglePlay}
                            >
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    loop
                                    onTimeUpdate={handleTimeUpdate}
                                    className="w-full h-full object-cover"
                                >
                                    <source src="/reel/26619-359604050_tiny.mp4" type="video/mp4" />
                                </video>



                                {/* Vignette */}
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                            </motion.div>

                            {/* OFFSET Controls UI - Positioned below the video box, nudged up by 50px */}
                            <div
                                className="flex flex-col items-center gap-[7px] z-20 w-full -mt-[50px]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Circular Control Buttons */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={togglePlay}
                                        className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white hover:text-black transition-all"
                                    >
                                        {isPlaying ? <Pause size={18} /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowVideo(false);
                                        }}
                                        className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white hover:text-black transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        onClick={toggleMute}
                                        className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white hover:text-black transition-all"
                                    >
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-1/4 h-[2px] bg-white/20 relative">
                                    <motion.div
                                        style={{ width: `${progress}%` }}
                                        className="absolute top-0 left-0 h-full bg-white flex items-center justify-end"
                                    >
                                        <div className="w-1.5 h-1.5 bg-white rounded-full translate-x-1" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
