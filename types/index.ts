import { ReactNode } from "react";
import { SocialPlatform } from "../config/links";

export interface OrbitNode {
  id: SocialPlatform;
  label: string;
  url: string;
  color: string;
  glowColor: string;
  baseRadiusX: number; // in pixels
  baseRadiusY: number; // in pixels
  speed: number;       // speed multiplier
  initialPhase: number; // phase angle in radians
  depthOffset: number; // custom z-index offset
}
