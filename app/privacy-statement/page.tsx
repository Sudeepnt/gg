"use client";

import { motion } from "framer-motion";
import Starfield from "../animations/Starfield";

export default function PrivacyStatement() {
    return (
        <div className="min-h-screen w-full bg-black text-white relative">
            <Starfield />
            <main className="relative z-10 flex flex-col items-center justify-start pt-32 pb-20 px-4 md:px-32 w-full max-w-[1920px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1.5 }}
                    className="w-full max-w-4xl"
                >
                    <h1 className="text-white text-3xl md:text-4xl font-black mb-12 mt-4 text-center">
                        Privacy Statement
                    </h1>

                    <div className="space-y-8 text-white/80 text-base leading-relaxed mb-32">
                        <p className="font-medium text-white">
                            Gattabara Games LLP ("Gattabara Games", "we", "us", "our") respects your privacy and is committed to protecting your personal information.
                        </p>

                        <div>
                            <h2 className="text-white text-lg font-bold mb-4">Information We Collect</h2>
                            <p className="mb-2">When you submit this form, we may collect:</p>
                            <ul className="list-disc pl-5 space-y-1 text-white/70">
                                <li>Your name</li>
                                <li>Your email address</li>
                                <li>Any information you voluntarily provide in your inquiry</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-white text-lg font-bold mb-4">Purpose of Collection</h2>
                            <p className="mb-2">We process this information solely to:</p>
                            <ul className="list-disc pl-5 space-y-1 text-white/70">
                                <li>Respond to your inquiry</li>
                                <li>Explore potential partnerships or opportunities</li>
                                <li>Communicate with you regarding your request</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-white text-lg font-bold mb-4">Legal Basis</h2>
                            <p>
                                By submitting this form, you explicitly consent to the processing of your personal data for the purposes stated above. Providing personal data is voluntary.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-white text-lg font-bold mb-4">Data Storage & Security</h2>
                            <p>
                                Your information is stored securely and accessed only by authorized personnel. We take reasonable technical and organizational measures to protect your data from unauthorized access, misuse, or disclosure.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-white text-lg font-bold mb-4">Data Retention</h2>
                            <p>
                                We retain your personal data only for as long as necessary to address your inquiry or comply with legal obligations.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-white text-lg font-bold mb-4">Your Rights</h2>
                            <p className="mb-2">You have the right to:</p>
                            <ul className="list-disc pl-5 space-y-1 text-white/70">
                                <li>Access the personal data we hold about you</li>
                                <li>Request correction or updates</li>
                                <li>Request deletion of your personal data</li>
                                <li>Withdraw consent at any time</li>
                            </ul>

                        </div>



                        <p className="mt-20 text-center text-white/50 text-xs leading-relaxed">
                            “Gattabara Games”, ”GG”, “GG Productions” and the Gattabara Games logo are all brands of Gattabara Games LLP. All rights reserved.
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
