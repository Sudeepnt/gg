'use client';

import ParticleText from './animations/ParticleText';
import CookieConsent from './animations/CookieConsent';

export default function Home() {
  return (
    <main className="px-[12vw]">
      <ParticleText />
      <CookieConsent />
    </main>
  );
}
