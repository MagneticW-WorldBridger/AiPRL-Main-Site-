import React from "react";


export const SocialIcon: React.FC<{ label: string; href: string; children: React.ReactNode }> = ({ label, href, children }) => (
    <>
        <a
            aria-label={label}
            href={href}
            className="group inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-125 transform origin-center"
        >
            <span className="sr-only">{label}</span>
            <div className="text-black/90 group-hover:text-black">{children}</div>
        </a>
    </>
);