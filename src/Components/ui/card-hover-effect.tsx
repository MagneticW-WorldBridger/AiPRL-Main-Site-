import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";

import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    image: {
      src: string;
      alt: string;
    };
    // link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 py-6 sm:py-8 md:py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-[#0d61fd] dark:bg-slate-800/[0.8] block py-12 sm:py-16 md:py-20 px-2 sm:px-4 rounded-2xl sm:rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="bg-gray-900/40 h-full shadow-2xl shadow-gray-900/90">
            <div className="flex justify-center mb-3 sm:mb-4">
              <img src={item.image.src} alt={item.image.alt} className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain" />
            </div>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl sm:rounded-2xl px-4 sm:px-6 overflow-hidden bg-gray-900/40 border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20 dark:bg-gray-900/40 py-4 sm:py-6",
        className
      )}
    >
      <div className="relative z-10">
        <div className="p-2 sm:p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-gray-600 font-bold tracking-wide mt-3 sm:mt-4 text-sm sm:text-base", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 sm:mt-6 md:mt-8 text-gray-600 tracking-wide leading-relaxed text-xs sm:text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
