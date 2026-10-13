"use client";

import { motion } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { birthday } from "@/config/birthday";
import { Confetti } from "@/components/ui/Confetti";
import { Polaroid } from "@/components/ui/Polaroid";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";
import { Stars } from "@/components/ui/Stars";
import { StarryHeart } from "@/components/ui/StarryHeart";

/**
 * Momento (ms desde que entra la escena) en que se alcanza cada etapa:
 * 1 estrellas, 2 corazón, 3 texto y foto, 4 carta, 5 cierre y botón.
 */
const STAGE_AT = [600, 1800, 3600, 5200, 6800];
const LAST_STAGE = STAGE_AT.length;

const reveal = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const },
};

interface FinalLetterSceneProps {
  /** True si la secuencia ya se vio: todo aparece revelado de entrada. */
  introDone: boolean;
  giftRevealed: boolean;
  /** Debe ser estable entre renders. */
  onIntroDone: () => void;
  onRevealGift: () => void;
  onRestart: () => void;
  onBack: () => void;
}

export function FinalLetterScene({
  introDone,
  giftRevealed,
  onIntroDone,
  onRevealGift,
  onRestart,
  onBack,
}: FinalLetterSceneProps) {
  const { final } = birthday;
  const [stage, setStage] = useState(introDone ? LAST_STAGE : 0);
  const [celebrate, setCelebrate] = useState(false);
  // La pista de "seguí bajando" se decide al entrar y no cambia, para que no mueva la carta al terminar la secuencia.
  const [showScrollHint] = useState(!introDone);

  useEffect(() => {
    if (introDone) return;
    const timers = STAGE_AT.map((ms, i) =>
      window.setTimeout(() => {
        setStage(i + 1);
        if (i + 1 === LAST_STAGE) onIntroDone();
      }, ms),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [introDone, onIntroDone]);

  const revealGift = () => {
    setCelebrate(true);
    onRevealGift();
  };

  return (
    <SceneShell
      heading={final.intro}
      tone="night"
      onBack={onBack}
      headingClassName={`text-center transition-opacity duration-1000 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}
    >
      <Stars visible={stage >= 1} />
      {celebrate && <Confetti />}

      <div className="relative mt-8">
        <StarryHeart lit={stage >= 2} />
      </div>

      {stage >= 3 && final.favoritePhoto && (
        <motion.div {...reveal} className="relative mx-auto mt-8 w-[70%] max-w-xs">
          <Polaroid
            photo={final.favoritePhoto}
            rotate={-2}
            tape
            eager
            sizes="(min-width: 640px) 320px, 70vw"
            onMissing="hide"
          />
        </motion.div>
      )}

      {stage >= 4 && (
        <>
          {showScrollHint && (
            <motion.p
              {...reveal}
              aria-hidden
              className="relative mt-6 flex items-center justify-center gap-1 font-hand text-xl text-cream/80"
            >
              seguí bajando <ChevronDown size={18} />
            </motion.p>
          )}
          <motion.article
            {...reveal}
            className="paper relative mx-auto mt-8 w-full max-w-xl rounded-sm bg-cream px-6 py-8 text-plum shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)] sm:px-10"
          >
            {final.letter.map((paragraph, i) => (
              <p key={i} className="mt-4 font-serif text-lg leading-relaxed first:mt-0">
                {paragraph}
              </p>
            ))}
          </motion.article>
        </>
      )}

      {stage >= 5 && (
        <motion.div {...reveal} className="relative mt-12 flex flex-col items-center gap-8 text-center">
          <p className="font-serif text-3xl leading-snug text-balance">{final.closing}</p>

          {giftRevealed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="polaroid max-w-sm rotate-1 px-6 py-6 text-plum" aria-live="polite">
                <p className="font-serif text-xl leading-relaxed">{final.giftMessage.text}</p>
                <p className="mt-3 text-right font-hand text-2xl">— {final.giftMessage.signature}</p>
              </div>
              <PrimaryButton tone="night" onClick={onRestart}>
                <RotateCcw size={18} aria-hidden /> {final.restartLabel}
              </PrimaryButton>
            </motion.div>
          ) : (
            <PrimaryButton tone="night" onClick={revealGift}>
              {final.giftButton}
            </PrimaryButton>
          )}
        </motion.div>
      )}
    </SceneShell>
  );
}
