
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Icon } from '@iconify/react';
import { Loader2 } from 'lucide-react';
import { getCMSData } from "../actions/cmsActions";

// SVG Wireframe 1: Foundation (Land/Values) - Architectural Skyline & Construction - Complex
const FoundationWireframe = ({ draw, fadeIn }: { draw: any, fadeIn: any }) => (
    <motion.svg viewBox="0 0 600 300" className="w-full h-auto" fill="none" stroke="#13343e" strokeWidth="1.5" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        {/* Deep Foundation / Ground Strata */}
        <motion.line variants={draw} custom={1} x1="50" y1="240" x2="550" y2="240" strokeWidth="2" />
        <motion.path variants={draw} custom={1} d="M 50 240 L 50 260 M 150 240 L 150 280 M 250 240 L 250 280 M 350 240 L 350 280 M 450 240 L 450 280 M 550 240 L 550 260" strokeOpacity="0.5" />

        {/* Emerging Structural Grid - Complex */}
        {[100, 160, 220, 280, 340, 400, 460].map((x, i) => (
            <motion.line key={`grid-v-${i}`} variants={draw} custom={2 + i} x1={x} y1="240" x2={x} y2={100 + (i % 3) * 40} strokeWidth="1" />
        ))}
        {/* Horizontal Floors */}
        {[200, 160, 120].map((y, i) => (
            <motion.path key={`grid-h-${i}`} variants={draw} custom={5 + i} d={`M 100 ${y} L 460 ${y}`} strokeDasharray="4 4" strokeWidth="1" />
        ))}

        {/* Main Building Volumes */}
        <motion.rect variants={draw} custom={8} x="120" y="160" width="80" height="80" strokeWidth="2" />
        <motion.rect variants={draw} custom={9} x="240" y="120" width="100" height="120" strokeWidth="2" />
        <motion.rect variants={draw} custom={10} x="380" y="180" width="60" height="60" strokeWidth="2" />

        {/* Crane Detail */}
        <motion.path variants={draw} custom={11} d="M 480 240 L 480 80 L 380 40 L 380 60" strokeWidth="2" />
        <motion.line variants={draw} custom={12} x1="480" y1="80" x2="520" y2="100" /> {/* Counterweight */}
        <motion.line variants={draw} custom={13} x1="380" y1="40" x2="380" y2="120" strokeWidth="0.5" /> {/* Cable */}
        <motion.rect variants={draw} custom={14} x="360" y="120" width="40" height="10" /> {/* Load */}
    </motion.svg>
);

// SVG Wireframe 2: Pillars (Core Principles) - Three Towers (User Reference)
const PillarsWireframe = ({ draw, fadeIn }: { draw: any, fadeIn: any }) => (
    <motion.svg viewBox="0 0 600 300" className="w-full h-auto" fill="none" stroke="#13343e" strokeWidth="1.5" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        {/* Top Hanging Line */}
        <motion.line variants={draw} custom={1} x1="100" y1="50" x2="500" y2="50" strokeWidth="2" />

        {/* Tower 1 */}
        <motion.rect variants={draw} custom={2} x="150" y="50" width="80" height="200" />
        <motion.line variants={draw} custom={3} x1="190" y1="50" x2="190" y2="250" /> {/* Vertical split */}
        <motion.line variants={draw} custom={3} x1="150" y1="80" x2="230" y2="80" /> {/* Horizontal top split */}

        {/* Tower 2 */}
        <motion.rect variants={draw} custom={4} x="260" y="50" width="80" height="200" />
        <motion.line variants={draw} custom={5} x1="300" y1="50" x2="300" y2="250" />
        <motion.line variants={draw} custom={5} x1="260" y1="80" x2="340" y2="80" />

        {/* Tower 3 */}
        <motion.rect variants={draw} custom={6} x="370" y="50" width="80" height="200" />
        <motion.line variants={draw} custom={7} x1="410" y1="50" x2="410" y2="250" />
        <motion.line variants={draw} custom={7} x1="370" y1="80" x2="450" y2="80" />
    </motion.svg>
);

