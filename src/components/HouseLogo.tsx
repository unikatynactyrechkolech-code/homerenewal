"use client";

import { motion } from "framer-motion";

/**
 * Animated SVG house logo — draws itself stroke-by-stroke.
 * Used in both the initial loading screen and page transitions.
 *
 * The animation is built with SVG pathLength so it's resolution-independent
 * and buttery-smooth at any size. No frame flickering.
 */

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.15,
        type: "spring" as const,
        duration: 0.8,
        bounce: 0,
      },
      opacity: { delay: i * 0.15, duration: 0.01 },
    },
  }),
};

export default function HouseLogo({
  size = 80,
  strokeColor = "#c8a97e",
  className = "",
}: {
  size?: number;
  strokeColor?: string;
  className?: string;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
      className={className}
    >
      {/* Roof — triangle */}
      <motion.path
        d="M50 10 L15 45 L85 45 Z"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={0}
      />

      {/* Chimney */}
      <motion.path
        d="M65 18 L65 30 L72 30 L72 24"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={0.5}
      />

      {/* House body — rectangle */}
      <motion.rect
        x="22"
        y="45"
        width="56"
        height="42"
        rx="1"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={1}
      />

      {/* Door */}
      <motion.rect
        x="42"
        y="60"
        width="16"
        height="27"
        rx="1"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={2}
      />

      {/* Door knob */}
      <motion.circle
        cx="54"
        cy="75"
        r="1.5"
        stroke={strokeColor}
        strokeWidth="2"
        fill="none"
        variants={draw}
        custom={2.5}
      />

      {/* Left window */}
      <motion.rect
        x="28"
        y="54"
        width="10"
        height="10"
        rx="0.5"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={3}
      />

      {/* Left window cross */}
      <motion.line
        x1="33"
        y1="54"
        x2="33"
        y2="64"
        stroke={strokeColor}
        strokeWidth="1.5"
        variants={draw}
        custom={3.3}
      />
      <motion.line
        x1="28"
        y1="59"
        x2="38"
        y2="59"
        stroke={strokeColor}
        strokeWidth="1.5"
        variants={draw}
        custom={3.3}
      />

      {/* Right window */}
      <motion.rect
        x="62"
        y="54"
        width="10"
        height="10"
        rx="0.5"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={3}
      />

      {/* Right window cross */}
      <motion.line
        x1="67"
        y1="54"
        x2="67"
        y2="64"
        stroke={strokeColor}
        strokeWidth="1.5"
        variants={draw}
        custom={3.3}
      />
      <motion.line
        x1="62"
        y1="59"
        x2="72"
        y2="59"
        stroke={strokeColor}
        strokeWidth="1.5"
        variants={draw}
        custom={3.3}
      />
    </motion.svg>
  );
}
