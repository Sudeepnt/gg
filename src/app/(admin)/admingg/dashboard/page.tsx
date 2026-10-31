"use client";

export const dynamic = "force-dynamic";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    Home, Newspaper, Gamepad2, BookOpen, Clapperboard, Mail, Users, Building2, Briefcase, Send, Phone, Globe, Type, Cpu, ChevronDown, Sun, Moon, Inbox, ClipboardList, RefreshCw, Paperclip, History,
    Shield, Settings, Save, LogOut, Download, UploadCloud, Plus, Trash2, ArrowUp, ArrowDown, Loader2, Check, X, Image as ImageIcon, Film,
} from "lucide-react";
import pageTexts from "@/content/page-texts.json";
import { UI_STRINGS } from "@/content/uiStrings.js";
import cmsSnapshot from "@/cms-data.json";
import { getSiteContent, saveSiteContent, uploadAsset, logoutAdmin, getSubmissions, deleteSubmission, restorePreviousContent, getUploadUrl, getPosterUploadUrl } from "@/app/actions/adminActions";

/* ---------- what can be edited, per tab. Labels are the words the website itself shows. ---------- */
type F = { key: string; label: string; type: "group" | "text" | "toggle" | "textarea" | "lines" | "tags" | "number" | "select" | "image" | "video" | "rows"; options?: string[] | "disciplines" | "tiers"; hint?: string;
    itemFields?: F[]; blank?: () => any; addLabel?: string; itemLabel?: (it: any) => string;
    /* a wording of the page itself (not a field of the content): the key and the original text it is stored under, in content.texts or content.uiText */
    store?: "texts" | "uiText"; def?: string;
    /* inside a list item: only show this field when the item says so (e.g. "Developed together with" only for co-development games) */
    showIf?: (item: any) => boolean };
type Block =
    | { kind: "object"; path: string; title: string; fields: F[]; hint?: string; cols?: 2 | 3 }
    | { kind: "lines"; path: string; title: string; hint?: string }
    | { kind: "heading"; title: string; hint?: string }
    | { kind: "submissions"; which: "general" | "applications" }
    | { kind: "list"; path: string; title: string; addLabel: string; fields: F[]; blank: () => any; label: (it: any) => string; hint?: string };

/* the application form's fields are named after the sentence the visitor reads, so the client sees the same words */
const FORM_ORDER = ["studioName", "studioWebsite", "yourName", "email", "country", "gameTitle", "collaboration", "collabCoDev", "collabCoFunding", "collabPublishing", "selectPlaceholder", "description", "totalBudget", "budgetAsk", "platforms", "platformOptions", "genre", "compTitle", "materials", "chooseFile", "dragDrop", "alertFiles", "alertSize", "materialsLinks", "multiplayer", "launchWindow", "estimatedPrice", "teamSize", "additionalNotes", "howHeard", "notRobot", "alertRobot", "captchaNote", "captchaAction", "captchaBrand", "captchaPrivacy", "captchaTerms", "submit", "submitting", "submitted", "finalizing", "tryAgain", "sendingTitle", "failTitle", "successTitle", "successMessage", "successButton"];
const FORM_LABELS = (cmsSnapshot as any).form.labels as Record<string, string>;
const FORM_SORTED = FORM_ORDER.flatMap((k) => [k, k + "Hint", k + "Desc"]).filter((k) => k in FORM_LABELS);
const FORM_LABEL_FIELDS: F[] = FORM_SORTED.map((k) => [k, FORM_LABELS[k]] as [string, string]).map(([k, v]) => ({ key: k, label: String(v).length > 90 ? String(v).slice(0, 87) + "\u2026" : String(v), type: String(v).length > 70 ? "textarea" as const : "text" as const }));

/* every fixed word on the press-kit page, in page order: [key, where it appears, the website's wording] */
const PK_LABELS: [string, string, string][] = [
  ["navFact", "Top menu", "Factsheet"],
  ["navDesc", "Top menu", "Description"],
  ["navMedia", "Top menu", "Media"],
  ["navAbout", "Top menu", "About"],
  ["navContact", "Top menu", "Contact"],
  ["tag", "Title block: small tag", "PRESS KIT"],
  ["release", "Title block", "Release date:"],
  ["insider", "Button (sealed games)", "Join the insider list"],
  ["downloadAll", "Button", "↓ Download all media (.zip)"],
  ["inquiry", "Button", "Press inquiry"],
  ["fact", "Heading", "Factsheet"],
  ["factDl", "Button", "↓ Factsheet .md"],
  ["descTitle", "Heading", "Description"],
  ["short", "Small heading", "Short description"],
  ["descLabel", "Small heading", "Description"],
  ["features", "Small heading", "Features"],
  ["feature", "Feature card tag (a number follows)", "FEATURE"],
  ["restricted", "Sealed games", "Access restricted"],
  ["sealedLine", "Sealed games", "This file is sealed."],
  ["hold", "Sealed games: button", "Hold to decrypt"],
  ["decrypting", "Sealed games: while holding (a % follows)", "Decrypting"],
  ["decrypted", "Sealed games: button when done", "Decrypted"],
  ["decryptedLine", "Sealed games: after decrypting", "File decrypted."],
  ["withheld", "Sealed games: factsheet values", "Withheld until reveal"],
  ["media", "Heading", "Media"],
  ["embargoTag", "Sealed games: tag", "EMBARGOED"],
  ["embargoText", "Sealed games", "Media embargoed until reveal day"],
  ["trailer", "Media: heading", "Trailer"],
  ["comingSoonTag", "Media: tag", "COMING SOON"],
  ["comingSoonText", "Media: placeholder", "Trailer · coming soon"],
  ["logo", "Media: heading", "Logo"],
  ["logoSpec", "Media: tag", "TRANSPARENT PNG · 1600×640"],
  ["black", "Media: logo caption", "Black"],
  ["white", "Media: logo caption", "White"],
  ["screenshots", "Media: heading", "Screenshots"],
  ["screenshotSpec", "Media: tag", "PNG · 1920×1080"],
  ["promo", "Media: heading", "Promo graphics"],
  ["promoSpec", "Media: tag", "STORE CAPSULES"],
  ["cap_main", "Media: capsule name", "Main capsule"],
  ["cap_vertical", "Media: capsule name", "Vertical capsule"],
  ["cap_small", "Media: capsule name", "Small capsule"],
  ["note", "Media: note", "* Images are key visuals from our halftone renderer until final in-game captures are released."],
  ["dlPng", "Media: download button", "↓ PNG"],
  ["dlFile", "Media: download button for uploaded files", "↓ File"],
  ["about", "Heading", "About the developer"],
  ["logoWhiteBtn", "About: button", "↓ Logo (white)"],
  ["logoBlackBtn", "About: button", "↓ Logo (black)"],
  ["contact", "Heading", "Contact"],
  ["others", "Heading", "Other titles"],
  ["pressKitWord", "Other titles: caption", "Press kit"]
];
const PK_GROUPS: Record<string, string> = { navFact: "Top menu of the press kit", tag: "Title block", fact: "Factsheet", descTitle: "Description", restricted: "Sealed games", media: "Media", about: "About the developer", contact: "Contact", others: "Other titles (bottom)" };
const PK_LABEL_FIELDS: F[] = PK_LABELS.flatMap(([key, where, text]) => [
    ...(PK_GROUPS[key] ? [{ key: "group:" + key, label: PK_GROUPS[key], type: "group" as const }] : []),
    { key, label: `${where} \u2192 \u201c${text.length > 60 ? text.slice(0, 57) + "\u2026" : text}\u201d`, type: text.length > 70 ? "textarea" as const : "text" as const }]);

/* a big heading that starts a new group of boxes inside a game (Factsheet, Trailer, Logo ...) */
const GH = (label: string, hint?: string): F => ({ key: "group:" + label, label, type: "group", hint });

