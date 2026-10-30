import React from "react";

/* A tiny, safe text format for the CMS-edited legal pages. Blocks are separated by a blank line:
     - lines that all start with "- "        -> bullet list
     - lines that all contain " | "          -> table (the first line is the header row)
     - anything else                         -> paragraph (single line breaks are kept)
   Inside text: **bold**, [label](https://link or mailto:x or /path), and {{cookie-settings}} (button that reopens the cookie popup).
   Nothing is ever inserted as raw HTML. */
const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|\{\{cookie-settings\}\})/g;
const safeHref = (h: string) => (/^(https?:\/\/|mailto:|\/|#)/i.test(h) ? h : "#");

export function inline(text: string, cookieLabel = "Cookie settings"): React.ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**")) return <b key={i}>{part.slice(2, -2)}</b>;
    if (part === "{{cookie-settings}}") return <button key={i} type="button" className="lg-link" data-cookie-settings>{cookieLabel}</button>;
    const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (m) return <a key={i} href={safeHref(m[2])}>{m[1]}</a>;
    return part;
  });
}

export function RichText({ text, cookieLabel }: { text: string; cookieLabel?: string }) {
  const blocks = String(text || "").replace(/\r/g, "").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.every((l) => l.startsWith("- "))) {
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2), cookieLabel)}</li>)}</ul>;
        }
        if (lines.length > 1 && lines.every((l) => l.includes(" | "))) {
          const rows = lines.map((l) => l.split(" | ").map((c) => c.trim()));
          const cols = Math.min(3, Math.max(...rows.map((r) => r.length)));
          return (
            <div key={i} className={"lg-tbl" + (cols === 3 ? " lg-tbl3" : "")} role="table">
              {rows.map((r, j) => (
                <div key={j} className={"r" + (j === 0 ? " h" : "")} role="row">
                  {Array.from({ length: cols }, (_, k) => <span key={k}>{inline(r[k] || "", cookieLabel)}</span>)}
                </div>
              ))}
            </div>
          );
        }
        return <p key={i}>{lines.map((l, j) => <React.Fragment key={j}>{j > 0 && <br />}{inline(l, cookieLabel)}</React.Fragment>)}</p>;
      })}
    </>
  );
}
