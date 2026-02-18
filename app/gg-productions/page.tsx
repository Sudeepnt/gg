"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import ParticleText from "../animations/ParticleText";


const games = [
  {
    title: "ORBITALS",
    image: "/clients/Orbitals Environment 2.png",
    description: "Step into a lovingly crafted retro anime world as explorers Maki and Omura brave the deadly Storm Wall and the perils beyond, all to save their home. In this 2-player co-op puzzle adventure, only brains, heart and unyielding resolve will open the path forward."
  },
  {
    title: "ONTOS",
    image: "/clients/Machine.png",
    description: "A sci-fi mystery set on the repurposed moon hotel Samsara. Uncover cryptic experiments, face unsettling encounters, and piece together a mind-bending narrative. The deeper you go, the more the truth unravels as you confront the ultimate question: What is reality?"
  },
  {
    title: "TANKRAT",
    image: "/clients/TankHead 2025-11-16 21-26-46_666.png",
    description: "A dying world, flesh given way to steel. Swarms of corrupted mech-monsters roam a desolate land. Search and destroy, scavenge and dismantle, rebuild yourself from the wreckage. What you take becomes what you are. Survive the wasteland. Make it to Highpoint."
  },
  {
    title: "CLAIR OBSCUR",
    image: "/clients/expedition33-screenshots-01.jpg",
    description: "Lead the members of Expedition 33 on their quest to destroy the Paintress so that she can never paint death again. Explore a world of wonders inspired by Belle Époque France and battle unique enemies in this turn-based RPG with real-time mechanics."
  }
];

export default function AboutPage() {
  const rootRef = useRef<HTMLElement | null>(null);

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
            <ParticleText text="GG PRODUCTIONS" mobileScale={0.7} />
          </div>

          <figure className="about-brief-reel">
            <video src="https://r2.studiolumio.com/lumio-reel.mp4" autoPlay muted loop playsInline />
          </figure>

          <div className="about-brief-text">
            <p>
              At GG Productions, we know what it’s like to build games with tight budgets and big ambitions. Every decision is about momentum, what to ship now, what to defer, and where the right support can unblock your next milestone.
            </p>

            <p>
              We stay lean so you can move fast, plugging in exactly the talent you need, when you need it, across art, tech, design, and production.
            </p>

            <p>
              With clear milestones and transparent delivery, we integrate as an extension of your team, whether for full production or focused co-development, so you keep creative control while scaling execution globally.
            </p>

          </div>


          {/* Games Section */}
          <div className="games-grid">
            {games.map((game, index) => (
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
          <h2 className="about-services-h2">Our Services</h2>

          <div className="about-services-list">

            <ul className="about-services-dl">
              <li className="about-services-dt">Game Design & Systems Design</li>
              <li className="about-services-dt">Gameplay Prototyping</li>
              <li className="about-services-dt">Level Design</li>
              <li className="about-services-dt">Combat & Mechanics Design</li>
              <li className="about-services-dt">Narrative & Worldbuilding</li>
            </ul>

            <ul className="about-services-dl">
              <li className="about-services-dt">Technical Game Development (Unity / Unreal)</li>
              <li className="about-services-dt">Multiplayer & Backend Systems</li>
              <li className="about-services-dt">Game UI / UX Design</li>
              <li className="about-services-dt">Art Direction & Visual Development</li>
              <li className="about-services-dt">Full Production & Co-Development</li>
            </ul>

          </div>
        </section>


        <section className="about-shouts-wrap">
          <h2>Our Clients</h2>
          <ul className="about-shouts-list">
            <li className="about-shouts-item"><p>Nexon Games MapleStory Worlds</p></li>
            <li className="about-shouts-item"><p>Singular Scheme</p></li>
            <li className="about-shouts-item"><p>BattleBucks</p></li>
            <li className="about-shouts-item"><p>Magadha Studios</p></li>
            <li className="about-shouts-item"><p>Qila Games</p></li>
            <li className="about-shouts-item"><p>Studio Cupcakes</p></li>
          </ul>
        </section>

        <section className="about-footer">
          <h2>Looking for a game development partner?</h2>
          <a className="footer-cta-text" href="/contact">Let&apos;s make magic</a>
        </section>

        <footer className="copyright">
          <p className="copyright-p">&copy; {new Date().getFullYear()} Gattabara Games</p>
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
          display: grid;
          gap: 2rem;
        }
        .about-services-dl {
          margin: 0;
          will-change: opacity;
        }
        .about-services-dt {
          margin: 0 0 0.5rem;
          font-size: clamp(1.15rem, 2.2vw, 2rem);
          line-height: 1.2;
          letter-spacing: -0.03em;
          font-weight: 600;
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
          gap: 0.8rem;
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
        .footer-cta-text {
          color: #ffffff;
          text-decoration: none;
          font-size: clamp(1.5rem, 4.2vw, 4.5rem);
          letter-spacing: -0.05em;
          font-weight: 700;
          position: relative;
          will-change: opacity;
        }
        .footer-cta-text::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -0.3rem;
          height: 0.2rem;
          background: currentColor;
          transform-origin: left center;
          transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .footer-cta-text:hover::after {
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
          .copyright {
            padding-bottom: 100px;
          }
        }
      `}</style>
      </motion.main>
    </>
  );
}