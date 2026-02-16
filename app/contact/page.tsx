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
    formLine1Start: "Hi! My name is",
    namePlaceholder: "your name",
    formLine1End: ",",
    formLine2Start: "and I can be reached at",
    emailPlaceholder: "your email",
    formLine2End: ".",
    consentText: "I agree to the privacy policy and terms of service.",
    buttonText: "Send Message",
    companyName: "Gattabara Games",
    email: "contact@gattabaragames.com",
    phone: "",
    address1: "Bengaluru,",
    address2: "India",
    address3: ""
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
        <div className="h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-20">
            <main className="w-full max-w-5xl flex flex-col justify-center items-center">

                {/* Contact Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    className="w-full"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.01, duration: 0.5 }}
                >
                    {/* Headline / Input Group 1 */}
                    <div className="mt-6 mb-6 leading-relaxed text-white font-sans font-normal" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.5rem)' }}>
                        <span>{content.formLine1Start} </span>
                        <input
                            type="text"
                            placeholder={content.namePlaceholder}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-white/10 border-0 outline-none px-2 md:px-4 py-1 mx-2 rounded text-white placeholder-white/30 inline-block align-baseline w-[clamp(120px,15vw,200px)] h-[clamp(1.5rem,3vw,3rem)] text-center font-sans font-normal transition-all focus:bg-white/20"
                            disabled={status === 'loading' || status === 'success'}
                        />
                        <span> {content.formLine1End}</span>
                    </div>

                    {/* Headline / Input Group 2 */}
                    <div className="mb-12 leading-relaxed text-white font-sans font-light" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.5rem)' }}>
                        <span className="font-normal">{content.formLine2Start} </span>
                        <input
                            type="email"
                            placeholder={content.emailPlaceholder}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-white/10 border-0 outline-none px-2 md:px-4 py-1 mx-2 rounded text-white placeholder-white/30 inline-block align-baseline w-[clamp(150px,20vw,300px)] h-[clamp(1.5rem,3vw,3rem)] text-center font-sans font-light transition-all focus:bg-white/20"
                            disabled={status === 'loading' || status === 'success'}
                        />
                        <span>{content.formLine2End}</span>
                    </div>

                    {/* Consent Checkbox */}
                    <div className="mb-10 max-w-3xl">
                        <label className={`flex items-start gap-4 cursor-pointer group ${status === 'success' ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div className="relative mt-1">
                                <input
                                    type="checkbox"
                                    checked={formData.consent}
                                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                    className="peer appearance-none w-6 h-6 border-2 border-white/30 rounded cursor-pointer transition-colors checked:bg-white checked:border-white"
                                    disabled={status === 'loading' || status === 'success'}
                                />
                                <Check size={16} className="absolute top-1 left-1 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
                            </div>
                            <span className="text-[10px] md:text-xs text-white/50 font-sans font-light leading-relaxed pt-0.5 group-hover:text-white transition-colors">
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
                    <div className="min-h-[60px]">
                        <AnimatePresence mode="wait">
                            {status === 'success' ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-3 text-white bg-white/10 px-6 py-4 rounded-lg inline-flex"
                                >
                                    <div className="bg-white rounded-full p-1 shadow-sm">
                                        <Check size={20} className="text-black" strokeWidth={3} />
                                    </div>
                                    <span className="font-bold text-lg font-sans">Message Sent Successfully!</span>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="submit-btn"
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="bg-white text-black pl-8 pr-6 py-4 rounded font-sans font-bold text-lg flex items-center gap-4 group hover:bg-white/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
                                            <motion.svg
                                                width="36"
                                                height="12"
                                                viewBox="0 0 36 12"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M30 1L35 6L30 11" />
                                                <motion.path
                                                    d="M0 6H35"
                                                    variants={{
                                                        initial: { scaleX: 1, originX: 1 },
                                                        hover: { scaleX: 0.5, originX: 1 }
                                                    }}
                                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                />
                                            </motion.svg>
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Info Grid - Moved inside form, closer to button */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-white/50 text-sm leading-relaxed text-left mt-8 font-sans font-light">
                        {/* Column 1: Company & Contact */}
                        <div className="flex flex-col">
                            <p className="font-bold mb-1 font-sans text-white">{content.companyName}</p>
                            <p>{content.email}</p>
                            <p>{content.phone}</p>
                        </div>

                        {/* Column 2: Address Combined */}
                        <div className="flex flex-col">
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
