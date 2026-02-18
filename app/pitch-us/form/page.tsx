"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PitchForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        authorized: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.authorized) {
            alert("Please authorize the data processing to continue.");
            return;
        }
        alert(`Pitch submitted for ${formData.name}! (Demo)`);
    };

    return (
        <div className="relative w-full min-h-screen text-white overflow-hidden flex flex-col font-sans">
            <main className="flex-1 flex flex-col justify-center items-center px-4 pt-10 pb-20 md:py-32 w-full z-10">
                <div className="w-full max-w-4xl">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-12 text-xl md:text-3xl font-medium leading-relaxed">

                        <div className="flex flex-wrap items-baseline gap-4">
                            <span>Hi, my name is</span>
                            <input
                                type="text"
                                placeholder="your name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-white/10 px-6 py-2 rounded-lg min-w-[300px] outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30 text-white w-full md:w-auto border border-white/5 backdrop-blur-sm"
                                required
                            />
                            <span>and I'm exploring a potential partnership or opportunity with Gattabara Games.</span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-4">
                            <span>Get in touch with me at</span>
                            <input
                                type="email"
                                placeholder="your e-mail"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="bg-white/10 px-6 py-2 rounded-lg min-w-[300px] outline-none focus:ring-2 focus:ring-white/30 placeholder-white/30 text-white w-full md:w-auto border border-white/5 backdrop-blur-sm"
                                required
                            />
                            <span>.</span>
                        </div>

                        <div className="flex items-start gap-4 text-sm text-gray-400 font-normal max-w-2xl mt-8">
                            <div className="relative flex items-center shrink-0">
                                <input
                                    type="checkbox"
                                    id="auth"
                                    checked={formData.authorized}
                                    onChange={(e) => setFormData({ ...formData, authorized: e.target.checked })}
                                    className="peer h-16 w-16 cursor-pointer appearance-none rounded-lg border border-white/20 bg-white/5 transition-all checked:bg-[#CCFF00] checked:border-[#CCFF00] hover:border-white/40"
                                    style={{ borderRadius: '12px' }}
                                />
                                <span className="absolute text-black opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>
                            <label htmlFor="auth" className="cursor-pointer leading-tight hover:text-white transition-colors pt-4 select-none">
                                Hereby I authorise Gattabara Games, to process the given personal information in connection with my the inquiry. I am aware that submitting personal data is voluntary and that I have a right to view, edit and delete all the data concerning myself.
                            </label>
                        </div>

                        <div className="mt-8 flex justify-end w-full">
                            <button
                                type="submit"
                                className="bg-[#CCFF00] text-black px-8 py-3 rounded-lg flex items-center gap-4 text-base font-bold hover:bg-[#b8e600] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
                            >
                                Send
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-gray-500 font-medium z-10 pointer-events-none md:pointer-events-auto hidden md:flex">
                <div>
                    <p className="font-bold text-gray-400 mb-1">Gattabara Games LLP</p>
                    <p>contact@gattabaragames.com</p>
                    <p>+91 9900114038</p>
                </div>
                <div className="text-right">
                    <p>No. 55, 1st Floor, 10th Cross, 2nd Stage, Mahalakshmipuram,</p>
                    <p>WOC Road, Bengaluru, Karnataka,</p>
                    <p>India - 560086</p>
                </div>
            </div>
        </div>
    );
}
