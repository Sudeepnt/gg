"use client";

import { motion } from "framer-motion";

export default function PrivacyStatement() {
    return (
        <div className="h-screen w-full overflow-y-auto bg-white flex flex-col">
            <main className="flex-1 flex flex-col items-center justify-start pt-30 px-4 md:px-32 w-full min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1.5 }}
                    className="w-full max-w-4xl"
                >
                    <h1 className="text-[#13343e] text-3xl md:text-4xl font-black mb-12 mt-4 text-center">
                        Privacy Statement
                    </h1>

                    <div className="space-y-8 text-black text-base leading-relaxed mb-32">
                        <p className="font-medium">
                            ATit Capital Management LLP ("ATit Capital", "we", "us", "our") respects your privacy and is committed to protecting your personal information.
                        </p>

                        <div>
                            <h2 className="text-[#13343e] text-lg font-bold mb-4">Information We Collect</h2>
                            <p className="mb-2">When you submit this form, we may collect:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Your name</li>
                                <li>Your email address</li>
                                <li>Any information you voluntarily provide in your inquiry</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-[#13343e] text-lg font-bold mb-4">Purpose of Collection</h2>
                            <p className="mb-2">We process this information solely to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Respond to your inquiry</li>
                                <li>Explore potential partnerships or opportunities</li>
                                <li>Communicate with you regarding your request</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-[#13343e] text-lg font-bold mb-4">Legal Basis</h2>
                            <p>
                                By submitting this form, you explicitly consent to the processing of your personal data for the purposes stated above. Providing personal data is voluntary.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-[#13343e] text-lg font-bold mb-4">Data Storage & Security</h2>
                            <p>
                                Your information is stored securely and accessed only by authorized personnel. We take reasonable technical and organizational measures to protect your data from unauthorized access, misuse, or disclosure.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-[#13343e] text-lg font-bold mb-4">Data Retention</h2>
                            <p>
                                We retain your personal data only for as long as necessary to address your inquiry or comply with legal obligations.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-[#13343e] text-lg font-bold mb-4">Your Rights</h2>
                            <p className="mb-2">You have the right to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Access the personal data we hold about you</li>
                                <li>Request correction or updates</li>
                                <li>Request deletion of your personal data</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                            <p className="mt-4">
                                Requests can be sent to <a href="mailto:info@ATitCapital.com" className="text-[#13343e] underline">info@ATitCapital.com</a>.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-[#13343e] text-lg font-bold mb-4">Contact Information</h2>
                            <div className="space-y-1">
                                <p className="font-bold">ATit Capital Management LLP</p>
                                <p>Email: <a href="mailto:info@ATitCapital.com" className="text-[#13343e] underline">info@ATitCapital.com</a></p>
                                <p>Phone: +91 9900114038</p>
                                <div className="mt-4">
                                    <p className="font-bold">Address:</p>
                                    <p>No. 55, 1st Floor, 10th Cross, 2nd Stage, Mahalakshmipuram,</p>
                                    <p>WOC Road, Bengaluru, Karnataka,</p>
                                    <p>India – 560086</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
