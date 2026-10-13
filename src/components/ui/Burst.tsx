"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart, Star } from "lucide-react";

const COLORS = ["#EBA8C0", "#C9B8E8", "#57394D"];

/** Partículas que salen del centro del contenedor `relative` más cercano. Se dibujan una sola vez. */
export function Burst({ count = 12 }: { count?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 block">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const distance = 80 + (i % 3) * 30;
        const Icon = i % 2 === 0 ? Heart : Star;
        return (
          <motion.span
            key={i}
            className="absolute -top-2 -left-2 block"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance - 50, scale: 1, opacity: 0 }}
            transition={{ duration: 1.1, delay: 0.3 + (i % 4) * 0.04, ease: "easeOut" }}
          >
            <Icon size={14 + (i % 3) * 4} fill={COLORS[i % 3]} color={COLORS[i % 3]} />
          </motion.span>
        );
      })}
    </span>
  );
}
