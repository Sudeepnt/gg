'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl"
            >
                <h1 className="text-white text-4xl md:text-5xl font-bold mb-8 text-center">
                    Contact us
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-white text-sm mb-2">
                            Your full name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-white/30 text-white px-0 py-3 focus:outline-none focus:border-white transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-white text-sm mb-2">
                            Your email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-white/30 text-white px-0 py-3 focus:outline-none focus:border-white transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-white text-sm mb-2">
                            Tell us more about your project, goals, or ideas.
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-transparent border-b border-white/30 text-white px-0 py-3 focus:outline-none focus:border-white transition-colors resize-none"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="relative overflow-hidden border border-white transition-[background-size,color] duration-300 bg-no-repeat bg-right hover:bg-left bg-white text-black hover:text-white bg-gradient-to-r from-black to-black bg-[length:0%_100%] hover:bg-[length:100%_100%] px-8 py-3 font-bold text-sm flex items-center gap-2 group"
                        >
                            <span className="relative z-10">Send Message</span>
                            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
