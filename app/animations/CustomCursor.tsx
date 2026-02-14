'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function CustomCursor() {
    const pathname = usePathname();
    const cursorX = useMotionValue(-100); // Start off-screen
    const cursorY = useMotionValue(-100);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX - 12);
            cursorY.set(e.clientY - 12);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className={`fixed top-0 left-0 pointer-events-none z-[2147483647] hidden md:block ${pathname === '/gg-productions' ? 'text-black mix-blend-normal' : 'text-white mix-blend-difference'}`}
            style={{
                x: cursorX,
                y: cursorY,
            }}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 block"
            >
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
            </svg>
        </motion.div>
    );
}