// SVG Wireframe 3: Growth (People/Inclusion) - Connected Community Complex
const GrowthWireframe = ({ draw, fadeIn }: { draw: any, fadeIn: any }) => (
    <motion.svg viewBox="0 0 600 300" className="w-full h-auto" fill="none" stroke="#13343e" strokeWidth="1.5" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        {/* Cityscape Silhouette */}
        <motion.path variants={draw} custom={1} d="M 50 250 L 50 150 L 100 120 L 150 150 L 150 250" strokeWidth="2" />
        <motion.path variants={draw} custom={2} d="M 170 250 L 170 80 L 250 80 L 250 250" strokeWidth="2" />
        <motion.path variants={draw} custom={3} d="M 270 250 L 270 110 L 350 110 L 350 250" strokeWidth="2" />
        <motion.path variants={draw} custom={4} d="M 370 250 L 370 140 L 450 190 L 450 250" strokeWidth="2" />
        <motion.path variants={draw} custom={5} d="M 470 250 L 470 160 L 550 160 L 550 250" strokeWidth="2" />

        {/* Interconnections / Bridges */}
        <motion.line variants={draw} custom={6} x1="150" y1="180" x2="170" y2="180" strokeWidth="2" />
        <motion.line variants={draw} custom={6} x1="250" y1="130" x2="270" y2="130" strokeWidth="2" />
        <motion.line variants={draw} custom={6} x1="350" y1="200" x2="370" y2="200" strokeWidth="2" />
        <motion.line variants={draw} custom={6} x1="450" y1="220" x2="470" y2="220" strokeWidth="2" />

        {/* Windows / Texture - High Complexity */}
        {[...Array(6)].map((_, i) => (
            <motion.line key={`w1-${i}`} variants={draw} custom={7 + i} x1="190" y1={100 + i * 20} x2="230" y2={100 + i * 20} strokeWidth="1" />
        ))}
        {[...Array(5)].map((_, i) => (
            <motion.line key={`w2-${i}`} variants={draw} custom={13 + i} x1="290" y1={130 + i * 20} x2="330" y2={130 + i * 20} strokeWidth="1" />
        ))}
        {/* Random scattered windows */}
        <motion.rect variants={draw} custom={20} x="70" y="170" width="10" height="15" />
        <motion.rect variants={draw} custom={21} x="90" y="170" width="10" height="15" />
        <motion.rect variants={draw} custom={22} x="80" y="200" width="10" height="15" />

        <motion.rect variants={draw} custom={23} x="390" y="180" width="10" height="15" />
        <motion.rect variants={draw} custom={24} x="410" y="180" width="10" height="15" />

        <motion.rect variants={draw} custom={25} x="490" y="180" width="10" height="10" />
        <motion.rect variants={draw} custom={26} x="510" y="180" width="10" height="10" />
        <motion.rect variants={draw} custom={27} x="500" y="210" width="10" height="10" />
    </motion.svg>
);

// SVG Wireframe 4: Intent (Culture/Institution) - Institutional Structure
const IntentWireframe = ({ draw, fadeIn }: { draw: any, fadeIn: any }) => (
    <motion.svg viewBox="0 0 600 300" className="w-full h-auto" fill="none" stroke="#13343e" strokeWidth="1.5" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        {/* Base */}
        <motion.rect variants={draw} custom={1} x="100" y="230" width="400" height="20" />

        {/* Columns/Structure */}
        {[120, 180, 240, 300, 360, 420, 480].map((x, i) => (
            <motion.line key={i} variants={draw} custom={2 + i} x1={x} y1="90" x2={x} y2="230" strokeWidth="2" />
        ))}
        {/* Roof Structure */}
        <motion.rect variants={draw} custom={8} x="100" y="60" width="400" height="30" />
        <motion.path variants={draw} custom={9} d="M 100 60 L 300 20 L 500 60" />
    </motion.svg>
);

