"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { getCMSData } from "../actions/cmsActions";
// import { submitContactForm } from "../actions/contact";
import { Loader2, Check, AlertCircle } from "lucide-react";

// Mock actions since they are missing in the project
const submitContactForm = async (data: any) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1500);
    });
};

const defaultContent = {
    formLine1Start: "Hi, my name is",
    namePlaceholder: "your name",
    formLine1End: "and I'm exploring a potential partnership or opportunity with Gattabara Games.",
    formLine2Start: "Get in touch with me at",
    emailPlaceholder: "your e-mail",
    formLine2End: ".",
    consentText: "Hereby I authorise Gattabara Games, to process the given personal information in connection with my the inquiry. I am aware that submitting personal data is voluntary and that I have a right to view, edit and delete all the data concerning myself.",
    buttonText: "Send",
    companyName: "Gattabara Games",
    email: "info@gattabaragames.com",
    phone: "+91 9900114038",
    address1: "No. 55, 1st Floor, 10th Cross, 2nd Stage, Mahalakshmipuram,",
    address2: "WOC Road, Bengaluru, Karnataka,",
    address3: "India - 560086"
};

export default function ContactPage({ initialContent }: { initialContent?: any }) {
    const [content, setContent] = useState<any>(initialContent || defaultContent);
    const [formData, setFormData] = useState({
        name: "",
        project: "",
        email: "",
        consent: false,
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            setStatus('error');
            setErrorMessage("Please fill in all required fields.");
            return;
        }
        if (!formData.consent) {
            setStatus('error');
            setErrorMessage("Please accept the terms to proceed.");
            return;
        }

        setStatus('loading');
        setErrorMessage("");

        try {
            const result = await submitContactForm({
                name: formData.name,
                email: formData.email,
                message: `Project: ${formData.project}`, // Map project input to message for now
            });

            if (result.success) {
                setStatus('success');
                // Reset form after a delay to allow re-submission
                setTimeout(() => {
                    setFormData({ ...formData, name: "", project: "", email: "", consent: false });
                    setStatus('idle');
                }, 3000);
            } else {
                setStatus('error');
                setErrorMessage(result.error || "Something went wrong.");
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage("An unexpected error occurred.");
        }
    };

    if (!content) {
        return (
            <div className="min-h-screen"></div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start md:justify-center pt-[13vh] md:pt-0 px-[6vw] md:px-[12vw]">
            <main className="w-full flex flex-col items-start text-left font-sans">

                {/* Contact Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="w-full"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.01, duration: 0.5 }}
                >
                    {/* Sentence Layout */}
                    <div className="mb-6 leading-[1.8] text-white font-normal text-[0.92rem] md:text-[clamp(0.8rem,1.6vw,1.44rem)]">
                        <span>{content.formLine1Start} </span>
                        <input
                            type="text"
                            placeholder={content.namePlaceholder}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-white/10 border-0 outline-none px-4 mx-1 rounded text-white placeholder-white/30 inline-block align-middle w-[clamp(150px,20vw,300px)] h-[1.32rem] md:h-[clamp(1.1rem,2.2vw,2.25rem)] text-left font-sans transition-all focus:bg-white/20"
                            disabled={status === 'loading' || status === 'success'}
                        />
                        <span> {content.formLine1End}</span>
                        <br className="hidden md:block" />
                        <span className="md:mt-4 inline-block">{content.formLine2Start} </span>
                        <input
                            type="email"
                            placeholder={content.emailPlaceholder}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-white/10 border-0 outline-none px-4 mx-1 rounded text-white placeholder-white/30 inline-block align-middle w-[clamp(200px,25vw,400px)] h-[1.32rem] md:h-[clamp(1.1rem,2.2vw,2.25rem)] text-left font-sans transition-all focus:bg-white/20"
                            disabled={status === 'loading' || status === 'success'}
                        />
                        <span>{content.formLine2End}</span>
                    </div>

                    {/* Consent Checkbox */}
                    <div className="mb-8 w-full max-w-4xl">
                        <label className={`flex items-start gap-4 cursor-pointer group ${status === 'success' ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="relative mt-1 shrink-0">
                                <input
                                    type="checkbox"
                                    checked={formData.consent}
                                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                    className="peer appearance-none w-5 h-5 border-[1.5px] border-white/50 rounded-sm cursor-pointer transition-colors checked:bg-white checked:border-white"
                                    disabled={status === 'loading' || status === 'success'}
                                />
                                <Check size={14} className="absolute top-0.5 left-0.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                            </div>
                            <span className="text-[11px] md:text-sm text-white/60 font-sans font-normal leading-relaxed group-hover:text-white transition-colors">
                                {content.consentText}
                            </span>
                        </label>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {status === 'error' && errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 text-red-400 mb-6 font-medium text-sm font-sans"
                            >
                                <AlertCircle size={16} />
                                {errorMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Area */}
                    <div className="mb-6">
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 text-black bg-white px-6 py-4 rounded-lg inline-flex"
                                >
                                    <div className="bg-black rounded-full p-1 shadow-sm">
                                        <Check size={20} className="text-white" strokeWidth={3} />
                                    </div>
                                    <span className="font-bold text-lg font-sans">Sent!</span>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="submit-btn"
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="bg-white text-black px-7 py-3 rounded-sm font-sans font-bold text-lg flex items-center justify-center gap-4 group hover:bg-white/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    initial="initial"
                                    whileHover={status === 'loading' ? {} : "hover"}
                                    whileTap={status === 'loading' ? {} : "tap"}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    variants={{
                                        initial: { scale: 1 },
                                        hover: { scale: 1.02 },
                                        tap: { scale: 0.98 }
                                    }}
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            {content.buttonText}
                                            <svg
                                                width="32"
                                                height="10"
                                                viewBox="0 0 32 10"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="ml-2"
                                            >
                                                <path d="M0 5H30" stroke="black" strokeWidth="2" />
                                                <path d="M24 1L30 5L24 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Info Grid - Aligned to edges of 12vw container */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 font-sans">
                        {/* Column 1: Company & Contact */}
                        <div className="flex flex-col text-left">
                            <p className="font-bold mb-2 text-white text-sm md:text-base">{content.companyName}</p>
                            <p className="text-white/60 text-xs md:text-sm">{content.email}</p>
                            <p className="text-white/60 text-xs md:text-sm">{content.phone}</p>
                        </div>

                        {/* Column 2: Address combined */}
                        <div className="flex flex-col text-left md:text-right text-white/60 text-xs md:text-sm">
                            <p>{content.address1}</p>
                            <p>{content.address2}</p>
                            <p>{content.address3}</p>
                        </div>
                    </div>
                </motion.form>
            </main>
        </div>
    );
}
