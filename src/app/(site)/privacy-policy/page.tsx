import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Gattabara Games",
  description: "How Gattabara Games LLP collects, uses and protects personal data, which cookies the site uses, and the rights you have over your data.",
  alternates: { canonical: "/privacy-policy" },
};

const MAIL = "info@gattabaragames.com";
const UPDATED = "30 October 2026";

const toc: [string, string][] = [
  ["who", "Who we are"],
  ["collect", "What we collect"],
  ["why", "Why we use it, and on what basis"],
  ["cookies", "Cookies and similar technologies"],
  ["share", "Who we share it with"],
  ["transfers", "International transfers"],
  ["keep", "How long we keep it"],
  ["security", "How we protect it"],
  ["rights", "Your rights"],
  ["children", "Children"],
  ["links", "Other websites"],
  ["changes", "Changes to this policy"],
  ["contact", "Contact and complaints"],
];

export default function PrivacyPolicy() {
  return (
    <div className="lg">
      <header className="lg-top">
        <a href="/" className="lg-brand" aria-label="Gattabara Games, back to the home page">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gg-lockup-white.png" alt="Gattabara Games" width={1451} height={295} />
        </a>
        <a href="/" className="lg-back">← Back to site</a>
      </header>

      <main className="lg-wrap">
        <p className="lg-k">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="lg-meta">Last updated {UPDATED}</p>
        <p className="lg-lead">
          We make games and run a production studio. We collect as little personal data as we can, we tell you plainly what we do with it,
          and we never sell it. This page covers gattabaragames.com and the forms on it (contact, pitch us and recruit).
        </p>

        <nav className="lg-toc" aria-label="Contents">
          <p className="lg-k">In this policy</p>
          <ol>{toc.map(([id, t]) => <li key={id}><a href={`#${id}`}>{t}</a></li>)}</ol>
        </nav>

        <section id="who">
          <h2><span>01</span>Who we are</h2>
          <p>
            The controller of your personal data is <b>Gattabara Games LLP</b>, a video game company and creative studio based in Bengaluru,
            Karnataka, India (&ldquo;Gattabara&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). You can reach us at{" "}
            <a href={`mailto:${MAIL}`}>{MAIL}</a> for anything in this policy.
          </p>
          <p>
            We handle personal data under the laws that apply to us, including India&rsquo;s Digital Personal Data Protection Act, 2023 and the
            Information Technology Act, 2000. Where we deal with people in the European Economic Area, the United Kingdom or Switzerland, we also
            follow the principles and rights of the EU General Data Protection Regulation (GDPR) and the UK GDPR.
          </p>
        </section>

        <section id="collect">
          <h2><span>02</span>What we collect</h2>
          <p>We only collect what you give us, plus a small amount of technical data your browser sends when it loads the site.</p>
          <div className="lg-tbl" role="table">
            <div className="r h" role="row"><span>Where</span><span>What</span></div>
            <div className="r" role="row"><span>Contact form</span><span>Your name, organisation (optional), email address and the message you write.</span></div>
            <div className="r" role="row"><span>Pitch us</span><span>Your name, studio, role, email, country, details about your game or project, links, and any files you choose to attach (such as a pitch deck or build).</span></div>
            <div className="r" role="row"><span>Recruit</span><span>Your name, email and the details and files you send us about your work and experience.</span></div>
            <div className="r" role="row"><span>Email</span><span>If you write to us directly, your email address and whatever you tell us.</span></div>
            <div className="r" role="row"><span>Technical data</span><span>IP address, browser type and version, device type, pages requested and time of request. This is recorded in server logs by our hosting providers to deliver the site and keep it secure.</span></div>
            <div className="r" role="row"><span>Your choices</span><span>Your cookie choice, and a few interface settings stored on your device (see Cookies below).</span></div>
          </div>
          <p>
            Please do not send us sensitive personal data (health, religion, government ID numbers and similar). We do not need it and do not ask for it.
            We do not collect data from visitors through advertising trackers or social media pixels.
          </p>
        </section>

        <section id="why">
          <h2><span>03</span>Why we use it, and on what basis</h2>
          <div className="lg-tbl" role="table">
            <div className="r h" role="row"><span>Purpose</span><span>Legal basis (GDPR Art. 6)</span></div>
            <div className="r" role="row"><span>Reply to your message and handle your enquiry or pitch</span><span>Steps you ask us to take before a contract, and our legitimate interest in running our business.</span></div>
            <div className="r" role="row"><span>Assess a recruitment application</span><span>Steps you ask us to take before a contract, or your consent where you ask us to keep your details on file.</span></div>
            <div className="r" role="row"><span>Keep the site working, secure and free from abuse</span><span>Our legitimate interest in a safe and reliable service.</span></div>
            <div className="r" role="row"><span>Remember your cookie choice</span><span>Legal obligation (storing proof of consent).</span></div>
            <div className="r" role="row"><span>Optional analytics and marketing cookies, if we ever switch them on</span><span>Your consent, which you can withdraw at any time.</span></div>
            <div className="r" role="row"><span>Meet legal, tax and accounting duties, and defend legal claims</span><span>Legal obligation and legitimate interest.</span></div>
          </div>
          <p>
            We do not use your data for automated decision-making or profiling that has legal or similarly significant effects on you.
            We do not sell personal data and we do not use it to train AI models.
          </p>
        </section>

        <section id="cookies">
          <h2><span>04</span>Cookies and similar technologies</h2>
          <p>
            A cookie is a small file a website stores on your device. We also use your browser&rsquo;s local storage, which works in a similar way.
            When you first visit, a notice lets you accept all, reject all, or choose by category. Nothing optional is set until you agree.
            You can change your mind at any time with <button type="button" className="lg-link" data-cookie-settings>Cookie settings</button>.
          </p>
          <div className="lg-tbl lg-tbl3" role="table">
            <div className="r h" role="row"><span>Name</span><span>Purpose</span><span>Type · lifetime</span></div>
            <div className="r" role="row"><span>gg_consent</span><span>Remembers your cookie choice so we do not ask again straight away.</span><span>Necessary · 6 months (cookie and local storage)</span></div>
            <div className="r" role="row"><span>ggj_*</span><span>Remembers small interface states, for example which sealed files you have opened.</span><span>Necessary · until you clear your browser data (local storage)</span></div>
            <div className="r" role="row"><span>Analytics</span><span>Statistics on how the site is used. <b>Not in use at the moment.</b> If we add them, they stay off until you accept.</span><span>Optional · set when introduced</span></div>
            <div className="r" role="row"><span>Marketing</span><span>Measuring and showing our own campaigns. <b>Not in use at the moment.</b> If we add them, they stay off until you accept.</span><span>Optional · set when introduced</span></div>
          </div>
          <p>
            You can also block or delete cookies in your browser settings. If you do, the site will still work, but we will ask for your choice again on your next visit.
          </p>
        </section>

        <section id="share">
          <h2><span>05</span>Who we share it with</h2>
          <p>We share personal data only with service providers who run the site for us (&ldquo;processors&rdquo;), under contract and only for that purpose:</p>
          <ul>
            <li><b>Vercel Inc.</b>: hosts and delivers the website.</li>
            <li><b>Supabase</b>: database and file storage for the messages, pitches and attachments you submit.</li>
            <li><b>Cloudflare, Inc.</b>: delivers images and videos, and stores the site&rsquo;s media files.</li>
            <li><b>Google Fonts</b>: the site loads its typefaces from Google&rsquo;s servers, which means your IP address is sent to Google when a page loads.</li>
            <li><b>Our email and office tools</b>: used to read and reply to what you send us.</li>
          </ul>
          <p>
            We may also disclose data where the law or a court requires it, to protect our rights, or as part of a merger, sale or restructuring of the business,
            in which case the new owner must honour this policy. We do not share your data with advertisers or data brokers.
          </p>
        </section>

        <section id="transfers">
          <h2><span>06</span>International transfers</h2>
          <p>
            We are in India and our providers operate worldwide, so your data may be processed outside the country where you live, including in the United States and India.
            When data from the EEA, UK or Switzerland is transferred to a country without an adequacy decision, we rely on appropriate safeguards such as the European
            Commission&rsquo;s Standard Contractual Clauses, which our providers offer. You can ask us for a copy of the safeguards that apply.
          </p>
        </section>

        <section id="keep">
          <h2><span>07</span>How long we keep it</h2>
          <ul>
            <li><b>Enquiries and pitches:</b> for as long as needed to deal with them, and normally no longer than 24 months after our last contact with you.</li>
            <li><b>Recruitment applications:</b> up to 12 months after the role closes, unless you ask us to keep your details longer for future openings.</li>
            <li><b>Cookie choice:</b> 6 months.</li>
            <li><b>Server logs:</b> a short period set by our hosting providers, normally under 90 days.</li>
            <li><b>Business records</b> we must keep by law (for example for tax): for the period the law requires.</li>
          </ul>
          <p>After that we delete the data or anonymise it so it can no longer identify you.</p>
        </section>

        <section id="security">
          <h2><span>08</span>How we protect it</h2>
          <p>
            Traffic to the site is encrypted with HTTPS. Access to submitted data is limited to people at Gattabara who need it, and our providers keep data on secured
            infrastructure. No system is perfectly secure. If a breach puts your rights at risk, we will tell you and the relevant authority as the law requires.
          </p>
        </section>

        <section id="rights">
          <h2><span>09</span>Your rights</h2>
          <p>Depending on where you live, you have the right to:</p>
          <ul>
            <li><b>Access</b> the personal data we hold about you and get a copy.</li>
            <li><b>Correct</b> data that is wrong or incomplete.</li>
            <li><b>Erase</b> your data, when we no longer need it or you withdraw consent.</li>
            <li><b>Restrict</b> how we use your data while a concern is looked into.</li>
            <li><b>Object</b> to uses based on our legitimate interests.</li>
            <li><b>Take your data with you</b> (portability) in a common format, where it applies.</li>
            <li><b>Withdraw consent</b> at any time, without affecting what we did before. Use Cookie settings for cookies, or email us.</li>
            <li><b>Nominate</b> another person to exercise your rights for you, and <b>seek grievance redressal</b>, as the Indian DPDP Act provides.</li>
          </ul>
          <p>
            To use any of these, write to <a href={`mailto:${MAIL}`}>{MAIL}</a>. We may need to confirm who you are first, and we aim to answer within 30 days.
            It is free unless a request is clearly excessive.
          </p>
        </section>

        <section id="children">
          <h2><span>10</span>Children</h2>
          <p>
            This website is for adults and professionals: studios, creators, partners and applicants. It is not directed at children under 16 and we do not knowingly
            collect their data. If you think a child has sent us personal data, email us and we will delete it.
          </p>
        </section>

        <section id="links">
          <h2><span>11</span>Other websites</h2>
          <p>
            The site may link to other websites, such as social profiles, store pages or the sites of partner studios. We do not control them and are not responsible for
            their privacy practices. Please read their policies.
          </p>
        </section>

        <section id="changes">
          <h2><span>12</span>Changes to this policy</h2>
          <p>
            We will update this page when our practices change, and the date at the top will change with it. If a change matters to you, for example a new kind of
            cookie, we will ask for your consent again where the law requires it.
          </p>
        </section>

        <section id="contact">
          <h2><span>13</span>Contact and complaints</h2>
          <p>
            Gattabara Games LLP<br />Bengaluru, Karnataka, India<br /><a href={`mailto:${MAIL}`}>{MAIL}</a>
          </p>
          <p>
            If you are in the EEA, the UK or Switzerland, you may also complain to your local data protection authority. In India you can raise a grievance with us first,
            and then with the Data Protection Board of India. We would appreciate the chance to put things right before you do.
          </p>
        </section>
      </main>

      <footer className="lg-foot">
        <span>© 2026 Gattabara Games LLP. All rights reserved.</span>
        <button type="button" className="lg-link" data-cookie-settings>Cookie settings</button>
      </footer>
    </div>
  );
}