// SVG Wireframe 5: Culture (Heritage/Context) - Arches & Forum
const CultureWireframe = ({ draw, fadeIn }: { draw: any, fadeIn: any }) => (
    <motion.svg viewBox="0 0 600 300" className="w-full h-auto" fill="none" stroke="#13343e" strokeWidth="1.5" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        {/* Base / Steps */}
        <motion.rect variants={draw} custom={1} x="50" y="240" width="500" height="10" />
        <motion.rect variants={draw} custom={2} x="80" y="230" width="440" height="10" />

        {/* Arches - Cultural Motif */}
        {/* Left Arch */}
        <motion.path variants={draw} custom={3} d="M 120 230 L 120 130 A 30 30 0 0 1 180 130 L 180 230" />
        {/* Center Grand Arch */}
        <motion.path variants={draw} custom={4} d="M 220 230 L 220 110 A 80 80 0 0 1 380 110 L 380 230" strokeWidth="2" />
        {/* Right Arch */}
        <motion.path variants={draw} custom={5} d="M 420 230 L 420 130 A 30 30 0 0 1 480 130 L 480 230" />

        {/* Horizontal Lines defining the structure */}
        <motion.line variants={draw} custom={6} x1="50" y1="60" x2="550" y2="60" />
        <motion.rect variants={draw} custom={7} x="50" y="40" width="500" height="20" />

        {/* Connecting Columns/Details */}
        <motion.line variants={draw} custom={8} x1="120" y1="60" x2="120" y2="100" />
        <motion.line variants={draw} custom={9} x1="480" y1="60" x2="480" y2="100" />
        <motion.line variants={draw} custom={10} x1="220" y1="60" x2="220" y2="80" />
        <motion.line variants={draw} custom={11} x1="380" y1="60" x2="380" y2="80" />
    </motion.svg>
);

// SVG 15: Governance (Checklist/Badge)
const GovernanceWireframe = ({ draw, fadeIn }: { draw: any, fadeIn: any }) => (
    <motion.svg viewBox="0 0 600 200" className="w-full h-auto" fill="none" stroke="#13343e" strokeWidth="1.5" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
        <motion.rect variants={draw} custom={1} x="200" y="50" width="200" height="120" strokeWidth="2" />
        <motion.line variants={draw} custom={2} x1="220" y1="80" x2="380" y2="80" />
        <motion.line variants={draw} custom={3} x1="220" y1="110" x2="380" y2="110" />
        <motion.line variants={draw} custom={4} x1="220" y1="140" x2="300" y2="140" />
        <motion.circle variants={draw} custom={5} cx="360" cy="140" r="15" strokeWidth="2" />
        <motion.path variants={draw} custom={6} d="M 355 140 L 360 145 L 370 135" />
    </motion.svg>
);

// SVG 24: Diversity (Shapes - Triangle/Circle/Square)
const DiversityWireframe = ({ draw, fadeIn }: { draw: any, fadeIn: any }) => (
    <motion.svg viewBox="0 0 600 200" className="w-full h-auto" fill="none" stroke="#13343e" strokeWidth="1.5" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        <motion.rect variants={draw} custom={1} x="150" y="80" width="60" height="60" strokeWidth="2" />
        <motion.circle variants={draw} custom={2} cx="280" cy="110" r="35" strokeWidth="2" />
        <motion.path variants={draw} custom={3} d="M 380 140 L 410 80 L 440 140 Z" strokeWidth="2" />
    </motion.svg>
);

// SVG 25: Stewardship (Client & Capital) - Protection/Growth
const StewardshipWireframe = ({ draw, fadeIn }: { draw: any, fadeIn: any }) => (
    <motion.svg viewBox="0 0 600 200" className="w-full h-auto mb-6" fill="none" stroke="#13343e" strokeWidth="1.5" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        {/* Central Value/Core */}
        <motion.rect variants={draw} custom={1} x="270" y="80" width="60" height="60" strokeWidth="2" transform="rotate(45 300 110)" />

        {/* Protective/Stewarding Arcs */}
        <motion.path variants={draw} custom={2} d="M 200 110 Q 200 40, 300 40 Q 400 40, 400 110" strokeWidth="2" />
        <motion.path variants={draw} custom={3} d="M 200 110 Q 200 180, 300 180 Q 400 180, 400 110" strokeWidth="2" />

        {/* Support Lines */}
        <motion.line variants={draw} custom={4} x1="150" y1="110" x2="200" y2="110" />
        <motion.line variants={draw} custom={5} x1="400" y1="110" x2="450" y2="110" />
    </motion.svg>
);

