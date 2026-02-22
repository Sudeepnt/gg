"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getCMSData } from "../actions/cmsActions";

export default function Pitch() {
    const [content, setContent] = useState({
        title: "Inbound Form",
        paragraphs: [
            "Pitch with clarity and conviction. We want to see what you are building, why it matters, and how you plan to ship it end to end.",
            "Keep your deck focused and easy to scan. Deep dives on systems or mechanics can live in a separate GDD or design doc.",
            "Show us something real. A playable build beats a video. A video beats concept art. We generally do not review pitches without a build or proof of concept.",
            "GG collaborates on PC, Console, and mobile titles. AR/VR and mobile-first projects are welcome."
        ],
        buttonText: "Click Here to Start"
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const cmsData = await getCMSData();
                if (cmsData && cmsData.pitch) {
                    setContent(cmsData.pitch);
                }
            } catch (error) {
                console.error("Failed to fetch CMS data:", error);
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="relative w-full min-h-screen text-white overflow-hidden flex flex-col font-sans">
            <main className="flex-1 flex flex-col justify-start w-full pt-[13vh] md:pt-32 px-[6vw] md:px-[12vw]">
                <div className="w-full flex flex-col">

                    {/* Equal spacing above text block */}
                    <h1 className="text-xl md:text-4xl font-bold text-white text-center uppercase tracking-wider mb-12 md:mb-20">
                        {content.title}
                    </h1>

                    <div className="w-full flex flex-col gap-5 md:gap-7 text-sm md:text-lg text-white/95 leading-[1.7] font-extrabold tracking-tight">
                        {content.paragraphs.map((p, i) => (
                            <p key={i} className="text-left w-full">
                                {p}
                            </p>
                        ))}
                    </div>

                    {/* Button untouched */}
                    <div className="mt-12 md:mt-20 w-full flex justify-center pb-20">
                        <Link
                            href="/form"
                            className="relative min-w-[280px] md:min-w-[400px] h-[42px] md:h-14 flex items-center justify-center border border-white transition-[background-size,color] duration-500 bg-no-repeat bg-right hover:bg-left bg-white text-black hover:text-white bg-gradient-to-r from-black to-black bg-[length:0%_100%] hover:bg-[length:100%_100%] font-bold text-sm md:text-base tracking-wide px-6 backdrop-blur-sm cursor-pointer"
                        >
                            <span className="relative z-10">{content.buttonText}</span>
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}
