"use client";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { MotionValue, motion, useScroll, useTransform } from "motion/react";
import { cn } from "../../lib/utils";
import Aiprl from '../../assets/Curious-Customer.png';

// Debounce utility for resize optimization
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Optimized Video Player Component with lazy loading
export const VideoPlayer = memo(({
  isVisible,
  className = "h-full w-full"
}: {
  isVisible: boolean;
  className?: string;
}) => {
  const youtubeVideoId = "hLHGCZD8ruk";

  return (
    <div className={`relative ${className}`} style={{ contain: 'layout style paint' }}>
      <iframe
        className="h-[100%] w-[100%]"
        src={`https://www.youtube.com/embed/${youtubeVideoId}?${isVisible ? 'autoplay=1&' : ''}loop=1&rel=0&modestbranding=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        style={{
          objectPosition: 'center',
          minHeight: '10%',
          minWidth: '10%',
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export const MacbookScroll = memo(({
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

  // Debounced resize handler for performance
  const debouncedResize = useCallback(
    debounce(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 150),
    []
  );

  useEffect(() => {
    // Initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    window.addEventListener("resize", debouncedResize, { passive: true });
    return () => window.removeEventListener("resize", debouncedResize);
  }, [debouncedResize]);

  // Optimized scroll listener with requestAnimationFrame
  useEffect(() => {
    let rafId: number;
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setShowVideo(latest > 0.3);
      });
    });
    return () => {
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrollYProgress]);

  const isMobile = dimensions.width < 768;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;

  // Optimized scroll transforms with smooth easing
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
      style={{
        contain: 'layout style paint',
        contentVisibility: 'auto',
        willChange: 'scroll-position'
      }}
    >
      <motion.h2
        style={{
          opacity: textOpacity,
          willChange: 'opacity',
          transform: 'translateZ(0)',
        }}
        className="mb-4 text-center text-lg font-bold text-neutral-800 dark:text-white sm:mb-6 sm:text-2xl md:mb-8 md:text-3xl lg:mb-10 lg:text-4xl"
      >
        {/* Your heading content here */}
      </motion.h2>

      {/* Video Screen - Optimized */}
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
        <div
          className="absolute inset-x-0 bottom-0 z-10 h-24 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black sm:h-32 md:h-40"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {badge && (
        <div className="absolute bottom-0.5 left-0.5 sm:bottom-1 sm:left-1 md:bottom-1.5 md:left-1.5 lg:bottom-4 lg:left-4 z-30">
          {badge}
        </div>
      )}
    </div>
  );
});

MacbookScroll.displayName = 'MacbookScroll';

export const Lid = memo(({
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
    <div className="relative [perspective:1200px]" style={{ contain: 'layout style' }}>
      {/* Animated screen - GPU accelerated */}
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
        className="mx-auto mt-2 h-[10rem] w-[17rem] rounded-xl overflow-hidden sm:mt-4 sm:h-[14rem] sm:w-[24rem] md:mt-5 md:h-[16rem] md:w-[28rem] lg:mt-8 lg:h-[20rem] lg:w-[36rem] xl:h-[24rem] xl:w-[42rem]"
      >
        {/* Content Container with hardware acceleration */}
        <div className="relative h-full w-full" style={{ contain: 'layout style paint' }}>
          {/* Image - shown by default with lazy loading */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: showVideo ? 0 : 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
          >
            <img
              src={Aiprl}
              alt="Aiprl Assist"
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
              style={{
                willChange: 'opacity',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
              }}
            />
          </motion.div>

          {/* Video - shown when scrolled with smooth transition */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: showVideo ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
          >
            <VideoPlayer isVisible={showVideo} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
});

Lid.displayName = 'Lid';

// Responsive Video Scroll Component - Optimized
export const ResponsiveVideoScroll = memo(({
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

  // Debounced resize handler
  const debouncedResize = useCallback(
    debounce(() => {
      const width = window.innerWidth;
      setDimensions({ width, height: window.innerHeight });
      setIsDesktop(width >= 1024);
    }, 150),
    []
  );

  useEffect(() => {
    // Initial dimensions
    const width = window.innerWidth;
    setDimensions({ width, height: window.innerHeight });
    setIsDesktop(width >= 1024);

    window.addEventListener("resize", debouncedResize, { passive: true });
    return () => window.removeEventListener("resize", debouncedResize);
  }, [debouncedResize]);

  // Loading state with smooth transition
  if (dimensions.width === 0) {
    return <div className="h-screen w-full" style={{ contain: 'layout' }} />;
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

  // Mobile & Tablet: Can be extended with ContainerScroll if needed
  return (
    <MacbookScroll
      showGradient={showGradient}
      badge={badge}
    />
  );
});

ResponsiveVideoScroll.displayName = 'ResponsiveVideoScroll';

// Optimized Video Container
const VideoContainer = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [showVideo, setShowVideo] = useState(false);

  // Optimized scroll listener with RAF
  useEffect(() => {
    let rafId: number;
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setShowVideo(latest > 0.3);
      });
    });
    return () => {
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      style={{ contain: 'layout style paint' }}
    >
      {/* Image - shown by default */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 1 }}
        animate={{ opacity: showVideo ? 0 : 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
      >
        <img
          src={Aiprl}
          alt="Aiprl Assist"
          className="h-full w-full object-cover rounded-lg"
          loading="lazy"
          decoding="async"
          style={{
            willChange: 'opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        />
      </motion.div>

      {/* Video - shown when scrolled */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: showVideo ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
      >
        <VideoPlayer
          isVisible={showVideo}
          className="h-full w-full rounded-lg"
        />
      </motion.div>
    </div>
  );
});

VideoContainer.displayName = 'VideoContainer';
