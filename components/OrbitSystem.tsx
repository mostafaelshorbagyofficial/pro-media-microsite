"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { socialLinks } from "../config/links";
import { OrbitNode } from "../types";
import SocialObject from "./SocialObject";
import CenterProfile from "./CenterProfile";

export default function OrbitSystem() {
  const [nodes, setNodes] = useState<OrbitNode[]>([]);
  const [scale, setScale] = useState(1);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Parallax tilt states
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Core loop values
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  
  // Custom speeds and current phases refs to avoid state-re-render lag on 60FPS
  const phasesRef = useRef<{ [key: string]: number }>({});
  const organicOffsetsRef = useRef<{ [key: string]: number }>({});
  const targetOrganicOffsetsRef = useRef<{ [key: string]: number }>({});
  const speedFactorRef = useRef<number>(1.0);

  // Initialize Orbit configurations
  useEffect(() => {
    // Track prefers-reduced-motion media query
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", motionListener);

    const list: OrbitNode[] = [
      // Inner Ring (website, email, whatsapp)
      {
        id: "website",
        label: "Website",
        url: socialLinks.website,
        color: "rgba(255,255,255,0.4)",
        glowColor: "rgba(255,255,255,0.15)",
        baseRadiusX: 239,
        baseRadiusY: 160,
        speed: 0.15,
        initialPhase: 0,
        depthOffset: 1,
      },
      {
        id: "x",
        label: "X (Twitter)",
        url: socialLinks.x,
        color: "rgba(255,255,255,0.4)",
        glowColor: "rgba(255,255,255,0.15)",
        baseRadiusX: 239,
        baseRadiusY: 160,
        speed: 0.15,
        initialPhase: (2 * Math.PI) / 3,
        depthOffset: 1,
      },
      {
        id: "snapchat",
        label: "Snapchat",
        url: socialLinks.snapchat,
        color: "rgba(255,252,0,0.4)",
        glowColor: "rgba(255,252,0,0.25)",
        baseRadiusX: 239,
        baseRadiusY: 160,
        speed: 0.15,
        initialPhase: (4 * Math.PI) / 3,
        depthOffset: 1,
      },
      // Middle Ring (instagram, facebook, linkedin)
      {
        id: "instagram",
        label: "Instagram",
        url: socialLinks.instagram,
        color: "rgba(236,72,153,0.4)",
        glowColor: "rgba(236,72,153,0.25)",
        baseRadiusX: 291,
        baseRadiusY: 195,
        speed: -0.10,
        initialPhase: 0,
        depthOffset: 2,
      },
      {
        id: "facebook",
        label: "Facebook",
        url: socialLinks.facebook,
        color: "rgba(59,130,246,0.4)",
        glowColor: "rgba(59,130,246,0.2)",
        baseRadiusX: 291,
        baseRadiusY: 195,
        speed: -0.10,
        initialPhase: (2 * Math.PI) / 3,
        depthOffset: 2,
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        url: socialLinks.linkedin,
        color: "rgba(37,99,235,0.4)",
        glowColor: "rgba(37,99,235,0.25)",
        baseRadiusX: 291,
        baseRadiusY: 195,
        speed: -0.10,
        initialPhase: (4 * Math.PI) / 3,
        depthOffset: 2,
      },
      // Outer Ring (youtube, tiktok, location)
      {
        id: "youtube",
        label: "YouTube",
        url: socialLinks.youtube,
        color: "rgba(239,68,68,0.4)",
        glowColor: "rgba(239,68,68,0.3)",
        baseRadiusX: 343,
        baseRadiusY: 230,
        speed: 0.07,
        initialPhase: 0,
        depthOffset: 3,
      },
      {
        id: "tiktok",
        label: "TikTok",
        url: socialLinks.tiktok,
        color: "rgba(255,255,255,0.4)",
        glowColor: "rgba(255,255,255,0.2)",
        baseRadiusX: 343,
        baseRadiusY: 230,
        speed: 0.07,
        initialPhase: (2 * Math.PI) / 3,
        depthOffset: 3,
      },
      {
        id: "location",
        label: "Location",
        url: socialLinks.location,
        color: "rgba(251,113,133,0.4)",
        glowColor: "rgba(251,113,133,0.25)",
        baseRadiusX: 343,
        baseRadiusY: 230,
        speed: 0.07,
        initialPhase: (4 * Math.PI) / 3,
        depthOffset: 3,
      },
    ];

    setNodes(list);

    // Init phase angles
    list.forEach(node => {
      phasesRef.current[node.id] = node.initialPhase;
      organicOffsetsRef.current[node.id] = 0;
      targetOrganicOffsetsRef.current[node.id] = 0;
    });

    // Handle responsive scaling
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      let calculatedScale = 1.0;
      
      if (w < 768) {
        // Mobile layout: base scale factor on screen width to prevent horizontal scroll
        calculatedScale = w / 460;
      } else {
        const imgRatio = 1.5; // aspect ratio of background image bg.png
        const viewportRatio = w / h;
        let bgScale = 1.0;
        
        if (viewportRatio > imgRatio) {
          bgScale = w / 1500;
        } else {
          bgScale = h / 1000;
        }
        calculatedScale = bgScale / 0.8;
      }
      
      // Clamp to keep elements in readable bounds
      const clampedScale = Math.max(w < 768 ? 0.38 : 0.50, Math.min(calculatedScale, w < 768 ? 0.85 : 1.15));
      setScale(clampedScale);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      motionQuery.removeEventListener("change", motionListener);
    };
  }, []);

  // Parallax Mouse interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Relative offset from center
      const dx = (e.clientX - centerX) / (rect.width / 2);
      const dy = (e.clientY - centerY) / (rect.height / 2);

      setMouseOffset({ x: dx, y: dy });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Organic position changes every few seconds
  useEffect(() => {
    const triggerPhaseShift = () => {
      nodes.forEach((node) => {
        // Shift speed slightly or add phase offset between -0.5 and +0.5 rads
        targetOrganicOffsetsRef.current[node.id] = (Math.random() - 0.5) * 0.8;
      });
    };

    const interval = setInterval(triggerPhaseShift, 6000);
    return () => clearInterval(interval);
  }, [nodes]);

  // Orbit render loop (60 FPS)
  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const delta = (time - previousTimeRef.current) / 1000;

        // Initialize start time on first tick
        if (startTimeRef.current === null) {
          startTimeRef.current = time;
        }

        const elapsed = (time - startTimeRef.current) / 1000;
        let introProgress = 0;

        if (elapsed > 1.2) {
          // Smooth 0.5s fly-out starting at 1.2s
          const rawProgress = Math.min(1.0, (elapsed - 1.2) / 0.5);
          // cubic easeOut
          introProgress = 1 - Math.pow(1 - rawProgress, 3);
        }

        // Slow down factor on hover
        const targetSpeedFactor = hoveredNodeId ? 0.15 : 1.0;
        speedFactorRef.current += (targetSpeedFactor - speedFactorRef.current) * 0.08;

        nodes.forEach((node) => {
          // 1. Progress angle
          const currentPhase = phasesRef.current[node.id] || node.initialPhase;
          const speedMultiplier = prefersReducedMotion ? 0.05 : 1.0;
          const nodeSpeed = node.speed * speedFactorRef.current * speedMultiplier;
          phasesRef.current[node.id] = currentPhase + nodeSpeed * delta;

          // 2. Interpolate organic phase offsets
          const currentOffset = organicOffsetsRef.current[node.id] || 0;
          const targetOffset = targetOrganicOffsetsRef.current[node.id] || 0;
          organicOffsetsRef.current[node.id] = currentOffset + (targetOffset - currentOffset) * 0.02;

          // 3. Update DOM positions manually using Ref for smooth rendering
          const el = document.getElementById(`orbit-node-${node.id}`);
          if (el) {
            const finalAngle = phasesRef.current[node.id] + organicOffsetsRef.current[node.id];
            
            const isMobile = window.innerWidth < 768;
            
            // Safe boundaries: profileRadius = 65px (130px diameter) on mobile, 110px (220px diameter) on desktop; safeGap = 25px on mobile, 35px on desktop
            const profileRadius = isMobile ? 65 : 110;
            const safeRadius = profileRadius + (isMobile ? 25 : 35); 

            // Orbit scale mapping with dynamic boundary clamping to prevent overlapping
            let currentRadiusY = isMobile ? 100 : 160;
            if (node.baseRadiusY === 195) currentRadiusY = isMobile ? 130 : 195;
            if (node.baseRadiusY === 230) currentRadiusY = isMobile ? 160 : 230;

            let finalRadiusY = currentRadiusY * scale;
            if (currentRadiusY === (isMobile ? 100 : 160)) {
              finalRadiusY = Math.max(safeRadius, finalRadiusY);
            } else if (currentRadiusY === (isMobile ? 130 : 195)) {
              finalRadiusY = Math.max(safeRadius + (isMobile ? 25 : 35), finalRadiusY);
            } else if (currentRadiusY === (isMobile ? 160 : 230)) {
              finalRadiusY = Math.max(safeRadius + (isMobile ? 50 : 70), finalRadiusY);
            }

            // Squash ratio: desktop is squashed horizontally (Y/0.67), mobile is squashed vertically (Y*0.90) to fit portrait screens
            let finalRadiusX = isMobile ? finalRadiusY * 0.90 : finalRadiusY / 0.67;

            // Enforce safe clearance bounds to prevent icon-profile overlap at all angles (visual icon radius is 22px)
            const minX = profileRadius + 22 + (isMobile ? 5 : 10); // 92px on mobile, 142px on desktop
            finalRadiusX = Math.max(minX, finalRadiusX);

            let x = Math.cos(finalAngle) * finalRadiusX * introProgress;
            let y = Math.sin(finalAngle) * finalRadiusY * introProgress;

            // Compute 3D Depth
            const zProgress = Math.sin(finalAngle); // [-1, 1]
            
            // Adjust Y based on Tilt perspective
            y = y * 0.95; 

            // Scale factor based on Z depth and fly-out progress
            const depthScale = (0.85 + (zProgress + 1) * 0.15) * introProgress;
            
            // Z-Index: nodes in front have higher index
            const zIndex = Math.round((zProgress + 1) * 100) + node.depthOffset * 10;
            
            // Opacity: nodes in back are slightly translucent (fade out during intro)
            const opacity = (0.55 + (zProgress + 1) * 0.225) * introProgress;

            // Apply transformations (uses a non-negative translateZ offset to remain in front of background layers and keep 100% clickable)
            el.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${(zProgress + 1) * 30}px) scale(${depthScale})`;
            el.style.zIndex = zIndex.toString();
            el.style.opacity = hoveredNodeId === node.id ? "1.0" : opacity.toString();
          }
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    if (nodes.length > 0) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [nodes, scale, hoveredNodeId]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] md:h-[650px] flex items-center justify-center perspective-container select-none"
      style={{
        // 3D Parallax Tilt container
        transform: `rotateX(${-mouseOffset.y * 12}deg) rotateY(${mouseOffset.x * 12}deg)`,
        transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* 2. Center Profile & Title Core */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 select-none pointer-events-none"
        style={{
          transform: `translateZ(20px)`,
        }}
      >
        <div className="pointer-events-auto">
          <CenterProfile />
        </div>
        
        {/* CEO PRO MEDIA Badge */}
        <div className="flex flex-col items-center gap-0.5 mt-1.5">
          <h2 className="text-[11px] md:text-[13px] font-bold tracking-[0.4em] text-white uppercase font-outfit text-glow-white">
            CEO
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-[9px] md:text-[11px] font-black tracking-[0.3em] text-rose-500 uppercase font-outfit text-glow-primary">
              PRO MEDIA
            </span>
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* 3. Floating Social 3D Nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          id={`orbit-node-${node.id}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-shadow duration-300 pointer-events-auto"
          onMouseEnter={() => setHoveredNodeId(node.id)}
          onMouseLeave={() => setHoveredNodeId(null)}
        >
          <SocialObject
            platform={node.id}
            url={node.url}
            label={node.label}
            glowColor={node.glowColor}
          />
        </div>
      ))}
    </div>
  );
}
