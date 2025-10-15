import { HoverEffect } from '../ui/card-hover-effect'
import AiprlLogo from '../../assets/AiprlLogo.svg'

export const Retails = () => {
    return (
        <>
            <div className='my-8 sm:my-12 md:my-16 lg:my-20 px-4 sm:px-6 lg:px-8'>
                <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-center text-[#fd8a0d] mb-2 sm:mb-3 lg:mb-4'>Trusted by THE LEADING retailers.</h1>
                <p className='text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-500 mb-2 sm:mb-3 lg:mb-4'>The AI Assistant Built for Real Business Impact</p>
                <p className='text-center text-xs sm:text-sm md:text-base lg:text-lg text-gray-500 mb-6 sm:mb-8 lg:mb-10 max-w-4xl mx-auto leading-relaxed'>AiPRL is the always-on retail AI Assistant that works smarter, sells more, and supports faster across every channel.</p>
                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 my-6 sm:my-8 md:my-10 lg:my-12">
                    <HoverEffect items={projects} />
                </div>
            </div>
        </>
    )
}

export const projects = [
    {
        title: "Multi-LLM Response Optimization",
        description:
            "AiPRL’s AI Assistant runs thousands of real-time outputs through multiple LLMs to generate accurate, brand-consistent responses. No scripts. No guesswork. Just intelligent support.",
        image: {
            src: AiprlLogo,
            alt: "Multi-LLM Response Optimization",
        },
        // link: "https://stripe.com",
    },
    {
        title: "Advanced Sentiment Analysis",
        description:
            "The AI Assistant detects emotion, urgency, and frustration in every interaction. It escalates high-priority issues to human agents with full context for faster resolution.",
        image: {
            src: AiprlLogo,
            alt: "Advanced Sentiment Analysis",
        },
        // link: "https://netflix.com",
    },
    {
        title: "Machine Learning Models",
        description:
            "AiPRL’s AI Assistant learns from your customers to personalize product recommendations, pricing, and promotions across voice, chat, SMS, and web.",
        image: {
            src: AiprlLogo,
            alt: "Machine Learning Models",
        },
        // link: "https://google.com",
    }
];