"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1];

// Fades and lifts content into place the first time it scrolls into view.
export function Reveal({ children, delay = 0, y = 16, className, as = "div", ...rest }) {
  const Component = motion[as];
  return (
    <Component
      {...rest}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </Component>
  );
}

// Parent/child pair for staggered grids: wrap items in <StaggerItem>.
export function Stagger({ children, className, as = "div", stagger = 0.06 }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-64px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({ children, className, as = "div" }) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
    >
      {children}
    </Component>
  );
}
