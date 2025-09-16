import React from "react";
import { AlignRight } from "lucide-react";


export const TopNav: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
    return (
        <>
            <div className="fixed top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-40">
                <button
                    onClick={onOpen}
                    className="inline-flex items-center justify-center rounded-xl bg-white scale-125 sm:scale-140 md:scale-150 text-black shadow-lg cursor-pointer h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
                    aria-label="Open menu"
                >
                    <AlignRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </button>
            </div>
        </>
    );
};