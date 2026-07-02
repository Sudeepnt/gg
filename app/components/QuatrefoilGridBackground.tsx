"use client";

import React from "react";

interface QuatrefoilGridBackgroundProps {
    strokeColor?: string;
    opacity?: number;
}

export default function QuatrefoilGridBackground({
    strokeColor = "#000000",
    opacity = 0.1,
}: QuatrefoilGridBackgroundProps) {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <svg
                className="absolute w-full h-full"
                width="100%"
                height="100%"
                style={{ opacity }}
            >
                <defs>
                    <pattern
                        id="quatrefoil-pattern"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Grid lines */}
                        <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="0.5"
                        />
                        {/* Decorative circles at intersections */}
                        <circle cx="0" cy="0" r="2" fill={strokeColor} opacity="0.5" />
                        <circle cx="40" cy="0" r="2" fill={strokeColor} opacity="0.5" />
                        <circle cx="0" cy="40" r="2" fill={strokeColor} opacity="0.5" />
                        <circle cx="40" cy="40" r="2" fill={strokeColor} opacity="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#quatrefoil-pattern)" />
            </svg>
            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)] pointer-events-none" />
        </div>
    );
}
