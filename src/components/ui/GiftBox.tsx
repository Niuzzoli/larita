"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/** Flores que asoman de la caja: cabeza (x, y), tamaño, color de pétalos y del centro. */
const FLOWERS = [
  { x: 72, y: 46, r: 20, petal: "#EBA8C0", center: "#F6D58E" },
  { x: 168, y: 42, r: 20, petal: "#C9B8E8", center: "#F6D58E" },
  { x: 120, y: 16, r: 24, petal: "#F8DCE6", center: "#E89AB4" },
  { x: 95, y: 74, r: 16, petal: "#FFFFFF", center: "#F6D58E" },
  { x: 146, y: 72, r: 16, petal: "#EBA8C0", center: "#FFF5F2" },
];

/** Flor de cinco pétalos con tallo y una hojita, dibujada desde su cabeza. */
function Flower({ x, y, r, petal, center }: (typeof FLOWERS)[number]) {
  return (
    <g>
      <path d={`M${x} ${y}Q${(x + 120) / 2} ${y + 50} 120 150`} stroke="#7FA77A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path
        d={`M${(x + 120) / 2} ${y + 44}q${x < 120 ? 14 : -14} -4 ${x < 120 ? 20 : -20} -16q${x < 120 ? -14 : 14} 0 ${x < 120 ? -20 : 20} 16Z`}
        fill="#9CC394"
      />
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx={x}
          cy={y - r * 0.62}
          rx={r * 0.48}
          ry={r * 0.68}
          fill={petal}
          stroke="#57394D"
          strokeOpacity="0.16"
          transform={`rotate(${angle} ${x} ${y})`}
        />
      ))}
      <circle cx={x} cy={y} r={r * 0.34} fill={center} />
    </g>
  );
}

interface GiftBoxProps {
  opened: boolean;
  onOpen: () => void;
  label: string;
}

export function GiftBox({ opened, onOpen, label }: GiftBoxProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={opened}
      aria-label={label}
      className="press block w-56 rounded-3xl disabled:cursor-default sm:w-64"
    >
      <span className={`block ${opened ? "" : "gift-nudge"}`}>
      <motion.svg
        viewBox="0 0 240 260"
        className="block h-auto w-full overflow-visible"
        initial={false}
        // Anticipación: la caja se hunde un instante antes de saltar.
        animate={opened ? { y: [0, 5, -11, 0] } : { y: 0 }}
        transition={{ duration: 0.62, times: [0, 0.2, 0.55, 1], ease: "easeOut" }}
      >
        <defs>
          <radialGradient id="gift-glow">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F8DCE6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#EBA8C0" stopOpacity="0" />
          </radialGradient>
          <clipPath id="gift-mouth">
            <rect x="-40" y="-120" width="320" height="234" />
          </clipPath>
        </defs>
        <ellipse cx="120" cy="246" rx="86" ry="9" fill="#57394D" opacity="0.12" />

        {/* Luz que sale de adentro al abrirse */}
        <motion.ellipse
          cx="120"
          cy="104"
          rx="104"
          ry="78"
          fill="url(#gift-glow)"
          initial={false}
          animate={opened ? { opacity: [0, 1, 0.6], scale: [0.6, 1.08, 1] } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 1.3, delay: 0.16, times: [0, 0.4, 1], ease: EASE_OUT }}
        />

        {/* Base */}
        <rect x="36" y="112" width="168" height="128" rx="10" fill="#EBA8C0" />
        <rect x="36" y="112" width="168" height="20" fill="#57394D" opacity="0.1" />
        <rect x="106" y="112" width="28" height="128" fill="#C9B8E8" />

        {/* Tapa: gira sobre su esquina inferior izquierda */}
        <motion.g
          style={{ originX: 0, originY: 1 }}
          initial={false}
          animate={opened ? { rotate: -34, x: -18, y: -44 } : { rotate: 0, x: 0, y: 0 }}
          transition={{ type: "spring", duration: 0.7, bounce: 0.28, delay: 0.12 }}
        >
          <rect x="26" y="84" width="188" height="36" rx="8" fill="#F8DCE6" stroke="#57394D" strokeOpacity="0.18" />
          <rect x="104" y="84" width="32" height="36" fill="#C9B8E8" />
        </motion.g>

        {/* Flores: suben desde adentro de la caja y quedan asomando, delante de la tapa.
            El recorte en la boca de la caja esconde los tallos. */}
        <g clipPath="url(#gift-mouth)">
          {FLOWERS.map((flower, i) => (
            <motion.g
              key={i}
              initial={false}
              animate={opened ? { y: 0, opacity: 1 } : { y: 140, opacity: 0 }}
              transition={{
                type: "spring",
                duration: 0.9,
                bounce: 0.35,
                delay: 0.3 + i * 0.09,
                opacity: { duration: 0.2, delay: 0.3 + i * 0.09 },
              }}
            >
              <Flower {...flower} />
            </motion.g>
          ))}
        </g>

        {/* Moño: se suelta y cae */}
        <motion.g
          initial={false}
          animate={opened ? { y: 150, x: 46, rotate: 50, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
          // Cae con la gravedad: por eso acelera.
          transition={{ duration: 0.55, ease: [0.4, 0, 0.9, 0.6], opacity: { duration: 0.25, delay: 0.3 } }}
        >
          <path d="M120 84C96 48 68 52 73 74C76 89 104 87 120 84Z" fill="#C9B8E8" stroke="#57394D" strokeOpacity="0.2" />
          <path d="M120 84C144 48 172 52 167 74C164 89 136 87 120 84Z" fill="#C9B8E8" stroke="#57394D" strokeOpacity="0.2" />
          <circle cx="120" cy="82" r="9" fill="#B49CE0" />
        </motion.g>
      </motion.svg>
      </span>
    </button>
  );
}
