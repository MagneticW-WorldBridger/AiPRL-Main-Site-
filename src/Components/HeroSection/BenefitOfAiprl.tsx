"use client";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import CaptureActionableInsights from '../../assets/GraphicContent/SplitImage.png';
import DriveRepeatBusiness from '../../assets/GraphicContent/User02.png';
import ImproveCustomerExperience from '../../assets/GraphicContent/User03.png';

const content = [
    {
        title: "Capture Actionable Insights",
        description:
            "With AiPRL as your AI assistant, lead qualification happens in seconds. It responds instantly, books appointments automatically, and ensures no opportunity slips away. No more missed DMs or lost sales, just sharper insights and smarter conversations that drive measurable revenue.",
        paragraphContent:
            "AiPRL is your 24/7 AI assistant, engineered to streamline every interaction, empower your team, and unlock smarter ways to grow.",
        content: (
            <div className="flex h-full w-full items-center justify-center ">
                <img src={CaptureActionableInsights} alt="Capture Actionable Insights" className="w-full h-full object-cover rounded-xl" />
            </div>
        ),
    },
    {
        title: "Drive Repeat Business with AiPRL’s AI Assistant",
        description:
            "Turning first-time buyers into lifelong customers takes consistency. AiPRL’s AI assistant delivers personalized, real-time support that remembers every detail, customer history, preferences, and past purchases, so every return visit feels like a continuation of the last. That’s how you build loyalty that lasts.",
            paragraphContent:
            "Trusted customers feel recognized and valued.",
        content: (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] text-white rounded-xl">
                <img src={DriveRepeatBusiness} alt="Drive Repeat Business" className="w-full h-full object-cover rounded-xl" />
            </div>
        ),
        // button: (
        //     <button 
        //         onClick={showDemoModal}
        //         className="w-full py-3 px-6 text-center"
        //     >
        //         Try a Demo
        //     </button>
        // ),
    },
    {
        title: "Improve Customer Experience with AiPRL’s AI Assistant",
        description:
            "Great service isn’t just about speed, it’s about making customers feel seen. AiPRL’s AI assistant adapts to each customer in real time, remembering preferences and tailoring every touchpoint. The result? Happier shoppers, stronger word of mouth, and higher NPS scores.",
        paragraphContent:
            "Delighted customers leave positive reviews and tell their friends.",
        content: (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(to_bottom_right,var(--purple-500),var(--pink-500))] text-white rounded-xl">
                <img src={ImproveCustomerExperience} alt="Improve Customer Experience" className="w-full h-full object-cover rounded-xl" />
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