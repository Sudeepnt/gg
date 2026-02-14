"use client";

import { useState } from "react";
import { Save, Loader2, Home, BookOpen, Briefcase, Users, Mail, Plus, Trash2, X, CheckCircle, AlertCircle, RotateCcw, MessageSquare } from "lucide-react";
import { getCMSData, saveCMSData } from "../actions/cmsActions";
import { getContactSubmissions } from "../actions/adminActions"; // Assumed action exists
import { DEFAULT_CONTENT as defaultContent } from "../data/defaultContent";

type Tab = "submissions" | "home" | "principles" | "business" | "people" | "contact";
type ToastType = { message: string; type: "success" | "error" } | null;

export default function AdminAtit() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("submissions"); // Set submissions as default
    const [loginError, setLoginError] = useState("");
    const [toast, setToast] = useState<ToastType>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);

    // Initial Content State - Loaded from Server Action
    const [content, setContent] = useState<any>(null);

    const ADMIN_PASSWORD = "atit5656";

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLoginError("");
        setTimeout(async () => {
            if (password === ADMIN_PASSWORD) {
                setIsAuthenticated(true);
                try {
                    // Fetch Content
                    const data = await getCMSData();
                    if (data) setContent(data);

                    // Fetch Submissions
                    const subs = await getContactSubmissions();
                    setSubmissions(subs || []);

                } catch (error) {
                    console.error("Failed to fetch data", error);
                }
            } else {
                setLoginError("Invalid password. Please try again.");
            }
            setLoading(false);
        }, 800);
    };

    const handleReset = (scope: Tab | 'all' = 'all') => {
        const message = scope === 'all'
            ? "Are you sure? This will reset the ENTIRE website content to defaults. You need to click Save to make it permanent."
            : `Are you sure? This will reset only the ${scope.toUpperCase()} page content to defaults. You need to click Save to make it permanent.`;

        if (window.confirm(message)) {
            if (scope === 'all') {
                setContent(defaultContent);
                showToast("All content reset to defaults. Remember to Save.", "success");
            } else {
                setContent((prev: any) => {
                    const updated = {
                        ...prev,
                        [scope]: defaultContent[scope as keyof typeof defaultContent]
                    };
                    // Special case: 'business' tab also controls 'services'
                    if (scope === 'business') {
                        updated.services = (defaultContent as any).services;
                    }
                    return updated;
                });
                showToast(`${scope} content reset to defaults. Remember to Save.`, "success");
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await saveCMSData(content);
            if (result.success) {
                showToast("All changes saved successfully!", "success");
            } else {
                showToast("Failed to save changes: " + result.error, "error");
            }
        } catch (e) {
            console.error(e);
            showToast("An unexpected error occurred while saving.", "error");
        }
        setSaving(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen w-full bg-[#13343e] flex items-center justify-center p-4">
                <div className="bg-white rounded-[32px] shadow-2xl p-12 w-full max-w-[480px] flex flex-col items-center">

                    <h1 className="text-3xl font-bold text-black mb-2 tracking-tight">Admin Portal</h1>
                    <p className="text-gray-500 mb-10 font-medium">Content Management System</p>

                    <form onSubmit={handleLogin} className="w-full space-y-4">
                        <div className="text-left">
                            <label className="block text-sm font-bold text-black mb-2 ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                                className={`w-full px-5 py-3 border rounded-xl focus:ring-2 focus:ring-[#13343e] focus:border-[#13343e] outline-none text-gray-900 placeholder-gray-400 bg-gray-50 text-lg transition-all ${loginError ? 'border-red-400' : 'border-gray-200'}`}
                                placeholder="Enter admin password"
                            />
                            {loginError && (
                                <p className="text-red-500 text-sm mt-2 ml-1 flex items-center gap-1">
                                    <AlertCircle size={14} /> {loginError}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#13343e] text-white py-3.5 rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                "Access CMS"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!content) {
        return (
            <div className="fixed inset-0 z-[200] bg-[#F5F5F7] flex items-center justify-center cursor-auto">
                <style jsx global>{`
                    .cursor-auto, .cursor-auto * { cursor: auto !important; }
                `}</style>
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-[#13343e]" size={48} />
                    <p className="text-[#13343e] font-medium">Loading CMS Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 min-h-screen bg-[#F5F5F7] text-black z-[200] font-sans flex flex-col overflow-y-auto cursor-auto">
            <style jsx global>{`
                .cursor-auto, .cursor-auto * { cursor: auto !important; }
            `}</style>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[300] px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X size={18} /></button>
                </div>
            )}

            {/* Top Navigation Bar */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 px-8 py-4 flex items-center justify-between flex-shrink-0">
                <h2 className="text-[#13343e] font-bold text-xl tracking-tight">Admin Portal</h2>

                <div className="flex gap-3">
                    <a
                        href="/"
                        className="border border-[#13343e] text-[#13343e] px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm text-sm"
                    >
                        Go Back to Home
                    </a>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#13343e] text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 shadow-sm text-sm"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save All Changes
                    </button>
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto mt-10 px-6 pb-20 flex-grow">

                {/* Tab Navigation */}
                <div className="flex justify-center mb-10 overflow-x-auto pb-4">
                    <div className="flex space-x-2 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 whitespace-nowrap">
                        {(["submissions", "home", "principles", "business", "people", "contact"] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab
                                    ? "bg-[#13343e] text-white shadow-md"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {tab === "submissions" && <MessageSquare size={16} />}
                                {tab === "home" && <Home size={16} />}
                                {tab === "principles" && <BookOpen size={16} />}
                                {tab === "business" && <Briefcase size={16} />}
                                {tab === "people" && <Users size={16} />}
                                {tab === "contact" && <Mail size={16} />}
                                {tab === "submissions" ? "Inquiries" :
                                    tab === "principles" ? "Principles & Culture" :
                                        tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    {activeTab === "submissions" && <SubmissionsContent submissions={submissions} />}
                    {activeTab === "home" && <HomeContent content={content} setContent={setContent} handleReset={handleReset} />}
                    {activeTab === "principles" && <PrinciplesContent content={content} setContent={setContent} handleReset={handleReset} />}
                    {activeTab === "business" && <BusinessContent content={content} setContent={setContent} handleReset={handleReset} />}
                    {activeTab === "people" && <PeopleContent content={content} setContent={setContent} handleReset={handleReset} />}
                    {activeTab === "contact" && <ContactContent content={content} setContent={setContent} handleReset={handleReset} />}
                </div>
            </div>
        </div>
    );
}

// ------------------------------------------------------------------
// SECTION COMPONENTS
// ------------------------------------------------------------------

function HomeContent({ content, setContent, handleReset }: { content: any, setContent: any, handleReset: any }) {
    const updateHero = (field: string, value: any) => {
        setContent((prev: any) => ({
            ...prev,
            home: { ...prev.home, hero: { ...prev.home.hero, [field]: value } }
        }));
    };

    const updateNav = (idx: number, field: string, value: any) => {
        const newNav = [...content.home.navigation];
        newNav[idx] = { ...newNav[idx], [field]: value };
        setContent((prev: any) => ({
            ...prev,
            home: { ...prev.home, navigation: newNav }
        }));
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-black">Hero Section Text</h3>
                    <button onClick={() => handleReset('home')} className="text-xs text-gray-500 hover:text-[#13343e] hover:underline flex items-center gap-1">
                        <RotateCcw size={12} /> Reset Home Text
                    </button>
                </div>
                <div className="grid gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Title</label>
                        <input
                            type="text"
                            value={content.home.hero.title}
                            onChange={(e) => updateHero("title", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#13343e] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Description</label>
                        <textarea
                            value={content.home.hero.subtitle}
                            onChange={(e) => updateHero("subtitle", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#13343e] focus:border-transparent outline-none transition-all resize-none font-medium leading-relaxed"
                            rows={4}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Call to Action Label</label>
                        <input
                            type="text"
                            value={content.home.hero.cta}
                            onChange={(e) => updateHero("cta", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#13343e] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>
            </div>


        </div>
    );
}

function PrinciplesContent({ content, setContent, handleReset }: { content: any, setContent: any, handleReset: any }) {
    const updatePrinciples = (path: string, value: any) => {
        setContent((prev: any) => {
            // Deep clone approach simpler for this level of nesting
            const newState = JSON.parse(JSON.stringify(prev));
            const parts = path.split('.');
            let current = newState.principles;
            for (let i = 0; i < parts.length - 1; i++) {
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
            return newState;
        });
    };

    return (
        <div className="space-y-6">
            {/* Main Heading */}
            <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Main Page Heading</label>
                    <button onClick={() => handleReset('principles')} className="text-xs text-gray-500 hover:text-[#13343e] hover:underline flex items-center gap-1">
                        <RotateCcw size={12} /> Reset Principles Text
                    </button>
                </div>
                <input
                    type="text"
                    value={content.principles.mainHeading}
                    onChange={(e) => updatePrinciples("mainHeading", e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#13343e] focus:border-transparent outline-none transition-all font-bold text-lg"
                />
            </div>

            {/* Section 1 */}
            <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-[#13343e]">Section 1: Values</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={content.principles.section1.heading}
                        onChange={(e) => updatePrinciples("section1.heading", e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-semibold"
                        placeholder="Heading"
                    />
                    <textarea
                        value={content.principles.section1.description}
                        onChange={(e) => updatePrinciples("section1.description", e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none resize-none h-32"
                        placeholder="Description"
                    />
                </div>
            </div>

            {/* Section 2: Core Principles List */}
            <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-[#13343e]">Section 2: Core Principles</h3>
                <div className="space-y-6">
                    {content.principles.corePrinciples.map((item: any, idx: number) => (
                        <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="mb-2">
                                <label className="text-xs font-bold text-gray-400 uppercase">Principle {idx + 1}</label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updatePrinciples(`corePrinciples.${idx}.title`, e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none font-medium mb-2"
                                />
                                <textarea
                                    value={item.description}
                                    onChange={(e) => updatePrinciples(`corePrinciples.${idx}.description`, e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none h-20 text-sm"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sections 3, 4, 5 */}
            {['section3', 'section4', 'section5'].map((secKey) => (
                <div key={secKey} className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-4 text-[#13343e]">
                        {secKey === 'section3' ? 'Section 3: Culture' : secKey === 'section4' ? 'Section 4: People' : 'Section 5: Invested'}
                    </h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={content.principles[secKey].heading}
                            onChange={(e) => updatePrinciples(`${secKey}.heading`, e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-semibold"
                        />
                        <textarea
                            value={content.principles[secKey].description}
                            onChange={(e) => updatePrinciples(`${secKey}.description`, e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none resize-none h-32"
                        />
                    </div>
                </div>
            ))}

        </div>
    );
}

function BusinessContent({ content, setContent, handleReset }: { content: any, setContent: any, handleReset: any }) {
    const updateBusiness = (field: string, value: any) => {
        setContent((prev: any) => ({
            ...prev,
            business: { ...prev.business, [field]: value }
        }));
    };

    const updateServicesList = (newItems: any[]) => {
        setContent((prev: any) => ({
            ...prev,
            services: { ...prev.services, items: newItems }
        }));
    };

    const updateService = (idx: number, field: string, value: any) => {
        const newServices = [...(content.services?.items || [])];
        newServices[idx] = { ...newServices[idx], [field]: value };
        updateServicesList(newServices);
    };

    const addService = () => {
        const newServices = [...(content.services?.items || []), { title: "New Service", description: "Desc..." }];
        updateServicesList(newServices);
    };

    const removeService = (idx: number) => {
        if (window.confirm("Delete this service?")) {
            const newServices = (content.services?.items || []).filter((_: any, i: number) => i !== idx);
            updateServicesList(newServices);
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. Main Business Page Configuration */}
            <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-black">Main Business Page</h3>
                    <button onClick={() => handleReset('business')} className="text-xs text-gray-500 hover:text-[#13343e] hover:underline flex items-center gap-1">
                        <RotateCcw size={12} /> Reset Business Text
                    </button>
                </div>

                <div className="mb-8">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Intro Paragraph</label>
                    <textarea
                        value={content.business.intro}
                        onChange={(e) => updateBusiness("intro", e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#13343e] focus:border-transparent outline-none transition-all resize-none font-medium leading-relaxed h-32"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-lg text-[#13343e]">Services Carousel (Main Page)</h4>
                        <button
                            onClick={addService}
                            className="text-xs bg-[#13343e] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:opacity-90 transition-opacity"
                        >
                            <Plus size={14} /> Add Service
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(content.services?.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative group flex items-center gap-3">
                                <span className="text-gray-400 font-mono text-sm self-center">0{idx + 1}</span>
                                <div className="flex-1">
                                    <label className="block text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Carousel Title</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => updateService(idx, 'title', e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#13343e] outline-none font-semibold text-sm"
                                        placeholder="Short Title"
                                    />
                                </div>
                                <button
                                    onClick={() => removeService(idx)}
                                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                    title="Remove Service"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Side View Content Configuration */}
            {(content.services?.items || []).length > 0 && (
                <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm border-t-4 border-t-[#13343e]">
                    <h3 className="text-xl font-bold mb-6 text-black">Business Side View Content</h3>
                    <p className="text-sm text-gray-500 mb-6 -mt-4">
                        This content appears in the side panel when a user clicks 'see more' on a service.
                    </p>

                    <div className="space-y-8">
                        {(content.services?.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-6 border border-gray-100 rounded-xl bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                                    <span className="bg-[#13343e] text-white text-xs font-bold px-2 py-0.5 rounded">
                                        {item.title || `Service ${idx + 1}`}
                                    </span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Details</span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Full Title (Side View)</label>
                                        <input
                                            type="text"
                                            value={item.fullTitle || ""}
                                            onChange={(e) => updateService(idx, 'fullTitle', e.target.value)}
                                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#13343e] outline-none font-bold text-lg"
                                            placeholder="e.g. Hotel Brand Management"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">If left blank, the carousel title will be used.</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Description</label>
                                        <textarea
                                            value={item.description || ""}
                                            onChange={(e) => updateService(idx, 'description', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#13343e] outline-none resize-none h-24 text-sm leading-relaxed"
                                            placeholder="Description appearing in the side panel..."
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function PeopleContent({ content, setContent, handleReset }: { content: any, setContent: any, handleReset: any }) {
    const [uploading, setUploading] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const updateMember = (idx: number, field: string, value: any) => {
        const newMembers = [...content.people.members];
        newMembers[idx] = { ...newMembers[idx], [field]: value };
        setContent((prev: any) => ({
            ...prev,
            people: { ...prev.people, members: newMembers }
        }));
    };

    const addMember = () => {
        const newMembers = [...content.people.members, { name: "New Member", role: "Role", bio: "", bio2: "", bio3: "", bio4: "", image: "/placeholder.jpeg" }];
        setContent((prev: any) => ({
            ...prev,
            people: { ...prev.people, members: newMembers }
        }));
    };

    const removeMember = (idx: number) => {
        const newMembers = content.people.members.filter((_: any, i: number) => i !== idx);
        setContent((prev: any) => ({
            ...prev,
            people: { ...prev.people, members: newMembers }
        }));
        setConfirmDelete(null);
    };

    const getDefaultImage = (name: string) => {
        if (name.toLowerCase().includes("guru")) return "/guru.jpeg";
        if (name.toLowerCase().includes("utsav")) return "/utsav.jpeg";
        return "/placeholder.jpeg";
    };

    const handleFileUpload = async (idx: number, file: File) => {
        if (!file.type.startsWith("image/")) {
            return;
        }

        setUploading(idx);
        try {
            const { uploadImage, deleteImage } = await import("../actions/uploadImage");

            // Get current image path to potentially delete later
            const currentImage = content.people.members[idx].image;

            // Upload new image
            const formData = new FormData();
            formData.append("file", file);
            formData.append("memberName", content.people.members[idx].name);

            const result = await uploadImage(formData);

            if (result.success && result.path) {
                // Delete old image (unless it's protected)
                if (currentImage && currentImage !== "/placeholder.jpeg") {
                    await deleteImage(currentImage);
                }

                // Update the member's image path
                updateMember(idx, "image", result.path);
            }
        } catch (error: any) {
            console.error("Upload error:", error);
        }
        setUploading(null);
    };

    const handleImageDrop = (idx: number, e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(idx, file);
        }
    };

    const handleImageSelect = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(idx, file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-black">Team Members</h3>
                    <button onClick={() => handleReset('people')} className="text-xs text-gray-500 hover:text-[#13343e] hover:underline flex items-center gap-1">
                        <RotateCcw size={12} /> Reset People Text
                    </button>
                </div>
                <button onClick={addMember} className="bg-[#13343e] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:opacity-90">
                    <Plus size={16} /> Add Member
                </button>
            </div>

            {content.people.members.map((member: any, idx: number) => (
                <div key={idx} className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm relative group">
                    {/* Remove Button with Inline Confirmation */}
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                        {confirmDelete === idx ? (
                            <>
                                <span className="text-xs text-red-500 font-medium">Delete?</span>
                                <button
                                    onClick={() => removeMember(idx)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                                >
                                    No
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setConfirmDelete(idx)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Column 1: Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={member.name}
                                    onChange={(e) => updateMember(idx, "name", e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#13343e] outline-none font-bold text-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Role</label>
                                <input
                                    type="text"
                                    value={member.role}
                                    onChange={(e) => updateMember(idx, "role", e.target.value)}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#13343e] outline-none"
                                />
                            </div>

                            {/* Image Section */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Profile Image</label>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${uploading === idx ? 'border-[#13343e] bg-[#13343e]/5' : 'border-gray-300 hover:border-[#13343e]'}`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleImageDrop(idx, e)}
                                    onClick={() => !uploading && document.getElementById(`image-input-${idx}`)?.click()}
                                >
                                    <input
                                        id={`image-input-${idx}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleImageSelect(idx, e)}
                                        disabled={uploading !== null}
                                    />
                                    {uploading === idx ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="animate-spin text-[#13343e]" size={16} />
                                            <p className="text-sm text-[#13343e] font-medium">Uploading...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm text-gray-500">Drag & drop or click to select</p>
                                            <p className="text-xs text-gray-400 mt-1">Current: {member.image}</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    value={member.image}
                                    onChange={(e) => updateMember(idx, "image", e.target.value)}
                                    className="w-full px-4 py-2 mt-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
                                    placeholder="/image-path.jpg"
                                />
                                <button
                                    onClick={() => updateMember(idx, "image", getDefaultImage(member.name))}
                                    className="mt-2 text-xs text-[#13343e] hover:underline"
                                >
                                    ↺ Reset to Default Photo
                                </button>
                                <p className="text-[10px] text-amber-600 mt-2">
                                    ⚠️ If you change the image, the old one will be replaced. Note: guru.jpeg & utsav.jpeg (The default images)are protected and will never be deleted.
                                </p>
                            </div>
                        </div>

                        {/* Column 2: Bio Paragraphs 1 & 2 */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Biography (Paragraphs 1-2)</label>
                            <textarea
                                value={member.bio || ""}
                                onChange={(e) => updateMember(idx, "bio", e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none h-32 text-sm"
                                placeholder="Paragraph 1"
                            />
                            <textarea
                                value={member.bio2 || ""}
                                onChange={(e) => updateMember(idx, "bio2", e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none h-32 text-sm"
                                placeholder="Paragraph 2 (Optional)"
                            />
                        </div>

                        {/* Column 3: Bio Paragraphs 3 & 4 */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Biography (Paragraphs 3-4)</label>
                            <textarea
                                value={member.bio3 || ""}
                                onChange={(e) => updateMember(idx, "bio3", e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none h-32 text-sm"
                                placeholder="Paragraph 3 (Optional)"
                            />
                            <textarea
                                value={member.bio4 || ""}
                                onChange={(e) => updateMember(idx, "bio4", e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none h-32 text-sm"
                                placeholder="Paragraph 4 (Optional)"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ContactContent({ content, setContent, handleReset }: { content: any, setContent: any, handleReset: any }) {
    const updateContact = (field: string, value: any) => {
        setContent((prev: any) => ({
            ...prev,
            contact: { ...prev.contact, [field]: value }
        }));
    };

    return (
        <div className="space-y-6">
            {/* Form Text Section */}
            <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-black">Contact Form Text</h3>
                    <button onClick={() => handleReset('contact')} className="text-xs text-gray-500 hover:text-[#13343e] hover:underline flex items-center gap-1">
                        <RotateCcw size={12} /> Reset Contact Text
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Line 1 Start</label>
                            <input
                                type="text"
                                value={content.contact.formLine1Start || ""}
                                onChange={(e) => updateContact("formLine1Start", e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
                                placeholder="Hi, my name is"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Name Placeholder</label>
                            <input
                                type="text"
                                value={content.contact.namePlaceholder || ""}
                                onChange={(e) => updateContact("namePlaceholder", e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
                                placeholder="your name"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Line 1 End</label>
                        <input
                            type="text"
                            value={content.contact.formLine1End || ""}
                            onChange={(e) => updateContact("formLine1End", e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
                            placeholder="and I'm exploring a potential partnership..."
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Line 2 Start</label>
                            <input
                                type="text"
                                value={content.contact.formLine2Start || ""}
                                onChange={(e) => updateContact("formLine2Start", e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
                                placeholder="Get in touch with me at"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email Placeholder</label>
                            <input
                                type="text"
                                value={content.contact.emailPlaceholder || ""}
                                onChange={(e) => updateContact("emailPlaceholder", e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
                                placeholder="your e-mail"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Line 2 End</label>
                            <input
                                type="text"
                                value={content.contact.formLine2End || ""}
                                onChange={(e) => updateContact("formLine2End", e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
                                placeholder="."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Button Text</label>
                            <input
                                type="text"
                                value={content.contact.buttonText || ""}
                                onChange={(e) => updateContact("buttonText", e.target.value)}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none font-semibold"
                                placeholder="Send"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Company Details */}
            <div className="bg-white rounded-[24px] border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-black">Contact & Footer Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Company Name</label>
                        <input
                            type="text"
                            value={content.contact.companyName}
                            onChange={(e) => updateContact("companyName", e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Email</label>
                        <input
                            type="text"
                            value={content.contact.email}
                            onChange={(e) => updateContact("email", e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Phone Number</label>
                        <input
                            type="text"
                            value={content.contact.phone || ""}
                            onChange={(e) => updateContact("phone", e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Address Lines</label>
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={content.contact.address1}
                            onChange={(e) => updateContact("address1", e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none"
                        />
                        <input
                            type="text"
                            value={content.contact.address2}
                            onChange={(e) => updateContact("address2", e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none"
                        />
                        <input
                            type="text"
                            value={content.contact.address3}
                            onChange={(e) => updateContact("address3", e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Form Consent Text</label>
                    <textarea
                        value={content.contact.consentText}
                        onChange={(e) => updateContact("consentText", e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 focus:ring-2 focus:ring-[#13343e] focus:border-transparent outline-none transition-all resize-none text-sm h-24"
                    />
                </div>

            </div>
        </div>
    );
}

function SubmissionsContent({ submissions }: { submissions: any[] }) {
    if (!submissions || submissions.length === 0) {
        return (
            <div className="bg-white rounded-[24px] border border-gray-200 p-12 shadow-sm text-center">
                <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-black mb-2">No Inquiries Yet</h3>
                <p className="text-gray-500">Messages sent via the contact form will appear here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-black">Client Inquiries ({submissions.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-4 font-bold text-[#13343e] uppercase tracking-wider text-xs">Date & Time</th>
                            <th className="px-8 py-4 font-bold text-[#13343e] uppercase tracking-wider text-xs">Name</th>
                            <th className="px-8 py-4 font-bold text-[#13343e] uppercase tracking-wider text-xs">Email</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {submissions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-8 py-4 text-gray-500 whitespace-nowrap text-xs font-mono">
                                    {new Date(sub.created_at).toLocaleString()}
                                </td>
                                <td className="px-8 py-4 font-semibold text-gray-900">
                                    {sub.name || "N/A"}
                                </td>
                                <td className="px-8 py-4">
                                    {sub.email ? (
                                        <a
                                            href={`mailto:${sub.email}`}
                                            className="text-[#13343e] hover:underline font-medium inline-flex items-center gap-1"
                                        >
                                            {sub.email}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
