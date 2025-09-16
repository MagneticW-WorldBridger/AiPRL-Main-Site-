import React from 'react'
import { HoverEffect } from '../ui/card-hover-effect'
import AiprlLogo from '../../assets/AiprlLogo.svg'

export const Retails = () => {
    return (
        <>
            <div className='my-8 sm:my-12 md:my-16 px-4 sm:px-6'>
                <h1 className='text-lg sm:text-xl md:text-2xl font-semibold text-center text-[#fd8a0d] mb-2 sm:mb-3'>Trusted by THE LEADING retailers.</h1>
                <p className='text-center text-lg sm:text-xl md:text-2xl font-semibold text-gray-500 mb-1 sm:mb-2'>Retail AI, Built for Real Business Impact</p>
                <p className='text-center text-sm sm:text-base md:text-lg text-gray-500 mb-6 sm:mb-8'>AiPRL works smarter, not harder, and sells more</p>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 my-6 sm:my-8 md:my-10">
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
            "AiPRL test thousand of AI output in real-time to deliver the most accurate, brand-consistent responses-no scripts, no guesswork.",
        image: {
            src: AiprlLogo,
            alt: "Multi-LLM Response Optimization",
        },
        // link: "https://stripe.com",
    },
    {
        title: "Advanced Sentiment Analysis",
        description:
            "Detects emotion, urgency, and frustration automatically, escalating sensitive issues to the right human agent with full context.",
        image: {
            src: AiprlLogo,
            alt: "Advanced Sentiment Analysis",
        },
        // link: "https://netflix.com",
    },
    {
        title: "Machine Learning Models",
        description:
            "Learns your products, pricing, promotions, and customer behavior to personaize every interaction across web, SMS, chat, and voice.",
        image: {
            src: AiprlLogo,
            alt: "Machine Learning Models",
        },
        // link: "https://google.com",
    }
];