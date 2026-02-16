"use client";

import React from "react";

export default function Pitch() {
    return (
        <div className="relative w-full min-h-screen text-white overflow-hidden flex flex-col font-sans">
            <main className="flex-1 flex flex-col justify-start w-full pt-16 md:pt-32 px-[12vw]">
                <div className="w-full flex flex-col">

                    {/* Equal spacing above text block */}
                    <h1 className="text-xl md:text-4xl font-bold text-white text-center uppercase tracking-wider mb-12 md:mb-20">
                        Inbound Form
                    </h1>

                    <div className="w-full flex flex-col gap-5 md:gap-7 text-sm md:text-lg text-white/95 leading-[1.7] font-extrabold tracking-tight">
                        <p className="text-left w-full">
                            Pitch with clarity and conviction. We want to see what you are building, why it matters, and how you plan to ship it end to end.
                        </p>
                        <p className="text-left w-full">
                            Keep your deck focused and easy to scan. Deep dives on systems or mechanics can live in a separate GDD or design doc.
                        </p>
                        <p className="text-left w-full">
                            Show us something real. A playable build beats a video. A video beats concept art. We generally do not review pitches without a build or proof of concept.
                        </p>
                        <p className="text-left w-full">
                            GG collaborates on PC, Console, and mobile titles. AR/VR and mobile-first projects are welcome.
                        </p>
                    </div>

                    {/* Button untouched */}
                    <div className="mt-12 md:mt-20 w-full flex justify-center pb-20">
                        <button
                            className="relative min-w-[280px] md:min-w-[400px] h-[42px] md:h-14 flex items-center justify-center overflow-hidden border border-white/20 text-white font-bold text-sm md:text-base tracking-wide px-6 backdrop-blur-sm cursor-pointer transition-[background-size,color] duration-300 bg-no-repeat bg-right hover:bg-left hover:text-black bg-gradient-to-r from-white to-white bg-[length:0%_100%] hover:bg-[length:100%_100%]"
                        >
                            <span className="relative z-10">Click Here to Start</span>
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
