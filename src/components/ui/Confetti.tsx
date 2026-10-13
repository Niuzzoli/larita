"use client";

import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#EBA8C0", "#C9B8E8", "#F8DCE6", "#FFF5F2"];

const PIECES = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 29 + 5) % 100,
  drift: ((i * 17) % 60) - 30,
  rotate: (i * 47) % 360,
  delay: (i % 10) * 0.07,
  duration: 2.2 + (i % 5) * 0.25,
  color: COLORS[i % COLORS.length],
  round: i % 3 === 0,
}));

/** Confeti que cae una sola vez. Montarlo dispara la animación. */
export function Confetti() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {PIECES.map((piece, i) => (
        <motion.span
          key={i}
          className={`absolute top-0 block h-3 w-2 ${piece.round ? "rounded-full" : "rounded-[1px]"}`}
          style={{ left: `${piece.left}%`, background: piece.color }}
          initial={{ y: "-5vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", x: piece.drift, rotate: piece.rotate + 360, opacity: [1, 1, 0] }}
          transition={{ duration: piece.duration, delay: piece.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
