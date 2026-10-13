"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import type { CSSProperties } from "react";
import { EASE_OUT } from "@/lib/motion";

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

const SHADOW = "shadow-[0_10px_20px_-12px_rgba(87,57,77,0.45)]";

// El sobre y la nota ocupan la misma celda: mide siempre lo que la capa más alta
// y abrirlo no mueve a los vecinos.
// Secuencia al abrir: se levanta la solapa, el sobre cae y se desvanece, la nota sale hacia adelante.
// Con movimiento reducido no hay desplazamientos: el sobre y la nota solo se funden.
export function Envelope({ title, message, opened, onOpen, rotate, tint }: EnvelopeProps) {
  const reduce = useReducedMotion();
  const layer = "col-start-1 row-start-1 min-h-44 rounded-lg";
  const away = reduce ? {} : { y: "14%", scale: 0.94 };
  const inside = reduce ? {} : { y: "10%", scale: 0.9 };
  const rest = reduce ? {} : { y: "0%", scale: 1 };

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={opened}
      className="envelope block w-full text-left"
      style={{ "--tilt": `${rotate}deg` } as CSSProperties}
    >
      <span className="grid">
        <motion.span
          aria-hidden={opened}
          className={`${layer} relative flex flex-col items-center justify-end gap-2 p-3 text-plum ${SHADOW}`}
          style={{ background: tint }}
          initial={false}
          animate={opened ? { opacity: 0, ...away } : { opacity: 1, ...rest }}
          transition={{ duration: 0.45, delay: opened && !reduce ? 0.2 : 0, ease: EASE_OUT }}
        >
          {/* Solapa: gira sobre el borde superior, hacia quien mira */}
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-lg [clip-path:polygon(0_0,100%_0,50%_100%)]"
            style={{ background: `color-mix(in srgb, ${tint} 88%, #57394D)`, transformPerspective: 500 }}
            initial={false}
            animate={{ rotateX: opened && !reduce ? 150 : 0 }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
          />
          <Heart size={22} fill="#57394D" color="#57394D" aria-hidden className="relative" />
          <span className="relative font-hand text-xl">{title}</span>
        </motion.span>

        <motion.span
          aria-hidden={!opened}
          className={`${layer} flex items-center bg-white p-4 font-hand text-xl leading-snug text-plum ${SHADOW}`}
          initial={false}
          animate={opened ? { opacity: 1, ...rest } : { opacity: 0, ...inside }}
          transition={
            opened
              ? { type: "spring", duration: 0.65, bounce: 0.18, delay: 0.26, opacity: { duration: 0.3, delay: reduce ? 0.1 : 0.26 } }
              : { duration: 0.2 }
          }
        >
          {message}
        </motion.span>
      </span>
    </button>
  );
}
