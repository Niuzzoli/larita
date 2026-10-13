"use client";

import { motion } from "framer-motion";

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
      className="block w-56 rounded-3xl disabled:cursor-default sm:w-64"
    >
      <motion.svg
        viewBox="0 0 240 260"
        className="block h-auto w-full overflow-visible"
        initial={false}
        animate={opened ? { y: [0, -12, 0] } : { y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <ellipse cx="120" cy="246" rx="86" ry="9" fill="#57394D" opacity="0.12" />

        {/* Base */}
        <rect x="36" y="112" width="168" height="128" rx="10" fill="#EBA8C0" />
        <rect x="36" y="112" width="168" height="20" fill="#57394D" opacity="0.1" />
        <rect x="106" y="112" width="28" height="128" fill="#C9B8E8" />

        {/* Tapa: gira sobre su esquina inferior izquierda */}
        <motion.g
          style={{ originX: 0, originY: 1 }}
          initial={false}
          animate={opened ? { rotate: -34, x: -18, y: -44 } : { rotate: 0, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 170, damping: 13, delay: 0.25 }}
        >
          <rect x="26" y="84" width="188" height="36" rx="8" fill="#F8DCE6" stroke="#57394D" strokeOpacity="0.18" />
          <rect x="104" y="84" width="32" height="36" fill="#C9B8E8" />
        </motion.g>

        {/* Moño: se suelta y cae */}
        <motion.g
          initial={false}
          animate={opened ? { y: 150, x: 46, rotate: 50, opacity: 0 } : { y: 0, x: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeIn" }}
        >
          <path d="M120 84C96 48 68 52 73 74C76 89 104 87 120 84Z" fill="#C9B8E8" stroke="#57394D" strokeOpacity="0.2" />
          <path d="M120 84C144 48 172 52 167 74C164 89 136 87 120 84Z" fill="#C9B8E8" stroke="#57394D" strokeOpacity="0.2" />
          <circle cx="120" cy="82" r="9" fill="#B49CE0" />
        </motion.g>
      </motion.svg>
    </button>
  );
}
