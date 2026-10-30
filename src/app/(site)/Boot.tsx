"use client";

import { useEffect } from "react";

/* Attaches the site's behaviour (window stack, hero, press kits, Machine view) to the markup rendered by page.tsx.
   Lenis must be on window before app.js runs; app.js falls back to native scroll without it. */
export default function Boot() {
  useEffect(() => {
    const w = window as unknown as { Lenis?: unknown; __ggBooted?: boolean };
    if (w.__ggBooted) return;
    w.__ggBooted = true;
    (async () => {
      w.Lenis = (await import("lenis")).default;
      await import("../../inquiries.js");
      /* the carousel videos start downloading right away, in parallel with the rest of the page script */
      const cms = import("../../cms-apply.js");
      await import("../../app.js");
      await cms;
      await import("../../pitch.js");
    })();
  }, []);
  return null;
}
