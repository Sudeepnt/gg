"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "gg5656") {
            // In a real app, we'd use a secure cookie or session
            localStorage.setItem("admin_auth", "true");
            router.push("/admingg/dashboard");
        } else {
            setError("Incorrect password");
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-black border border-white/10 rounded-xl shadow-2xl p-8"
            >
                <h1 className="text-[24px] font-bold text-white mb-2 font-serif">Admin Portal</h1>
                <p className="text-gray-400 mb-8 text-sm">Enter password to access CMS</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">
                            Admin Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
                            placeholder="Enter password"
                        />
                        {error && <p className="text-red-500 text-xs mt-2 px-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all shadow-sm"
                    >
                        Login
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