type Tab = { id: string; label: string; icon: any; blocks: Block[] };
const RAW: Tab[] = [
    { id: "inquiries", label: "Inquiries", icon: Inbox, blocks: [{ kind: "submissions", which: "general" }] },
    { id: "applications", label: "Applications", icon: ClipboardList, blocks: [{ kind: "submissions", which: "applications" }] },
    { id: "hero", label: "Home", icon: Home, blocks: [
        { kind: "object", path: "hero", title: "Hero", fields: [
            { key: "line1", label: "Headline, line 1", type: "text" }, { key: "line2", label: "Headline, line 2", type: "text" },
            { key: "sub", label: "Text under the headline", type: "textarea" }] },
        { kind: "list", path: "heroSlides", title: "Carousel slides", addLabel: "Add slide", label: x => (x.title || "New slide") + (x.caption ? " \u00b7 " + x.caption : ""),
          blank: () => ({ title: "", caption: "", pc: "", mobile: "" }),
          fields: [
            { key: "title", label: "Name shown on the slide (white tag)", type: "text", hint: "Free text, independent of the Games section." },
            { key: "caption", label: "Small text next to the name", type: "text" },
            { key: "pc", label: "PC video (16:9, about 7 seconds)", type: "video", hint: "Plays on computers and tablets." },
            { key: "mobile", label: "Mobile video (9:16, about 7 seconds)", type: "video", hint: "Plays on phones. Leave empty to use the PC video." }] }] },
    { id: "news", label: "News", icon: Newspaper, blocks: [
        { kind: "list", path: "news", title: "News", addLabel: "Add news item", label: n => n.title || "New item",
          blank: () => ({ date: new Date().toISOString().slice(0, 10).replace(/-/g, "."), category: "STUDIO", title: "", body: "" }),
          fields: [{ key: "date", label: "Date", type: "text", hint: "Shown as YYYY.MM.DD" }, { key: "category", label: "Category", type: "text", hint: "STUDIO, GAMES, PRODUCTIONS, RECRUIT \u2026" },
            { key: "title", label: "Title", type: "text" }, { key: "body", label: "Text", type: "textarea" }] }] },
    { id: "philosophy", label: "Philosophy", icon: BookOpen, blocks: [
        { kind: "object", path: "philosophy", title: "Mission \u00b7 Vision \u00b7 Values", fields: [
            { key: "mission", label: "Mission", type: "text" }, { key: "vision", label: "Vision", type: "text" },
            { key: "valuesIntro", label: "Values", type: "textarea" }] },
        { kind: "list", path: "philosophy.values", title: "The values", addLabel: "Add value", label: v => v.title || "New value", blank: () => ({ title: "", text: "" }),
          fields: [{ key: "title", label: "Title", type: "text" }, { key: "text", label: "Text", type: "textarea" }] },
        { kind: "object", path: "philosophy", title: "Handbook line (bottom of the section)", fields: [{ key: "doc", label: "From the studio handbook", type: "textarea" }] }] },
    { id: "games", label: "Games", icon: Gamepad2, blocks: [
        { kind: "object", path: "gamesPage", title: "Game cards: picture area", fields: [
            { key: "showComingSoon", label: "Show \u201cComing soon\u201d instead of the pictures", type: "toggle", hint: "Off shows each game\u2019s key art on its card." },
            { key: "comingSoonText", label: "Coming soon text", type: "text" }] },
        { kind: "list", path: "games", title: "Games", addLabel: "Add game", label: g => g.title || "New game",
          blank: () => ({ id: "game-" + Date.now().toString(36), title: "", code: "", status: "In development", collaboratingWith: [], platformLinks: [], cardCaption: "", tags: [], image: "",
            factsheet: [{ label: "Developer", value: "Gattabara Games" }, { label: "Based in", value: "Bengaluru, India" }, { label: "Genre", value: "" }, { label: "Players", value: "" },
              { label: "Platforms", value: "To be announced" }, { label: "Release date", value: "To be announced" }, { label: "Status", value: "In development" },
              { label: "Website", value: "gattabaragames.com" }, { label: "Press contact", value: "info@gattabaragames.com" }],
            shortDescription: "", description: [], features: [], noPressKit: false, trailer: "", trailerPoster: "", logoBlack: "", logoWhite: "",
            screenshots: [1, 2, 3, 4, 5, 6].map((n) => ({ caption: `Frame 0${n}`, image: "" })), promoMain: "", promoVertical: "", promoSmall: "", sealedText: "", summary: "", pressAbout: "", pressStudioLogo: "", pressStudioLogoBlack: "", pressContact: [] }),
          fields: [
            GH("Game card", "What the Games section shows for this game."),
            { key: "title", label: "Title", type: "text" },
            { key: "status", label: "Status", type: "select", options: ["In development", "In co-development", "Released", "Sealed"], hint: "\u201cIn co-development\u201d shows the game under In development with a Co-development badge on its picture. \u201cSealed\u201d hides the details on the press kit." },
            { key: "collaboratingWith", label: "Developed together with", type: "rows", showIf: (g) => /co-?dev/i.test(g.status || ""), addLabel: "Add collaborator", blank: () => ({ name: "" }), itemLabel: r => r.name || "New collaborator",
              hint: "The studios or people you are co-developing this game with, one row per name. The game card shows them as \u201cWith \u2026\u201d.",
              itemFields: [{ key: "name", label: "Name", type: "text" }] },
            { key: "platformLinks", label: "Available on (platform logos)", type: "rows", addLabel: "Add platform", blank: () => ({ platform: "Steam", url: "" }), itemLabel: r => r.platform || "New platform",
              hint: "Shown as logos under the game and on its press kit. Paste a store link to make a logo clickable; leave the link empty to show the logo only.",
              itemFields: [{ key: "platform", label: "Platform", type: "select", options: ["Steam", "Epic Games Store", "PlayStation", "Xbox", "Nintendo Switch", "App Store", "Google Play", "Windows"] },
                { key: "url", label: "Store link (optional)", type: "text", hint: "https://\u2026" }] },
            { key: "cardCaption", label: "Line under the title (Games card)", type: "text" },
            { key: "code", label: "Press kit code (shown after \u201cPRESS KIT\u201d)", type: "text" },
            { key: "image", label: "Key art", type: "image" },
            { key: "noPressKit", label: "Hide the press kit for now", type: "toggle", hint: "On: the game card is not clickable." },
            { key: "tags", label: "Tags (comma separated)", type: "tags" },
            { key: "factsheet", label: "Press kit \u2192 Factsheet", type: "rows", addLabel: "Add row", blank: () => ({ label: "", value: "" }), itemLabel: r => r.label || "New row",
              itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "value", label: "Value", type: "text" }] },
            GH("Press kit \u2192 Description"),
            { key: "shortDescription", label: "Short description", type: "textarea" },
            { key: "description", label: "Description (one paragraph per line)", type: "lines" },
            { key: "features", label: "Press kit \u2192 Features", type: "rows", addLabel: "Add feature", blank: () => ({ title: "", text: "" }), itemLabel: r => r.title || "New feature",
              itemFields: [{ key: "title", label: "Feature title", type: "text" }, { key: "text", label: "Feature text", type: "textarea" }] },
            GH("Press kit \u2192 Sealed games only"),
            { key: "sealedText", label: "Text shown after \u201cHold to decrypt\u201d (sealed games)", type: "textarea" },
            GH("Press kit \u2192 Media: Trailer"),
            { key: "trailer", label: "Trailer (video)", type: "video", hint: "Shown in the press kit's Trailer section, and the first 10 seconds play when a visitor hovers the game card. Leave empty to show \u201ccoming soon\u201d." },
            { key: "trailerPoster", label: "Trailer poster image (optional)", type: "image" },
            GH("Press kit \u2192 Media: Logo"),
            { key: "logoBlack", label: "Logo \u2192 01 Black", type: "image", hint: "Transparent PNG, about 1600\u00d7640. Leave empty to use the generated logo." },
            { key: "logoWhite", label: "Logo \u2192 02 White", type: "image", hint: "Transparent PNG, about 1600\u00d7640. Leave empty to use the generated logo." },
            { key: "screenshots", label: "Press kit \u2192 Media: Screenshots", type: "rows", addLabel: "Add screenshot", blank: () => ({ caption: "", image: "" }), itemLabel: r => r.caption || "New screenshot",
              hint: "PNG, 1920\u00d71080. A row without an image shows a generated frame.",
              itemFields: [{ key: "caption", label: "Caption", type: "text" }, { key: "image", label: "Screenshot", type: "image" }] },
            GH("Press kit \u2192 Media: Promo graphics"),
            { key: "promoMain", label: "Promo graphics \u2192 Main capsule \u00b7 1232\u00d7706", type: "image" },
            { key: "promoVertical", label: "Promo graphics \u2192 Vertical capsule \u00b7 748\u00d7896", type: "image" },
            { key: "promoSmall", label: "Promo graphics \u2192 Small capsule \u00b7 462\u00d7174", type: "image", hint: "Leave a capsule empty to use the generated one." },
            GH("Press kit \u2192 About the developer (this game only)"),
            { key: "pressAbout", label: "Press kit \u2192 About the developer (this game only)", type: "textarea", hint: "Leave empty to use the default in Games \u2192 Press kit defaults." },
            { key: "pressStudioLogo", label: "Press kit \u2192 About the developer \u2192 Logo (white), this game only", type: "image", hint: "Leave empty to use the default." },
            { key: "pressStudioLogoBlack", label: "Press kit \u2192 About the developer \u2192 Logo (black), this game only", type: "image", hint: "Leave empty to use the default." },
            { key: "pressContact", label: "Press kit \u2192 Contact rows (this game only)", type: "rows", addLabel: "Add row", blank: () => ({ label: "", value: "" }), itemLabel: r => r.label || "New row",
              hint: "Leave empty to use the default rows in Games \u2192 Press kit defaults.",
              itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "value", label: "Value", type: "text" }] },
            GH("Machine view"),
            { key: "summary", label: "Machine view summary", type: "textarea", hint: "Shown for this game in the Machine view. Leave empty to reuse the short description. Not shown for sealed games." }] },
        { kind: "object", path: "pressKit", title: "Press kit (all games)", fields: [{ key: "about", label: "About the developer", type: "textarea" },
            { key: "studioLogo", label: "About the developer \u2192 Logo (white)", type: "image" }, { key: "studioLogoBlack", label: "About the developer \u2192 Logo (black)", type: "image" }] },
        { kind: "list", path: "pressKit.contact", title: "Press kit \u2192 Contact", addLabel: "Add row", label: r => r.label || "New row", blank: () => ({ label: "", value: "" }),
          fields: [{ key: "label", label: "Label", type: "text" }, { key: "value", label: "Value", type: "text" }] },
        { kind: "object", path: "pressKitLabels", title: "Press kit page: headings, buttons and small labels (all games, in page order)", fields: PK_LABEL_FIELDS },
] },
    { id: "production", label: "GG Productions", icon: Clapperboard, blocks: [
        { kind: "list", path: "production.services", title: "Services", addLabel: "Add service", label: s => s.title || "New service", blank: () => ({ title: "", description: "", tags: [], quote: "" }),
          fields: [{ key: "title", label: "Title", type: "text" }, { key: "description", label: "Description", type: "textarea" },
            { key: "tags", label: "Tags (comma separated)", type: "tags" }, { key: "quote", label: "Quote (optional)", type: "text" }] },
        { kind: "list", path: "production.specialties", title: "Specialties", addLabel: "Add specialty", label: s => `${s.name || "New specialty"} \u00b7 ${s.score ?? ""}`, blank: () => ({ name: "", score: 90, description: "" }),
          fields: [{ key: "name", label: "Name", type: "text" }, { key: "score", label: "Score (0\u2013100)", type: "number" }, { key: "description", label: "Description", type: "text" }] }] },
    { id: "network", label: "Network", icon: Globe, blocks: [
        { kind: "lines", path: "network.disciplines", title: "Disciplines", hint: "One per line" },
        { kind: "lines", path: "network.tiers", title: "Quality tiers", hint: "One per line" },
        { kind: "list", path: "network.people", title: "Global roster (sample)", addLabel: "Add person", label: p => `${p.role || "New person"} \u00b7 ${p.city || ""}`, blank: () => ({ role: "", city: "", lat: 0, lon: 0, discipline: "", tier: "", experience: "" }),
          fields: [{ key: "role", label: "Role", type: "text" }, { key: "city", label: "City", type: "text" }, { key: "lat", label: "Latitude", type: "number" }, { key: "lon", label: "Longitude", type: "number" },
            { key: "discipline", label: "Discipline", type: "select", options: "disciplines", hint: "Pick from the Disciplines list above." }, { key: "tier", label: "Quality tier", type: "select", options: "tiers", hint: "Pick from the Quality tiers list above." }, { key: "experience", label: "Experience", type: "text", hint: "e.g. 9 yrs" }] },
        { kind: "object", path: "networkCall", title: "Roster call window: status lines", fields: [
            { key: "idle", label: "Before the call (idle)", type: "text" }, { key: "ring", label: "While the call rings", type: "text" }, { key: "connected", label: "When connected", type: "text" }, { key: "missed", label: "When missed", type: "text" }, { key: "ended", label: "When the call ends", type: "text" },
            { key: "onCall", label: "Roster list: available", type: "text" }, { key: "standby", label: "Roster list: not available", type: "text" }] }] },
    { id: "message", label: "Message", icon: Mail, blocks: [
        { kind: "object", path: "letter", title: "From the founding partners", fields: [
            { key: "big", label: "Big line", type: "text" }, { key: "to", label: "Opening line", type: "text" }] },
        { kind: "lines", path: "letter.before", title: "Paragraphs before the numbered list", hint: "One paragraph per line" },
        { kind: "list", path: "letter.principles", title: "Numbered list", addLabel: "Add item", label: p => p.title || "New item", blank: () => ({ title: "", text: "" }),
          fields: [{ key: "title", label: "Bold lead-in", type: "text" }, { key: "text", label: "Text", type: "textarea" }] },
        { kind: "lines", path: "letter.after", title: "Paragraphs after the numbered list", hint: "One paragraph per line" },
        { kind: "object", path: "letter", title: "Signature (bottom of the letter)", fields: [
            { key: "signature", label: "Signature", type: "text" }, { key: "signatureLine", label: "Signature sub-line", type: "text" }] }] },
    { id: "leadership", label: "Leadership", icon: Users, blocks: [
        { kind: "list", path: "leadership", title: "Leadership", addLabel: "Add person", label: p => p.name || "New person", blank: () => ({ name: "", role: "", photo: "", bio: "", id: "" }),
          fields: [{ key: "photo", label: "Profile photo", type: "image", hint: "A square photo works best. Leave it empty to keep the generated portrait." },
            { key: "name", label: "Name", type: "text" }, { key: "role", label: "Role", type: "text" },
            { key: "bio", label: "Bio", type: "textarea" }, { key: "id", label: "ID", type: "text", hint: "e.g. GG-001" }] }] },
    { id: "clients", label: "Clients", icon: Building2, blocks: [
        { kind: "list", path: "clients", title: "Clients", addLabel: "Add client", label: c => c.name || "New client", blank: () => ({ name: "", logo: "" }),
          fields: [{ key: "logo", label: "Logo", type: "image" }, { key: "name", label: "Name", type: "text" }] },
        { kind: "object", path: "clientsPage", title: "Last tile (call to action)", fields: [{ key: "ctaTitle", label: "Title", type: "text" }, { key: "ctaText", label: "Link text", type: "text" }] }] },
    { id: "recruit", label: "Recruit", icon: Briefcase, blocks: [
        { kind: "list", path: "jobs", title: "Jobs", addLabel: "Add job", label: j => j.role || "New job", blank: () => ({ role: "", type: "Contract", location: "Remote" }),
          fields: [{ key: "role", label: "Role", type: "text" }, { key: "type", label: "Type", type: "text", hint: "e.g. Contract, Full-time" }, { key: "location", label: "Location", type: "text" }] }] },
    { id: "pitch", label: "Pitch us", icon: Send, blocks: [
        { kind: "object", path: "pitch", title: "Heading", fields: [{ key: "title", label: "Heading", type: "text" }] },
        { kind: "lines", path: "pitch.paragraphs", title: "Paragraphs", hint: "One paragraph per line" },
        { kind: "object", path: "pitch", title: "Button (below the text)", fields: [{ key: "buttonText", label: "Button", type: "text" }] },
        { kind: "object", path: "applicationForm", title: "Application form (opens when someone clicks the button)", fields: [{ key: "title", label: "Form title", type: "text" }, { key: "intro", label: "Form introduction", type: "textarea" }] },
        { kind: "object", path: "applicationForm.labels", title: "Application form \u2192 every label, hint and message", fields: FORM_LABEL_FIELDS }] },
    { id: "contact", label: "Contact", icon: Phone, blocks: [
        /* top to bottom, exactly as the Contact page reads */
        { kind: "object", path: "contactPage", title: "Top of the page: sub-heading and the two tabs", fields: [
            { key: "subContact", label: "Sub-heading under \u201cContact\u201d", type: "text" },
            { key: "tabContact", label: "First tab", type: "text" }, { key: "tabPitch", label: "Second tab", type: "text" },
            { key: "subPitch", label: "Sub-heading when the second tab is open", type: "text" }] },
        { kind: "object", path: "contactPage", title: "Introduction", fields: [
            { key: "intro", label: "Text before the link", type: "textarea" }, { key: "introLink", label: "Link text (goes to the second tab)", type: "text" }] },
        { kind: "object", path: "contactPage", title: "Inquiry type", fields: [{ key: "typeLabel", label: "Field label", type: "text" }] },
        { kind: "list", path: "contactPage.types", title: "Inquiry type options (the drop-down)", addLabel: "Add option", label: t => t.label || "New option", blank: () => ({ value: "type-" + Date.now().toString(36), label: "" }),
          fields: [{ key: "label", label: "Option", type: "text" }] },
        { kind: "object", path: "contactPage", title: "Form fields", fields: [
            { key: "nameLabel", label: "Name \u2192 label", type: "text" }, { key: "companyLabel", label: "Company / studio \u2192 label", type: "text" },
            { key: "emailLabel", label: "Email \u2192 label", type: "text" }, { key: "messageLabel", label: "Message \u2192 label", type: "text" },
            { key: "messagePlaceholder", label: "Message \u2192 hint inside the box", type: "text" },
            { key: "requiredTag", label: "Tag on required fields", type: "text" }, { key: "optionalTag", label: "Tag on optional fields", type: "text" }] },
        { kind: "object", path: "contactPage", title: "Consent and button", fields: [
            { key: "consent", label: "Consent line (checkbox)", type: "textarea" }, { key: "button", label: "Send button", type: "text" }] },
        { kind: "object", path: "contactPage", title: "After sending (thank-you screen)", fields: [
            { key: "thankTitle", label: "Title", type: "text" }, { key: "thankText", label: "Text", type: "textarea" }, { key: "newButton", label: "Button", type: "text" }] },
        { kind: "object", path: "contactPage", title: "Messages shown when something is missing", fields: [
            { key: "errName", label: "Name is empty", type: "text" }, { key: "errEmail", label: "Email is empty", type: "text" }, { key: "errEmailBad", label: "Email looks wrong", type: "text" },
            { key: "errMessage", label: "Message is empty", type: "text" }, { key: "errConsent", label: "Consent not ticked", type: "text" },
            { key: "toastSent", label: "Pop-up after a successful send", type: "text" }, { key: "toastFail", label: "Pop-up when sending fails", type: "text" }] },
        { kind: "object", path: "contactPage", title: "Email line (bottom of the form)", fields: [
            { key: "emailLine", label: "Label", type: "text" }, { key: "copyButton", label: "Copy button", type: "text" }] },
        { kind: "object", path: "contact", title: "Footer and contact details (shown in the footer and under the form)", fields: [
            { key: "tagline", label: "Line above the three lines: \u201cWe summon worlds\u2026\u201d", type: "text" }, { key: "company", label: "Line 1: company name (Gattabara Games LLP)", type: "text" },
            { key: "address", label: "Line 2: address (Bengaluru, Karnataka, India)", type: "text" }, { key: "email", label: "Line 3: email address", type: "text" }] }] },
    { id: "privacy", label: "Privacy policy", icon: Shield, blocks: [
        { kind: "object", path: "privacy", title: "Privacy policy page: heading", fields: [
            { key: "kicker", label: "Small label above the title", type: "text" }, { key: "title", label: "Title", type: "text" },
            { key: "updated", label: "Date line", type: "text", hint: "For example: Last updated 30 October 2026. Change it whenever you edit the policy." },
            { key: "lead", label: "Introduction", type: "textarea" }, { key: "tocTitle", label: "Heading of the contents box", type: "text" },
            { key: "backLink", label: "\u201cBack to site\u201d button", type: "text" }, { key: "copyright", label: "Line at the bottom of the page", type: "text" }, { key: "cookieLabel", label: "\u201cCookie settings\u201d wording", type: "text", hint: "Used for the link at the bottom of the page and wherever you write {{cookie-settings}}." }] },
        { kind: "list", path: "privacy.sections", title: "Privacy policy page: sections (in this order, numbered automatically)", addLabel: "Add section", label: x => x.title || "New section", blank: () => ({ title: "", body: "" }),
          fields: [{ key: "title", label: "Section title", type: "text" },
            { key: "body", label: "Text", type: "textarea", hint: "Leave a blank line between paragraphs. Start every line with \u201c- \u201d for a bullet list. For a table, write one row per line with \u201c | \u201d between the columns; the first line is the header. **bold**, [link text](https://example.com) and [email](mailto:name@site.com) work. {{cookie-settings}} adds a button that reopens the cookie popup." }] },
        { kind: "object", path: "cookieBanner", title: "Cookie popup (shown to every new visitor)", fields: [
            { key: "kicker", label: "Small label", type: "text" }, { key: "title", label: "Title", type: "text" },
            { key: "text", label: "Text", type: "textarea" }, { key: "policyLink", label: "Link to the privacy policy", type: "text" },
            { key: "accept", label: "Accept button", type: "text" }, { key: "reject", label: "Reject button", type: "text" },
            { key: "customise", label: "Customise button", type: "text" }, { key: "save", label: "Save choices button", type: "text" },
            { key: "necessaryTitle", label: "Necessary: title", type: "text" }, { key: "necessaryText", label: "Necessary: text", type: "text" },
            { key: "analyticsTitle", label: "Analytics: title", type: "text" }, { key: "analyticsText", label: "Analytics: text", type: "text" },
            { key: "marketingTitle", label: "Marketing: title", type: "text" }, { key: "marketingText", label: "Marketing: text", type: "text" }] }] },
    { id: "site", label: "Page title & 404", icon: Settings, blocks: [
        { kind: "object", path: "seo", title: "Browser tab title", fields: [
            { key: "title", label: "Page title (shown in the browser tab)", type: "text" }] },
        { kind: "object", path: "notFound", title: "\u201cPage not found\u201d page (shown for a wrong web address)", fields: [
            { key: "title", label: "Heading", type: "text" }, { key: "text", label: "Text", type: "textarea" }, { key: "button", label: "Button", type: "text" }] }] },
];

