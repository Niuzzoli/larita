"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { birthday } from "@/config/birthday";
import { Confetti } from "@/components/ui/Confetti";
import { Polaroid } from "@/components/ui/Polaroid";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";
import { Stars } from "@/components/ui/Stars";
import { StarryHeart } from "@/components/ui/StarryHeart";
import { EASE_OUT } from "@/lib/motion";

/**
 * Momento (ms desde que entra la escena) en que se alcanza cada etapa:
 * 1 estrellas, 2 corazón, 3 texto y foto, 4 carta, 5 cierre y botón.
 * El corazón tarda 1,5 s en dibujarse y late una vez antes de que aparezca el texto.
 */
const STAGE_AT = [750, 1900, 4300, 5900, 7500];
const LAST_STAGE = STAGE_AT.length;

const shown = {
  opacity: 1,
  y: 0,
  scale: 1,
  transition: { duration: 1.1, ease: EASE_OUT, opacity: { duration: 0.9, ease: "easeOut" as const } },
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
  // Se decide al entrar y no cambia: la secuencia (y la pista de "seguí bajando") solo corre la primera vez.
  // Al volver a la escena todo está en su lugar, sin animarse de nuevo ni mover la carta.
  const [first] = useState(!introDone);

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

  // El mensaje aparece donde estaba el botón, casi al borde de la pantalla: se lo trae al centro.
  const giftRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (celebrate) giftRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }, [celebrate, reduce]);

  const revealGift = () => {
    setCelebrate(true);
    onRevealGift();
  };

  const reveal = { initial: first ? { opacity: 0, y: 18 } : false, animate: shown } as const;

  return (
    <SceneShell
      heading={final.intro}
      tone="night"
      onBack={onBack}
      headingClassName={`text-center transition-opacity duration-[1400ms] ${stage >= 3 ? "opacity-100" : "opacity-0"}`}
    >
      <Stars visible={stage >= 1} />
      {celebrate && <Confetti />}

      <div className="relative mt-8">
        <StarryHeart lit={stage >= 2} />
      </div>

      {stage >= 3 && final.favoritePhoto && (
        // Con variantes con nombre para que la foto se revele, igual que en el álbum.
        <motion.div
          variants={{ hidden: { opacity: 0, y: 22, scale: 0.95 }, shown }}
          initial={first ? "hidden" : false}
          animate="shown"
          className="relative mx-auto mt-8 w-[70%] max-w-xs"
        >
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
          {first && (
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
              // Cada párrafo se asienta cuando llega a la vista, al ritmo de la lectura.
              <motion.p
                key={i}
                initial={first ? { opacity: 0, y: 10, filter: "blur(4px)" } : false}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.15 }}
                className="mt-4 font-script text-2xl leading-relaxed first:mt-0 sm:text-[1.65rem]"
              >
                {paragraph}
              </motion.p>
            ))}
          </motion.article>
        </>
      )}

      {stage >= 5 && (
        <motion.div {...reveal} className="relative mt-12 flex flex-col items-center gap-8 text-center">
          <p className="font-serif text-3xl leading-snug text-balance">{final.closing}</p>

          {giftRevealed ? (
            <motion.div
              ref={giftRef}
              initial={celebrate ? { opacity: 0, y: 26, scale: 0.94, rotate: -4 } : false}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.9, bounce: 0.2, opacity: { duration: 0.4 } }}
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
