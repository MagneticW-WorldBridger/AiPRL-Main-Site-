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
import Aiprl from '../../assets/Curious-Customer.png'

// Video Player Component - Simple YouTube Embed
export const VideoPlayer = ({
  isVisible,
  className = "h-full w-full"
}: {
  isVisible: boolean;
  className?: string;
}) => {
  const youtubeVideoId = "hLHGCZD8ruk";

  return (
    <div className={`relative ${className}`}>
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${youtubeVideoId}?${isVisible ? 'autoplay=1&' : ''}mute=1&loop=1&playlist=${youtubeVideoId}&rel=0&modestbranding=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          objectPosition: 'center center',
          minHeight: '100%',
          minWidth: '100%'
        }}
      />
    </div>
  );
};

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
  const [showVideo, setShowVideo] = useState(false);

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

  // Trigger video when scroll progress reaches 0.3
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setShowVideo(latest > 0.3);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

  // Scroll transforms for animation
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
      className="relative flex min-h-[120vh] w-full shrink-0 flex-col items-center justify-start pt-4 pb-16 [perspective:1000px] sm:min-h-[140vh] sm:pt-6 sm:pb-24 md:min-h-[150vh] md:pt-8 md:pb-32 lg:min-h-[180vh] lg:pt-12 lg:pb-40"
    >
      <motion.h2
        style={{
          opacity: textOpacity,
        }}
        className="mb-4 text-center text-lg font-bold text-neutral-800 dark:text-white sm:mb-6 sm:text-2xl md:mb-8 md:text-3xl lg:mb-10 lg:text-4xl"
      >
        {/* Your heading content here */}
      </motion.h2>

      {/* Video Screen - No keyboard base */}
      <div className="relative z-20 w-full flex items-start justify-center">
        <Lid
          scaleX={scaleX}
          scaleY={scaleY}
          rotate={rotate}
          translate={translateY}
          showVideo={showVideo}
        />
      </div>

      {showGradient && (
        <div className="absolute inset-x-0 bottom-0 z-10 h-24 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black sm:h-32 md:h-40"></div>
      )}

      {badge && (
        <div className="absolute bottom-0.5 left-0.5 sm:bottom-1 sm:left-1 md:bottom-1.5 md:left-1.5 lg:bottom-4 lg:left-4 z-30">
          {badge}
        </div>
      )}
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  showVideo,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  showVideo: boolean;
}) => {
  return (
    <div className="relative [perspective:1200px]">
      {/* Animated screen - No back lid */}
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="mx-auto mt-2 h-[10rem] w-[17rem] rounded-xl overflow-hidden sm:mt-4 sm:h-[14rem] sm:w-[24rem] md:mt-5 md:h-[16rem] md:w-[28rem] lg:mt-8 lg:h-[20rem] lg:w-[36rem] xl:h-[24rem] xl:w-[42rem]"
      >
        {/* Content Container */}
        <div className="relative h-full w-full">
          {/* Image - shown by default */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: showVideo ? 0 : 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <img
              src={Aiprl}
              alt="Aiprl Assist"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Video - shown when scrolled */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: showVideo ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <VideoPlayer
              isVisible={showVideo}
            />
          </motion.div>
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

// Responsive Video Scroll Component
// Usage: Replace MacbookScroll with ResponsiveVideoScroll in your components
// Desktop (≥1024px): Shows MacBook scroll effect
// Mobile & Tablet (<1024px): Shows Container scroll effect with 3D card
export const ResponsiveVideoScroll = ({
  showGradient,
  badge,
}: {
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
  titleComponent?: string | React.ReactNode;
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setDimensions({ width, height: window.innerHeight });
      setIsDesktop(width >= 1024); // Desktop breakpoint
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Show loading state while dimensions are being calculated
  if (dimensions.width === 0) {
    return <div className="h-screen w-full" />;
  }

  // Desktop: Use MacBook scroll
  if (isDesktop) {
    return (
      <MacbookScroll
        showGradient={showGradient}
        badge={badge}
      />
    );
  }

  // Mobile & Tablet: Use Container scroll
  // return (
  //   <ContainerScroll
  //     titleComponent={titleComponent || (
  //       <h2 className="text-2xl md:text-4xl font-bold text-neutral-800 dark:text-white">
  //         Experience AiprlAssist in Action
  //       </h2>
  //     )}
  //   >
  //     <VideoContainer />
  //   </ContainerScroll>
  // );
};

// Video Container for ContainerScroll
const VideoContainer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [showVideo, setShowVideo] = useState(false);

  // Trigger video when scroll progress reaches 0.3
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setShowVideo(latest > 0.3);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {/* Image - shown by default */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: showVideo ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <img
          src={Aiprl}
          alt="Aiprl Assist"
          className="h-full w-full object-cover rounded-lg"
        />
      </motion.div>
      
      {/* Video - shown when scrolled */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showVideo ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <VideoPlayer 
          isVisible={showVideo}
          className="h-full w-full rounded-lg"
        />
      </motion.div>
    </div>
  );
};