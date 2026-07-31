"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { SocialPlatform } from "../config/links";

interface SocialObjectProps {
  platform: SocialPlatform;
  url: string;
  label: string;
  glowColor: string;
}

export default function SocialObject({ platform, url, label, glowColor }: SocialObjectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const hasBeenTappedRef = useRef(false);

  // Dismiss tooltip on outside tap (mobile support)
  useEffect(() => {
    if (!isHovered) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("button")) {
        setIsHovered(false);
        setMagneticOffset({ x: 0, y: 0 });
        hasBeenTappedRef.current = false;
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isHovered]);

  // Handle specific click animations then open URL
  const handleClick = async (e: React.MouseEvent) => {
    const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
    
    if (isTouch && !hasBeenTappedRef.current) {
      e.preventDefault();
      setIsHovered(true);
      hasBeenTappedRef.current = true;
      return;
    }

    hasBeenTappedRef.current = false;
    switch (platform) {
      case "instagram":
        // Spin + Glow
        await controls.start({
          rotateY: 360,
          scale: 1.3,
          boxShadow: `0 0 35px ${glowColor}`,
          transition: { duration: 0.6, ease: "easeInOut" }
        });
        // reset
        controls.start({ rotateY: 0, scale: 1 });
        break;

      case "facebook":
        // Soft Bounce
        await controls.start({
          y: [-10, 10, -5, 5, 0],
          transition: { duration: 0.8, ease: "easeInOut" }
        });
        break;

      case "linkedin":
        // Flip
        await controls.start({
          rotateX: 180,
          transition: { duration: 0.5, ease: "easeInOut" }
        });
        await controls.start({
          rotateX: 360,
          transition: { duration: 0.5, ease: "easeInOut" }
        });
        controls.set({ rotateX: 0 });
        break;

      case "youtube":
        // Play Pulse
        await controls.start({
          scale: [1, 1.4, 0.9, 1.1, 1],
          boxShadow: [
            `0 0 10px ${glowColor}`,
            `0 0 45px ${glowColor}`,
            `0 0 5px ${glowColor}`,
            `0 0 15px ${glowColor}`
          ],
          transition: { duration: 0.8 }
        });
        break;

      case "tiktok":
        // Pulse
        await controls.start({
          scale: [1, 1.2, 1],
          transition: { duration: 0.5 }
        });
        break;

      case "x":
        // Spin + Scale
        await controls.start({
          rotate: 360,
          scale: 1.25,
          transition: { duration: 0.5, ease: "easeOut" }
        });
        controls.set({ rotate: 0 });
        break;

      case "snapchat":
        // Bubble Bounce
        await controls.start({
          scale: [1, 1.3, 0.9, 1.1, 1],
          transition: { duration: 0.6, ease: "easeInOut" }
        });
        break;

      case "website":
        // Rotation Pulse
        await controls.start({
          rotate: [0, 90, -10, 10, 0],
          scale: [1, 1.15, 1],
          transition: { duration: 0.9, ease: "easeInOut" }
        });
        break;

      case "location":
        // Pin Drop bounce
        await controls.start({
          y: [0, -12, 4, -4, 0],
          scaleY: [1, 0.85, 1.05, 0.95, 1],
          transition: { duration: 0.8, ease: "easeOut" }
        });
        break;

      default:
        break;
    }

    // Delay redirect slightly for visual confirmation of click effect
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 450);
  };

  // SVG Logos for each platform (resized to w-5 h-5 for elegance and safe clearance)
  const getIcon = () => {
    switch (platform) {
      case "instagram":
        return (
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        );
      case "facebook":
        return (
          <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        );
      case "linkedin":
        return (
          <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"></path>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
        );
      case "youtube":
        return (
          <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
            <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#0B0F19"></polygon>
          </svg>
        );
      case "tiktok":
        return (
          <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M9 12a4 4 0 1 0 4 4V4h4a4 4 0 0 0 4 4h-2a2 2 0 0 1-2-2v-2h-2v13a6 6 0 1 1-10-4.5V12z"></path>
          </svg>
        );
      case "x":
        return (
          <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        );
      case "snapchat":
        return (
          <svg className="w-5 h-5 text-yellow-300 fill-current" viewBox="0 0 24 24">
            <path d="M12 2c-.93 0-2.85.12-3.8 1.83-.34.62-.48 1.4-.48 2.33 0 1.6.49 2.53.95 3.14.07.1.09.22.06.33l-.33 1.3c-.09.34.02.7.29.93.26.22.63.29.96.17l.95-.36c.11-.04.22-.04.32 0l.96.36c.1.04.21.05.31.04l-.06 2.05c-.01.27.1.53.31.7.2.17.47.24.73.18l.85-.2c.07-.02.13-.02.2 0l.85.2c.26.06.53-.01.73-.18.2-.17.32-.43.31-.7l-.06-2.05c.1.01.21 0 .31-.04l.96-.36c.1-.04.21-.04.32 0l.95.36c.33.12.7.05.96-.17.27-.23.38-.59.29-.93l-.33-1.3a.36.36 0 0 1 .06-.33c.46-.61.95-1.54.95-3.14 0-.93-.14-1.71-.48-2.33C14.85 2.12 12.93 2 12 2z"></path>
          </svg>
        );
      case "website":
        return (
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
      case "location":
        return (
          <svg className="w-5 h-5 text-white fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        );
      default:
        return null;
    }
  };

  // Styled 3D render containers (resized to w-11 h-11 with rounded-xl for ~10% visual enlargement)
  const renderShape = () => {
    switch (platform) {
      case "instagram":
        return (
          <div className="relative w-11 h-11 preserve-3d group-hover:rotate-x-12 group-hover:rotate-y-12 transition-transform duration-300">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-orange-500/20 border border-white/20 backdrop-blur-[6px] flex items-center justify-center shadow-lg shadow-pink-500/10">
              {getIcon()}
            </div>
            <div className="absolute inset-0 rounded-xl border border-rose-500/40 translate-z-[-4px] scale-[0.98] pointer-events-none" />
            <div className="absolute inset-0 rounded-xl border border-white/5 translate-z-[-8px] scale-[0.96] pointer-events-none" />
          </div>
        );

      case "facebook":
        return (
          <div className="w-11 h-11 rounded-xl bg-slate-900/40 border border-white/10 flex items-center justify-center backdrop-blur-[8px] relative overflow-hidden shadow-lg shadow-blue-500/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-blue-500/15" />
            {getIcon()}
            <div className="absolute inset-0.5 rounded-[11px] border border-white/5 pointer-events-none" />
          </div>
        );

      case "linkedin":
        return (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-blue-600 to-blue-800 border-b-4 border-blue-900 flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.3)]">
            {getIcon()}
          </div>
        );

      case "youtube":
        return (
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 border border-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] relative">
            <div className="absolute w-full h-full rounded-full border-2 border-white/10 animate-ping opacity-25 scale-75" />
            {getIcon()}
          </div>
        );

      case "tiktok":
        return (
          <div className="w-11 h-11 rounded-xl bg-black/80 border border-cyan-500/40 border-r-rose-500/40 flex items-center justify-center relative shadow-[0_0_15px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500/10 via-transparent to-rose-500/10 pointer-events-none" />
            {getIcon()}
          </div>
        );

      case "x":
        return (
          <div className="w-11 h-11 rounded-xl bg-black border border-white/20 flex items-center justify-center backdrop-blur-[6px] relative shadow-lg shadow-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
            {getIcon()}
          </div>
        );

      case "website":
        return (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-900/60 to-slate-800/60 border border-white/10 flex items-center justify-center backdrop-blur-[6px] relative shadow-lg shadow-white/5">
            <div className="absolute inset-0 rounded-xl border border-dashed border-rose-500/20 animate-spin-slow pointer-events-none scale-110" />
            {getIcon()}
          </div>
        );

      case "snapchat":
        return (
          <div className="w-11 h-11 rounded-xl bg-yellow-400 border border-yellow-300 flex items-center justify-center relative shadow-[0_4px_15px_rgba(255,252,0,0.3)]">
            <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/25 rounded-full rotate-[-15deg] filter blur-[0.5px]" />
            {getIcon()}
          </div>
        );

      case "location":
        return (
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500/10 to-rose-500/30 border border-rose-500/40 flex items-center justify-center backdrop-blur-[6px] shadow-lg shadow-rose-500/10">
            {getIcon()}
          </div>
        );

      default:
        return null;
    }
  };

  // Helper to fetch username for the platform tooltip
  const getUsername = (p: SocialPlatform) => {
    switch (p) {
      case "instagram": return "@m.ellhagan";
      case "facebook": return "MohamedElhaganPromedia";
      case "linkedin": return "mohamed-elhagan";
      case "youtube": return "@mohamedelhagan";
      case "tiktok": return "@elhaganofficial";
      case "snapchat": return "elhagan";
      case "x": return "@mohamedelhagan2";
      case "website": return "elhagan.com";
      case "location": return "Pro Media HQ";
      default: return "";
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Soft magnetic attraction
    setMagneticOffset({ x: x * 0.22, y: y * 0.22 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMagneticOffset({ x: 0, y: 0 });
    hasBeenTappedRef.current = false;
  };

  return (
    <motion.button
      animate={controls}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={handleMouseLeave}
      onMouseLeave={handleMouseLeave}
      className="relative w-14 h-14 flex items-center justify-center group select-none cursor-none border-none bg-transparent hover:bg-transparent pointer-events-auto perspective-container preserve-3d focus:outline-none"
      style={{
        zIndex: isHovered ? 100 : "auto",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {/* Glow Backdrop */}
      <motion.div
        className="absolute w-11 h-11 rounded-full filter blur-[12px] pointer-events-none -z-10"
        animate={{
          scale: isHovered ? 1.25 : 1,
          opacity: isHovered ? 0.95 : 0,
        }}
        transition={{
          duration: 0.25,
        }}
        style={{
          backgroundColor: glowColor,
        }}
      />

      {/* Floating Shape Element */}
      <motion.div
        className="relative pointer-events-none preserve-3d"
        animate={{
          x: magneticOffset.x,
          y: (isHovered ? -4 : 0) + magneticOffset.y,
          z: isHovered ? 20 : 0,
          scale: isHovered ? 1.12 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 22,
        }}
      >
        {renderShape()}
      </motion.div>

      {/* Premium Glass Tooltip (floating above the icon) */}
      <div 
        className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 pointer-events-none z-50"
        style={{
          transition: "opacity 0.12s ease-out, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformOrigin: "bottom center"
        }}
      >
        <div className="px-3.5 py-2 rounded-xl border border-white/10 bg-slate-950/80 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-w-[110px] text-center">
          <span className="text-[10px] font-extrabold tracking-wider text-white uppercase font-outfit">
            {label}
          </span>
          <span className="text-[8px] text-rose-400 font-semibold tracking-wide mt-0.5 whitespace-nowrap">
            {getUsername(platform)}
          </span>
        </div>
        {/* Tiny Tooltip Arrow */}
        <div className="w-2 h-2 bg-slate-950/80 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
      </div>
    </motion.button>
  );
}
