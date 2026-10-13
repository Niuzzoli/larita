"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { birthday } from "@/config/birthday";
import { PhotoModal } from "@/components/ui/PhotoModal";
import { Polaroid } from "@/components/ui/Polaroid";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";

// Inclinación fija por posición: evita diferencias entre renders y da ritmo al álbum.
const ROTATIONS = [-3, 2, 0, -2, 3, 0, -1, 2, 0];

type DesktopSlot = "wide" | "left" | "right" | "solo";

/** En escritorio las verticales van de a pares; la que queda sin pareja se centra. */
function desktopSlots(landscapes: boolean[]): DesktopSlot[] {
  const slots: DesktopSlot[] = [];
  for (let i = 0; i < landscapes.length; i++) {
    if (landscapes[i]) slots.push("wide");
    else if (slots[i - 1] === "left") slots.push("right");
    else slots.push(i + 1 < landscapes.length && !landscapes[i + 1] ? "left" : "solo");
  }
  return slots;
}

const DESKTOP_CLASS: Record<DesktopSlot, string> = {
  wide: "md:col-span-2 md:mx-auto md:w-3/4",
  left: "md:w-full md:self-auto",
  right: "md:mt-20 md:w-full md:self-auto",
  solo: "md:col-span-2 md:mx-auto md:w-[42%] md:self-auto",
};

interface MemoriesSceneProps {
  onNext: () => void;
  onBack: () => void;
}

export function MemoriesScene({ onNext, onBack }: MemoriesSceneProps) {
  const { memories, relationshipStart } = birthday;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const slots = desktopSlots(memories.photos.map((photo) => photo.width > photo.height));

  return (
    <SceneShell heading={memories.intro} eyebrow={relationshipStart ? memories.sinceLabel : undefined} onBack={onBack}>
      <ol className="mt-10 flex flex-col gap-12 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-16">
        {memories.photos.map((photo, i) => {
          const landscape = photo.width > photo.height;
          const side = i % 2 === 0 ? "self-start" : "self-end";
          return (
            <motion.li
              key={photo.src}
              className={`${landscape ? "w-full" : `w-[80%] ${side}`} ${DESKTOP_CLASS[slots[i]]}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -12% 0px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Polaroid
                photo={photo}
                caption={photo.caption}
                rotate={ROTATIONS[i % ROTATIONS.length]}
                tape={i % 3 === 0}
                eager={i < 2}
                sizes={landscape ? "(min-width: 768px) 540px, 100vw" : "(min-width: 768px) 340px, 80vw"}
                onOpen={() => setOpenIndex(i)}
              />
              {photo.date && <p className="mt-2 text-center text-sm text-plum/70">{photo.date}</p>}
              {photo.description && <p className="mt-1 text-center text-base">{photo.description}</p>}
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-14 flex justify-center">
        <PrimaryButton onClick={onNext}>{memories.continueLabel}</PrimaryButton>
      </div>

      {openIndex !== null && (
        <PhotoModal
          photos={memories.photos}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </SceneShell>
  );
}
