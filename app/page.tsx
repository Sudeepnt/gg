'use client';

import ParticleText from './animations/ParticleText';
import CookieConsent from './animations/CookieConsent';

export default function Home() {
  return (
    <main className="px-[6vw] md:px-[12vw] fixed inset-0 overflow-hidden">
      <ParticleText className="-translate-y-[150px] md:translate-y-0" mobileScale={0.85} />
      <CookieConsent />
    </main>
  );
}