/* ---------- the website's own wording, as fields ----------
   Every heading, button and label of the page is a field that sits exactly where it sits on the page. T finds a visible text by its section and
   its first words, A a hidden one (read aloud, section name), U a wording the page's scripts build themselves. A wrong name fails loudly. */
type PT = { key: string; group: string; label: string; text: string; attr?: string };
const PTS = pageTexts as PT[];
const UIS = UI_STRINGS as string[][];
const missing = (what: string): never => { throw new Error("Admin layout: no text named " + what); };
const mkText = (store: "texts" | "uiText", key: string, def: string, label: string, type?: F["type"]): F => ({ key, store, def, label, type: type || (def.length > 70 ? "textarea" : "text") });
const T = (group: string, start: string, label?: string, type?: F["type"]): F => {
    const e = PTS.find((x) => x.group === group && !x.attr && x.text === start) || PTS.find((x) => x.group === group && !x.attr && x.text.startsWith(start)) || missing(group + " / " + start);
    return mkText("texts", e.key, e.text, label || e.label, type);
};
/* W: the name of a section, shown in the thin bar at the top of that section (and in the side rail and top bar while it is on screen) */
const W = (group: string): F => {
    const e = PTS.find((x) => x.group === group && x.attr === "data-name") || missing(group + " / section name");
    return { ...mkText("texts", e.key, e.text, "Name in the thin bar at the top of this section"), hint: "Also shown in the side rail and the top bar while this section is on screen." };
};
const U = (start: string, label?: string): F => {
    const r = UIS.find((x) => x[1].startsWith(start)) || missing(start);
    return mkText("uiText", r[2], r[2], label || r[1]);
};
const UF = (group: string): F[] => UIS.filter((r) => r[0] === group).map((r) => mkText("uiText", r[2], r[2], r[1]));
/* G: a heading that separates groups of boxes inside one card (Column 1, Column 2, Bottom line ...) */
const G = (label: string): F => ({ key: "group:" + label, label, type: "group" });
const card = (title: string, fields: F[], hint?: string, cols?: 2 | 3): Block => ({ kind: "object", path: "", title, hint, cols, fields });
const part = (title: string, hint?: string): Block => ({ kind: "heading", title, hint });

