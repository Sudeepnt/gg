import { notFound } from "next/navigation";

/* any web address that does not exist lands here, so the "Page not found" page is drawn inside the site (see ../not-found.tsx) */
export default function CatchAll() {
  notFound();
}
