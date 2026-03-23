"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: "fade" | "slide-up" | "slide-left" | "slide-right";
  duration?: number;
  delay?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollAnimation({
  children,
  animation = "fade",
  duration = 0.5,
  delay = 0,
  threshold = 0.1,
  className = "",
}: ScrollAnimationProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  const getAnimationVariant = () => {
    switch (animation) {
      case "slide-up":
        return {
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        };
      case "slide-left":
        return {
          hidden: { x: -20, opacity: 0 },
          visible: { x: 0, opacity: 1 },
        };
      case "slide-right":
        return {
          hidden: { x: 20, opacity: 0 },
          visible: { x: 0, opacity: 1 },
        };
      case "fade":
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={getAnimationVariant()}
        transition={{ duration, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function ScrollReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={className}>
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) return child;

        return (
          <ScrollAnimation
            key={i}
            animation="slide-up"
            delay={i * 0.1}
            threshold={0.1}
          >
            {child}
          </ScrollAnimation>
        );
      })}
    </div>
  );
}
