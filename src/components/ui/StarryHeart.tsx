"use client";

import { motion } from "framer-motion";

const POINT_COUNT = 30;
/** Segundos entre el encendido de una estrella y la siguiente. */
const STEP = 0.05;

// Curva clásica del corazón, recorrida en puntos equidistantes en t.
const POINTS = Array.from({ length: POINT_COUNT }, (_, i) => {
  const t = (i / POINT_COUNT) * Math.PI * 2;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return { cx: Number((50 + x * 2.6).toFixed(2)), cy: Number((46 - y * 2.6).toFixed(2)) };
});

export function StarryHeart({ lit }: { lit: boolean }) {
  return (
    <div aria-hidden className="relative mx-auto w-36 sm:w-44">
      {/* Resplandor: aparece cuando el corazón ya está dibujado */}
      <div
        className={`absolute inset-0 m-auto size-4/5 rounded-full bg-rose/30 blur-2xl transition-opacity duration-[2400ms] ${
          lit ? "opacity-100 delay-[1200ms]" : "opacity-0"
        }`}
      />
      {/* Un solo latido, apenas termina de dibujarse. Al volver a la escena no se repite. */}
      <motion.svg
        viewBox="0 0 100 100"
        className="relative block w-full"
        initial={false}
        animate={lit ? { scale: [1, 1.08, 1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 1.3, delay: POINT_COUNT * STEP + 0.3, times: [0, 0.18, 0.4, 0.58, 1], ease: "easeInOut" }}
      >
        {POINTS.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.cx}
            cy={point.cy}
            r={i % 4 === 0 ? 1.6 : 1.1}
            fill={i % 3 === 0 ? "#EBA8C0" : "#FFF5F2"}
            initial={false}
            animate={{ opacity: lit ? 1 : 0 }}
            transition={{ duration: 0.4, delay: lit ? i * STEP : 0 }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
