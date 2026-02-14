"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Icon } from '@iconify/react';
import { slugify } from '../utils/slugify';

interface BusinessSideViewProps {
    service: any;
    onClose?: () => void;
    onStartConversation?: () => void;
}

export default function BusinessSideView({ service, onClose, onStartConversation }: BusinessSideViewProps) {
    const router = useRouter();
    // No internal state needed for service, using prop directly


    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };

    const handleStartConversation = () => {
        if (onStartConversation) {
            onStartConversation();
        } else if (onClose) {
            onClose();
            // Wait for exit animation (0.8s) before navigating
            setTimeout(() => {
                router.push('/contact');
            }, 800);
        } else {
            router.push('/contact');
        }
    };

    return (
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] flex flex-col h-[100dvh] w-screen overflow-hidden"
            data-theme="dark-teal"
        >
            {!service ? (
                <div className="flex-1 w-full bg-[#13343e] flex flex-col items-center justify-center gap-4">
                    <p className="text-white text-xl">Service not found.</p>
                    <button onClick={handleClose} className="text-white underline">Go back</button>
                </div>
            ) : (
                <>
                    {/* 1. Top Block - 50% width */}
                    <div className="flex-1 w-[50%] bg-[#13343e] border-r border-white/10"></div>

                    {/* 2. Middle Block - Content Section */}
                    <div className="w-full h-auto py-12 md:py-16 bg-[#244751] flex flex-col px-8 md:px-24 relative">

                        {/* Mobile-only Close Button (Top Right) */}
                        <div className="md:hidden w-full flex justify-end mb-6">
                            <button onClick={handleClose} className="p-2">
                                <Icon icon="ph:x-light" className="w-12 h-12 text-white/50" />
                            </button>
                        </div>

                        {/* Content Layout Wrapper */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-8 md:gap-16">

                            {/* Title Section (Left on PC) */}
                            <div className="md:w-[45%]">
                                <h2 className="text-white text-[clamp(1.275rem,2.55vw,1.87rem)] md:text-[clamp(1.87rem,2.55vw,2.975rem)] font-serif font-bold leading-[1.05] tracking-tighter max-w-[95%] [-webkit-text-stroke:1px]">

                                    {service.fullTitle || service.title}.
                                </h2>
                            </div>

                            {/* Description Section (Center on PC) */}
                            <div className="md:w-[35%] text-white/90">
                                <p className="text-[1.05rem] md:text-[1.15rem] font-sans font-light leading-relaxed mb-10">
                                    {service.description}
                                </p>

                                <div
                                    className="flex items-center gap-6 cursor-pointer group/link w-fit"
                                    onClick={handleStartConversation}
                                >
                                    <span className="font-sans font-bold text-[1.1rem] md:text-[0.96rem]">Start a conversation</span>
                                    <div className="group relative w-10 h-10 rounded-full flex items-center justify-center">
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 rounded-full border border-white"
                                            style={{ x: "-50%", y: "-50%" }}
                                            initial={{ width: 0, height: 0, opacity: 1 }}
                                            animate={{ width: "100%", height: "100%", opacity: 0 }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                        />
                                        <div className="w-3 h-3 bg-white rounded-full relative z-10"></div>
                                    </div>
                                </div>
                            </div>

                            {/* PC-only Close Button (Right side, centered vertically with text) */}
                            <div className="hidden md:flex md:w-[10%] justify-end">
                                <button
                                    onClick={handleClose}
                                    className="p-2 group transition-transform duration-300 hover:scale-75"
                                >
                                    <Icon
                                        icon="ph:x-light"
                                        className="w-20 h-20 text-white/30 group-hover:text-white transition-colors"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. Bottom Block - 75% width */}
                    <div className="flex-1 w-[75%] bg-[#13343e] border-r border-white/10"></div>
                </>
            )}
        </motion.div>
    );
}