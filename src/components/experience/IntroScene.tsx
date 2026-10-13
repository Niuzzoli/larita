"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { birthday } from "@/config/birthday";
import { Burst } from "@/components/ui/Burst";
import { DoodleHeart, DoodleSquiggle, DoodleStar } from "@/components/ui/Doodles";
import { GiftBox } from "@/components/ui/GiftBox";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";

interface IntroSceneProps {
  /** True si ya pasó por acá: la caja aparece abierta y sin animación de partículas. */
  initiallyOpened: boolean;
  onNext: () => void;
}

export function IntroScene({ initiallyOpened, onNext }: IntroSceneProps) {
  const { intro } = birthday;
  const [opened, setOpened] = useState(initiallyOpened);
  const [justOpened, setJustOpened] = useState(false);

  const open = () => {
    setOpened(true);
    setJustOpened(true);
  };

  return (
    <SceneShell heading={intro.lines[0]} headingClassName="text-center">
      <p className="mt-2 text-center font-serif text-xl italic sm:text-2xl">{intro.lines[1]}</p>
      <DoodleSquiggle className="mx-auto mt-4 w-24 text-rose" />

      <div className="relative mt-10 flex flex-1 flex-col items-center justify-center">
        <DoodleStar className="absolute top-2 left-2 w-9 -rotate-12 text-lavender" />
        <DoodleHeart className="absolute top-10 right-3 w-8 rotate-12 text-rose" />
        <DoodleStar className="absolute right-6 bottom-24 w-6 rotate-6 text-rose" />
        <div className="relative">
          <GiftBox opened={opened} onOpen={open} label={intro.boxLabel} />
          {justOpened && <Burst />}
        </div>

        {/* Altura fija para que el cambio de pista a botón no mueva la caja. */}
        <div className="mt-8 flex h-16 items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {opened ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: justOpened ? 0.9 : 0, duration: 0.4 }}
              >
                <PrimaryButton onClick={onNext}>{intro.cta}</PrimaryButton>
              </motion.div>
            ) : (
              <motion.p key="hint" exit={{ opacity: 0 }} className="font-hand text-2xl text-rose-deep">
                {intro.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </SceneShell>
  );
}
