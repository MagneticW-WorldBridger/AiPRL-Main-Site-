import React from "react";
import AiprlAssist from '../../assets/Logo.svg'
// import { SquareGanttChart } from "lucide-react";


export const BrandLogo: React.FC<{ className?: string }> = ({ className }) => (
    <>
        <div
            className={
                "inline-flex items-center mx-4 sm:mx-6 md:mx-8 lg:mx-12 justify-center h-12 w-40 sm:h-14 sm:w-44 md:h-16 md:w-48 lg:h-16 lg:w-56 rounded-lg" +
                (className ?? "")
            }
        >
            <img src={AiprlAssist} alt="AiprlAssist" className="h-20 w-40 sm:h-22 sm:w-44 md:h-24 md:w-48 lg:h-32 lg:w-56" />
        </div>
    </>
);