// SVG Wireframe 6: Invested (Land/Growth) - Strata & Rising
const InvestedWireframe = ({ draw, fadeIn }: { draw: any, fadeIn: any }) => (
    <motion.svg viewBox="0 0 600 300" className="w-full h-auto" fill="none" stroke="#13343e" strokeWidth="1.5" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
        {/* Land Strata - Foundation */}
        <motion.path variants={draw} custom={1} d="M 50 250 Q 300 280, 550 250" strokeWidth="2" />
        <motion.path variants={draw} custom={2} d="M 50 220 Q 300 250, 550 220" opacity="0.7" />
        <motion.path variants={draw} custom={3} d="M 50 190 Q 300 220, 550 190" opacity="0.5" />

        {/* Growth/Investment - Rising Columns */}
        <motion.rect variants={draw} custom={4} x="250" y="100" width="40" height="100" strokeWidth="2" />
        <motion.rect variants={draw} custom={5} x="310" y="80" width="40" height="120" strokeWidth="2" />
        <motion.rect variants={draw} custom={6} x="190" y="120" width="40" height="80" />

        {/* Human/Personal Detail - Circle elements */}
        <motion.circle variants={draw} custom={7} cx="330" cy="50" r="15" />
        <motion.circle variants={draw} custom={8} cx="270" cy="70" r="10" />
        <motion.circle variants={draw} custom={9} cx="210" cy="90" r="10" />
    </motion.svg>
);

