"use client";

import { InfiniteMovingCards } from "../ui/Testimony";

export function Testimony() {
    return (
        <>
            <section id="customers" className="my-20 bg-black scroll-mt-28">
                <h1 className="text-4xl text-white/80 font-bold text-center">Testimonials</h1>
                <p className="text-center text-gray-600">What our clients say about us</p>
                <div className="h-[20rem] rounded-md flex flex-col antialiased bg-black dark:bg-black dark:bg-grid-black/[0.05] items-center justify-center relative overflow-hidden">
                    <InfiniteMovingCards
                        items={testimonials}
                        direction="right"
                        speed="slow"
                    />
                </div>
            </section>
        </>
    );
}

const testimonials = [
    {
        quote:
            "Before AiPRL, we were juggling three tools just to keep up with customer messages. Now, everything’s routed and answered in one place, with way less manual effort.",
        name: "Melissa T",
        title: "Customer Experience Manager, Boutique Home Retailer",
    },
    {
        quote:
            "The AI Assistant didn’t just help us respond faster, it actually helped us recover abandoned carts through chat and SMS. That was a game changer.",
        name: "Jason K",
        title: "Ecommerce Lead, Mid-Market Apparel Brand",
    },
    {
        quote: "We didn’t have the budget for a full support team. AiPRL let us automate the basics and still sound human. Our customers love how responsive we’ve become.",
        name: "Aisha R",
        title: "Owner, Independent Beauty Store",
    },
    {
        quote:
            "The setup was faster than I expected. We were live in under 2 weeks, and it already feels like AiPRL is part of the team.",
        name: "Carlos M",
        title: "Head of IT, Regional Electronics Chain",
    },
    {
        quote:
            "What stood out for us was the sentiment detection. It flags issues before they escalate, and that’s helped our team jump in before things spiral.",
        name: "Rachel B",
        title: "Digital Ops Manager, DTC Furniture Brand",
    },
    {
        quote:
            "We did the math, AiPRL is saving us close to $4,000 a month in support labor, and our CSAT scores are still climbing.",
        name: "Leo S",
        title: "COO, Sporting Goods Retailer",
    },
];