const raw = (id: string) => RAW.find((t) => t.id === id)!.blocks;
const [gamesCards, gamesList, pressAbout, pressContact, pressLabels] = raw("games") as any[];
const valuesList = raw("philosophy")[1];
const [servicesList, specialtiesList] = raw("production") as any[];
const [disciplinesLines, tiersLines, peopleList, callCard] = raw("network") as any[];
const [clientsList, clientsCta] = raw("clients") as any[];
const [letterCard, letterBefore, letterList, letterAfter, letterSign] = raw("message") as any[];
const contactBlocks = (raw("contact") as any[]).map((b) => b.title?.startsWith("Email line") ? { ...b, fields: [...b.fields, U("Contact page: email copy button", "Copy button after it is pressed"), U("Machine view and Contact page", "Pop-up after Copy")] } : b);
const contactHead = { ...contactBlocks[0], title: "Heading, sub-heading and the two tabs", fields: [W("Contact"), T("Contact", "Contact", "Heading"), ...contactBlocks[0].fields] };
const contactDetails = contactBlocks[contactBlocks.length - 1];

/* One tab per part of the website, in page order. Inside a tab the cards follow the page from top to bottom. */
const TABS: Tab[] = [
    RAW[0], RAW[1],
    { id: "hero", label: "Home", icon: Home, blocks: [
        { ...(raw("hero")[0] as any), title: "Headline and the text under it", hint: "The first thing on the page.", fields: [W("Top"), ...(raw("hero")[0] as any).fields] },
        card("Buttons under the headline", [T("Top", "Games", "Button 1"), T("Top", "Pitch us", "Button 2"), T("Top", "Game services", "Button 3")], "The three buttons right under the text, left to right.", 3),
        raw("hero")[1]] },
    { id: "news", label: "News", icon: Newspaper, blocks: [
        card("Heading", [W("News"), T("News", "News", "Heading"), T("News", "Studio updates", "Sub-heading")]),
        card("Filter buttons above the list", ["All", "Games", "Studio", "Productions", "Recruit"].map((w, i) => T("News", w, i === 0 ? "Filter button: everything" : "Filter button " + i)), "Each filter shows the news items whose Category is the same word in capitals (GAMES, STUDIO, PRODUCTIONS, RECRUIT).", 3),
        raw("news")[0],
        card("Button below the list", [T("News", "View all news", "Button"), U("News: button after", "Same button once the list is open")], undefined, 2)] },
    { id: "games", label: "Games", icon: Gamepad2, blocks: [
        card("Heading", [W("Games"), T("Games", "Games", "Heading"), T("Games", "Title lineup", "Sub-heading")]),
        card("Filter buttons above the game cards", [T("Games", "All titles", "Filter button 1"), T("Games", "In development", "Filter button 2"), T("Games", "Sealed", "Filter button 3")], undefined, 3),
        { ...gamesCards, title: "Game cards: the picture" },
        gamesList,
        card("Labels on the game cards", [U("Co-owned game: left tag"), U("Co-owned game: right tag"), U("Co-owned game: word before")], "Shown on a game that is in co-development."),
        part("Press kit defaults", "The press kit opens when a game card is clicked. Every game starts from what is below. A game can replace the About the developer text, the studio logos and the contact rows inside the game itself (open it in the list above); the facts, description, trailer and screenshots are always per game."),
        card("Top bar of the press kit window", [T("Other", "GATTABARA GAMES", "Company name"), T("Other", "PRESS KIT", "\u201cPress kit\u201d word"), T("Other", "Close", "Button: close")], undefined, 3),
        { ...pressLabels, title: "Headings, buttons and labels (same for every game, in page order)" },
        { ...pressAbout, title: "Default: About the developer" },
        { ...pressContact, title: "Default: Contact rows" },
        card("Pop-ups, and the picture of a game without artwork", UF("Press kit page"))] },
    { id: "business", label: "Business", icon: Building2, blocks: [
        card("Heading and introduction", [W("Business"), T("Business", "Business", "Heading"), T("Business", "Who we are", "Sub-heading"), T("Business", "Gattabara works", "Introduction")]),
        card("The three lines of business", [G("Line 1"), T("Business", "Original IP", "Heading"), T("Business", "Worlds we invent", "Text"), G("Line 2"), T("Business", "Co-owned IP", "Heading"), T("Business", "We co-own", "Text"), G("Line 3"), T("Business", "GG Productions", "Heading"), T("Business", "Our services arm", "Text")]),
        part("Philosophy"),
        { kind: "object", path: "philosophy", title: "Mission, vision and values", fields: [
            T("Business", "Philosophy", "Small label above the heading"), T("Business", "Mission", "Heading"),
            G("Mission"), T("Business", "MISSION", "Title"), { key: "mission", label: "Text", type: "text" },
            G("Vision"), T("Business", "VISION", "Title"), { key: "vision", label: "Text", type: "text" },
            G("Values"), T("Business", "VALUES", "Title"), { key: "valuesIntro", label: "Text", type: "textarea" }] },
        valuesList,
        { kind: "object", path: "philosophy", title: "Handbook line (bottom of Philosophy)", fields: [{ key: "doc", label: "Line", type: "textarea" }, T("Business", "FROM THE STUDIO HANDBOOK", "Signature under the line")] },
        part("Message"),
        { kind: "object", path: "letter", title: "From the founding partners", fields: [T("Business", "Message", "Small label above the heading"), T("Business", "From the founding partners", "Heading"), ...letterCard.fields] },
        letterBefore, letterList, letterAfter, letterSign,
        part("Leadership"),
        card("Heading", [T("Business", "Leadership", "Small label above the heading"), T("Business", "The team accountable", "Heading")]),
        raw("leadership")[0]] },
    { id: "production", label: "GG Productions", icon: Clapperboard, blocks: [
        card("Heading and introduction", [W("GG Productions"), T("GG Productions", "GG Productions", "Heading"), T("GG Productions", "Services arm", "Sub-heading"), T("GG Productions", "A lean partner", "Introduction")]),
        servicesList,
        card("Showreel player", [G("Reel switch buttons"), T("GG Productions", "Animation", "Button 1"), T("GG Productions", "Art", "Button 2"), G("Caption under the player"), ...UF("GG Productions")], "The video monitor next to the services."),
        { kind: "list", path: "productionImages", title: "Image gallery", addLabel: "Add image", label: (x) => x.caption || "New image", blank: () => ({ image: "", caption: "" }),
          hint: "Looks like the showreel monitor and sits under it, with previous / next buttons and a full-screen view. It only appears on the site when at least one image is added; with none, the page stays as it is now.",
          fields: [{ key: "image", label: "Image", type: "image", hint: "Shown 16:9; other shapes are cropped to fit." }, { key: "caption", label: "Caption (shown under the picture)", type: "text" }] },
        specialtiesList,
        card("How we work: four steps", ["01", "02", "03", "04"].flatMap((n, i) => {
            const label = T("GG Productions", "STEP " + n, "Label");
            const idx = PTS.findIndex((x) => x.key === label.key);
            return [G(`Step ${i + 1}`), label, mkText("texts", PTS[idx + 1].key, PTS[idx + 1].text, "Title"), mkText("texts", PTS[idx + 2].key, PTS[idx + 2].text, "Text", "textarea")];
        })),
        part("Clients"),
        card("Heading and introduction", [T("GG Productions", "Clients", "Small label above the heading"), T("GG Productions", "Studios we have built with", "Heading"), T("GG Productions", "Studios that have trusted", "Introduction")]),
        clientsList, clientsCta,
        part("Network"),
        card("Heading and introduction", [T("GG Productions", "Network", "Small label above the heading"), T("GG Productions", "A world on call", "Heading"), T("GG Productions", "A core team in Bengaluru", "Introduction")]),
        { ...callCard, title: "Roster panel (the black panel with the globe)", fields: [G("Panel title"), T("GG Productions", "Global roster", "Title"), G("Status line next to the phone button (changes during the call)"), ...callCard.fields, G("Big numbers under the panel"), { key: "countSpecialists", label: "Big number 1 (Specialists)", type: "number" }, T("GG Productions", "Specialists", "Word under number 1"),
            { key: "countCities", label: "Big number 2 (Cities)", type: "number" }, T("GG Productions", "Cities", "Word under number 2"),
            { key: "countDisciplines", label: "Big number 3 (Disciplines)", type: "number" }, T("GG Productions", "Disciplines", "Word under number 3"), G("Captions under the globe"), T("GG Productions", "ORIGIN", "Left"), T("GG Productions", "SAMPLE ROSTER", "Right")] },
        disciplinesLines, tiersLines, peopleList,
        card("Roster window (opens when the call is answered)", [G("Top of the window"), T("Network roster window", "● Connected", "Status line"), T("Network roster window", "Assemble a squad", "Heading"), T("Network roster window", "Choose disciplines", "Paragraph"), G("Controls and button"), T("Network roster window", "Quality bar", "Label"), T("Network roster window", "Send a brief", "Button"), G("Counters"), ...UF("Network roster window")])] },
    { id: "recruit", label: "Recruit", icon: Users, blocks: [
        card("Heading", [W("Recruit"), T("Recruit", "Recruit", "Heading"), T("Recruit", "Careers", "Sub-heading")]),
        card("Big headline: “Join the craft.”", [T("Recruit", "Join", "Part 1"), T("Recruit", "the", "Part 2"), T("Recruit", "craft.", "Part 3")], "Three lines of one headline.", 3),
        card("Text and button", [T("Recruit", "We are looking", "Paragraph"), T("Recruit", "Entry", "Button")]),
        raw("recruit")[0],
        card("Note under the list", [T("Recruit", "* Listings", "Note")])] },
    { id: "contact", label: "Contact & pitch", icon: Phone, blocks: [
        part("Contact", "The Contact tab of the Contact section."),
        contactHead, ...contactBlocks.slice(1, -1).map((b: any) => b.title?.startsWith("Email line") ? { ...b, hint: "The email address itself is edited in Header, menu & footer \u2192 Footer (top block)." } : b),
        part("Pitch us", "The Pitch us tab of the Contact section, and the application form it opens."),
        ...raw("pitch")] },
    { id: "legal", label: "Privacy, cookies & 404", icon: Shield, blocks: [...raw("privacy"), ...raw("site")] },
    { id: "chrome", label: "Header, menu & footer", icon: Type, blocks: [
        part("On every page", "The top bar, the menu and the footer appear on the whole site."),
        card("Top bar", [
            G("Navigation links"), T("Header", "NEWS", "Link 1"), T("Header", "GAMES", "Link 2"), T("Header", "BUSINESS", "Link 3"), T("Header", "GG PRODUCTIONS", "Link 4"), T("Header", "RECRUIT", "Link 5"),
            G("Human / Machine switch"), T("Header", "HUMAN", "Switch button 1"), T("Header", "MACHINE", "Switch button 2"),
            G("Buttons on the right"), T("Header", "PITCH US", "Button 1"), T("Header", "CONTACT", "Button 2"), T("Header", "MENU", "Menu button")], undefined, 3),
        card("Menu (opens from the Menu button)", [G("Company block"), T("Menu", "A video game company", "Paragraph under the company name"), G("Contact block"), T("Menu", "CONTACT", "Small heading above the email"), G("View block"), T("Menu", "VIEW", "Small heading above the switch"), T("Menu", "HUMAN", "Switch button 1"), T("Menu", "MACHINE", "Switch button 2")],
            "The company name and the email in the menu are edited in the Footer card below (top block)."),
        { kind: "object", path: "contact", title: "Footer", cols: 3, hint: "Top to bottom as the footer reads. The company name, address and email here are also used in the menu and under the contact form.", fields: [
            G("Top block (the three lines on the left)"), ...(contactDetails as any).fields,
            G("Column 1"), T("Footer", "GAMES", "Heading"), T("Footer", "Title lineup", "Link 1"), T("Footer", "News", "Link 2"),
            G("Column 2"), T("Footer", "COMPANY", "Heading"), T("Footer", "Business", "Link 1"), T("Footer", "GG Productions", "Link 2"),
            G("Column 3"), T("Footer", "JOIN", "Heading"), T("Footer", "Recruit", "Link 1"), T("Footer", "Pitch us", "Link 2"), T("Footer", "Contact", "Link 3"), T("Footer", "Machine view", "Button"),
            G("Bottom line"), T("Footer", "\u00a9 2026", "Copyright"), T("Footer", "Privacy Policy", "Link"), T("Footer", "Cookie settings", "Button"), T("Footer", "Bengaluru", "Place")] },
        card("Side rail, back-to-top button and cursor", [T("Other", "GATTABARA GAMES — WE SUMMON", "Vertical line on the left edge (wide screens)"), T("Other", "PAGE", "Back-to-top button: line 1"), T("Other", "TOP", "Back-to-top button: line 2"), T("Other", "VIEW", "Word on the round cursor")])] },
    { id: "machine", label: "Machine view", icon: Cpu, blocks: [
        part("Machine view", "The plain-text view of the site that the MACHINE switch opens. Everything it says is edited here, grouped by where it appears."),
        card("Top bar", [T("Machine view", "GATTABARA/AI", "Title"), T("Machine view", "Copy .md", "Button 1"), T("Machine view", "Save", "Button 2"), T("Machine view", "HUMAN", "Switch button 1"), T("Machine view", "MACHINE", "Switch button 2"), U("Machine view: copy blocked", "Pop-up when copying is blocked")]),
        card("Page names", UF("Machine view: page names")),
        card("Introduction of each page", UF("Machine view: page introductions")),
        card("Home page", UF("Machine view: Home page")),
        card("GG Productions page", UF("Machine view: GG Productions page")),
        card("Pitch us page", UF("Machine view: Pitch us page")),
        card("Founders' letter page", UF("Machine view: letter page")),
        card("Questions and answers", UF("Machine view: questions and answers")),
        card("Notes", UF("Machine view: notes")),
        card("Links and files", UF("Machine view: links and files")),
        card("Small headings between blocks", UF("Machine view: small headings between blocks")),
        card("Field names (the word before each value)", UF("Machine view: field names")),
        card("Console", UF("Machine view: console")),
        card("Top and bottom of every page", UF("Machine view: top and bottom of every page"))] },
];

