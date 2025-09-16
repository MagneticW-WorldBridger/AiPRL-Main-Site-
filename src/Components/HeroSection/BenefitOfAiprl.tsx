"use client";
import { StickyScroll } from "../ui/sticky-scroll-reveal";

const content = [
    {
        title: "Capture Actionable Insights",
        description:
            "AiPRL qualifies leads, responds instantly, and even books appointments. No more missed DMs or lost sales.",
        content: (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] text-white rounded-xl">
                <div className="text-center p-4 sm:p-6 md:p-8">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">📊</div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Lead Qualification</h3>
                    <p className="text-xs sm:text-sm opacity-90">Instant response & booking system</p>
                </div>
            </div>
        ),
    },
    {
        title: "Drive Repeat Business",
        description:
            "Offer real-time support that builds loyalty. AiPRL remembers your customers, knows their history with your company, and never drops the ball.",
        content: (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white rounded-xl">
                <div className="text-center p-4 sm:p-6 md:p-8">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">🔄</div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Customer Retention</h3>
                    <p className="text-xs sm:text-sm opacity-90">Personalized support with memory</p>
                </div>
            </div>
        ),
    },
    {
        title: "Improve Customer Experience",
        description:
            "AiPRL is your 24/7 virtual retail liaison—engineered to boost sales, elevate every customer touchpoint, and dramatically increase NPS.",
        content: (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--purple-500),var(--pink-500))] text-white rounded-xl">
                <div className="text-center p-4 sm:p-6 md:p-8">
                    <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">⭐</div>
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">24/7 Excellence</h3>
                    <p className="text-xs sm:text-sm opacity-90">Boost NPS & sales performance</p>
                </div>
            </div>
        ),
    },
];

export function StickyScrollRevealDemo() {
    return (
        <div className="w-full">
            <StickyScroll content={content} />
        </div>
    );
}