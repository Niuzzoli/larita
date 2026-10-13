"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { birthday } from "@/config/birthday";
import { Burst } from "@/components/ui/Burst";
import { DoodleHeart, DoodleSquiggle, DoodleStar } from "@/components/ui/Doodles";
import { GiftBox } from "@/components/ui/GiftBox";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";
import { EASE_OUT } from "@/lib/motion";

interface IntroSceneProps {
  /** True si ya pasó por acá: la caja aparece abierta y sin animación de partículas. */
  initiallyOpened: boolean;
  onNext: () => void;
}

export function IntroScene({ initiallyOpened, onNext }: IntroSceneProps) {
  const { intro } = birthday;
  const [opened, setOpened] = useState(initiallyOpened);
  const [justOpened, setJustOpened] = useState(false);

  // La coreografía de apertura corre solo la primera vez; al volver, la caja ya está abierta y quieta.
  const first = !initiallyOpened;

  const open = () => {
    setOpened(true);
    setJustOpened(true);
  };

  return (
    <SceneShell heading={intro.lines[0]} headingClassName={`text-center ${first ? "rise-in" : ""}`}>
      <p
        className={`mt-2 text-center font-serif text-xl italic sm:text-2xl ${first ? "rise-in" : ""}`}
        style={{ "--d": "140ms" } as CSSProperties}
      >
        {intro.lines[1]}
      </p>
      <DoodleSquiggle className={`mx-auto mt-4 w-24 text-rose ${first ? "draw-line" : ""}`} />

      <div className="relative mt-10 flex flex-1 flex-col items-center justify-center">
        <DoodleStar className="absolute top-2 left-2 w-9 -rotate-12 text-lavender" />
        <DoodleHeart className="absolute top-10 right-3 w-8 rotate-12 text-rose" />
        <DoodleStar className="absolute right-6 bottom-24 w-6 rotate-6 text-rose" />
        <div className={`relative ${first ? "gift-in" : ""}`}>
          <GiftBox opened={opened} onOpen={open} label={intro.boxLabel} />
          {justOpened && <Burst delay={0.28} />}
        </div>

        {/* Altura fija para que el cambio de pista a botón no mueva la caja. */}
        <div className="mt-8 flex h-16 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {opened ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: justOpened ? 0.75 : 0, duration: 0.6, ease: EASE_OUT }}
              >
                <PrimaryButton onClick={onNext}>{intro.cta}</PrimaryButton>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
                className={`font-hand text-2xl text-rose-deep ${first ? "rise-in" : ""}`}
                style={{ "--d": "900ms" } as CSSProperties}
              >
                {intro.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SceneShell>
  );
}
