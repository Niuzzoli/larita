"use client";

import { motion } from "framer-motion";

const POINT_COUNT = 30;

// Curva clásica del corazón, recorrida en puntos equidistantes en t.
const POINTS = Array.from({ length: POINT_COUNT }, (_, i) => {
  const t = (i / POINT_COUNT) * Math.PI * 2;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { cx: Number((50 + x * 2.6).toFixed(2)), cy: Number((46 - y * 2.6).toFixed(2)) };
});

export function StarryHeart({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden className="mx-auto block w-36 sm:w-44">
      {POINTS.map((point, i) => (
        <motion.circle
          key={i}
          cx={point.cx}
          cy={point.cy}
          r={i % 4 === 0 ? 1.6 : 1.1}
          fill={i % 3 === 0 ? "#EBA8C0" : "#FFF5F2"}
          initial={false}
          animate={{ opacity: lit ? 1 : 0 }}
          transition={{ duration: 0.4, delay: lit ? i * 0.05 : 0 }}
        />
      ))}
    </svg>
  );
}
