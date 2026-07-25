import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollExpandMediaProps {
  mediaType?: "image" | "video";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: boolean;
  textBlend?: boolean;
  children?: React.ReactNode;
}

export function ScrollExpandMedia({
  mediaType = "image",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand = true,
  textBlend = false,
  children,
}: ScrollExpandMediaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Intercept wheel/touch to drive internal scroll progress
  useEffect(() => {
    if (!scrollToExpand) return;

    let progress = 0;
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      if (isExpanded) return;
      e.preventDefault();
      progress = Math.min(1, Math.max(0, progress + e.deltaY / 800));
      setScrollProgress(progress);
      if (progress >= 1) {
        setIsExpanded(true);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isExpanded) return;
      e.preventDefault();
      const delta = touchStartY - e.touches[0].clientY;
      progress = Math.min(1, Math.max(0, progress + delta / 400));
      touchStartY = e.touches[0].clientY;
      setScrollProgress(progress);
      if (progress >= 1) {
        setIsExpanded(true);
      }
    };

    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
    };
  }, [scrollToExpand, isExpanded]);

  const mediaWidth = scrollToExpand
    ? `${20 + scrollProgress * 80}%`
    : "100%";
  const mediaHeight = scrollToExpand
    ? `${30 + scrollProgress * 70}vh`
    : "100vh";
  const mediaBorderRadius = scrollToExpand
    ? `${24 - scrollProgress * 24}px`
    : "0px";

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden",
        scrollToExpand && !isExpanded ? "h-screen" : "min-h-screen"
      )}
      style={{
        backgroundImage: bgImageSrc ? `url(${bgImageSrc})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Text overlay above media */}
      {(title || date) && (
        <div
          className={cn(
            "relative z-10 flex flex-col items-center gap-2 pb-6 text-center",
            textBlend ? "mix-blend-difference" : ""
          )}
        >
          {date && (
            <p className="text-sm font-medium uppercase tracking-widest text-white/70">
              {date}
            </p>
          )}
          {title && (
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              {title}
            </h1>
          )}
        </div>
      )}

      {/* Expanding media */}
      <motion.div
        className="relative z-10 overflow-hidden"
        style={{
          width: mediaWidth,
          height: mediaHeight,
          borderRadius: mediaBorderRadius,
          transition: "width 0.05s ease-out, height 0.05s ease-out, border-radius 0.05s ease-out",
        }}
      >
        {mediaType === "video" ? (
          <video
            src={mediaSrc}
            poster={posterSrc}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={mediaSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        )}

        {/* Children fade in when expanded */}
        <AnimatePresence>
          {(isExpanded || !scrollToExpand) && children && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute inset-0 flex items-end p-8"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll hint */}
      {scrollToExpand && !isExpanded && scrollProgress < 0.05 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest uppercase"
        >
          Scroll to expand
        </motion.div>
      )}
    </div>
  );
}
