"use client";

import { memo } from "react";

/* The site's markup. app.js rewrites this DOM after load (clients, jobs, reveals, window stack), so React must never
   re-apply it: a re-render would reset it to the raw markup and leave every section as bare headings. The compare
   function always reports "unchanged", so React renders it once (server + hydration) and then leaves it alone. */
export default memo(function Markup({ html }: { html: string }) {
  return <div style={{ display: "contents" }} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}, () => true);
