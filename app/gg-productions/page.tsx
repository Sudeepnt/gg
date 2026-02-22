"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import ParticleText from "../animations/ParticleText";
import { getCMSData } from "../actions/cmsActions";

export default function AboutPage() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [content, setContent] = useState({
    particleText: "GG PRODUCTIONS",
    brief: [
      "At GG Productions, we know what it’s like to build games with tight budgets and big ambitions. Every decision is about momentum, what to ship now, what to defer, and where the right support can unblock your next milestone.",
      "We stay lean so you can move fast, plugging in exactly the talent you need, when you need it, across art, tech, design, and production.",
      "With clear milestones and transparent delivery, we integrate as an extension of your team, whether for full production or focused co-development, so you keep creative control while scaling execution globally."
    ],
    servicesTitle: "Our Services",
    services: [
      {
        title: "Development",
        description: "From early concepts to shippable builds, our team designs core systems, builds robust gameplay foundations, and executes with production-grade engineering. We handle mechanics, level design, rapid prototyping, and full-cycle development across Unity, Unreal, and Roblox, with scalability in mind for long-term updates and live operations."
      },
      {
        title: "Art",
        description: "Our art direction and production bring clarity and identity to your game, from visual style discovery to complete world-building. We deliver cohesive 2D and 3D art, animation, and UI that give characters and environments a distinct voice, always grounded in gameplay and audience experience."
      },
      {
        title: "Strategy & Pre-Production",
        description: "We help you make the right game before you make the whole game. From IP ideation and concept validation to MVP planning for fundraising, we craft clear design documentation and production roadmaps. Our approach blends creative vision with market and production reality, helping you de-risk development across entertainment titles, branded experiences, and applied games."
      }
    ],
    clientsTitle: "Our Clients",
    clients: [
      "Nexon Games MapleStory Worlds",
      "Singular Scheme",
      "BattleBucks",
      "Magadha Studios",
      "Qila Games",
      "Studio Cupcakes"
    ],
    footerTitle: "Looking for a game development partner?",
    footerCta: "Let's make magic",
    copyright: "Gattabara Games",
    playReelVideo: "",
    projects: [] as any[]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const cmsData = await getCMSData();
        if (cmsData) {
          const ggData = cmsData.ggProductions || {};
          setContent({
            ...ggData,
            particleText: ggData.particleText || "GG PRODUCTIONS",
            brief: ggData.brief || [],
            servicesTitle: ggData.servicesTitle || "Our Services",
            services: ggData.services || [],
            clientsTitle: ggData.clientsTitle || "Our Clients",
            clients: ggData.clients || [],
            footerTitle: ggData.footerTitle || "Looking for a game development partner?",
            footerCta: ggData.footerCta || "Let's make magic",
            copyright: ggData.copyright || "Gattabara Games",
            playReelVideo: cmsData.home?.playReelVideo || "",
            projects: ggData.projects || []
          });
        }
      } catch (error) {
        console.error("Failed to fetch CMS data:", error);
      }
    };
    fetchContent();
  }, []);

  // Removed scroll-based opacity effect - now using viewport gradient shadows instead

  return (
    <>
      <div className="gg-viewport-shadow-top" />
      <div className="gg-viewport-shadow-bottom" />

      <motion.main
        ref={rootRef}
        className="about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >



        <section className="about-brief pt-[100px]">
          <div className="w-full h-[30vh] flex items-center justify-center px-[6vw] md:px-[12vw] mt-[100px] mb-[100px]">
            <ParticleText text={content.particleText.toUpperCase()} mobileScale={0.7} />
          </div>

          {(content as any).playReelVideo && (
            <figure className="about-brief-reel">
              <video
                ref={(el) => {
                  if (el) {
                    el.play().catch(err => {
                      console.warn("Autoplay failed:", err);
                    });
                  }
                }}
                src={(content as any).playReelVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />
            </figure>
          )}

          <div className="about-brief-text">
            {content.brief.map((p, i) => (
              <p key={i}>
                {p}
              </p>
            ))}
          </div>


          {/* Games Section */}
          <div className="games-grid">
            {content.projects.map((game, index) => (
              <div key={index} className="game-item">
                <Link href={`/games/${game.title.toLowerCase().replace(/\s+/g, '-')}`} className="block group cursor-pointer text-decoration-none">
                  <h2 className="game-title">
                    {game.title}
                  </h2>
                  <div className="game-image-container">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      className="game-image transition-transform duration-1000 ease-out group-hover:scale-105"
                    />
                    <div className="game-overlay group-hover:bg-white/5 transition-colors duration-500" />
                  </div>
                  <p className="game-description">
                    {game.description}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="about-services">
          <h2 className="about-services-h2">{content.servicesTitle}</h2>

          <div className="about-services-list">
            {(content as any).services?.map((service: any, i: number) => (
              <div key={i} className="about-services-item">
                <h3 className="about-services-dt">{service.title}</h3>
                <p className="about-services-dd">{service.description}</p>
              </div>
            ))}
          </div>
        </section>


        <section className="about-shouts-wrap">
          <h2>{content.clientsTitle}</h2>
          <ul className="about-shouts-list">
            {content.clients.map((c, i) => (
              <li key={i} className="about-shouts-item"><p>{c}</p></li>
            ))}
          </ul>
        </section>

        <section className="about-footer">
          <h2>{content.footerTitle}</h2>
          <Link className="footer-cta-text" href="/contact">{content.footerCta}</Link>
        </section>

        <footer className="copyright">
          <p className="copyright-p">&copy; {new Date().getFullYear()} {content.copyright}</p>
        </footer>

        <style jsx global>{`
        body {
          margin: 0;
          color: #ffffff;
        }
        ::selection {
          background-color: #ffffff;
          color: #000000;
        }
        
        .gg-viewport-shadow-top {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 30vh;
          background: linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0) 100%);
          pointer-events: none;
          z-index: 99999;
        }
        .gg-viewport-shadow-bottom {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60vh;
          background: linear-gradient(to top, #000000 0%, rgba(0,0,0,0) 100%);
          pointer-events: none;
          z-index: 99999;
        }
      `}</style>

        <style jsx>{`
        .about {
          width: 100%;
          margin: 0 auto;
          padding: 0 0.5rem 1rem;
          position: relative;
          z-index: 10;
        }
        @media (min-width: 768px) {
          .about {
            padding: 0 1.5rem 1rem;
          }
        }
        .about-brief-reel {
          margin: 0 6vw;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          will-change: opacity;
          position: relative;
        }
        .about-brief-reel video {
          width: 100%;
          aspect-ratio: 910 / 460;
          object-fit: cover;
          display: block;
        }
        .about-brief-text {
          margin: clamp(4rem, 10vw, 8rem) 6vw 0 6vw;
          padding-top: 12vh;
          padding-bottom: 5vh;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          gap: 1.4rem;
        }
        .about-brief-text p {
          margin: 0;
          font-size: clamp(1.3rem, 2.6vw, 2.02rem);
          line-height: 1.25;
          letter-spacing: -0.03em;
          font-weight: 600;
          will-change: opacity;
          text-align: left;
        }
        .games-grid {
          margin: clamp(4rem, 10vw, 8rem) 6vw 0 6vw;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(5rem, 8vw, 8rem) clamp(0.5rem, 1.5vw, 1.5rem);
        }
        @media (max-width: 768px) {
          .games-grid {
            grid-template-columns: 1fr;
          }
        }
        .game-item {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          will-change: opacity;
        }
        .game-title {
          color: rgba(255, 255, 255, 0.9);
          font-size: clamp(10px, 0.75vw, 12px);
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin: 0;
        }
        .game-image-container {
          position: relative;
          aspect-ratio: 16 / 9;
          width: 100%;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
        }
        .game-image {
          object-fit: cover;
          transition: transform 1000ms ease-out;
        }
        .game-item:hover .game-image {
          transform: scale(1.05);
        }
        .game-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0);
          transition: background 500ms;
        }
        .game-item:hover .game-overlay {
          background: rgba(255, 255, 255, 0.05);
        }
        .game-description {
          color: #ddd;
          font-size: clamp(0.875rem, 0.9375vw, 0.9375rem);
          line-height: 1.6;
          font-weight: 600;
          max-width: 40rem;
          margin: 0;
        }
        .about-services {
          margin: clamp(6rem, 16vw, 12rem) 6vw 0 6vw;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem 2rem;
        }
        .about-services-h2 {
          margin: 0;
          font-size: clamp(0.95rem, 1.5vw, 1.25rem);
          color: rgba(255, 255, 255, 0.8);
          will-change: opacity;
        }
        .about-services-list {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }
        .about-services-item {
          will-change: opacity;
        }
        .about-services-dt {
          margin: 0 0 0.8rem;
          font-size: clamp(1.15rem, 2.2vw, 2rem);
          line-height: 1.2;
          letter-spacing: -0.03em;
          font-weight: 600;
        }
        .about-services-dd {
          font-size: clamp(0.9rem, 1.2vw, 1.1rem);
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
          max-width: 60ch;
        }
        .about-shouts-wrap {
          margin-top: clamp(8rem, 20vw, 16rem);
          text-align: center;
          display: grid;
          justify-items: center;
          gap: 0.8rem;
        }
        .about-shouts-wrap h2 {
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          will-change: opacity;
        }
        .about-shouts-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 0.4rem;
        }
        .about-shouts-item {
            will-change: opacity;
        }
        .about-shouts-item p {
          margin: 0;
          font-size: clamp(1.15rem, 2.2vw, 2rem);
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: -0.03em;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
        }
        .about-shouts-item sup {
          font-size: 0.72em;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          padding: 0.2em 0.45em;
          text-transform: uppercase;
        }

        .about-shouts-p {
          margin: 1rem 0 0;
          max-width: 28ch;
          font-size: clamp(0.88rem, 1.2vw, 1rem);
          line-height: 1.35;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
          will-change: opacity;
        }
        .about-footer {
          margin-top: clamp(8rem, 25vh, 14rem);
          padding-bottom: 60px;
          text-align: center;
          display: grid;
          justify-items: center;
          gap: 0.4rem;
          position: relative;
          z-index: 100001;
        }
        .about-footer h2 {
          margin: 0;
          max-width: 20ch;
          color: rgba(255, 255, 255, 0.8);
          font-size: clamp(0.9rem, 1.2vw, 1rem);
          line-height: 1.3;
          font-weight: 700;
          will-change: opacity;
        }
        :global(.footer-cta-text) {
          color: #ffffff !important;
          text-decoration: none !important;
          font-size: clamp(1.5rem, 4.2vw, 4.5rem) !important;
          letter-spacing: -0.05em;
          font-weight: 700;
          position: relative;
          display: inline-block;
          will-change: opacity;

        }
        :global(.footer-cta-text::after) {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -0.3rem;
          height: 0.2rem;
          background: currentColor;
          transform: scaleX(1);
          transform-origin: left center;
          transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }
        :global(.footer-cta-text:hover::after) {
          transform: scaleX(0);
          transform-origin: right center;
        }
        .copyright {
          margin-top: 5rem;
          padding-bottom: 30px;
          text-align: center;
          position: relative;
          z-index: 100001;
        }
        .copyright-p {
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.03em;
          font-size: 0.85rem;
          font-weight: 700;
          user-select: text;
          will-change: opacity;
        }
        @media (min-width: 768px) {
          .about-brief-reel {
            margin: 0 12vw;
          }
          .about-brief-text {
            margin-left: 12vw;
            margin-right: 12vw;
          }
          .games-grid {
            margin-left: 12vw;
            margin-right: 12vw;
          }
          .about-services {
            margin-left: 12vw;
            margin-right: 12vw;
          }
        }
        @media (max-width: 768px) {
          .about {
            width: calc(100% - 1.2rem);
            padding-top: 13vh;
          }
          .about-services {
            grid-template-columns: 1fr;
          }
          .about-brief-text {
            margin-top: clamp(2rem, 5vw, 4rem);
            padding-top: 6vh;
          }
          .copyright {
            padding-bottom: 100px;
          }
        }
      `}</style>
      </motion.main>
    </>
  );
}