/* ---------- small helpers ---------- */
const getAt = (o: any, p: string) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
const setAt = (o: any, p: string, v: any): any => {
    const [h, ...t] = p.split(".");
    return Array.isArray(o) ? o.map((x, i) => (String(i) === h ? (t.length ? setAt(x, t.join("."), v) : v) : x))
        : { ...o, [h]: t.length ? setAt(o?.[h] ?? {}, t.join("."), v) : v };
};
const inputBase = "w-full border rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1A2E35]/20 focus:border-[#1A2E35]/30";
const keyCls = inputBase + " bg-gray-100 border-gray-200 text-gray-900 font-semibold";   /* titles, names, labels: dark and bold */
const valCls = inputBase + " bg-gray-50 border-gray-100 text-gray-600";                  /* ordinary content: a step lighter */
const inputCls = valCls;
/* any field whose name says title / headline / heading / name is a title, e.g. "Feature title", "Form title" */
const isTitle = (f: { label: string }) => /\b(title|headline|heading|name)\b/i.test(f.label) && !/\b(under|below|after)\b/i.test(f.label) && !/sub-?heading/i.test(f.label);   /* "Line under the title" is not itself a title */

/* the name of a section (a list inside a game, a card): big and dark, never small print */
function SubHeading({ text, hint }: { text: string; hint?: string }) {
    return (<div><h4 className="text-[22px] leading-tight font-extrabold text-gray-900">{text}</h4>{hint && <p className="text-[14px] text-gray-500 mt-1.5">{hint}</p>}</div>);
}

function Label({ text, hint }: { text: string; hint?: string }) {
    return (<div className="mb-2 px-1"><label className="block text-[14px] font-semibold text-gray-700">{text}</label>{hint && <p className="text-[13px] text-gray-500 mt-1">{hint}</p>}</div>);
}

/* send a file straight to Cloudflare R2 with a signed link (progress bar); small images fall back to going through the server */
function putWithProgress(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
    return new Promise((resolve, reject) => {
        const x = new XMLHttpRequest();
        x.open("PUT", url);
        x.setRequestHeader("Content-Type", file.type);
        x.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100)); };
        x.onload = () => (x.status >= 200 && x.status < 300 ? resolve() : reject(new Error(`R2 answered ${x.status}`)));
        x.onerror = () => reject(new Error("blocked"));
        x.send(file);
    });
}

/* first frame of a video file, as a small JPEG: the website shows it instantly while the video itself starts */
function captureFrame(file: File): Promise<Blob | null> {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file), v = document.createElement("video");
        const done = (b: Blob | null) => { URL.revokeObjectURL(url); resolve(b); };
        v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = url;
        v.onerror = () => done(null);
        v.onloadeddata = () => { v.currentTime = Math.min(0.3, (v.duration || 1) / 2); };
        v.onseeked = () => {
            try {
                const w = Math.min(960, v.videoWidth || 960), h = Math.round(w * (v.videoHeight || 540) / (v.videoWidth || 960));
                const c = document.createElement("canvas"); c.width = w; c.height = h;
                c.getContext("2d")!.drawImage(v, 0, 0, w, h);
                c.toBlob((b) => done(b), "image/jpeg", 0.6);
            } catch { done(null); }
        };
        setTimeout(() => done(null), 15000);
    });
}
async function uploadPoster(file: File, videoUrl: string) {
    try {
        const blob = await captureFrame(file); if (!blob) return;
        const sig: any = await getPosterUploadUrl(videoUrl); if (!sig.ok) return;
        await fetch(sig.uploadUrl, { method: "PUT", body: blob, headers: { "Content-Type": "image/jpeg" } });
    } catch { /* the poster is a nicety: the video works without it */ }
}

function Upload({ kind, value, onChange }: { kind: "image" | "video"; value: string; onChange: (v: string) => void }) {
    const [busy, setBusy] = useState(false); const [pct, setPct] = useState(0); const [err, setErr] = useState(""); const [done, setDone] = useState(false); const [over, setOver] = useState(false); const ref = useRef<HTMLInputElement>(null);
    const pick = async (file?: File) => {
        if (!file) return; setBusy(true); setErr(""); setPct(0); setDone(false);
        try {
            const sig: any = await getUploadUrl(file.name, file.type, kind, file.size);
            if (!sig.ok) throw new Error(sig.error);
            try { await putWithProgress(sig.uploadUrl, file, setPct); if (kind === "video") await uploadPoster(file, sig.publicUrl); onChange(sig.publicUrl); setDone(true); }
            catch (e: any) {
                if (e.message !== "blocked") throw e;
                if (file.size > 4 * 1024 * 1024) throw new Error("The upload was blocked by Cloudflare. Add the CORS rule from cloudflare/r2-cors.json to the R2 bucket (see README), then try again.");
                const fd = new FormData(); fd.append("file", file); fd.append("kind", kind);       /* small file: send it through the server instead */
                const r: any = await uploadAsset(fd); if (!r.ok) throw new Error(r.error || "Upload failed"); onChange(r.url); setDone(true);
            }
        } catch (e: any) { setErr(e.message || "Upload failed"); }
        setBusy(false);
    };
    return (
        <div className={`border border-dashed rounded-2xl p-4 transition-colors ${over ? "border-[#1A2E35] bg-[#1A2E35]/5" : "border-gray-200 bg-gray-50/50"}`}
            onDragOver={(e) => { e.preventDefault(); if (!busy) setOver(true); }} onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); if (!busy) pick(e.dataTransfer.files?.[0]); }}>
            <div className="flex gap-4 items-start">
                <div className="w-40 aspect-video bg-white border border-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    {value ? (kind === "image" ? <img src={value} alt="" className="w-full h-full object-contain" /> : <video src={value} className="w-full h-full object-cover" muted preload="metadata" />)
                        : (kind === "image" ? <ImageIcon className="text-gray-300" /> : <Film className="text-gray-300" />)}
                </div>
                <div className="flex-1 min-w-0">
                    <input className={inputCls} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={`${kind === "image" ? "Image" : "Video"} URL (or upload a file)`} />
                    <div className="flex items-center gap-3 mt-3">
                        <button type="button" disabled={busy} onClick={() => ref.current?.click()} className="inline-flex items-center gap-2 bg-[#1A2E35] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-60">
                            {busy ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />} {busy ? `Uploading ${pct}%` : `Upload ${kind}`}
                        </button>
                        {value && !busy && <button type="button" onClick={() => onChange("")} className="text-[13px] text-gray-400 hover:text-red-500">Remove</button>}
                        <input ref={ref} type="file" hidden accept={kind === "image" ? "image/*" : "video/*"} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
                    </div>
                    {busy && <div className="mt-3 h-1.5 w-full max-w-xs bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-[#1A2E35] transition-[width]" style={{ width: `${pct}%` }} /></div>}
                    {err && <p className="text-red-500 text-xs mt-2">{err}</p>}
                    {done && !busy && !err && <p className="text-[13px] font-semibold text-emerald-600 mt-3">✓ Uploaded. It goes live on the website after you press “Save All Changes” (top right).</p>}
                    <p className="text-[12px] text-gray-500 mt-2">Click Upload or drag a file onto this box. Stored in the Cloudflare R2 bucket. Images up to 25 MB, videos up to 600 MB.</p>
                </div>
            </div>
        </div>
    );
}

