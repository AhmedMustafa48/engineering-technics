"use client";

import { MotionConfig } from "motion/react";

// Honour the OS "reduce motion" setting across every animation on the site.
export function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
