"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [isDarkBg, setIsDarkBg] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring configuration for the trailing effect
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);

            const target = e.target as HTMLElement;

            // Check if hovering over a clickable element
            const isClickable =
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                window.getComputedStyle(target).cursor === "pointer";

            setIsHovered(!!isClickable);

            // Check for dark background theme
            const darkThemeElement = target.closest('[data-theme="dark-teal"]');
            setIsDarkBg(!!darkThemeElement);
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        const handleMouseEnter = () => {
            setIsVisible(true);
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            {/* Central Dot - Always Visible & Instant Movement */}
            <motion.div
                className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[9999] items-center justify-center"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{
                    opacity: { duration: 0.2 }
                }}
            >
                <div
                    className="w-1 h-1 rounded-full z-10 transition-colors duration-200"
                    style={{ backgroundColor: "#FFFFFF" }}
                />
            </motion.div>

            {/* Outer Circle - Changes based on state & Trailing Movement */}
            <motion.div
                className="hidden md:flex fixed top-0 left-0 pointer-events-none z-[9999] items-center justify-center"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{
                    opacity: { duration: 0.2 }
                }}
            >
                <motion.div
                    animate={{
                        width: isHovered ? 36 : 27,
                        height: isHovered ? 36 : 27,
                        backgroundColor: isHovered
                            ? "rgba(255, 255, 255, 0.2)"
                            : "transparent",
                        border: isHovered
                            ? "none"
                            : "1px solid rgba(255, 255, 255, 0.5)",
                    }}
                    transition={{ duration: 0.15 }}
                    className="rounded-full flex items-center justify-center"
                />
            </motion.div>
        </>
    );
}
