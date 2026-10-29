import markup from "./markup";
import Markup from "./SiteMarkup";
import Boot from "./Boot";
import content from "@/content/site-content.json";
import { applyTexts } from "@/content/pageTextRules";

export default function Home() {
  return (
    <>
      <Markup html={applyTexts(markup, (content as { texts?: Record<string, string> }).texts)} />
      {/* app.js fills this with the schema.org graph */}
      <script type="application/ld+json" id="ldjson" />
      {/* the editable site content (edited from /admingg); read by app.js, cms.js and pitch.js */}
      <script id="gg-content" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(content).replace(/</g, "\\u003c") }} />
      <Boot />
    </>
  );
}
