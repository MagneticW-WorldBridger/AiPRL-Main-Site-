import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Twitter, Instagram, Linkedin, Youtube, ArrowRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { SocialIcon } from "./SocialIcon";


export const OverlayMenu: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ y: 24, scale: 0.98, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 24, scale: 0.98, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-4 rounded-2xl p-6 md:p-8 bg-gradient-to-br bg-white/80 shadow-2xl"
                    >
                        <div className="absolute left-6 top-6">
                            <BrandLogo />
                        </div>


                        <button
                            onClick={onClose}
                            className="absolute right-0 cursor-pointer top-0 inline-flex h-16 w-16 items-center justify-center rounded-full p-2 bg-white/10 hover:bg-white/20 transition"
                            aria-label="Close menu"
                        >
                            <X onClick={onClose} className="h-16 w-16 text-black rounded-full" />
                        </button>


                        <div className="flex h-full w-full">
                            <div className="hidden sm:flex w-14 shrink-0 flex-col items-center justify-end gap-3 pb-4">
                                <SocialIcon label="Twitter" href="#">
                                    <Twitter className="h-4 w-4" />
                                </SocialIcon>
                                <SocialIcon label="Instagram" href="#">
                                    <Instagram className="h-4 w-4" />
                                </SocialIcon>
                                <SocialIcon label="LinkedIn" href="#">
                                    <Linkedin className="h-4 w-4" />
                                </SocialIcon>
                                <SocialIcon label="YouTube" href="#">
                                    <Youtube className="h-4 w-4" />
                                </SocialIcon>
                            </div>


                            <nav className="relative flex-1 grid content-center pl-2">
                                <ul className="space-y-3 md:space-y-4">
                                    {[
                                        { label: "Products.", href: "#products" },
                                        { label: "Solution.", href: "#solution" },
                                        { label: "Pricing.", href: "#pricing" },
                                        { label: "Customer.", href: "#customer" },
                                        { label: "Resources.", href: "#resources" },
                                        { label: "Company.", href: "#company" },
                                    ].map((item, i) => (
                                        <motion.li
                                            key={item.label}
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.06 * i }}
                                        >
                                            <a
                                                href={item.href}
                                                className="block text-5xl md:text-7xl font-extrabold tracking-tight text-black/80 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-125 transform origin-left"
                                            >
                                                {item.label}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>


                                <div className="absolute right-2 bottom-2">
                                    <a
                                        href="#contact"
                                        className="group inline-flex items-center gap-2 rounded-full bg-[#fd8a0d] px-6 py-3 text-black font-semibold backdrop-blur hover:bg-white/25 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 transform origin-center"
                                    >
                                        View Demo
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};