export default function Principles({ initialContent }: { initialContent?: any }) {
    const router = useRouter();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [content, setContent] = useState<any>(initialContent || null);

    // efficient: removed client-side fetch since data is passed as prop
    /*
    useEffect(() => {
        const fetchContent = async () => {
            // ...
        }
        fetchData();
    }, []);
    */

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setScrollProgress(progress);
    };

    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => ({
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay: i * 0.05, type: "spring", duration: 1.5, bounce: 0 }, // Speed up drawing
                opacity: { delay: i * 0.05, duration: 0.02 }
            }
        })
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { delay: 0.2, duration: 0.8 } } // Reduced delay from 2s to 0.2s
    };

    if (!content) return (
        <div className="h-screen w-full bg-white"></div>
    );

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Main Content Area */}
            <div
                className="h-screen overflow-y-auto pt-30 pb-20 px-8 md:px-32 scrollbar-hide relative"
                onScroll={handleScroll}
            >
                {/* Navigation Button */}
                <motion.button
                    onClick={() => router.push('/')}
                    className="absolute top-18 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] hover:opacity-70 transition-opacity"
                >
                    <div className="grid grid-cols-3 gap-2 hidden md:grid">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-[#13343e] rounded-full"></div>
                        ))}
                    </div>
                </motion.button>

                <div className="max-w-4xl mx-auto relative">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 1.6 }}
                        className="mb-4 max-w-2xl mx-auto text-center"
                    >
                        <h1 className="text-[#13343e] text-3xl md:text-4xl font-serif font-bold mb-12 mt-4 text-center [-webkit-text-stroke:1px]">
                            {content.mainHeading}
                        </h1>

                        <div className="w-full mb-0">
                            <IntentWireframe draw={draw} fadeIn={fadeIn} />
                        </div>
                    </motion.div>

                    {/* Section 1: Foundations */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mb-8 max-w-2xl mx-auto"
                    >
                        <h2 className="text-[#13343e] text-lg font-serif font-bold mb-2 [-webkit-text-stroke:0.4px]">
                            {content.section1.heading}
                        </h2>
                        <p className="text-black text-base font-sans font-light leading-relaxed mb-8 whitespace-pre-wrap [-webkit-text-stroke:0.15px]">
                            {content.section1.description}
                        </p>
                    </motion.div>

                    {/* Section 2: Core Principles */}
                    <div
                        className="mb-20 max-w-2xl mx-auto"
                    >
                        <div className="text-black text-base leading-relaxed mb-16 space-y-8">
                            {content.corePrinciples.map((item: any, idx: number) => (
                                <div key={idx}>
                                    <h3 className="text-[#13343e] text-md font-serif font-bold tracking-wide mb-2 [-webkit-text-stroke:0.4px]">{item.title}</h3>
                                    <p className="font-sans font-light [-webkit-text-stroke:0.15px]">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Culture & Institutional Intent */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mb-20 max-w-2xl mx-auto"
                    >
                        <div className="w-full mb-8">
                            <GovernanceWireframe draw={draw} fadeIn={fadeIn} />
                        </div>
                        <h2 className="text-[#13343e] text-lg font-serif font-bold mb-2 [-webkit-text-stroke:0.4px]">
                            {content.section3.heading}
                        </h2>
                        <p className="text-black text-base font-sans font-light leading-relaxed mb-16 whitespace-pre-wrap [-webkit-text-stroke:0.15px]">
                            {content.section3.description}
                        </p>
                    </motion.div>

                    {/* Section 4: People, Merit & Inclusion */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mb-20 max-w-2xl mx-auto"
                    >
                        <div className="w-full mb-8">
                            <DiversityWireframe draw={draw} fadeIn={fadeIn} />
                        </div>
                        <h2 className="text-[#13343e] text-lg font-serif font-bold mb-2 [-webkit-text-stroke:0.4px]">
                            {content.section4.heading}
                        </h2>

                        <p className="text-black text-base font-sans font-light leading-relaxed mb-16 whitespace-pre-wrap [-webkit-text-stroke:0.15px]">
                            {content.section4.description}
                        </p>
                    </motion.div>

                    {/* Section 5: Invested in Land. Invested in You. */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mb-20 max-w-2xl mx-auto"
                    >
                        <div className="w-full mb-8">
                            <InvestedWireframe draw={draw} fadeIn={fadeIn} />
                        </div>
                        <h2 className="text-[#13343e] text-lg font-serif font-bold mb-2 [-webkit-text-stroke:0.4px]">
                            {content.section5.heading}
                        </h2>

                        <p className="text-black text-base font-sans font-light leading-relaxed mb-16 whitespace-pre-wrap [-webkit-text-stroke:0.15px]">
                            {content.section5.description}
                        </p>
                    </motion.div>

                    {/* Footer - Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="border-t border-gray-200 pt-8 mt-8 max-w-2xl mx-auto"
                    >
                        <div
                            className="flex items-center justify-center gap-4 mb-8 cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => router.push('/contact')}
                        >
                            <h2 className="text-[#13343e] text-xl font-sans font-bold">
                                Start a conversation
                            </h2>
                            <div className="relative flex h-6 w-6 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13343e] opacity-20"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#13343e]"></span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>


            {/* Right Sidebar - Custom Scroll Indicator */}
            <div className="fixed right-[150px] top-1/2 -translate-y-1/2 hidden md:block pointer-events-none z-[50]">
                <div className="flex flex-col items-end">


                    {/* Vertical Scroll Track */}
                    <div className="relative h-[50vh] w-[4px] bg-[#13343e]/10">
                        {/* Background Track Line (Faint Teal) */}
                        <div className="absolute inset-0 w-[1px] bg-[#13343e]/20 left-1/2 -translate-x-1/2"></div>

                        {/* Active Progress Line (Dark Teal) */}
                        <motion.div
                            className="absolute top-0 left-0 w-full bg-[#13343e]"
                            style={{
                                height: `${scrollProgress}%`,
                            }}
                        />
                    </div>


                </div>
            </div>




        </div>
    );
}