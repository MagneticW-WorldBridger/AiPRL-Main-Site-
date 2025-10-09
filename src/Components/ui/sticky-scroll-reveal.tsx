"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "../../lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: { title: string; description: string; paragraphContent?: string; content?: React.ReactNode; button?: React.ReactNode }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Use container scroll with better offset configuration
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Create more responsive breakpoints that activate when each section enters the center
    const breakpoints = content.map((_, i) => {
      // Adjust these values to fine-tune when content switches
      const sectionStart = i / cardLength;
      const sectionEnd = (i + 1) / cardLength;
      // Content switches when we're 30% into each section
      return sectionStart + (sectionEnd - sectionStart) * 0.3;
    });

    // Find which section we're currently in
    let newActiveCard = 0;
    for (let i = 0; i < breakpoints.length; i++) {
      if (latest >= breakpoints[i]) {
        newActiveCard = i;
      }
    }

    // Ensure we don't exceed bounds
    newActiveCard = Math.min(newActiveCard, cardLength - 1);
    setActiveCard(newActiveCard);
  });

  const backgroundColors = ["#000000", "#000000", "#000000"];
  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #0f172a)",
    "linear-gradient(to bottom right, #0f172a, #6366f1)",
    "linear-gradient(to bottom right, #e5ffff, #ffe5e5)",
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(linearGradients[0]);

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.section
      ref={ref}
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative w-full py-8 sm:py-12 md:py-16 lg:py-24"
      style={{ minHeight: `${cardLength * 100}vh` }}
    >
      <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6">
        <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-4">More REVENUE. More PROFIT. Fewer FIREs.</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">What AiPRL can do for you</h1>
        <p className="text-white/80 w-full sm:w-4/5 md:w-2/4 mt-2 sm:mt-3 mx-auto text-sm sm:text-base md:text-xl">AiPRL is your 24/7 AI assistant, engineered to elevate every interaction, empower your team, and deliver seamless, high-impact customer experiences.</p>
      </div>

      <div className="mx-auto w-full max-w-[95%] sm:max-w-[90%] md:max-w-[80%] px-2 sm:px-4 md:px-6 lg:px-8">
        {/* Mobile & Tablet: Stacked layout with content below each text section */}
        <div className="block lg:hidden">
          {content.map((item, index) => (
            <div key={item.title + index} className="mb-6 sm:mb-20">
              {/* Text Section */}
              <div className="flex flex-col justify-center py-12 sm:py-16 px-2 sm:px-4">
                <motion.h2
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                    y: activeCard === index ? 0 : 20
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="text-xl sm:text-2xl font-bold text-white/80"
                >
                  {item.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                    y: activeCard === index ? 0 : 20
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                  className="mt-4 sm:mt-6 max-w-prose text-sm sm:text-base leading-6 sm:leading-7 text-white/80"
                >
                  {item.description}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                    y: activeCard === index ? 0 : 20
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                  className="mt-4 sm:mt-6 max-w-prose text-sm sm:text-base leading-6 sm:leading-7 text-white/80"
                >
                  {item.paragraphContent}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0.3,
                    y: activeCard === index ? 0 : 20
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                  className="bg-transparent w-full hover:bg-[#fd8a0d] cursor-pointer hover:text-black transition-all duration-300 text-lg sm:text-xl font-bold rounded-full dark:bg-slate-900 text-white/80 dark:text-white/80 border-neutral-200 dark:border-slate-800"
                >
                  {item.button}
                </motion.div>
              </div>
              
              {/* Content Preview - Directly below text with fade-up animation */}
              <motion.div
                style={{ background: linearGradients[index % linearGradients.length] }}
                className={cn(
                  "relative w-full h-[40vh] sm:h-[50vh] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden",
                  contentClassName,
                )}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  y: activeCard === index ? 0 : 30,
                  scale: activeCard === index ? 1 : 0.95
                }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeInOut",
                  delay: 0.2
                }}
              >
                {item.content ?? null}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Desktop: Original side-by-side layout */}
        <div className="hidden lg:grid grid-cols-[1.15fr_1fr] items-start gap-6 xl:gap-10">
        {/* Left column – scrolly text */}
        <div className="w-full max-w-xl">
          {content.map((item, index) => (
            <div
              key={item.title + index}
                className="flex flex-col justify-center py-32 xl:py-40 px-0"
              style={{ minHeight: '100vh' }}
            >
              <motion.h2
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  y: activeCard === index ? 0 : 20
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="text-3xl xl:text-5xl font-bold text-white/80"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  y: activeCard === index ? 0 : 20
                }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                  className="mt-6 max-w-prose text-lg xl:text-lg leading-7 xl:leading-8 text-white/80"
              >
                {item.description}
              </motion.p>
              <motion.p
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                  y: activeCard === index ? 0 : 20
                }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                  className="mt-6 max-w-prose text-lg xl:text-lg leading-7 xl:leading-8 text-white/80"
              >
                {item.paragraphContent}
              </motion.p>
             
            </div>
          ))}
        </div>

        {/* Right column – sticky preview */}
          <div className="sticky top-[20%] h-fit">
          <motion.div
            style={{ background: backgroundGradient }}
            className={cn(
                "relative w-[28rem] xl:w-[54rem] h-[60vh] xl:h-[70vh] rounded-2xl p-3 shadow-2xl overflow-hidden",
              contentClassName,
            )}
              key={activeCard}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {content[activeCard]?.content ?? null}
          </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};