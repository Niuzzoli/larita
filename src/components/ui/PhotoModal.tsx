"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { wrapIndex } from "@/lib/wrapIndex";
import type { MemoryPhoto } from "@/types/birthday";

interface PhotoModalProps {
  photos: MemoryPhoto[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

const roundButton = "inline-flex size-11 items-center justify-center rounded-full bg-cream/15 text-cream";

export function PhotoModal({ photos, index, onChange, onClose }: PhotoModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const photo = photos[index];

  // El alto de la foto deja lugar al resto del modal (botón de cierre, epígrafe de dos líneas y flechas).
  // showModal() da el foco atrapado, el cierre con Escape y la devolución del foco al cerrar.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") onChange(wrapIndex(index + 1, photos.length));
        if (event.key === "ArrowLeft") onChange(wrapIndex(index - 1, photos.length));
      }}
      aria-label={`Foto ${index + 1} de ${photos.length}`}
      className="tone-night m-auto max-h-dvh w-full max-w-xl bg-transparent p-4 text-cream"
    >
      <div className="flex justify-end">
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Cerrar" className={roundButton}>
          <X size={22} aria-hidden />
        </button>
      </div>

      <Image
        key={photo.src}
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="(min-width: 640px) 576px, 100vw"
        className="mx-auto mt-3 h-auto max-h-[calc(100dvh-17rem)] w-auto max-w-full rounded-sm"
      />

      <p className="mt-3 text-center font-hand text-2xl leading-tight">{photo.caption}</p>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChange(wrapIndex(index - 1, photos.length))}
          aria-label="Foto anterior"
          className={roundButton}
        >
          <ChevronLeft size={22} aria-hidden />
        </button>
        <span className="text-sm text-cream/80" aria-hidden>
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={() => onChange(wrapIndex(index + 1, photos.length))}
          aria-label="Foto siguiente"
          className={roundButton}
        >
          <ChevronRight size={22} aria-hidden />
        </button>
      </div>
    </dialog>
  );
}
