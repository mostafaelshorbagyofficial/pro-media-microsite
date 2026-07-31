"use client";

import { motion } from "framer-motion";
import { socialLinks } from "../config/links";
import AnimatedBackground from "../components/AnimatedBackground";
import LogoHeader from "../components/LogoHeader";
import OrbitSystem from "../components/OrbitSystem";

export default function Home() {
  // Opening sequence durations total ~ 2s
  // 1. Background fades in (base animation)
  // 2. Logo appears (LogoHeader delay 0.3s)
  // 3. Lighting activates (AmbientBackground fade)
  // 4. Photo scales into view (OrbitSystem / CenterProfile)
  // 5. Rings appear & pulse
  // 6. Social icons fly into orbit

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.5, // delay content to let background start
        staggerChildren: 0.3,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 15,
      },
    },
  };

  const footerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 1.6,
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden pt-[calc(1.5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))] pl-[calc(1.5rem+env(safe-area-inset-left))] pr-[calc(1.5rem+env(safe-area-inset-right))] md:p-8">
      {/* 1. Cinematic Background Layer */}
      <AnimatedBackground />

      {/* 2. Main Content Container */}
      <motion.main
        className="relative z-10 flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 py-8 md:py-12"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Block */}
        <motion.div variants={sectionVariants} className="w-full">
          <LogoHeader />
        </motion.div>

        {/* Orbit Interactive Block */}
        <motion.div 
          variants={sectionVariants} 
          className="w-full flex justify-center items-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <OrbitSystem />
        </motion.div>

        {/* Call To Action & Branding Footer */}
        <motion.div
          variants={footerVariants}
          className="w-full flex flex-col items-center mt-2"
        >
          {/* Footer Branding details */}
          <div className="flex flex-col items-center gap-1 select-none">
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-medium">POWERED BY</span>
              <span className="text-[9px] text-rose-500 font-extrabold tracking-widest font-outfit text-glow-primary">PRO MEDIA</span>
            </div>
            <span className="text-[7px] text-slate-600 tracking-[0.25em] uppercase font-mono">
              CREATING STORIES THAT MATTER
            </span>
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
}