/* ---------- centered confirmation popup (replaces the browser's confirm()) ---------- */
type AskOpts = { title?: string; message: string; confirmLabel?: string; danger?: boolean };
/* the roster's lists (Disciplines, Quality tiers), so a person's discipline and tier are picked from them instead of typed:
   the site matches people to these lists by exact name, so a typo or a renamed tier would silently put someone in the wrong group */
const ListsCtx = createContext<{ disciplines: string[]; tiers: string[] }>({ disciplines: [], tiers: [] });
const ConfirmCtx = createContext<(o: AskOpts) => Promise<boolean>>(async () => false);

function ConfirmHost({ children }: { children: React.ReactNode }) {
    const [st, setSt] = useState<{ o: AskOpts; res: (v: boolean) => void } | null>(null);
    const ask = useCallback((o: AskOpts) => new Promise<boolean>((res) => setSt({ o, res })), []);
    const close = useCallback((v: boolean) => { st?.res(v); setSt(null); }, [st]);
    useEffect(() => {
        if (!st) return;
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") close(false); };
        window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
    }, [st, close]);
    const danger = st?.o.danger !== false;
    return (
        <ConfirmCtx.Provider value={ask}>
            {children}
            <AnimatePresence>
                {st && (
                    <motion.div key="confirm" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onMouseDown={(e) => { if (e.target === e.currentTarget) close(false); }}>
                        <motion.div role="alertdialog" aria-modal="true" aria-labelledby="cf-title" aria-describedby="cf-msg" initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                            className="w-full max-w-[420px] bg-white text-gray-900 rounded-[24px] shadow-2xl p-8 text-center font-sans">
                            <div className={`mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center ${danger ? "bg-red-50 text-red-500" : "bg-gray-100 text-[#1A2E35]"}`}><Trash2 size={24} /></div>
                            <h3 id="cf-title" className="text-xl font-bold font-serif mb-2">{st.o.title || "Are you sure?"}</h3>
                            <p id="cf-msg" className="text-gray-500 text-[15px] leading-relaxed mb-7">{st.o.message}</p>
                            <div className="flex gap-3">
                                <button type="button" autoFocus onClick={() => close(false)} className="flex-1 border border-gray-200 text-gray-700 font-semibold text-[14px] py-3 rounded-xl hover:bg-gray-50">Cancel</button>
                                <button type="button" onClick={() => close(true)} className={`flex-1 text-white font-semibold text-[14px] py-3 rounded-xl hover:opacity-90 ${danger ? "bg-red-600" : "bg-[#1A2E35]"}`}>{st.o.confirmLabel || "Remove"}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ConfirmCtx.Provider>
    );
}

/* ---------- form submissions (Contact page and Pitch us application), read from the inquiries table ---------- */
type Subs = { rows: any[]; loading: boolean; error: string; loaded: boolean };
const SubsCtx = createContext<{ subs: Subs; reload: () => void; remove: (id: any) => Promise<string | null> }>({ subs: { rows: [], loading: false, error: "", loaded: false }, reload: () => {}, remove: async () => null });
const isApplication = (r: any) => !!r?.data?.fullData;
const nice = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).replace(/\bUrl\b/, "URL");
const when = (r: any) => { const d = new Date(r.created_at || r.date); return isNaN(+d) ? "" : d.toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); };
const SKIP = new Set(["name", "email", "message", "fullData", "isCaptchaVerified", "kind"]);

function Value({ k, v }: { k: string; v: any }) {
    if (k === "attachedFiles" && Array.isArray(v)) return <div className="flex flex-col gap-1.5 mt-1">{v.map((f: any, i: number) => (
        <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[13px] text-[#1A2E35] underline underline-offset-4 hover:opacity-70"><Paperclip size={13} /><span className="max-w-[260px] truncate">{f.name}</span></a>))}</div>;
    if (typeof v === "boolean") return <>{v ? "Yes" : "No"}</>;
    if (Array.isArray(v)) return <>{v.join(", ")}</>;
    if (typeof v === "string" && /^https?:\/\//i.test(v)) return <a href={v} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 break-all">{v}</a>;
    return <>{String(v)}</>;
}

function SubmissionsView({ which }: { which: "general" | "applications" }) {
    const { subs, reload, remove } = useContext(SubsCtx);
    const ask = useContext(ConfirmCtx);
    const [open, setOpen] = useState<any>(null);
    const [err, setErr] = useState("");
    const list = subs.rows.filter((r) => (which === "applications") === isApplication(r));
    const title = which === "applications" ? "Studio application submissions" : "General contact inquiries";
    return (
        <section className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between gap-4 p-8 pb-4">
                <h3 className="text-[26px] leading-tight font-extrabold">{title} <span className="text-gray-300 font-normal text-base">({list.length})</span></h3>
                <button type="button" onClick={reload} disabled={subs.loading} className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-60"><RefreshCw size={14} className={subs.loading ? "animate-spin" : ""} /> Refresh</button>
            </div>
            {(subs.error || err) && <div className="mx-8 mb-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-5 py-3">{err || subs.error}</div>}
            {subs.loading && !subs.loaded ? <div className="p-16 text-center text-gray-400"><Loader2 className="animate-spin mx-auto" /></div>
              : list.length === 0 ? <div className="p-16 text-center border-t border-gray-100"><Inbox size={44} className="mx-auto text-gray-200 mb-3" /><p className="text-gray-400">No submissions yet.</p></div>
              : (<div className="overflow-x-auto"><table className="w-full text-left border-collapse">
                <thead><tr className="bg-gray-50 border-t border-b border-gray-100">
                    {["Date & time", "Name", "Email", which === "applications" ? "Game / project" : "Inquiry type", ""].map((h, i) => <th key={i} className="px-6 py-3 text-[12px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>{list.map((r) => { const d = r.data || {}; const full = d.fullData || {}; const isOpen = open === r.id; return (
                    <React.Fragment key={r.id}>
                        <tr onClick={() => setOpen(isOpen ? null : r.id)} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <td className="px-6 py-4 text-[13px] text-gray-400 font-mono whitespace-nowrap">{when(r)}</td>
                            <td className="px-6 py-4 text-[15px] font-bold text-gray-900">{r.name}</td>
                            <td className="px-6 py-4 text-[14px] text-gray-600"><a href={`mailto:${r.email}`} onClick={(e) => e.stopPropagation()} className="hover:underline">{r.email}</a></td>
                            <td className="px-6 py-4 text-[14px] text-gray-600">{which === "applications" ? full.gameTitle || "" : d.inquiryType || d.type || ""}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap"><button type="button" aria-label="Delete" title="Delete" onClick={async (e) => { e.stopPropagation(); if (await ask({ title: "Delete this submission?", message: `The submission from \u201c${r.name}\u201d will be permanently deleted. This can\u2019t be undone.`, confirmLabel: "Delete" })) setErr((await remove(r.id)) || ""); }} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={16} /></button></td>
                        </tr>
                        {isOpen && (<tr><td colSpan={5} className="px-6 pb-6 pt-3 bg-gray-50 border-b border-gray-100">
                            {r.message && r.message.trim() && which === "general" && <div className="bg-white rounded-xl p-5 border border-gray-100 mb-4"><p className="text-[12px] font-bold text-gray-600 uppercase tracking-widest mb-2">Message</p><p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">{r.message}</p></div>}
                            <div className="bg-white rounded-xl p-5 border border-gray-100"><p className="text-[12px] font-bold text-gray-600 uppercase tracking-widest mb-4">{which === "applications" ? "Application details" : "Details"}</p>
                                <div className="grid gap-x-8 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
                                    {Object.entries(which === "applications" ? full : d).filter(([k, v]) => !SKIP.has(k) && v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0)).map(([k, v]) => (
                                        <div key={k} className="flex flex-col gap-1"><span className="text-[12px] text-gray-600 uppercase font-bold tracking-wider">{nice(k)}</span><span className="text-[14px] text-gray-900 font-medium break-words"><Value k={k} v={v} /></span></div>))}
                                    <div className="flex flex-col gap-1"><span className="text-[12px] text-gray-600 uppercase font-bold tracking-wider">Email</span><span className="text-[14px] text-gray-900 font-medium break-all">{r.email}</span></div>
                                </div></div>
                        </td></tr>)}
                    </React.Fragment>); })}</tbody></table></div>)}
        </section>
    );
}

/* a list of items, each with its own fields. Used for top-level lists and for lists inside an item (factsheet, features). */
function ListEditor({ heading, items, fields, blank, labelOf, addLabel, onChange, compact }: { heading: React.ReactNode; items: any[]; fields: F[]; blank: () => any; labelOf: (it: any) => string; addLabel: string; onChange: (v: any[]) => void; compact?: boolean }) {
    const box = useRef<HTMLDivElement>(null); const added = useRef(false); const ask = useContext(ConfirmCtx);
    const inline = fields.length > 0 && fields.length <= 3 && fields.every((f) => SHORT.includes(f.type));
    const collapsible = !inline && !compact;                         /* top-level cards start closed; click to open or close */
    const [open, setOpen] = useState<Set<number>>(new Set());
    useEffect(() => {
        if (!added.current) return; added.current = false;
        const el = box.current?.lastElementChild as HTMLElement | null;
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        el?.querySelector<HTMLElement>("input,textarea,select")?.focus({ preventScroll: true });
    }, [items.length]);
    const isOpen = (i: number) => !collapsible || open.has(i);
    const toggle = (i: number) => setOpen((o) => { const n = new Set(o); if (n.has(i)) n.delete(i); else n.add(i); return n; });
    const move = (i: number, d: number) => {
        const n = items.slice(); const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; onChange(n);
        setOpen((o) => { const m = new Set(o); const a = o.has(i), b = o.has(j); a ? m.add(j) : m.delete(j); b ? m.add(i) : m.delete(i); return m; });
    };
    const remove = (i: number) => { onChange(items.filter((_, k) => k !== i)); setOpen((o) => new Set([...o].filter((k) => k !== i).map((k) => (k > i ? k - 1 : k)))); };
    const set = (i: number, k: string, v: any) => onChange(items.map((x, n) => (n === i ? { ...x, [k]: v } : x)));
    const add = () => { added.current = true; setOpen((o) => new Set(o).add(items.length)); onChange([...items, blank()]); };
    const allOpen = items.length > 0 && items.every((_, i) => open.has(i));
    return (
        <div>
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="min-w-0">{heading}</div>
                <div className="flex items-center gap-3 shrink-0">
                    {collapsible && items.length > 1 && <button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(items.map((_, i) => i)))} className="text-[13px] text-gray-500 hover:text-gray-900 underline-offset-4 hover:underline">{allOpen ? "Collapse all" : "Expand all"}</button>}
                    <button type="button" onClick={add} className="inline-flex items-center gap-2 bg-[#1A2E35] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:opacity-90"><Plus size={15} /> {addLabel}</button>
                </div>
            </div>
            {inline && items.length > 0 && (
                <div className="hidden md:grid gap-3 pl-9 pr-[92px] mb-2 text-[13px] font-semibold text-gray-600" style={{ gridTemplateColumns: `repeat(${fields.length}, minmax(0, 1fr))` }}>
                    {fields.map((f, n) => <span key={f.key} className={`px-1 ${n === 0 ? "text-gray-600" : ""}`}>{f.label}</span>)}
                </div>)}
            <div ref={box} className={inline ? "space-y-2" : "space-y-3"}>
                {items.map((it, i) => {
                    const tools = (<div className="flex items-center gap-0.5 shrink-0">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-30" aria-label="Move up"><ArrowUp size={15} /></button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1.5 text-gray-400 hover:text-gray-900 disabled:opacity-30" aria-label="Move down"><ArrowDown size={15} /></button>
                        <button type="button" onClick={async () => { if (await ask({ title: "Remove this item?", message: `\u201c${labelOf(it)}\u201d will be removed from this list. You can still change your mind until you press Save All Changes.`, confirmLabel: "Remove" })) remove(i); }} className="p-1.5 text-gray-400 hover:text-red-500" aria-label="Remove"><Trash2 size={15} /></button></div>);
                    if (inline) return (
                        <div key={i} className="flex items-center gap-2 sm:gap-3 scroll-mt-28 min-w-0">
                            <span className="w-6 text-[12px] text-gray-300 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                            <div className="grid flex-1 min-w-0 gap-3 md:[grid-template-columns:var(--cols)]" style={{ ["--cols" as any]: `repeat(${fields.length}, minmax(0, 1fr))` }}>
                                {fields.map((f, n) => <Control key={f.key} f={f} label={f.label} variant={n === 0 ? "key" : "value"} value={it[f.key]} onChange={(v) => set(i, f.key, v)} />)}
                            </div>
                            {tools}
                        </div>);
                    const expanded = isOpen(i);
                    return (
                    <div key={i} className={`border rounded-2xl scroll-mt-28 transition-colors ${expanded ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50/40 hover:bg-gray-50"} ${compact ? "p-3 sm:p-4" : "px-3 sm:px-5 py-4"}`}>
                        <div className="flex items-center justify-between gap-3">
                            {collapsible
                                ? <button type="button" onClick={() => toggle(i)} aria-expanded={expanded} className="flex-1 min-w-0 flex items-center gap-3 text-left py-1.5">
                                    <ChevronDown size={22} className={`shrink-0 text-gray-400 transition-transform ${expanded ? "" : "-rotate-90"}`} />
                                    <span className="min-w-[1.6rem] sm:min-w-[2.2rem] text-[20px] sm:text-[26px] leading-none font-extrabold text-[#1A2E35]/35 shrink-0 tabular-nums">{i + 1}.</span>
                                    <span className="font-extrabold text-[17px] sm:text-[22px] leading-tight text-gray-900 truncate">{labelOf(it) || "Untitled"}</span></button>
                                : <p className="font-bold text-[18px] text-gray-900 truncate pr-4"><span className="text-[#1A2E35]/35 font-extrabold mr-2">{i + 1}.</span>{labelOf(it)}</p>}
                            {tools}
                        </div>
                        {expanded && <div className="grid gap-4 md:grid-cols-2 mt-4 pb-2">{fields.filter((f) => !f.showIf || f.showIf(it)).map((f) => f.type === "group"
                            ? <div key={f.key} className="md:col-span-full mt-4 pt-6 border-t-2 border-gray-200 first:mt-0 first:pt-0 first:border-0"><h4 className="text-[26px] leading-tight font-extrabold text-gray-900">{f.label}</h4>{f.hint && <p className="text-[14px] text-gray-500 mt-1.5">{f.hint}</p>}</div>
                            : <Field key={f.key} f={f} value={it[f.key]} onChange={(v) => set(i, f.key, v)} />)}</div>}
                    </div>);
                })}
                {items.length === 0 && <p className="text-gray-400 text-sm py-4 text-center">Nothing here yet. Use the button above to add one.</p>}
            </div>
        </div>
    );
}

const SHORT = ["text", "number", "select", "toggle"];
const isWide = (f: F) => !SHORT.includes(f.type);

/* the bare input for a field type (no label) */
function Control({ f, value, onChange, label, variant }: { f: F; value: any; onChange: (v: any) => void; label?: string; variant?: "key" | "value" }) {
    const lists = useContext(ListsCtx);
    const v = variant ?? (isTitle(f) ? "key" : undefined);
    const cls = v === "key" ? keyCls : v === "value" ? valCls : inputCls;
    const aria = label ? { "aria-label": label, placeholder: label } : {};
    if (f.type === "toggle") return <label className="inline-flex items-center gap-3 cursor-pointer select-none px-1 py-2"><input type="checkbox" className="w-5 h-5 accent-[#1A2E35]" checked={!!value} onChange={(e) => onChange(e.target.checked)} /><span className="text-[14px] text-gray-700">{value ? "On" : "Off"}</span></label>;
    if (f.type === "textarea") return <textarea rows={3} className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    if (f.type === "lines") return <textarea rows={Math.max(3, (value || []).length + 1)} className={inputCls} value={(value || []).join("\n")} onChange={(e) => onChange(e.target.value.split("\n"))} onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))} />;
    if (f.type === "tags") return <input className={inputCls} value={Array.isArray(value) ? value.join(", ") : value ?? ""} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.replace(/^\s+/, "")))} onBlur={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />;
    if (f.type === "number") return <input type="number" className={cls} value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} {...aria} />;
    if (f.type === "select") { const opts = f.options === "disciplines" ? lists.disciplines : f.options === "tiers" ? lists.tiers : f.options!; const shown = value && !opts.includes(value) ? [...opts, value] : (!value && typeof f.options === "string") ? ["", ...opts] : opts;
        return <select className={cls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...aria}>{shown.map((o) => <option key={o} value={o}>{o === "" ? "\u2014 choose \u2014" : o}</option>)}</select>; }
    if (f.type === "image" || f.type === "video") return <Upload kind={f.type} value={value || ""} onChange={onChange} />;
    return <input className={cls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...aria} />;
}

