"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [hoverState, setHoverState] = useState<"default" | "hover" | "magnetic">("default");
  const [activeText, setActiveText] = useState("");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const cursorRingX = useSpring(cursorX, springConfig);
  const cursorRingY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setMounted(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    // Event delegation for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find closest interactive parent
      const interactive = target.closest("a, button, [role='button'], .magnetic");
      
      if (interactive) {
        if (interactive.classList.contains("magnetic")) {
          setHoverState("magnetic");
        } else {
          setHoverState("hover");
        }
        
        const label = interactive.getAttribute("data-cursor-label");
        if (label) {
          setActiveText(label);
        }
      } else {
        setHoverState("default");
        setActiveText("");
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!mounted) return null;

  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "rgba(244, 63, 94, 0)",
      borderColor: "rgba(255, 255, 255, 0.4)",
      borderWidth: 1.5,
    },
    hover: {
      width: 64,
      height: 64,
      backgroundColor: "rgba(244, 63, 94, 0.15)",
      borderColor: "rgba(244, 63, 94, 0.8)",
      borderWidth: 1,
    },
    magnetic: {
      width: 72,
      height: 72,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "rgba(244, 63, 94, 0.9)",
      borderWidth: 2,
      boxShadow: "0 0 15px rgba(244, 63, 94, 0.4)",
    }
  };

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen hidden md:block"
        style={{
          x: cursorRingX,
          y: cursorRingY,
        }}
        variants={ringVariants}
        animate={hoverState}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {activeText && (
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-rose-400">
            {activeText}
          </span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-rose-500 rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
    </>
  );
}
