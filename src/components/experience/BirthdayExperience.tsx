"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useReducer, useState } from "react";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { experienceReducer, initialState } from "@/state/experience";
import { IntroScene } from "./IntroScene";
import { MemoriesScene } from "./MemoriesScene";

export function BirthdayExperience() {
  const [state, dispatch] = useReducer(experienceReducer, initialState);
  const { scene } = state;
  const night = scene === "final";
  // La primera escena llega ya dibujada desde el servidor: no se anima su entrada.
  const [navigated, setNavigated] = useState(false);

  // `from` hace que un toque sobre una escena que ya está saliendo no tenga efecto.
  const next = useCallback(() => {
    setNavigated(true);
    dispatch({ type: "next", from: scene });
  }, [scene]);
  const back = useCallback(() => {
    setNavigated(true);
    dispatch({ type: "back", from: scene });
  }, [scene]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [scene]);

  const renderScene = () => {
    switch (scene) {
      case "intro":
        return <IntroScene initiallyOpened={state.maxReached !== "intro"} onNext={next} />;
      case "memories":
        return <MemoriesScene onNext={next} onBack={back} />;
      default:
        return null;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-dvh transition-colors duration-[2000ms] ${night ? "bg-night" : "paper bg-cream"}`}>
        <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-[calc(1rem+env(safe-area-inset-top))]">
          <ProgressIndicator current={scene} tone={night ? "night" : "light"} />
          <div className="pointer-events-auto" data-slot="music" />
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={scene}
            initial={navigated ? { opacity: 0, y: 18 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {renderScene()}
          </motion.main>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
