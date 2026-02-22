"use client";

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getCMSData, saveCMSData, getInquiries, resetPageToDefault, dbHeartbeat, deleteInquiry } from "../../actions/cmsActions";
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
    ClipboardList,
    Gamepad2,
    RotateCcw,
    Trash2,
    Plus,
    Upload,
    Loader2,
    X,
    ChevronDown
} from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("inquiries");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const router = useRouter();

    const renderVideoUpload = (label: string, value: string, path: string[]) => {
        const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Simple validation
            if (!file.type.startsWith('video/')) {
                alert('Please upload a video file.');
                return;
            }

            setIsUploading(true);
            setUploadProgress(0);

            try {
                const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
                const filePath = `applications/hero-reels/${fileName}`;

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('gg-content')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('gg-content')
                    .getPublicUrl(filePath);

                // Update CMS data state
                const newData = { ...data };
                let current = newData;
                for (let i = 0; i < path.length - 1; i++) {
                    current = current[path[i]];
                }
                current[path[path.length - 1]] = publicUrl;
                setData(newData);

                alert("Video uploaded and URL updated!");
            } catch (error: any) {
                console.error("Upload error:", error);
                alert(`Upload failed: ${error.message || 'Unknown error'}. Make sure the "gg-content" bucket exists and has public policies.`);
            } finally {
                setIsUploading(false);
            }
        };

        return (
            <div className="mb-8 p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl transition-all hover:bg-white hover:border-[#1A2E35]/30">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">
                    {label}
                </label>

                <div className="flex flex-col items-center justify-center gap-4 py-4">
                    {value ? (
                        <div className="w-full max-w-sm aspect-video bg-black rounded-lg overflow-hidden border border-gray-100 mb-2 relative group">
                            <video src={value} className="w-full h-full object-cover" controls />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-4">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const newData = { ...data };
                                        let current = newData;
                                        for (let i = 0; i < path.length - 1; i++) {
                                            current = current[path[i]];
                                        }
                                        current[path[path.length - 1]] = "";
                                        setData(newData);
                                    }}
                                    className="bg-red-500/80 hover:bg-red-600 p-2 rounded-full border border-red-400/50 transition-colors pointer-events-auto shadow-lg"
                                    title="Remove Video"
                                >
                                    <X size={18} className="text-white" />
                                </button>
                                <span className="text-white text-[10px] font-bold uppercase tracking-widest pointer-events-none">Active Reel</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                            <PlayCircle size={40} />
                        </div>
                    )}

                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                            {isUploading ? "Uploading video..." : "Upload or replace video reel"}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Supabase Storage (gg-content bucket)
                        </p>
                    </div>

                    <label className={`relative cursor-pointer px-8 py-3 bg-[#1A2E35] text-white rounded-lg font-bold text-xs hover:bg-opacity-90 transition-all flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        {isUploading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Upload size={16} />
                        )}
                        <span>{isUploading ? 'Processing...' : (value ? 'Change Video' : 'Upload Video')}</span>
                        <input type="file" className="hidden" accept="video/*" onChange={onUpload} disabled={isUploading} />
                    </label>
                </div>

                {value && !isUploading && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] text-gray-400 truncate">{value}</p>
                        </div>
                    </div>
                )}
            </div>
        );
    };

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

            // Trigger heartbeat to keep Supabase active
            dbHeartbeat();
        };
        fetchData();
    }, [router]);

    const handleReset = async (pageKey: string) => {
        setIsSaving(true);
        try {
            const result = await resetPageToDefault(pageKey);
            if (result.success) {
                // Instantly update the UI state with the fresh defaults
                setData(result.data);

                // Show a quick success feedback without blocking alerts
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000);
            } else {
                alert(`Reset failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Failed to reset:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await saveCMSData(data);
            if (result.success) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                const errorMsg = (result as any).error?.message || "Unknown database error";
                alert(`FAILED TO SAVE TO SUPABASE: ${errorMsg}\n\nYour changes are NOT stored securely. Check your Supabase table and connection.`);
            }
        } catch (error: any) {
            console.error("Failed to save:", error);
            alert(`SYSTEM ERROR: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        router.push("/admingg");
    };

    const handleDeleteInquiry = async (id: number) => {
        if (!confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) return;

        try {
            const result = await deleteInquiry(id);
            if (result.success) {
                setInquiries(inquiries.filter(iq => iq.id !== id));
            } else {
                alert(`Delete failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Failed to delete inquiry:", error);
            alert("An unexpected error occurred while deleting.");
        }
    };

    const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number, projectPath: string = "projects") => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        setIsUploading(true);
        try {
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const filePath = `applications/projects/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('gg-content')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('gg-content')
                .getPublicUrl(filePath);

            const newData = { ...data };
            const projects = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
            projects[index].image = publicUrl;
            setData(newData);
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(`Upload failed: ${error.message}. Make sure the "gg-content" bucket exists and has public policies.`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleProjectScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>, projectIndex: number, screenshotIndex: number, projectPath: string = "projects") => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        setIsUploading(true);
        try {
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const filePath = `applications/screenshots/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('gg-content')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('gg-content')
                .getPublicUrl(filePath);

            const newData = { ...data };
            const projects = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
            if (!projects[projectIndex].screenshots) {
                projects[projectIndex].screenshots = [];
            }
            projects[projectIndex].screenshots[screenshotIndex] = publicUrl;
            setData(newData);
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleProjectVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number, projectPath: string = "projects") => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            alert('Please upload a video file.');
            return;
        }

        setIsUploading(true);
        try {
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const filePath = `applications/project-videos/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('gg-content')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('gg-content')
                .getPublicUrl(filePath);

            const newData = { ...data };
            const projects = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
            projects[index].video = publicUrl;
            setData(newData);
            alert("Video uploaded successfully!");
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    if (!data) return <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center font-sans">Loading...</div>;

    const tabs = [
        { id: "inquiries", label: "General Inquiries", icon: ListFilter },
        { id: "applications", label: "Applications", icon: ClipboardList },
        { id: "home", label: "Home", icon: Home },
        { id: "projects", label: "Games", icon: Gamepad2 },
        { id: "ggProductions", label: "GG Productions", icon: PlayCircle },
        { id: "about", label: "About Us", icon: Info },
        { id: "pitch", label: "Pitch Us", icon: FileText },
        { id: "contact", label: "Contact Us", icon: Mail },
        { id: "form", label: "Form Labels", icon: ClipboardList },
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
                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A2E35] focus:border-transparent transition-all min-h-[120px] font-sans text-[15px] leading-relaxed select-text cursor-text"
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => updateValue(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A2E35] focus:border-transparent transition-all font-sans text-[15px] select-text cursor-text"
                    />
                )}
            </div>
        );
    };

    const renderInquirySection = (title: string, list: any[]) => {
        const [expandedId, setExpandedId] = useState<string | null>(null);

        return (
            <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm">
                <div className="p-8 pb-4">
                    <h3 className="text-xl font-bold text-gray-900">{title} ({list.length})</h3>
                </div>

                {list.length === 0 ? (
                    <div className="p-20 text-center border-t border-gray-50">
                        <Mail size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium">No submissions yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-t border-b border-gray-100">
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Date & Time</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Name</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Email</th>
                                    <th className="px-8 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((iq) => (
                                    <React.Fragment key={iq.id}>
                                        <tr
                                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors cursor-pointer"
                                            onClick={() => setExpandedId(expandedId === iq.id ? null : iq.id)}
                                        >
                                            <td className="px-8 py-6 text-[13px] text-gray-400 font-mono whitespace-nowrap">
                                                {new Date(iq.created_at || iq.date).toLocaleString('en-GB', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit', second: '2-digit'
                                                })}
                                            </td>
                                            <td className="px-8 py-6 text-[15px] font-bold text-gray-900 font-sans">
                                                {iq.name}
                                            </td>
                                            <td className="px-8 py-6 text-[14px] text-[#2C3E50] font-sans">
                                                {iq.email}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteInquiry(iq.id);
                                                        }}
                                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <ChevronDown
                                                        size={18}
                                                        className={`text-gray-300 transition-transform duration-300 ${expandedId === iq.id ? 'rotate-180 text-[#1A2E35]' : ''}`}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedId === iq.id && (
                                            <tr>
                                                <td colSpan={4} className="px-8 pb-8 pt-2 bg-gray-50/30 border-b border-gray-100 transition-all">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="space-y-6"
                                                    >
                                                        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Message Body</p>
                                                            <div className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                                                                {iq.message || "No message provided."}
                                                            </div>
                                                        </div>

                                                        {iq.data && iq.data.fullData && (
                                                            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mt-4">
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Submission Details</p>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                                                    {Object.entries(iq.data.fullData).map(([key, value]: [string, any]) => {
                                                                        if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || key === "isCaptchaVerified") return null;

                                                                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                                                                        return (
                                                                            <div key={key} className="flex flex-col gap-1">
                                                                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</span>
                                                                                <span className="text-[14px] text-gray-900 font-medium break-words">
                                                                                    {key === "attachedFiles" && Array.isArray(value) ? (
                                                                                        <div className="flex flex-col gap-2 mt-2">
                                                                                            {value.map((f: any, i: number) => (
                                                                                                <a key={i} href={f.url} target="_blank" rel="noopener noreferrer" className="text-[#1A2E35] hover:underline flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 w-fit">
                                                                                                    <Upload size={14} className="text-gray-400" />
                                                                                                    <span className="max-w-[200px] truncate">{f.name}</span>
                                                                                                </a>
                                                                                            ))}
                                                                                        </div>
                                                                                    ) : typeof value === 'boolean' ? (
                                                                                        value ? "Yes" : "No"
                                                                                    ) : String(value)}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A2E35] focus:border-transparent transition-all min-h-[80px] font-sans text-[15px] leading-relaxed select-text cursor-text"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderProjectManagement = (title: string, projects: any[], projectPath: string) => {
        return (
            <div className="space-y-8 w-full relative">
                <div className="flex justify-between items-center bg-white border border-gray-200 rounded-2xl p-6 mb-4 relative">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-xl font-bold">{title}</h3>
                    </div>
                    <button
                        onClick={() => {
                            const newData = { ...data };
                            if (projectPath === "projects") {
                                if (!newData.projects) newData.projects = [];
                                newData.projects.push({
                                    title: "NEW PROJECT",
                                    image: "/clients/default.jpg",
                                    description: "Describe your project here...",
                                    screenshots: [],
                                    wishlistOn: [],
                                    followOn: [],
                                    availableOn: []
                                });
                            } else {
                                if (!newData.ggProductions) newData.ggProductions = {};
                                if (!newData.ggProductions.projects) newData.ggProductions.projects = [];
                                newData.ggProductions.projects.push({
                                    title: "NEW PROJECT",
                                    image: "/clients/default.jpg",
                                    description: "Describe your project here...",
                                    screenshots: [],
                                    wishlistOn: [],
                                    followOn: [],
                                    availableOn: []
                                });
                            }
                            setData(newData);
                        }}
                        className="flex items-center gap-2 px-6 py-2 bg-[#1A2E35] text-white rounded-lg font-bold text-xs hover:bg-opacity-90 transition-all font-sans"
                    >
                        <Plus size={16} /> Add New Project
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {projects.map((project: any, i: number) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-2xl p-10 relative overflow-hidden group">
                            <button
                                onClick={() => {
                                    const newData = { ...data };
                                    if (projectPath === "projects") {
                                        newData.projects.splice(i, 1);
                                    } else {
                                        newData.ggProductions.projects.splice(i, 1);
                                    }
                                    setData(newData);
                                }}
                                className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors"
                                title="Delete Project"
                            >
                                <Trash2 size={20} />
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">Project Thumbnail</label>
                                    <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl transition-all hover:bg-white hover:border-[#1A2E35]/30 flex flex-col items-center justify-center gap-5">
                                        {project.image && !project.image.includes('default.jpg') ? (
                                            <div
                                                className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-100 relative group cursor-pointer shadow-sm"
                                                onClick={() => document.getElementById(`${projectPath}-file-input-${i}`)?.click()}
                                            >
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e: any) => e.target.src = 'https://placehold.co/600x400?text=No+Image'}
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-4">
                                                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                                                        <Upload size={20} className="text-white" />
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newData = { ...data };
                                                            const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                            target[i].image = "";
                                                            setData(newData);
                                                        }}
                                                        className="bg-red-500/20 backdrop-blur-md p-3 rounded-full border border-red-500/30 hover:bg-red-500/40 transition-colors"
                                                    >
                                                        <X size={20} className="text-white" />
                                                    </button>
                                                </div>
                                                {isUploading && (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white z-10 backdrop-blur-[2px]">
                                                        <Loader2 size={24} className="animate-spin mb-2" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Uploading...</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 cursor-pointer hover:bg-gray-200 transition-all hover:scale-110 shadow-inner"
                                                onClick={() => document.getElementById(`${projectPath}-file-input-${i}`)?.click()}
                                            >
                                                {projectPath === "projects" ? <Gamepad2 size={40} /> : <PlayCircle size={40} />}
                                            </div>
                                        )}

                                        <div className="text-center">
                                            <p className="text-sm font-bold text-gray-600 mb-1">
                                                {isUploading ? "Uploading image..." : "Upload or replace project image"}
                                            </p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.1em]">
                                                Supabase Storage
                                            </p>
                                        </div>

                                        <label className={`relative cursor-pointer px-10 py-3 bg-[#1A2E35] text-white rounded-lg font-bold text-[11px] hover:bg-opacity-90 transition-all flex items-center gap-2 shadow-sm ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            <span>{isUploading ? 'Processing...' : (project.image && !project.image.includes('default.jpg') ? 'Change Thumbnail' : 'Upload Thumbnail')}</span>
                                            <input
                                                id={`${projectPath}-file-input-${i}`}
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleProjectImageUpload(e, i, projectPath)}
                                                disabled={isUploading}
                                            />
                                        </label>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hero Video</label>
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={project.video || ""}
                                                        onChange={(e) => {
                                                            const newData = { ...data };
                                                            const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                            target[i].video = e.target.value;
                                                            setData(newData);
                                                        }}
                                                        className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-mono"
                                                        placeholder="Paste .mp4 link..."
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                    <label className={`cursor-pointer px-4 py-2 bg-[#1A2E35] text-white rounded-lg font-bold text-[10px] hover:bg-opacity-90 transition-all flex items-center gap-2 whitespace-nowrap ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                        {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                                        <span>{project.video ? 'Replace' : 'Upload'}</span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="video/*"
                                                            onChange={(e) => handleProjectVideoUpload(e, i, projectPath)}
                                                            disabled={isUploading}
                                                        />
                                                    </label>
                                                </div>
                                                {project.video && (
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-[9px] text-green-600 font-bold flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                                            Video Attached
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                const newData = { ...data };
                                                                const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                                target[i].video = "";
                                                                setData(newData);
                                                            }}
                                                            className="text-[9px] text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
                                                        >
                                                            <X size={10} />
                                                            Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Developed By</label>
                                            <input
                                                type="text"
                                                value={project.developedBy || ""}
                                                onChange={(e) => {
                                                    const newData = { ...data };
                                                    const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                    target[i].developedBy = e.target.value;
                                                    setData(newData);
                                                }}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs"
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Project Title</label>
                                            <input
                                                type="text"
                                                value={project.title}
                                                onChange={(e) => {
                                                    const newData = { ...data };
                                                    const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                    target[i].title = e.target.value;
                                                    setData(newData);
                                                }}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-lg font-bold"
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subtitle / Header Text</label>
                                            <input
                                                type="text"
                                                value={project.sub || ""}
                                                onChange={(e) => {
                                                    const newData = { ...data };
                                                    const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                    target[i].sub = e.target.value;
                                                    setData(newData);
                                                }}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-lg font-bold"
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description / Synopsis</label>
                                        <textarea
                                            value={project.description}
                                            onChange={(e) => {
                                                const newData = { ...data };
                                                const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                target[i].description = e.target.value;
                                                setData(newData);
                                            }}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm min-h-[100px] leading-relaxed"
                                            onKeyDown={(e) => e.stopPropagation()}
                                        />
                                    </div>

                                    <div className="pt-8 border-t border-gray-100">
                                        <h4 className="text-[10px] font-black text-[#1A2E35] uppercase tracking-widest mb-6 font-sans">Gallery / Screenshots</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            {[0, 1, 2, 3].map((sIndex) => (
                                                <div key={sIndex} className="space-y-3">
                                                    <div
                                                        className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl overflow-hidden relative group cursor-pointer hover:border-[#1A2E35]/30 transition-all flex items-center justify-center"
                                                        onClick={() => document.getElementById(`${projectPath}-screenshot-input-${i}-${sIndex}`)?.click()}
                                                    >
                                                        {project.screenshots?.[sIndex] ? (
                                                            <>
                                                                <img
                                                                    src={project.screenshots[sIndex]}
                                                                    className="w-full h-full object-cover"
                                                                    alt={`Screenshot ${sIndex + 1}`}
                                                                />
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-3">
                                                                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
                                                                        <Upload size={14} className="text-white" />
                                                                    </div>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            const newData = { ...data };
                                                                            const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                                            target[i].screenshots[sIndex] = "";
                                                                            setData(newData);
                                                                        }}
                                                                        className="bg-red-500/20 backdrop-blur-md p-2 rounded-full border border-red-500/30 hover:bg-red-500/40 transition-colors"
                                                                    >
                                                                        <X size={14} className="text-white" />
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                                                                    <Plus size={16} />
                                                                </div>
                                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Add Image</span>
                                                            </div>
                                                        )}
                                                        <input
                                                            id={`${projectPath}-screenshot-input-${i}-${sIndex}`}
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleProjectScreenshotUpload(e, i, sIndex, projectPath)}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={project.screenshots?.[sIndex] || ""}
                                                        onChange={(e) => {
                                                            const newData = { ...data };
                                                            const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                            if (!target[i].screenshots) target[i].screenshots = [];
                                                            target[i].screenshots[sIndex] = e.target.value;
                                                            setData(newData);
                                                        }}
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 text-[9px] font-mono"
                                                        placeholder="URL..."
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
                                        <div>
                                            <h4 className="text-[10px] font-black text-[#1A2E35] uppercase tracking-widest mb-4 font-sans">{projectPath === "projects" ? "Wishlist Links" : "Store Links"}</h4>
                                            <div className="space-y-3">
                                                {["Steam", "Epic", "PlayStation"].map((label) => (
                                                    <div key={label}>
                                                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">{label}</label>
                                                        <input
                                                            type="text"
                                                            value={project.wishlistOn?.find((l: any) => l.label === label)?.url || ""}
                                                            onChange={(e) => {
                                                                const newData = { ...data };
                                                                const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                                if (!target[i].wishlistOn) target[i].wishlistOn = [];
                                                                const idx = target[i].wishlistOn.findIndex((l: any) => l.label === label);
                                                                if (idx >= 0) target[i].wishlistOn[idx].url = e.target.value;
                                                                else target[i].wishlistOn.push({ label, url: e.target.value });
                                                                setData(newData);
                                                            }}
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-[10px]"
                                                            placeholder="URL..."
                                                            onKeyDown={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-[#1A2E35] uppercase tracking-widest mb-4 font-sans">Social Links</h4>
                                            <div className="space-y-3">
                                                {["Twitter", "Discord", "YouTube"].map((label) => (
                                                    <div key={label}>
                                                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">{label}</label>
                                                        <input
                                                            type="text"
                                                            value={project.followOn?.find((l: any) => l.label === label)?.url || ""}
                                                            onChange={(e) => {
                                                                const newData = { ...data };
                                                                const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                                if (!target[i].followOn) target[i].followOn = [];
                                                                const idx = target[i].followOn.findIndex((l: any) => l.label === label);
                                                                if (idx >= 0) target[i].followOn[idx].url = e.target.value;
                                                                else target[i].followOn.push({ label, url: e.target.value });
                                                                setData(newData);
                                                            }}
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-[10px]"
                                                            placeholder="URL..."
                                                            onKeyDown={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-[#1A2E35] uppercase tracking-widest mb-4 font-sans">Availability</h4>
                                            <div className="space-y-3">
                                                {["PC", "Console", "Mobile"].map((label) => (
                                                    <div key={label}>
                                                        <label className="text-[9px] font-bold text-gray-400 uppercase block mb-1">{label}</label>
                                                        <input
                                                            type="text"
                                                            value={project.availableOn?.find((l: any) => l.label === label)?.url || ""}
                                                            onChange={(e) => {
                                                                const newData = { ...data };
                                                                const target = projectPath === "projects" ? newData.projects : newData.ggProductions.projects;
                                                                if (!target[i].availableOn) target[i].availableOn = [];
                                                                const idx = target[i].availableOn.findIndex((l: any) => l.label === label);
                                                                if (idx >= 0) target[i].availableOn[idx].url = e.target.value;
                                                                else target[i].availableOn.push({ label, url: e.target.value });
                                                                setData(newData);
                                                            }}
                                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-[10px]"
                                                            placeholder="Status / Link..."
                                                            onKeyDown={(e) => e.stopPropagation()}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-20 admin-portal">
            {/* Top Bar */}
            <header className="bg-white border-b border-gray-200 px-[6vw] md:px-[12vw] py-4 sticky top-0 z-50 shadow-sm">
                <div className="w-full flex justify-between items-center">
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

            <main className="w-full mt-8 px-[6vw] md:px-[12vw]">
                {/* Tabs - Centered */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center shadow-sm overflow-x-auto">
                        <div className="flex gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
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
                        {activeTab === "inquiries" && renderInquirySection("General Contact Inquiries", inquiries.filter(iq => !iq.data?.fullData))}
                        {activeTab === "applications" && renderInquirySection("Studio Application Submissions", inquiries.filter(iq => iq.data?.fullData))}

                        {activeTab === "home" && (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 w-full relative">
                                <button
                                    onClick={() => handleReset("home")}
                                    className="absolute top-10 right-10 flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"
                                >
                                    <RotateCcw size={14} /> Reset Section
                                </button>
                                <h3 className="text-xl font-bold mb-8">Hero Section Text</h3>
                                {renderInput("Particle Text", data.home.particleText, ["home", "particleText"])}

                                <h3 className="text-xl font-bold mt-12 mb-8 border-t border-gray-100 pt-12">Hero Video & Socials</h3>
                                {renderVideoUpload("Play Reel Video", data.home.playReelVideo, ["home", "playReelVideo"])}
                                <div className="grid grid-cols-2 gap-6">
                                    {renderInput("Instagram Link", data.home.socials.instagram, ["home", "socials", "instagram"])}
                                    {renderInput("X / Twitter Link", data.home.socials.twitter, ["home", "socials", "twitter"])}
                                    {renderInput("LinkedIn Link", data.home.socials.linkedin, ["home", "socials", "linkedin"])}
                                    {renderInput("Email Contact", data.home.socials.email, ["home", "socials", "email"])}
                                </div>

                                <h3 className="text-xl font-bold mt-12 mb-8 border-t border-gray-100 pt-12">Home Description & CTA</h3>
                                {renderInput("Description Text", data.home.description, ["home", "description"], true)}
                                {renderInput("CTA Button Text", data.home.ctaText, ["home", "ctaText"])}

                                <h3 className="text-xl font-bold mt-12 mb-8 border-t border-gray-100 pt-12">Cookie Consent Banner</h3>
                                {renderInput("Cookie Banner Text", data.home.cookieText, ["home", "cookieText"], true)}
                                {renderInput("Cookie Button Label", data.home.cookieButton, ["home", "cookieButton"])}
                            </div>
                        )}

                        {activeTab === "about" && (
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 w-full relative">
                                <button
                                    onClick={() => handleReset("about")}
                                    className="absolute top-10 right-10 flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"
                                >
                                    <RotateCcw size={14} /> Reset Section
                                </button>
                                <h3 className="text-xl font-bold mb-8">Manifesto Quote</h3>
                                {renderInput("Quote Text", data.about.quote, ["about", "quote"], true)}
                                {renderInput("Signature", data.about.signature, ["about", "signature"])}
                            </div>
                        )}

                        {activeTab === "ggProductions" && (
                            <div className="space-y-8 w-full relative">
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 relative">
                                    <button
                                        onClick={() => handleReset("ggProductions")}
                                        className="absolute top-10 right-10 flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"
                                    >
                                        <RotateCcw size={14} /> Reset Section
                                    </button>
                                    <h3 className="text-xl font-bold mb-8">Intro & Brief</h3>
                                    {renderInput("Header Particle Text", data.ggProductions.particleText, ["ggProductions", "particleText"])}
                                    {renderArrayInput("Brief Paragraphs", data.ggProductions.brief, ["ggProductions", "brief"])}
                                </div>

                                {renderProjectManagement("Manage Collaborations / Client Projects", data.ggProductions.projects || [], "ggProductions")}

                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
                                    <h3 className="text-xl font-bold mb-8">Services</h3>
                                    {renderInput("Section Title", data.ggProductions.servicesTitle, ["ggProductions", "servicesTitle"])}
                                    <div className="space-y-10">
                                        {data.ggProductions.services.map((service: any, i: number) => (
                                            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-6">
                                                <div className="mb-4">
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Service {i + 1} Title</label>
                                                    <input
                                                        type="text"
                                                        value={service.title}
                                                        onChange={(e) => {
                                                            const newData = { ...data };
                                                            newData.ggProductions.services[i].title = e.target.value;
                                                            setData(newData);
                                                        }}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Service {i + 1} Description</label>
                                                    <textarea
                                                        value={service.description}
                                                        onChange={(e) => {
                                                            const newData = { ...data };
                                                            newData.ggProductions.services[i].description = e.target.value;
                                                            setData(newData);
                                                        }}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm min-h-[100px]"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10">
                                    <h3 className="text-xl font-bold mb-8">Clients & Footer</h3>
                                    {renderInput("Clients Title", data.ggProductions.clientsTitle, ["ggProductions", "clientsTitle"])}
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Client List</h4>
                                        <button
                                            onClick={() => {
                                                const newData = { ...data };
                                                newData.ggProductions.clients.push("");
                                                setData(newData);
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A2E35] text-white rounded-lg font-bold text-[10px] hover:bg-opacity-90 transition-all uppercase tracking-wider"
                                        >
                                            <Plus size={12} /> Add Client
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        {data.ggProductions.clients.map((v: string, i: number) => (
                                            <div key={i} className="relative group">
                                                <input
                                                    type="text"
                                                    value={v}
                                                    onChange={(e) => {
                                                        const newData = { ...data };
                                                        newData.ggProductions.clients[i] = e.target.value;
                                                        setData(newData);
                                                    }}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 text-sm select-text cursor-text focus:outline-none focus:ring-1 focus:ring-[#1A2E35] pr-10"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newData = { ...data };
                                                        newData.ggProductions.clients.splice(i, 1);
                                                        setData(newData);
                                                    }}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                                    title="Remove Client"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
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
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 w-full relative">
                                <button
                                    onClick={() => handleReset("pitch")}
                                    className="absolute top-10 right-10 flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"
                                >
                                    <RotateCcw size={14} /> Reset Section
                                </button>
                                <h3 className="text-xl font-bold mb-8">Pitch Information</h3>
                                {renderInput("Page Title", data.pitch.title, ["pitch", "title"])}
                                {renderArrayInput("Instruction Paragraphs", data.pitch.paragraphs, ["pitch", "paragraphs"])}
                                {renderInput("Button Label", data.pitch.buttonText, ["pitch", "buttonText"])}
                            </div>
                        )}

                        {activeTab === "contact" && (
                            <div className="space-y-8 w-full relative">
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 relative">
                                    <button
                                        onClick={() => handleReset("contact")}
                                        className="absolute top-10 right-10 flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"
                                    >
                                        <RotateCcw size={14} /> Reset Section
                                    </button>
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
                            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 w-full relative">
                                <button
                                    onClick={() => handleReset("form")}
                                    className="absolute top-10 right-10 flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"
                                >
                                    <RotateCcw size={14} /> Reset Section
                                </button>
                                <h3 className="text-xl font-bold mb-8">Application Form Content</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Main Header</h4>
                                        {renderInput("Page Title", data.form.title, ["form", "title"])}
                                        {renderInput("Intro Text", data.form.intro, ["form", "intro"], true)}

                                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-12">Studio & Contact</h4>
                                        {renderInput("Studio Name Label", data.form.labels?.studioName, ["form", "labels", "studioName"])}
                                        {renderInput("Studio Website Label", data.form.labels?.studioWebsite, ["form", "labels", "studioWebsite"])}
                                        {renderInput("Website Hint", data.form.labels?.studioWebsiteHint, ["form", "labels", "studioWebsiteHint"])}
                                        {renderInput("Your Name Label", data.form.labels?.yourName, ["form", "labels", "yourName"])}
                                        {renderInput("Email Label", data.form.labels?.email, ["form", "labels", "email"])}
                                        {renderInput("Country Label", data.form.labels?.country, ["form", "labels", "country"])}

                                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-12">Collaboration Section</h4>
                                        {renderInput("Collaboration Label", data.form.labels?.collaboration, ["form", "labels", "collaboration"])}
                                        {renderInput("Collaboration Hint", data.form.labels?.collaborationHint, ["form", "labels", "collaborationHint"])}
                                        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                            {renderInput("Co-Dev Title", data.form.labels?.collabCoDev, ["form", "labels", "collabCoDev"])}
                                            {renderInput("Co-Dev Description", data.form.labels?.collabCoDevDesc, ["form", "labels", "collabCoDevDesc"], true)}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                            {renderInput("Co-Funding Title", data.form.labels?.collabCoFunding, ["form", "labels", "collabCoFunding"])}
                                            {renderInput("Co-Funding Description", data.form.labels?.collabCoFundingDesc, ["form", "labels", "collabCoFundingDesc"], true)}
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                                            {renderInput("Publishing Title", data.form.labels?.collabPublishing, ["form", "labels", "collabPublishing"])}
                                            {renderInput("Publishing Description", data.form.labels?.collabPublishingDesc, ["form", "labels", "collabPublishingDesc"], true)}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Project Details</h4>
                                        {renderInput("Project Title Label", data.form.labels?.gameTitle, ["form", "labels", "gameTitle"])}
                                        {renderInput("Project Title Hint", data.form.labels?.gameTitleHint, ["form", "labels", "gameTitleHint"])}
                                        {renderInput("Description Label", data.form.labels?.description, ["form", "labels", "description"])}
                                        {renderInput("Description Hint", data.form.labels?.descriptionHint, ["form", "labels", "descriptionHint"])}
                                        {renderInput("Genre Label", data.form.labels?.genre, ["form", "labels", "genre"])}
                                        {renderInput("Comp Title Label", data.form.labels?.compTitle, ["form", "labels", "compTitle"])}
                                        {renderInput("Comp Title Hint", data.form.labels?.compTitleHint, ["form", "labels", "compTitleHint"])}

                                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-12">Budget & Platforms</h4>
                                        {renderInput("Total Budget Label", data.form.labels?.totalBudget, ["form", "labels", "totalBudget"])}
                                        {renderInput("Total Budget Hint", data.form.labels?.totalBudgetHint, ["form", "labels", "totalBudgetHint"])}
                                        {renderInput("Budget Ask Label", data.form.labels?.budgetAsk, ["form", "labels", "budgetAsk"])}
                                        {renderInput("Budget Ask Hint", data.form.labels?.budgetAskHint, ["form", "labels", "budgetAskHint"])}
                                        {renderInput("Platforms Label", data.form.labels?.platforms, ["form", "labels", "platforms"])}
                                        {renderInput("Platforms Hint", data.form.labels?.platformsHint, ["form", "labels", "platformsHint"])}
                                        {renderInput("Choose File Text", data.form.labels?.chooseFile, ["form", "labels", "chooseFile"])}
                                        {renderInput("Drag & Drop Text", data.form.labels?.dragDrop, ["form", "labels", "dragDrop"])}
                                        {renderInput("Captcha Text", data.form.labels?.notRobot, ["form", "labels", "notRobot"])}

                                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-12">Submission Feedback</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {renderInput("Submit Button", data.form.labels?.submit, ["form", "labels", "submit"])}
                                            {renderInput("Submitting State", data.form.labels?.submitting, ["form", "labels", "submitting"])}
                                            {renderInput("Success State", data.form.labels?.submitted, ["form", "labels", "submitted"])}
                                            {renderInput("Error State", data.form.labels?.tryAgain, ["form", "labels", "tryAgain"])}
                                        </div>
                                        {renderInput("Success Screen Title", data.form.labels?.successTitle, ["form", "labels", "successTitle"])}
                                        {renderInput("Success Screen Message", data.form.labels?.successMessage, ["form", "labels", "successMessage"], true)}
                                        {renderInput("Success Screen Button", data.form.labels?.successButton, ["form", "labels", "successButton"])}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "projects" && renderProjectManagement("Manage Games / IP Projects", data.projects, "projects")}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