function Field({ f, value, onChange }: { f: F; value: any; onChange: (v: any) => void }) {
    if (f.type === "rows") return <div className="md:col-span-2"><ListEditor compact heading={<SubHeading text={f.label} hint={f.hint} />} items={value || []} fields={f.itemFields!} blank={f.blank!} labelOf={f.itemLabel || (() => "Row")} addLabel={f.addLabel || "Add"} onChange={onChange} /></div>;
    return (<div className={isWide(f) ? "md:col-span-full" : ""}><Label text={f.label} /><Control f={f} value={value} onChange={onChange} />{f.hint && <p className="text-[13px] text-gray-500 mt-1.5 px-1">{f.hint}</p>}</div>);
}

/* one wording of the page itself (a heading, a button, a label...): shows the original until it is changed, and can be reset */
function TextField({ f, content, update }: { f: F; content: any; update: (path: string, v: any) => void }) {
    const store = f.store!; const cur: Record<string, string> = content[store] || {};
    const v = cur[f.key] ?? f.def ?? "";
    const set = (val: string) => { const n = { ...cur }; if (val === f.def) delete n[f.key]; else n[f.key] = val; update(store, n); };
    return (
        <div className="min-w-0" data-textkey={store + "|" + f.key} style={isWide(f) ? { gridColumn: "1 / -1" } : undefined}>
            <Label text={f.label} hint={f.hint} />
            {f.type === "textarea" ? <textarea rows={3} className={inputCls} value={v} onChange={(e) => set(e.target.value)} /> : <input className={isTitle(f) ? keyCls : inputCls} value={v} onChange={(e) => set(e.target.value)} />}
            {cur[f.key] !== undefined && <button type="button" onClick={() => { const n = { ...cur }; delete n[f.key]; update(store, n); }} className="text-[13px] text-gray-500 hover:text-gray-900 mt-1.5 px-1 underline underline-offset-4">Reset to the original wording</button>}
        </div>
    );
}

function RestoreButton({ enabled, onRestored, onError }: { enabled: boolean; onRestored: (r: any) => void; onError: (m: string) => void }) {
    const ask = useContext(ConfirmCtx); const [busy, setBusy] = useState(false);
    if (!enabled) return null;
    return <button type="button" disabled={busy} title="Restore the version that was live before your last save" onClick={async () => {
        if (!(await ask({ title: "Restore the previous version?", message: "The website will go back to how it was before your last save. Your current version is kept, so you can switch back.", confirmLabel: "Restore", danger: false }))) return;
        setBusy(true); const r: any = await restorePreviousContent(); setBusy(false); if (r.ok) onRestored(r); else onError(r.error || "Restore failed");
    }} className="hidden md:inline-flex items-center gap-2 text-[13px] text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 disabled:opacity-60">{busy ? <Loader2 size={15} className="animate-spin" /> : <History size={15} />} Restore previous</button>;
}

