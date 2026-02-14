"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from '@iconify/react';
import { Pointer, Loader2 } from 'lucide-react';
import { slugify } from '../utils/slugify';
import BusinessSideView from './business-side-view';
import { getCMSData } from "../actions/cmsActions";

export default function Services({ initialData }: { initialData?: any }) {

  const [introText, setIntroText] = useState(initialData?.business?.intro || "");
  const [services, setServices] = useState<any[]>(initialData?.services?.items || []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const lastWheelTime = useRef(0);
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    setIsTouchDevice(typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
  }, []);

  // Removed client-side fetch since we pass data from server
  /* 
  useEffect(() => {
    const loadData = async () => {
      const data = await getCMSData();
      if (data?.business?.intro) {
        setIntroText(data.business.intro);
      }
      if (data?.services?.items) {
        setServices(data.services.items);
      }
    };
    if (!initialData) loadData();
  }, [initialData]);
  */

  // Consolidated swipe handler for both Drag (Cards) and Pan (Background)
  const handleSwipe = (event: any, info: PanInfo) => {
    const swipeThreshold = 80;
    const { offset, velocity } = info;

    // Quick swipe (high velocity) or long drag (high offset)
    if (offset.x < -swipeThreshold || velocity.x < -500) {
      if (currentIndex < services.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    } else if (offset.x > swipeThreshold || velocity.x > 500) {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  const getPosition = (index: number) => {
    const diff = index - currentIndex;

    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === -1) return "left";
    // Strictly hide distant neighbors to prevent overlap
    return "hidden";
  };

  // variants for path drawing
  const draw: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 4, bounce: 0, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" },
        opacity: { duration: 0.02 }
      }
    }
  };

  const renderBackground = (title: string, isCenter: boolean) => {
    const t = title.toLowerCase();
    const animationState = isCenter ? "visible" : "hidden";

    // Scale logic: Mobile stays 50% (small), others get bigger (e.g. 75-80%)
    const isMobile = t.includes("mobile");
    const containerSize = isMobile ? "w-[150px] h-[200px]" : "w-[240px] h-[180px]";

    const commonSvgProps = {
      width: "100%",
      height: "100%",
      viewBox: "0 0 300 400",
      fill: "none",
      stroke: "#9CA3AF",
      strokeWidth: "2",
      initial: "hidden",
      animate: animationState
    };

    // Wrapper to handle scale
    const Wrapper = ({ children, viewBox }: any) => (
      <div className={`${containerSize} flex items-center justify-center relative`}>
        <motion.svg
          {...commonSvgProps}
          viewBox={viewBox}
          strokeWidth="1.5"
          className="overflow-visible" // Allow lines to go outside if needed
        >
          {/* Main Content Group with Opacity 40% */}
          <g className="opacity-40" transform="translate(0, -40)">
            {children}
          </g>

          {/* Decorative Lines - 100% Opacity and moved further away */}
          {/* Right Side Lines - Moved from 260/270 to 320/330 range (outside standard 300 box) */}
          <motion.path variants={draw} d="M 310 140 L 350 140" strokeWidth="4" className="opacity-100" />
          <motion.path variants={draw} d="M 320 150 L 350 150" strokeWidth="4" className="opacity-100" />
          {/* Bottom Left Line - Moved further left/down */}
          <motion.path variants={draw} d="M -20 340 L 40 340" strokeWidth="4" className="opacity-100" />
        </motion.svg>
      </div>
    );

    if (t.includes("hotel")) {
      return (
        <Wrapper viewBox="0 0 400 300">
          {/* Hotel - Converted to paths for better draw animation */}
          {/* Main Building Outline */}
          <motion.path variants={draw} d="M 100 50 L 300 50 L 300 300 L 100 300 Z" strokeWidth="2" />

          {/* Floors */}
          <motion.path variants={draw} d="M 100 90 L 300 90" />
          <motion.path variants={draw} d="M 100 130 L 300 130" />
          <motion.path variants={draw} d="M 100 170 L 300 170" />
          <motion.path variants={draw} d="M 100 210 L 300 210" />

          {/* Doors */}
          <motion.path variants={draw} d="M 130 250 L 170 250 L 170 300" />
          <motion.path variants={draw} d="M 230 250 L 270 250 L 270 300" />

          {/* Ground */}
          <motion.path variants={draw} d="M 50 300 L 350 300" strokeWidth="2" />
        </Wrapper>
      );
    } else if (t.includes("capital")) {
      return (
        <Wrapper viewBox="0 0 400 300">
          {/* Capital Graph - Converted to paths */}
          {/* Axes */}
          <motion.path variants={draw} d="M 50 50 L 50 250 L 350 250" strokeWidth="2" />

          {/* Trend Line */}
          <motion.path variants={draw} d="M 50 250 L 100 200 L 150 220 L 200 150 L 250 180 L 300 100 L 350 80" strokeWidth="2" />

          {/* Data Points (Circles) - Simulated with small paths for draw animation */}
          <motion.path variants={draw} d="M 98 200 L 102 200 M 100 198 L 100 202" strokeWidth="5" strokeLinecap="round" stroke="#9CA3AF" />
          <motion.path variants={draw} d="M 198 150 L 202 150 M 200 148 L 200 152" strokeWidth="5" strokeLinecap="round" stroke="#9CA3AF" />
          <motion.path variants={draw} d="M 298 100 L 302 100 M 300 98 L 300 102" strokeWidth="5" strokeLinecap="round" stroke="#9CA3AF" />

          {/* Bar Chart Bars (Wireframe style) */}
          <motion.path variants={draw} d="M 280 250 L 280 150 L 310 150 L 310 250" />
          <motion.path variants={draw} d="M 320 250 L 320 120 L 350 120 L 350 250" />
        </Wrapper>
      );
    } else if (t.includes("development")) {
      return (
        <Wrapper viewBox="0 0 400 300">
          {/* Construction / Crane / Gear - Converted to paths */}
          {/* Building Frame */}
          <motion.path variants={draw} d="M 150 250 L 150 100 L 250 100 L 250 250" strokeWidth="2" />
          <motion.path variants={draw} d="M 150 100 L 250 250" /> {/* Cross brace */}
          <motion.path variants={draw} d="M 250 100 L 150 250" /> {/* Cross brace */}

          {/* Crane Arm */}
          <motion.path variants={draw} d="M 250 250 L 250 100" strokeWidth="2" />
          <motion.path variants={draw} d="M 250 100 L 350 50" strokeWidth="2" />
          <motion.path variants={draw} d="M 350 50 L 350 120" /> {/* Cable */}
          <motion.path variants={draw} d="M 330 120 L 370 120 L 370 140 L 330 140 Z" />

          {/* Ground */}
          <motion.path variants={draw} d="M 100 250 L 300 250" />
        </Wrapper>
      );
    }


    // Default / All-Rounder Animation (Network/Nexus) for Mobile, Advisory, etc.
    return (
      <Wrapper viewBox="0 0 400 300">
        {/* Central Core */}
        <motion.circle variants={draw} cx="200" cy="150" r="30" strokeWidth="2" />
        <motion.circle variants={draw} cx="200" cy="150" r="15" />

        {/* Contributing Nodes / Satellites */}
        <motion.circle variants={draw} cx="100" cy="80" r="20" />
        <motion.circle variants={draw} cx="300" cy="80" r="20" />
        <motion.circle variants={draw} cx="100" cy="220" r="20" />
        <motion.circle variants={draw} cx="300" cy="220" r="20" />

        {/* Connections to Center */}
        <motion.path variants={draw} d="M 120 95 L 180 135" />
        <motion.path variants={draw} d="M 280 95 L 220 135" />
        <motion.path variants={draw} d="M 120 205 L 180 165" />
        <motion.path variants={draw} d="M 280 205 L 220 165" />

        {/* Outer Ring / Orbit */}
        <motion.path variants={draw} d="M 200 50 Q 350 50, 350 150 Q 350 250, 200 250" strokeWidth="1" strokeDasharray="5 5" />
        <motion.path variants={draw} d="M 200 250 Q 50 250, 50 150 Q 50 50, 200 50" strokeWidth="1" strokeDasharray="5 5" />
      </Wrapper>
    );
  };

  // Handle Trackpad / MouseHorizontal Wheel
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 500) return; // 500ms throttle

    // Check for horizontal scroll (swipe gesture on trackpad)
    if (Math.abs(e.deltaX) > 30) {
      if (e.deltaX > 0) {
        // Swipe Right / Scroll Right -> Next
        if (currentIndex < services.length - 1) {
          setCurrentIndex(prev => prev + 1);
          lastWheelTime.current = now;
        }
      } else {
        // Swipe Left / Scroll Left -> Prev
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
          lastWheelTime.current = now;
        }
      }
    }
  };

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-white"></div>
    );
  }



  return (
    <motion.div
      className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center pb-20 touch-pan-y"
      onPanEnd={handleSwipe}
      onWheel={handleWheel}
    >
      {/* pb-20 pulls visual center down */}

      <AnimatePresence>
        {!isNavigating && (
          <motion.div
            key="services-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="w-full flex flex-col items-center justify-center"
          >
            {/* Intro Paragraph */}
            <div className="relative w-full max-w-4xl px-8 md:px-32 text-center mt-12 mb-0 z-10">
              <p className="text-black text-[15px] md:text-lg font-sans font-medium leading-relaxed">
                {introText || ""}
              </p>
            </div>

            {/* Carousel Container - Adjusted margin */}
            <div className="relative w-full h-[50vh] flex items-center justify-center -mt-12">
              <AnimatePresence mode="popLayout">
                {services.map((service, index) => {
                  const position = getPosition(index);
                  if (position === "hidden") return null;

                  const isCenter = position === "center";

                  let animateX = 0;
                  let scale = 1;
                  let opacity = 1;
                  let zIndex = 0;
                  let blur = "0px";

                  // Determine X positions
                  const isMobile = hasMounted && typeof window !== 'undefined' && window.innerWidth < 768;
                  const offsetMultiplier = isMobile ? 1.5 : 0.55; // 1.5 ensures completely offscreen for mobile

                  if (position === "left") {
                    animateX = (hasMounted && typeof window !== 'undefined') ? -window.innerWidth * offsetMultiplier : -800;
                    scale = 0.8;
                    zIndex = 10;
                  } else if (position === "right") {
                    animateX = (hasMounted && typeof window !== 'undefined') ? window.innerWidth * offsetMultiplier : 800;
                    scale = 0.8;
                    zIndex = 10;
                  } else {
                    // Center
                    zIndex = 20;
                  }

                  return (
                    <motion.div
                      key={index}
                      className="absolute flex flex-col items-center justify-center w-full max-w-2xl px-6"
                      initial={{ x: animateX, opacity: 0 }}
                      animate={{
                        x: animateX,
                        scale: scale,
                        opacity: 1,
                        filter: `blur(${blur})`
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 24,
                        mass: 1
                      }}
                      style={{ zIndex }}
                    >
                      {/* Dynamic Background */}
                      <motion.div
                        className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {renderBackground(service.title, isCenter)}
                        {isCenter && (
                          <motion.div
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: [-5, 5, -5] }}
                            transition={{
                              opacity: { duration: 0.5 },
                              x: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="absolute top-0 right-[20%] text-[#9CA3AF] text-3xl font-black"
                          >
                            +
                          </motion.div>
                        )}
                      </motion.div>

                      <h2 className="text-[#13343e] text-[clamp(1.19rem,2.125vw,1.87rem)] md:text-[clamp(1.53rem,2.55vw,2.55rem)] font-serif font-bold mb-4 tracking-tight text-center max-w-[90%] leading-tight [-webkit-text-stroke:1px]">
                        {service.title}.
                      </h2>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(service);
                        }}
                        onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
                        onTouchStart={(e: React.TouchEvent) => e.stopPropagation()}
                        className="text-black font-sans font-bold text-xl px-4 py-2 bg-gradient-to-r from-[#13343e] to-[#13343e] bg-no-repeat bg-[length:0%_100%] bg-right transition-[background-size,color] duration-500 hover:bg-[length:100%_100%] hover:bg-left hover:text-white block cursor-pointer"
                      >
                        see more
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Swipe Hand Icon SELECTION */}
            <div className="absolute bottom-28 w-full px-8 flex justify-center pointer-events-none">
              <motion.div
                className="flex flex-col items-center gap-2"
                animate={{ x: [-10, 10, -10] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-[#13343e] text-[10px] font-bold mb-0.5">&larr;&rarr;</span>
                  <Pointer size={24} className="text-[#13343e]" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Business Side View Overlay */}
      <AnimatePresence>
        {selectedService && (
          <BusinessSideView
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onStartConversation={() => {
              // 1. Hide the carousel content behind the side panel
              setIsNavigating(true);
              // 2. Trigger the side panel slide-out animation
              setSelectedService(null);
              // 3. Start navigation while side panel is still sliding
              setTimeout(() => {
                router.push('/contact');
              }, 300);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}