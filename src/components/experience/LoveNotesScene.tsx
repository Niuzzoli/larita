"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { birthday } from "@/config/birthday";
import { Envelope } from "@/components/ui/Envelope";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";
import { daysTogether } from "@/lib/daysTogether";
import { EASE_OUT } from "@/lib/motion";

const ROTATIONS = [-2, 1.5, 2, -1, 1, -2, -1.5, 2];
const TINTS = ["#F8DCE6", "#C9B8E8", "#EBA8C0", "#FFF5F2"];

interface LoveNotesSceneProps {
  opened: string[];
  onOpen: (noteId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LoveNotesScene({ opened, onOpen, onNext, onBack }: LoveNotesSceneProps) {
  const { notes, relationshipStart } = birthday;
  const [now] = useState(() => new Date());
  const remaining = notes.items.filter((note) => !opened.includes(note.id)).length;
  const days = daysTogether(relationshipStart, now);
  // Si ya estaban todas abiertas al entrar, el cierre aparece sin animarse de nuevo.
  const [startedDone] = useState(remaining === 0);
  const justFinished = !startedDone;

  return (
    <SceneShell heading={notes.title} onBack={onBack}>
      <p className="mt-2 font-hand text-2xl text-rose-deep" aria-live="polite">
        {remaining === 0
          ? "¡Las abriste todas!"
          : remaining === 1
            ? "Te queda 1 por abrir"
            : `Te quedan ${remaining} por abrir`}
      </p>

      <ul className="cork mt-6 grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl p-4 sm:grid-cols-4 sm:p-6">
        {notes.items.map((note, i) => (
          <motion.li
            key={note.id}
            // Los sobres se apoyan en el corcho de a uno.
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.18 + i * 0.05 }}
          >
            <Envelope
              title={note.title}
              message={note.message}
              opened={opened.includes(note.id)}
              onOpen={() => onOpen(note.id)}
              rotate={ROTATIONS[i % ROTATIONS.length]}
              tint={TINTS[i % TINTS.length]}
            />
          </motion.li>
        ))}
      </ul>

      {remaining === 0 && (
        <motion.div
          // Espera a que termine de salir la última nota.
          initial={justFinished ? { opacity: 0, y: 20, scale: 0.96 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.85 }}
          className="mt-10 flex flex-col items-center gap-6 text-center"
        >
          <div className="polaroid -rotate-1 px-6 py-4">
            {days === null ? (
              <Heart size={28} fill="#EBA8C0" color="#EBA8C0" aria-hidden />
            ) : (
              <p className="font-hand text-2xl leading-tight">{notes.unlockedText.replace("{days}", String(days))}</p>
            )}
          </div>
          <PrimaryButton onClick={onNext}>{notes.continueLabel}</PrimaryButton>
        </motion.div>
      )}
    </SceneShell>
  );
}
