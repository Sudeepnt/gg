"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getCMSData, saveCMSData, getInquiries } from "../../actions/cmsActions";
import {
    LayoutDashboard,
    Home,
    Info,
    PlayCircle,
    FileText,
    Mail,
    Save,
    LogOut,
    Check,
    ListFilter,
    ArrowRight,
    ClipboardList
} from "lucide-react";

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("inquiries");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Simple auth check
        const auth = localStorage.getItem("admin_auth");
        if (auth !== "true") {
            router.push("/admingg");
            return;
        }

        const fetchData = async () => {
            const cmsData = await getCMSData();
            setData(cmsData);
            const inquiryData = await getInquiries();
            setInquiries(inquiryData.reverse());
        };
        fetchData();
    }, [router]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveCMSData(data);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        router.push("/admingg");
    };

    if (!data) return <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-sans">Loading...</div>;

    const tabs = [
        { id: "inquiries", label: "Inquiries", icon: ListFilter },
        { id: "home", label: "Home", icon: Home },
        { id: "about", label: "About", icon: Info },
        { id: "ggProductions", label: "GG Productions", icon: PlayCircle },
        { id: "pitch", label: "Pitch", icon: FileText },
        { id: "contact", label: "Contact", icon: Mail },
        { id: "form", label: "App Form", icon: ClipboardList },
    ];

    const renderInput = (label: string, value: string, path: string[], isTextArea = false) => {
        const updateValue = (newVal: string) => {
            const newData = { ...data };
            let current = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = newVal;
            setData(newData);
        };

        return (
            <div className="mb-6 last:mb-0">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">
                    {label}
                </label>
                {isTextArea ? (
                    <textarea
                        value={value}
                        onChange={(e) => updateValue(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A2E35] focus:border-transparent transition-all min-h-[120px] font-sans text-[15px] leading-relaxed"
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => updateValue(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A2E35] focus:border-transparent transition-all font-sans text-[15px]"
                    />
                )}
            </div>
        );
    };

    const renderArrayInput = (label: string, values: string[], path: string[]) => {
        const updateValue = (index: number, newVal: string) => {
            const newData = { ...data };
            let current = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]][index] = newVal;
            setData(newData);
        };

        return (
            <div className="mb-8 last:mb-0">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 px-1 border-b border-gray-100 pb-2">
                    {label}
                </label>
                <div className="space-y-4">
                    {values.map((v, i) => (
                        <div key={i}>
                            <textarea
                                value={v}
                                onChange={(e) => updateValue(i, e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A2E35] focus:border-transparent transition-all min-h-[80px] font-sans text-[15px] leading-relaxed"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-20">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-[#1A2E35] p-2 rounded-lg">
                            <LayoutDashboard className="text-white" size={20} />
                        </div>
                        <h1 className="text-[20px] font-bold tracking-tight">Admin Portal</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/")}
                            className="text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 border border-gray-200 rounded-lg"
                        >
                            Go Back to Home
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-[13px] transition-all shadow-sm ${saveSuccess
                                ? "bg-green-500 text-white"
                                : "bg-[#1A2E35] text-white hover:bg-opacity-90"
                                }`}
                        >
                            {isSaving ? "Saving..." : saveSuccess ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save All Changes</>}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto mt-8 px-8">
                {/* Tabs */}
                <div className="bg-white border border-gray-200 rounded-xl p-2 mb-8 flex items-center justify-between shadow-sm overflow-x-auto">
                    <div className="flex gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                    ? "bg-[#1A2E35] text-white shadow-md"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Cards */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                    >
                        {activeTab === "inquiries" && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold mb-6">Recent Form Inquiries</h3>
                                {inquiries.length === 0 ? (
                                    <div className="bg-white border border-gray-200 rounded-2xl p-20 text-center">
                                        <Mail size={48} className="mx-auto text-gray-200 mb-4" />
                                        <p className="text-gray-400 font-medium">No inquiries yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {inquiries.map((iq) => (
                                            <div key={iq.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-bold text-lg">{iq.name}</h4>
                                                        <p className="text-[#1A2E35] font-medium text-sm">{iq.email}</p>
                                                    </div>
                                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">
                                                        {new Date(iq.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-[14px] leading-relaxed italic">
                                                    "{iq.message}"
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "home" && (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-4xl">
                                <h3 className="text-xl font-bold mb-8">Hero Section Text</h3>
                                {renderInput("Particle Text", data.home.particleText, ["home", "particleText"])}

                                <h3 className="text-xl font-bold mt-12 mb-8">Cookie Consent Banner</h3>
                                {renderInput("Cookie Banner Text", data.home.cookieText, ["home", "cookieText"], true)}
                                {renderInput("Cookie Button Label", data.home.cookieButton, ["home", "cookieButton"])}
                            </div>
                        )}

                        {activeTab === "about" && (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-4xl">
                                <h3 className="text-xl font-bold mb-8">Manifesto Quote</h3>
                                {renderInput("Quote Text", data.about.quote, ["about", "quote"], true)}
                                {renderInput("Signature", data.about.signature, ["about", "signature"])}
                            </div>
                        )}

                        {activeTab === "ggProductions" && (
                            <div className="space-y-8 max-w-4xl">
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
                                    <h3 className="text-xl font-bold mb-8">Intro & Brief</h3>
                                    {renderInput("Header Particle Text", data.ggProductions.particleText, ["ggProductions", "particleText"])}
                                    {renderArrayInput("Brief Paragraphs", data.ggProductions.brief, ["ggProductions", "brief"])}
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
                                    <h3 className="text-xl font-bold mb-8">Services</h3>
                                    {renderInput("Section Title", data.ggProductions.servicesTitle, ["ggProductions", "servicesTitle"])}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">List Column 1</h4>
                                            {data.ggProductions.servicesList1.map((v: string, i: number) => (
                                                <div key={i} className="mb-4">
                                                    <input
                                                        type="text"
                                                        value={v}
                                                        onChange={(e) => {
                                                            const newData = { ...data };
                                                            newData.ggProductions.servicesList1[i] = e.target.value;
                                                            setData(newData);
                                                        }}
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">List Column 2</h4>
                                            {data.ggProductions.servicesList2.map((v: string, i: number) => (
                                                <div key={i} className="mb-4">
                                                    <input
                                                        type="text"
                                                        value={v}
                                                        onChange={(e) => {
                                                            const newData = { ...data };
                                                            newData.ggProductions.servicesList2[i] = e.target.value;
                                                            setData(newData);
                                                        }}
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
                                    <h3 className="text-xl font-bold mb-8">Clients & Footer</h3>
                                    {renderInput("Clients Title", data.ggProductions.clientsTitle, ["ggProductions", "clientsTitle"])}
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Client List</h4>
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {data.ggProductions.clients.map((v: string, i: number) => (
                                            <input
                                                key={i}
                                                type="text"
                                                value={v}
                                                onChange={(e) => {
                                                    const newData = { ...data };
                                                    newData.ggProductions.clients[i] = e.target.value;
                                                    setData(newData);
                                                }}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm"
                                            />
                                        ))}
                                    </div>
                                    <div className="pt-8 border-t border-gray-100 space-y-6">
                                        {renderInput("Footer Banner Title", data.ggProductions.footerTitle, ["ggProductions", "footerTitle"])}
                                        {renderInput("Footer CTA Text", data.ggProductions.footerCta, ["ggProductions", "footerCta"])}
                                        {renderInput("Copyright Name", data.ggProductions.copyright, ["ggProductions", "copyright"])}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "pitch" && (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-4xl">
                                <h3 className="text-xl font-bold mb-8">Pitch Information</h3>
                                {renderInput("Page Title", data.pitch.title, ["pitch", "title"])}
                                {renderArrayInput("Instruction Paragraphs", data.pitch.paragraphs, ["pitch", "paragraphs"])}
                                {renderInput("Button Label", data.pitch.buttonText, ["pitch", "buttonText"])}
                            </div>
                        )}

                        {activeTab === "contact" && (
                            <div className="space-y-8 max-w-4xl">
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
                                    <h3 className="text-xl font-bold mb-8">Contact Form Text</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                        {renderInput("Line 1 Start", data.contact.formLine1Start, ["contact", "formLine1Start"])}
                                        {renderInput("Name Placeholder", data.contact.namePlaceholder, ["contact", "namePlaceholder"])}
                                        <div className="md:col-span-2">
                                            {renderInput("Line 1 End", data.contact.formLine1End, ["contact", "formLine1End"])}
                                        </div>
                                        {renderInput("Line 2 Start", data.contact.formLine2Start, ["contact", "formLine2Start"])}
                                        {renderInput("Email Placeholder", data.contact.emailPlaceholder, ["contact", "emailPlaceholder"])}
                                        {renderInput("Line 2 End", data.contact.formLine2End, ["contact", "formLine2End"])}
                                        {renderInput("Submit Button Text", data.contact.buttonText, ["contact", "buttonText"])}
                                    </div>
                                    {renderInput("Consent Checkbox Text", data.contact.consentText, ["contact", "consentText"], true)}
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
                                    <h3 className="text-xl font-bold mb-8">Contact & Footer Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                        {renderInput("Company Name", data.contact.companyName, ["contact", "companyName"])}
                                        {renderInput("Email", data.contact.email, ["contact", "email"])}
                                        {renderInput("Phone Number", data.contact.phone, ["contact", "phone"])}
                                    </div>
                                    <div className="space-y-4">
                                        {renderInput("Address Line 1", data.contact.address1, ["contact", "address1"])}
                                        {renderInput("Address Line 2", data.contact.address2, ["contact", "address2"])}
                                        {renderInput("Address Line 3", data.contact.address3, ["contact", "address3"])}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "form" && (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 max-w-4xl">
                                <h3 className="text-xl font-bold mb-8">Application Form Content</h3>
                                {renderInput("Page Title", data.form.title, ["form", "title"])}
                                {renderInput("Intro Text", data.form.intro, ["form", "intro"], true)}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