function BlockView({ b, content, update }: { b: Block; content: any; update: (path: string, v: any) => void }) {
    const card = "bg-white border border-gray-100 rounded-[24px] shadow-sm p-4 sm:p-8";
    if (b.kind === "submissions") return <SubmissionsView which={b.which} />;
    if (b.kind === "heading") return (<div className="pt-8 pb-1 border-b border-gray-200"><h2 className="text-[36px] leading-tight font-extrabold">{b.title}</h2>{b.hint && <p className="text-[15px] text-gray-500 mt-2 mb-3 max-w-[760px]">{b.hint}</p>}</div>);
    const title = (t: string, hint?: string) => (<div className="mb-6"><h3 className="text-[26px] leading-tight font-extrabold">{t}</h3>{hint && <p className="text-[14px] text-gray-500 mt-1.5">{hint}</p>}</div>);
    if (b.kind === "object") {
        const obj = getAt(content, b.path) || {};
        return (<section className={card}>{title(b.title, b.hint)}<div className={`grid gap-5 ${b.cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {b.fields.map((f) => f.type === "group" ? <div key={f.key} className="md:col-span-full mt-2 pt-5 border-t border-gray-200 first:mt-0 first:pt-0 first:border-0"><h4 className="text-[20px] leading-tight font-extrabold text-gray-900">{f.label}</h4></div> : f.store ? <TextField key={f.store + f.key} f={f} content={content} update={update} /> : <Field key={f.key} f={f} value={obj[f.key]} onChange={(v) => update(`${b.path}.${f.key}`, v)} />)}</div></section>);
    }
    if (b.kind === "lines") {
        return (<section className={card}>{title(b.title)}
            <Field f={{ key: "x", label: b.hint || "One per line", type: "lines" }} value={getAt(content, b.path) || []} onChange={(v) => update(b.path, v)} /></section>);
    }
    const list: any[] = getAt(content, b.path) || [];
    return (
        <section className={card}>
            <ListEditor heading={<div><h3 className="text-[26px] leading-tight font-extrabold">{b.title} <span className="text-gray-300 font-normal text-base">({list.length})</span></h3>{b.hint && <p className="text-[14px] text-gray-500 mt-1.5">{b.hint}</p>}</div>}
                items={list} fields={b.fields} blank={b.blank} labelOf={b.label} addLabel={b.addLabel} onChange={(v) => update(b.path, v)} />
        </section>
    );
}

export default function Dashboard() {
    const router = useRouter();
    const [content, setContent] = useState<any>(null);
    const [canSave, setCanSave] = useState(true);
    const [storage, setStorage] = useState<"database" | "file">("file");
    const [version, setVersion] = useState<string | null>(null);
    const [hasBackup, setHasBackup] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [tab, setTab] = useState(TABS[0].id);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);
    const importRef = useRef<HTMLInputElement>(null);
    const [subs, setSubs] = useState<Subs>({ rows: [], loading: true, error: "", loaded: false });
    const reloadSubs = useCallback(async () => {
        setSubs((x) => ({ ...x, loading: true }));
        const r: any = await getSubmissions();
        setSubs({ rows: r.ok ? r.rows : [], loading: false, error: r.ok ? "" : r.error || "", loaded: true });
    }, []);
    const removeSub = useCallback(async (id: any) => {
        const r: any = await deleteSubmission(id);
        if (r.ok) { setSubs((x) => ({ ...x, rows: x.rows.filter((q) => q.id !== id) })); return null; }
        return r.error || "Delete failed";
    }, []);
    useEffect(() => { reloadSubs(); }, [reloadSubs]);
    const [dark, setDark] = useState(false);
    useEffect(() => { setDark(localStorage.getItem("gg_admin_theme") === "dark"); }, []);
    useEffect(() => { document.documentElement.classList.toggle("admin-dark", dark); return () => document.documentElement.classList.remove("admin-dark"); }, [dark]);
    const toggleTheme = () => setDark((d) => { const n = !d; localStorage.setItem("gg_admin_theme", n ? "dark" : "light"); return n; });

    const loadContent = useCallback(() => {
        setLoadError("");
        getSiteContent().then((r: any) => {
            if (!r.ok) { if (/not authori[sz]ed/i.test(r.error || "")) router.replace("/admingg"); else setLoadError(r.error || "Could not load the content."); return; }
            setContent(r.content); setCanSave(r.canSave); setStorage(r.storage); setVersion(r.version); setHasBackup(!!r.hasBackup); setDirty(false);
        });
    }, [router]);
    useEffect(() => { loadContent(); }, [loadContent]);
    useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 5000); return () => clearTimeout(t); }, [toast]);
    useEffect(() => { const h = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } }; window.addEventListener("beforeunload", h); return () => window.removeEventListener("beforeunload", h); }, [dirty]);

    const update = (path: string, v: any) => { setContent((c: any) => setAt(c, path, v)); setDirty(true); };
    const save = async (): Promise<boolean> => {
        setSaving(true);
        const r: any = await saveSiteContent(content, version);
        setSaving(false);
        if (r.ok) { setDirty(false); setVersion(r.version ?? null); setHasBackup(!!r.hasBackup); setToast({ ok: true, text: storage === "database" ? "Saved to the database. The website now shows these changes." : "Saved. The site now shows these changes." }); return true; }
        setToast({ ok: false, text: r.error || "Save failed" });
        return false;
    };
    /* leaving the admin (Log out) or replacing the content (Import) with unsaved changes asks first: save, discard or stay */
    const [leave, setLeave] = useState<null | (() => void)>(null);
    const guard = (fn: () => void) => { if (dirty) setLeave(() => fn); else fn(); };
    const restored = (r: any) => { setContent(r.content); setVersion(r.version); setHasBackup(true); setDirty(false); setToast({ ok: true, text: "Previous version restored. The website shows it now." }); };
    const exportJson = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2) + "\n"], { type: "application/json" }));
        a.download = "site-content.json"; a.click(); URL.revokeObjectURL(a.href);
    };
    const importJson = async (file?: File) => {
        if (!file) return;
        try { const j = JSON.parse(await file.text()); if (!Array.isArray(j.games) || !Array.isArray(j.news)) throw new Error(); setContent(j); setDirty(true); setToast({ ok: true, text: "File loaded. Review it, then press Save." }); }
        catch { setToast({ ok: false, text: "That file is not valid site content." }); }
    };
    const logout = async () => { await logoutAdmin(); router.push("/admingg"); };

    if (loadError) return <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 p-6 text-center"><p className="max-w-md text-gray-700">{loadError}</p><button type="button" onClick={loadContent} className="bg-[#1A2E35] text-white font-semibold text-[14px] px-6 py-3 rounded-xl">Try again</button></div>;
    if (!content) return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-gray-400"><Loader2 className="animate-spin" /></div>;
    const cur = TABS.find((t) => t.id === tab)!;

    return (
        <ConfirmHost>
        <ListsCtx.Provider value={{ disciplines: (content?.network?.disciplines as string[]) || [], tiers: (content?.network?.tiers as string[]) || [] }}>
        <SubsCtx.Provider value={{ subs, reload: reloadSubs, remove: removeSub }}>
        <div className="admin-portal min-h-screen overflow-x-hidden bg-[#F8FAFC] text-gray-900 font-sans pb-24">
            <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1100px] mx-auto px-3 sm:px-4 min-h-[60px] sm:h-[70px] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0"><div className="w-9 h-9 shrink-0 rounded-xl bg-[#1A2E35] text-white flex items-center justify-center"><Home size={18} /></div><span className="text-[15px] sm:text-[20px] font-bold font-serif leading-tight">Admin <span className="hidden min-[400px]:inline">Portal</span></span>
                        {dirty && <><span className="sm:hidden w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unsaved changes" /><span className="hidden sm:inline ml-2 text-[11px] font-bold uppercase tracking-widest text-amber-500">Unsaved changes</span></>}</div>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <button type="button" onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"} className="p-2.5 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
                        <a href="/" target="_blank" className="hidden sm:inline-flex text-[13px] text-gray-500 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50">View site</a>
                        <RestoreButton enabled={storage === "database" && hasBackup} onRestored={restored} onError={(m) => setToast({ ok: false, text: m })} />
                        <button type="button" onClick={exportJson} className="inline-flex items-center gap-2 text-[13px] text-gray-600 border border-gray-200 rounded-lg px-2.5 sm:px-3 py-2.5 sm:py-2 hover:bg-gray-50" aria-label="Export"><Download size={15} /> <span className="hidden sm:inline">Export</span></button>
                        <button type="button" onClick={() => guard(() => importRef.current?.click())} className="hidden sm:inline-flex items-center gap-2 text-[13px] text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"><UploadCloud size={15} /> Import</button>
                        <input ref={importRef} type="file" hidden accept="application/json,.json" onChange={(e) => { importJson(e.target.files?.[0]); e.target.value = ""; }} />
                        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-[#1A2E35] text-white text-[13px] font-semibold rounded-lg px-3 sm:px-4 py-2.5 hover:opacity-90 disabled:opacity-60 whitespace-nowrap">{saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} <span className="sm:hidden">Save</span><span className="hidden sm:inline">Save All Changes</span></button>
                        <button type="button" onClick={() => guard(logout)} aria-label="Log out" className="p-2.5 text-gray-500 bg-gray-50 rounded-lg hover:text-gray-900"><LogOut size={17} /></button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1100px] mx-auto px-3 sm:px-4 mt-5 sm:mt-8">
                {!canSave && (<div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-5 py-4">Saving is not available here: database storage (Supabase) is not configured on this server. You can still edit and press <b>Export</b>.</div>)}
                <nav className="bg-white border border-gray-100 rounded-2xl shadow-sm p-1.5 sm:p-2 flex flex-nowrap sm:flex-wrap gap-1 mb-5 sm:mb-8 overflow-x-auto sm:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {TABS.map((t) => { const I = t.icon; const on = t.id === tab; return (
                        <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`inline-flex shrink-0 whitespace-nowrap items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-[13px] sm:text-[13.5px] font-semibold transition-colors ${on ? "bg-[#1A2E35] text-white" : "text-gray-500 hover:bg-gray-50"}`}><I size={16} /> {t.label}{(t.id === "inquiries" || t.id === "applications") && subs.loaded && <span className={`ml-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${on ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>{subs.rows.filter((r) => (t.id === "applications") === isApplication(r)).length}</span>}</button>); })}
                </nav>
                <div className="space-y-6">{cur.blocks.map((b, i) => <BlockView key={cur.id + i} b={b} content={content} update={update} />)}</div>
            </main>

            <AnimatePresence>
                {leave && (
                    <motion.div key="unsaved" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onMouseDown={(e) => { if (e.target === e.currentTarget) setLeave(null); }}>
                        <motion.div role="alertdialog" aria-modal="true" aria-labelledby="un-title" initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                            className="w-full max-w-[460px] bg-white text-gray-900 rounded-[24px] shadow-2xl p-8 text-center font-sans">
                            <div className="mx-auto mb-5 w-14 h-14 rounded-full flex items-center justify-center bg-gray-100 text-[#1A2E35]"><Save size={24} /></div>
                            <h3 id="un-title" className="text-2xl font-extrabold font-serif mb-2">You have unsaved changes</h3>
                            <p className="text-gray-500 text-[15px] leading-relaxed mb-7">Do you want to save them before you leave, or discard them? Saved changes go live on the website.</p>
                            <div className="flex flex-col gap-3">
                                <button type="button" autoFocus disabled={saving} onClick={async () => { const go = leave; if (await save()) { setLeave(null); go(); } }} className="w-full bg-[#1A2E35] text-white font-semibold text-[14px] py-3 rounded-xl hover:opacity-90 disabled:opacity-60">{saving ? "Saving\u2026" : "Save changes and continue"}</button>
                                <button type="button" disabled={saving} onClick={() => { const go = leave; setDirty(false); setLeave(null); setTimeout(go, 0); }} className="w-full bg-red-600 text-white font-semibold text-[14px] py-3 rounded-xl hover:opacity-90 disabled:opacity-60">Discard changes</button>
                                <button type="button" disabled={saving} onClick={() => setLeave(null)} className="w-full border border-gray-200 text-gray-700 font-semibold text-[14px] py-3 rounded-xl hover:bg-gray-50">Keep editing</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                {toast && (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[560px] w-[calc(100%-2rem)] flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm ${toast.ok ? "bg-[#1A2E35] text-white" : "bg-red-600 text-white"}`}>
                    {toast.ok ? <Check size={18} className="mt-0.5 shrink-0" /> : <X size={18} className="mt-0.5 shrink-0" />}<span className="flex-1">{toast.text}</span></motion.div>)}
            </AnimatePresence>
        </div>
        </SubsCtx.Provider>
        </ListsCtx.Provider>
        </ConfirmHost>
    );
}
