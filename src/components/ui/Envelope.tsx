"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

interface EnvelopeProps {
  title: string;
  message: string;
  opened: boolean;
  onOpen: () => void;
  /** Grados de inclinación. */
  rotate: number;
  /** Color de fondo del sobre. */
  tint: string;
}

// Las dos caras ocupan la misma celda: el sobre mide siempre lo que la cara más alta
// y abrirlo no mueve a los vecinos.
export function Envelope({ title, message, opened, onOpen, rotate, tint }: EnvelopeProps) {
  const reduce = useReducedMotion();
  const face = "col-start-1 row-start-1 min-h-44 rounded-lg [backface-visibility:hidden]";

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={opened}
      className="block w-full text-left [perspective:900px]"
      style={{ rotate: `${rotate}deg` }}
    >
      <motion.span
        className="grid [transform-style:preserve-3d]"
        initial={false}
        animate={reduce ? undefined : { rotateY: opened ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <span
          aria-hidden={opened}
          className={`${face} relative flex flex-col items-center justify-end gap-2 overflow-hidden p-3 text-plum shadow-[0_10px_20px_-12px_rgba(87,57,77,0.45)] transition-opacity duration-300`}
          style={{ background: tint, opacity: reduce && opened ? 0 : 1 }}
        >
          {/* Solapa del sobre */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1/2 bg-plum/10 [clip-path:polygon(0_0,100%_0,50%_100%)]"
          />
          <Heart size={22} fill="#57394D" color="#57394D" aria-hidden className="relative" />
          <span className="relative font-hand text-xl">{title}</span>
        </span>

        <span
          aria-hidden={!opened}
          className={`${face} flex items-center bg-white p-4 font-hand text-xl leading-snug text-plum shadow-[0_10px_20px_-12px_rgba(87,57,77,0.45)] transition-opacity duration-300`}
          style={reduce ? { opacity: opened ? 1 : 0 } : { transform: "rotateY(180deg)" }}
        >
          {message}
        </span>
      </motion.span>
    </button>
  );
}
