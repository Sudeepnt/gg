"use client";

import { useState, useEffect } from "react";
import ParticleText from './animations/ParticleText';
import CookieConsent from './animations/CookieConsent';
import { getCMSData } from "./actions/cmsActions";

export default function Home() {
  const [content, setContent] = useState({
    particleText: "Gattabara Games"
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const cmsData = await getCMSData();
        if (cmsData && cmsData.home) {
          setContent(cmsData.home);
        }
      } catch (error) {
        console.error("Failed to fetch CMS data:", error);
      }
    };
    fetchContent();
  }, []);

  return (
    <main className="px-[6vw] md:px-[12vw] fixed inset-0 overflow-hidden">
      <ParticleText text={content.particleText} className="-translate-y-[150px] md:translate-y-0" mobileScale={0.85} />
      <CookieConsent />
    </main>
  );
}
