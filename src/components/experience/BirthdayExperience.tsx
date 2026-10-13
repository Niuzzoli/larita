"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useCallback, useEffect, useReducer, useState } from "react";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { birthday } from "@/config/birthday";
import { experienceReducer, initialState } from "@/state/experience";
import { CoupleQuizScene } from "./CoupleQuizScene";
import { FinalLetterScene } from "./FinalLetterScene";
import { IntroScene } from "./IntroScene";
import { LoveNotesScene } from "./LoveNotesScene";
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
  const answerQuiz = useCallback(
    (questionId: string, optionId: string) => dispatch({ type: "answerQuiz", questionId, optionId }),
    [],
  );
  const openNote = useCallback((noteId: string) => dispatch({ type: "openNote", noteId }), []);
  const finalIntroDone = useCallback(() => dispatch({ type: "finalIntroDone" }), []);
  const revealGift = useCallback(() => dispatch({ type: "revealGift" }), []);
  const restart = useCallback(() => dispatch({ type: "restart" }), []);

  // El fondo de toda la página acompaña a la escena nocturna (barras del navegador y rebote del scroll).
  useEffect(() => {
    document.documentElement.classList.toggle("night", night);
    return () => document.documentElement.classList.remove("night");
  }, [night]);

  const renderScene = () => {
    switch (scene) {
      case "intro":
        return <IntroScene initiallyOpened={state.maxReached !== "intro"} onNext={next} />;
      case "memories":
        return <MemoriesScene onNext={next} onBack={back} />;
      case "quiz":
        return <CoupleQuizScene answers={state.quizAnswers} onAnswer={answerQuiz} onNext={next} onBack={back} />;
      case "notes":
        return <LoveNotesScene opened={state.openedNotes} onOpen={openNote} onNext={next} onBack={back} />;
      case "final":
        return (
          <FinalLetterScene
            introDone={state.finalIntroDone}
            giftRevealed={state.giftRevealed}
            onIntroDone={finalIntroDone}
            onRevealGift={revealGift}
            onRestart={restart}
            onBack={back}
          />
        );
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={`min-h-dvh transition-colors duration-[2000ms] ${night ? "bg-night" : "paper bg-cream"}`}>
        <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-[calc(1rem+env(safe-area-inset-top))]">
          <ProgressIndicator current={scene} tone={night ? "night" : "light"} />
          {/* Fuera del AnimatePresence: la música sigue al cambiar de escena. */}
          <div className="pointer-events-auto">
            <MusicToggle music={birthday.music} tone={night ? "night" : "light"} />
          </div>
        </header>

        {/* Se vuelve arriba cuando la escena anterior ya salió, no antes. */}
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
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
