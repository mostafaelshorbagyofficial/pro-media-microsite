"use client";

import { motion } from "framer-motion";

export default function LogoHeader() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const letterSpacingVariants = {
    hidden: { letterSpacing: "0.1em", opacity: 0 },
    visible: {
      letterSpacing: "0.25em",
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center text-center select-none z-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. Pro Media Logo SVG */}
      <motion.div 
        className="flex items-center gap-2.5 mb-5"
        variants={itemVariants}
      >
        <div className="relative w-11 h-11 flex items-center justify-center bg-slate-950/65 rounded-xl border border-white/15 shadow-[0_0_20px_rgba(244,63,94,0.25)] backdrop-blur-md">
          {/* Stylized camera aperture / play button logo */}
          <svg
            viewBox="0 0 100 100"
            className="w-6.5 h-6.5 text-rose-500 fill-current animate-pulse-glow"
          >
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" />
            <polygon points="40,32 75,50 40,68" />
            <circle cx="50" cy="50" r="10" className="text-white" />
          </svg>
        </div>
        <div className="flex flex-col items-start leading-none font-outfit">
          <span className="text-sm font-extrabold tracking-widest text-white">PRO</span>
          <span className="text-[10px] font-medium tracking-[0.2em] text-rose-500">MEDIA</span>
        </div>
      </motion.div>

      {/* 2. Large Mohamed Elhagan Name Title */}
      <div className="overflow-hidden mb-1.5">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.08em] text-white uppercase font-outfit text-glow-white text-center leading-tight"
          variants={itemVariants}
        >
          Mohamed Elhagan
        </motion.h1>
      </div>

      {/* 3. Title Badge (CEO in white, PRO MEDIA in brand red) */}
      <div className="overflow-hidden mb-3.5 flex flex-col items-center">
        <motion.div
          className="flex flex-col items-center leading-none"
          variants={itemVariants}
        >
          <span className="text-sm md:text-base font-bold tracking-[0.4em] text-white uppercase font-outfit text-glow-white mb-2">
            CEO
          </span>
          <span className="text-xs md:text-sm font-black tracking-[0.3em] text-rose-500 uppercase font-outfit text-glow-primary">
            PRO MEDIA
          </span>
        </motion.div>
      </div>

      {/* 4. Creative Bio (Influencer • Blogger • Director • CEO of Pro Media) */}
      <motion.div
        className="text-[9px] sm:text-[10px] md:text-[11px] text-slate-400 font-medium flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 tracking-[0.2em] uppercase max-w-lg text-center px-4 leading-normal mt-1"
        variants={letterSpacingVariants}
      >
        <span>Influencer</span>
        <span className="text-rose-500/80 font-bold">•</span>
        <span>Blogger</span>
        <span className="text-rose-500/80 font-bold">•</span>
        <span>Director</span>
        <span className="text-rose-500/80 font-bold">•</span>
        <span className="text-white/95">CEO of Pro Media</span>
      </motion.div>
    </motion.div>
  );
}
