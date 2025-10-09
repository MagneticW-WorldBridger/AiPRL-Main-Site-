"use client";
import { useEffect, useRef, useState } from "react";
import { MotionValue, motion, useScroll, useTransform } from "motion/react";
import { cn } from "../../lib/utils";
import AiprlLogo from '../../assets/AiprlLogo.svg'
import {
  IconCaretRightFilled,
  IconCaretUpFilled,
} from "@tabler/icons-react";
import { IconCaretLeftFilled } from "@tabler/icons-react";
import { IconCaretDownFilled } from "@tabler/icons-react";
import Aiprl from '../../assets/Imagecontent.png'

export const MacbookScroll = ({
  showGradient,
  badge,
}: {
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

  // Better scroll transforms for smoother animation
  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.6],
    [1, isMobile ? 1.8 : isTablet ? 2.0 : 2.2],
    { clamp: false }
  );
  
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.6],
    [1, isMobile ? 1.8 : isTablet ? 2.0 : 2.2],
    { clamp: false }
  );
  
  const translateY = useTransform(
    scrollYProgress, 
    [0, 1], 
    [0, isMobile ? 600 : isTablet ? 800 : 1000]
  );
  
  const rotate = useTransform(
    scrollYProgress, 
    [0.1, 0.25, 0.6], 
    [-28, -28, 0]
  );
  
  const textOpacity = useTransform(
    scrollYProgress, 
    [0, 0.3], 
    [1, 0]
  );

  return (
    <div
      ref={ref}
        className="relative flex min-h-[100vh] w-full shrink-0 flex-col items-center justify-start py-4 [perspective:1000px] sm:min-h-[120vh] sm:py-8 md:min-h-[130vh] md:py-10 lg:min-h-[160vh] lg:py-16"
    >
      <motion.h2
        style={{
          opacity: textOpacity,
        }}
        className="mb-4 text-center text-lg font-bold text-neutral-800 dark:text-white sm:mb-8 sm:text-2xl md:mb-10 md:text-3xl lg:mb-16 lg:text-4xl"
      >
        {/* Your heading content here */}
      </motion.h2>
      
      {/* Lid */}
      <Lid
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translateY}
      />
      
      {/* Base area - Responsive proportions */}
      <div className="relative -z-10 mx-auto h-[12rem] w-[20rem] overflow-hidden rounded-xl bg-gray-200 dark:bg-[#272729] sm:h-[16rem] sm:w-[28rem] md:h-[20rem] md:w-[32rem] lg:h-[28rem] lg:w-[48rem] xl:h-[32rem] xl:w-[56rem]">
        {/* Above keyboard bar */}
        <div className="relative mb-1 h-6 w-full sm:mb-2 sm:h-8 md:mb-2 md:h-9 lg:mb-4 lg:h-12">
          <div className="absolute inset-x-0 mx-auto h-1 w-[80%] bg-[#050505] sm:h-2 md:h-2.5 lg:h-4" />
        </div>
        
        <div className="relative flex h-[60%]">
          <div className="mx-auto h-full w-[15%] overflow-hidden">
            <SpeakerGrid isMobile={isMobile} />
          </div>
          <div className="mx-auto h-full w-[70%]">
            <Keypad isMobile={isMobile} />
          </div>
          <div className="mx-auto h-full w-[15%] overflow-hidden">
            <SpeakerGrid isMobile={isMobile} />
          </div>
        </div>
        
        <Trackpad />
        
        <div className="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-8 rounded-tl-2xl rounded-tr-2xl bg-gradient-to-t from-[#272729] to-[#050505] sm:h-1 sm:w-12 md:h-1.5 md:w-14 lg:w-20" />
        
        {showGradient && (
          <div className="absolute inset-x-0 bottom-0 z-50 h-24 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black sm:h-32 md:h-40"></div>
        )}
        
        {badge && (
          <div className="absolute bottom-0.5 left-0.5 sm:bottom-1 sm:left-1 md:bottom-1.5 md:left-1.5 lg:bottom-4 lg:left-4">
            {badge}
          </div>
        )}
      </div>
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
}) => {
  return (
    <div className="relative [perspective:1200px]">
      {/* Static lid back */}
      <div
        style={{
          transform: "perspective(1200px) rotateX(-22deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="relative mx-auto mt-2 h-[8rem] w-[14rem] rounded-xl bg-[#010101] p-1 sm:mt-4 sm:h-[11rem] sm:w-[18rem] sm:p-2 md:mt-5 md:h-[12rem] md:w-[20rem] md:p-2 lg:mt-8 lg:h-[18rem] lg:w-[32rem] lg:p-3 xl:h-[25rem] xl:w-[56rem]" 
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #171717 inset",
          }}
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-[#010101]"
        >
          <span className="text-white">
            <AceternityLogo />
          </span>
        </div>
      </div>
      
      {/* Animated screen */}
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="absolute inset-0 mx-auto mt-2 h-[8rem] w-[14rem] rounded-xl bg-[#010101] p-1 sm:mt-4 sm:h-[11rem] sm:w-[18rem] sm:p-2 md:mt-5 md:h-[12rem] md:w-[20rem] md:p-2 lg:-mt-16 lg:h-[18rem] lg:w-[32rem] lg:p-1 xl:h-[22rem] xl:w-[45rem]"
      >
        <div className="absolute inset-0 rounded-lg bg-[#272729] overflow-hidden">
          {/* Content Container - Properly centered */}
          <div className="relative h-full w-full flex items-center justify-center p-1 sm:p-2 md:p-2.5 lg:p-4">
            <img
              src={Aiprl}
              alt="Aiprl Assist"
              className="h-full w-full rounded-md object-contain"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div
      className="mx-auto my-0.5 h-12 w-[40%] rounded-lg sm:my-1 sm:h-16 md:my-1.5 md:h-18 lg:my-3 lg:h-24 lg:w-[45%]"
      style={{
        boxShadow: "0px 0px 1px 1px #00000020 inset",
      }}
    />
  );
};

export const Keypad = ({ isMobile }: { isMobile: boolean }) => {
  const keySize = isMobile ? "h-3 w-3" : "h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6";
  const fontSize = isMobile ? "text-[3px]" : "text-[4px] sm:text-[5px] md:text-[6px]";
  const gap = isMobile ? "gap-[0.5px]" : "gap-[1px] sm:gap-[1.5px] md:gap-[2px]";
  const marginBottom = isMobile ? "mb-[0.5px]" : "mb-[1px] sm:mb-[1.5px] md:mb-[2px]";
  
  return (
    <div className="mx-1 h-full rounded-md bg-[#050505] p-1 [transform:translateZ(0)] [will-change:transform]">
      {/* Function Row */}
      <div className={cn("flex w-full shrink-0", gap, marginBottom)}>
        <KBtn
          className={cn("w-4 items-end justify-start pb-[1px] pl-[1px] sm:w-6 sm:pb-[2px] sm:pl-[2px] md:w-8 md:pl-[4px]", keySize)}
          childrenClassName="items-start"
          fontSize={fontSize}
        >
          esc
        </KBtn>
        {[...Array(12)].map((_, i) => (
          <KBtn key={i} className={keySize} fontSize={fontSize}>
            <span className="mt-0.5 inline-block">F{i + 1}</span>
          </KBtn>
        ))}
        <KBtn className={keySize} fontSize={fontSize}>
          <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-neutral-900 from-20% via-black via-50% to-neutral-900 to-95% p-px sm:h-2 sm:w-2 md:h-3 md:w-3">
            <div className="h-full w-full rounded-full bg-black" />
          </div>
        </KBtn>
      </div>

      {/* Number Row */}
      <div className={cn("flex w-full shrink-0", gap, marginBottom)}>
        {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='].map((key, i) => (
          <KBtn key={i} className={keySize} fontSize={fontSize}>
            <span className="block">{key}</span>
          </KBtn>
        ))}
        <KBtn
          className={cn("w-6 items-end justify-end pr-[1px] pb-[1px] sm:w-8 sm:pr-[2px] sm:pb-[2px] md:w-10 md:pr-[4px]", keySize)}
          childrenClassName="items-end"
          fontSize={fontSize}
        >
          del
        </KBtn>
      </div>

      {/* QWERTY Row */}
      <div className={cn("flex w-full shrink-0", gap, marginBottom)}>
        <KBtn
          className={cn("w-6 items-end justify-start pb-[1px] pl-[1px] sm:w-8 sm:pb-[2px] sm:pl-[2px] md:w-10 md:pl-[4px]", keySize)}
          childrenClassName="items-start"
          fontSize={fontSize}
        >
          tab
        </KBtn>
        {'QWERTYUIOP[]\\'.split('').map((key, i) => (
          <KBtn key={i} className={keySize} fontSize={fontSize}>
            <span className="block">{key}</span>
          </KBtn>
        ))}
      </div>

      {/* ASDF Row */}
      <div className={cn("flex w-full shrink-0", gap, marginBottom)}>
        <KBtn
          className={cn("w-7 items-end justify-start pb-[1px] pl-[1px] sm:w-10 sm:pb-[2px] sm:pl-[2px] md:w-12 md:pl-[4px]", keySize)}
          childrenClassName="items-start"
          fontSize={fontSize}
        >
          caps
        </KBtn>
        {"ASDFGHJKL;'".split('').map((key, i) => (
          <KBtn key={i} className={keySize} fontSize={fontSize}>
            <span className="block">{key}</span>
          </KBtn>
        ))}
        <KBtn
          className={cn("w-7 items-end justify-end pr-[1px] pb-[1px] sm:w-10 sm:pr-[2px] sm:pb-[2px] md:w-12 md:pr-[4px]", keySize)}
          childrenClassName="items-end"
          fontSize={fontSize}
        >
          ⏎
        </KBtn>
      </div>

      {/* ZXCV Row */}
      <div className={cn("flex w-full shrink-0", gap, marginBottom)}>
        <KBtn
          className={cn("w-8 items-end justify-start pb-[1px] pl-[1px] sm:w-12 sm:pb-[2px] sm:pl-[2px] md:w-16 md:pl-[4px]", keySize)}
          childrenClassName="items-start"
          fontSize={fontSize}
        >
          shift
        </KBtn>
        {'ZXCVBNM,./'.split('').map((key, i) => (
          <KBtn key={i} className={keySize} fontSize={fontSize}>
            <span className="block">{key}</span>
          </KBtn>
        ))}
        <KBtn
          className={cn("w-8 items-end justify-end pr-[1px] pb-[1px] sm:w-12 sm:pr-[2px] sm:pb-[2px] md:w-16 md:pr-[4px]", keySize)}
          childrenClassName="items-end"
          fontSize={fontSize}
        >
          shift
        </KBtn>
      </div>

      {/* Bottom Row */}
      <div className={cn("flex w-full shrink-0 items-center", gap)}>
        <KBtn className={cn("w-3 sm:w-4 md:w-6", keySize)} fontSize={fontSize}>fn</KBtn>
        <KBtn className={cn("w-3 sm:w-4 md:w-6", keySize)} fontSize={fontSize}>^</KBtn>
        <KBtn className={cn("w-3 sm:w-4 md:w-6", keySize)} fontSize={fontSize}>⌥</KBtn>
        <KBtn className={cn("w-4 sm:w-6 md:w-8", keySize)} fontSize={fontSize}>⌘</KBtn>
        <KBtn className={cn("w-12 sm:w-20 md:w-32", keySize)} fontSize={fontSize}></KBtn>
        <KBtn className={cn("w-4 sm:w-6 md:w-8", keySize)} fontSize={fontSize}>⌘</KBtn>
        <KBtn className={cn("w-3 sm:w-4 md:w-6", keySize)} fontSize={fontSize}>⌥</KBtn>
        
        {/* Arrow keys */}
        <div className="flex flex-col items-center justify-center">
          <KBtn className={cn("h-2 w-3 sm:h-3 sm:w-4 md:h-3 md:w-5", fontSize)} fontSize={fontSize}>
            <IconCaretUpFilled className="h-[3px] w-[3px] sm:h-[4px] sm:w-[4px] md:h-[5px] md:w-[5px]" />
          </KBtn>
          <div className="flex">
            <KBtn className={cn("h-2 w-3 sm:h-3 sm:w-4 md:h-3 md:w-5", fontSize)} fontSize={fontSize}>
              <IconCaretLeftFilled className="h-[3px] w-[3px] sm:h-[4px] sm:w-[4px] md:h-[5px] md:w-[5px]" />
            </KBtn>
            <KBtn className={cn("h-2 w-3 sm:h-3 sm:w-4 md:h-3 md:w-5", fontSize)} fontSize={fontSize}>
              <IconCaretDownFilled className="h-[3px] w-[3px] sm:h-[4px] sm:w-[4px] md:h-[5px] md:w-[5px]" />
            </KBtn>
            <KBtn className={cn("h-2 w-3 sm:h-3 sm:w-4 md:h-3 md:w-5", fontSize)} fontSize={fontSize}>
              <IconCaretRightFilled className="h-[3px] w-[3px] sm:h-[4px] sm:w-[4px] md:h-[5px] md:w-[5px]" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true,
  fontSize = "text-[6px]",
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
  fontSize?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-[2px] p-[0.5px] [transform:translateZ(0)] [will-change:transform] sm:rounded-[3px] sm:p-[0.5px] md:rounded-[4px] md:p-[1px]",
        backlit && "bg-white/[0.2] shadow-lg shadow-white/20",
      )}
    >
      <div
        className={cn(
          "flex h-3 w-3 items-center justify-center rounded-[1px] bg-[#0A090D] sm:h-4 sm:w-4 sm:rounded-[2px] md:h-6 md:w-6 md:rounded-[3px]",
          className,
        )}
        style={{
          boxShadow:
            "0px -0.5px 1px 0 #0D0D0F inset, -0.5px 0px 1px 0 #0D0D0F inset",
        }}
      >
        <div
          className={cn(
            "flex w-full flex-col items-center justify-center text-neutral-200",
            fontSize,
            childrenClassName,
            backlit && "text-white",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export const SpeakerGrid = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <div
      className={cn(
        "mt-1 flex gap-[1px] px-[1px] sm:mt-2 sm:gap-[2px] md:mt-3 md:gap-[3px]",
        isMobile ? "h-16" : "h-20 sm:h-28 md:h-36"
      )}
      style={{
        backgroundImage:
          "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
        backgroundSize: isMobile ? "2px 2px" : "3px 3px sm:4px 4px",
      }}
    />
  );
};

export const OptionKey = ({ className }: { className: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect
        id="_Transparent_Rectangle_"
        className="st0"
        width="32"
        height="32"
        stroke="none"
      />
    </svg>
  );
};

const AceternityLogo = () => {
  return (
    <img src={AiprlLogo} alt="Aiprllogo" className="h-1.5 w-1.5 text-black sm:h-2 sm:w-2 md:h-3 md:w-3" />
  );
};