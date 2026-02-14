"use client";

import React from "react";

export default function Pitch() {
    return (
        <div className="relative w-full min-h-screen text-white overflow-hidden flex flex-col font-sans">
            <main className="flex-1 flex flex-col justify-center items-center px-4 md:px-8 w-full pt-16 md:pt-32">
                <div className="w-full max-w-7xl flex flex-col">
                    <h1 className="text-xl md:text-4xl font-bold mb-4 md:mb-8 text-white text-center uppercase tracking-wider">
                        Inbound Form
                    </h1>

                    <div className="flex flex-col gap-2 md:gap-5 text-base md:text-lg text-white/90 leading-normal font-bold tracking-wide w-full max-w-4xl mx-auto">
                        <p className="md:px-6 border-0 px-0 text-left md:text-center w-full">
                            Pitch with clarity and conviction. We want to see what you are building, why it matters, and how you plan to ship it end to end.
                        </p>
                        <p className="md:px-6 border-0 px-0 text-left md:text-center w-full">
                            Keep your deck focused and easy to scan. Deep dives on systems or mechanics can live in a separate GDD or design doc.
                        </p>
                        <p className="md:px-6 border-0 px-0 text-left md:text-center w-full">
                            Show us something real. A playable build beats a video. A video beats concept art. We generally do not review pitches without a build or proof of concept.
                        </p>
                        <p className="md:px-6 border-0 px-0 text-left md:text-center w-full">
                            GG collaborates on PC, Console, and mobile titles. AR/VR and mobile-first projects are welcome.
                        </p>
                    </div>

                    <div className="mt-12 md:mt-20 w-full flex justify-center pb-20">
                        <button
                            className="relative min-w-[280px] md:min-w-[400px] h-[42px] md:h-14 flex items-center justify-center border border-white/20 text-white font-bold text-sm md:text-base tracking-wide hover:bg-white hover:text-black transition-all duration-300 px-6 backdrop-blur-sm cursor-default"
                        >
                            Click Here to Start
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
