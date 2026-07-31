"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CenterProfile() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return (
    <div className="relative w-[130px] h-[130px] md:w-[220px] md:h-[220px] flex items-center justify-center select-none z-10">

      {/* Ring 1: Outermost glowing ring (124% size, slowly rotating clockwise) */}
      <div className="absolute w-[124%] h-[124%] rounded-full border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)] animate-spin-slow pointer-events-none" />

      {/* Ring 2: Middle dashed ring (114% size, counter-clockwise) */}
      <div 
        className="absolute w-[114%] h-[114%] rounded-full border-2 border-dashed border-rose-500/30 pointer-events-none"
        style={{ animation: "spin-reverse 20s linear infinite" }}
      />

      {/* Ring 3: Innermost glowing accent ring (106% size, rotating clockwise) */}
      <div 
        className="absolute w-[106%] h-[106%] rounded-full border border-white/10 border-t-rose-500/60 border-b-rose-500/60 pointer-events-none"
        style={{ animation: "spin 15s linear infinite" }}
      />

      {/* 4. Glass Ring (Neumorphic edge) */}
      <div className="absolute w-[98%] h-[98%] rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-[3px] shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] pointer-events-none" />

      {/* 5. Center Floating Profile Wrapper */}
      <motion.div
        className="relative z-10 w-[96%] h-[96%] rounded-full overflow-hidden border border-rose-500/35 shadow-[0_0_24px_rgba(244,63,94,0.28)] glass-sweep magnetic"
        animate={prefersReducedMotion ? {} : {
          y: [0, -2.5, 0],
        }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        data-cursor-label="SHARP"
      >
        {/* Profile Image */}
        <div className="relative w-full h-full bg-slate-900">
          <img
            src="/profile.jpg?v=1"
            alt="Mohamed Elhagan CEO"
            className="w-full h-full object-cover object-center scale-[1.22] transition-transform duration-700 hover:scale-[1.32] pointer-events-none select-none"
          />
          {/* Subtle vignette/gradient overlay inside image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          
          {/* Holographic light reflect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-rose-500/10 pointer-events-none" />
        </div>
      </motion.div>

      {/* 6. Mini orbit particle dot revolving on the outer ring */}
      <motion.div 
        className="absolute w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_#f43f5e] pointer-events-none"
        style={{
          transformOrigin: "center center",
          width: "100%",
          height: "100%",
          animation: "spin 8s linear infinite"
        }}
      >
        <div className="absolute top-[-4px] left-[50%] -translate-x-1/2 w-2 h-2 bg-rose-500 rounded-full" />
      </motion.div>
    </div>
  );
}
