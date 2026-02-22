"use client";

import React from "react";

export default function ComingSoonLiquid() {
    return (
        <div className="liquid-container">
            <div className="liquid-content">
                <h2>Coming Soon...</h2>
                <h2>Coming Soon...</h2>
            </div>

            <style jsx>{`
                .liquid-container {
                    display: flex;
                    background: transparent;
                    min-height: 100vh;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    width: 100%;
                    position: fixed;
                    top: 0;
                    left: 0;
                }

                .liquid-content {
                    position: relative;
                }

                .liquid-content h2 {
                    color: #fff;
                    font-family: 'NT Brick Sans', sans-serif;
                    font-size: 2.4vw;
                    letter-spacing: 0.15em;
                    position: absolute;
                    transform: translate(-50%, -50%);
                    margin: 0;
                    padding: 0;
                    white-space: nowrap;
                    text-transform: uppercase;
                    font-weight: 400;
                }

                /* The Outlined Text (Background) */
                .liquid-content h2:nth-child(1) {
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
                }

                /* The Animated Liquid Text (Foreground) */
                .liquid-content h2:nth-child(2) {
                    color: #fff;
                    animation: animate 4s ease-in-out infinite;
                }

                @keyframes animate {
                    0%,
                    100% {
                        clip-path: polygon(0% 45%,
                                16% 44%,
                                33% 50%,
                                54% 60%,
                                70% 61%,
                                84% 59%,
                                100% 52%,
                                100% 100%,
                                0% 100%);
                    }

                    50% {
                        clip-path: polygon(0% 60%,
                                15% 65%,
                                34% 66%,
                                51% 62%,
                                67% 50%,
                                84% 45%,
                                100% 46%,
                                100% 100%,
                                0% 100%);
                    }
                }

                /* Mobile fine-tuning */
                @media (max-width: 600px) {
                    .liquid-content h2 {
                        font-size: 4vw;
                        -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.3);
                    }
                }
            `}</style>
        </div>
    );
}
