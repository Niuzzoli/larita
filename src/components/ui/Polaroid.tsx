"use client";

import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { EASE_OUT } from "@/lib/motion";
import type { Photo } from "@/types/birthday";

// La foto "se revela" cuando un ancestro pasa de la variante `hidden` a `shown`.
// Sin ese ancestro (o si no anima), se ve nítida desde el principio.
const develop = {
  hidden: { scale: 1.07 },
  shown: { scale: 1, transition: { duration: 1.5, ease: EASE_OUT } },
};
const veil = {
  hidden: { opacity: 1 },
  shown: { opacity: 0, transition: { duration: 1.2, delay: 0.2, ease: "easeOut" as const } },
};

interface PolaroidProps {
  photo: Photo;
  caption?: string;
  /** Grados de inclinación. */
  rotate?: number;
  tape?: boolean;
  /** Cargar sin esperar a que entre en pantalla (para las primeras fotos). */
  eager?: boolean;
  sizes: string;
  onOpen?: () => void;
  /** Qué hacer si el archivo no carga. */
  onMissing?: "placeholder" | "hide";
}

export function Polaroid({
  photo,
  caption,
  rotate = 0,
  tape = false,
  eager = false,
  sizes,
  onOpen,
  onMissing = "placeholder",
}: PolaroidProps) {
  const [failed, setFailed] = useState(false);

  if (failed && onMissing === "hide") return null;

  return (
    <figure className="polaroid polaroid-photo relative" style={{ "--tilt": `${rotate}deg` } as CSSProperties}>
      {tape && <span className="tape" aria-hidden />}
      <div className="relative overflow-hidden bg-blush" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        {failed ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-plum/70">
            <ImageOff size={28} aria-hidden />
            <p className="text-sm">Acá va una foto</p>
            <code className="text-xs break-all">{`public${photo.src}`}</code>
          </div>
        ) : (
          <>
            <motion.div variants={develop} className="h-full w-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes={sizes}
                loading={eager ? "eager" : "lazy"}
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              aria-hidden
              variants={veil}
              style={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 bg-[#f6e6da]"
            />
          </>
        )}
      </div>
      {caption && <figcaption className="px-1 pt-2 text-center font-hand text-xl leading-tight text-plum">{caption}</figcaption>}
      {onOpen && !failed && (
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Ampliar foto: ${caption ?? photo.alt}`}
          className="absolute inset-0 rounded-[3px]"
        />
      )}
    </figure>
  );
}
