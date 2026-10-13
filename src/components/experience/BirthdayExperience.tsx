"use client";

import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { birthday } from "@/config/birthday";
import { EASE_OUT } from "@/lib/motion";
import { experienceReducer, initialState } from "@/state/experience";
import { CoupleQuizScene } from "./CoupleQuizScene";
import { FinalLetterScene } from "./FinalLetterScene";
import { IntroScene } from "./IntroScene";
import { LoveNotesScene } from "./LoveNotesScene";
import { MemoriesScene } from "./MemoriesScene";

// `direction` vale 1 al avanzar y -1 al volver: la escena que sale se va hacia donde
// "queda" en el recorrido y la que entra llega desde el lado contrario.
// La salida es más corta que la entrada: responde al toque y deja lugar a lo que viene.
const sceneVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, y: 30 * direction, scale: 0.985 }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT, opacity: { duration: 0.5, ease: "easeOut" } },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: -18 * direction,
    scale: 0.99,
    transition: { duration: 0.26, ease: "easeOut" },
  }),
};

export function BirthdayExperience() {
  const [state, dispatch] = useReducer(experienceReducer, initialState);
  const { scene } = state;
  const night = scene === "final";
  // La primera escena llega ya dibujada desde el servidor: no se anima su entrada.
  const [navigated, setNavigated] = useState(false);
  const [direction, setDirection] = useState(1);
  const mainRef = useRef<HTMLElement>(null);

  const leave = useCallback((nextDirection: number) => {
    // La escena puede medir varias pantallas: se escala desde lo que se está viendo, no desde su centro.
    if (mainRef.current) {
      mainRef.current.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`;
    }
    setNavigated(true);
    setDirection(nextDirection);
  }, []);

  // `from` hace que un toque sobre una escena que ya está saliendo no tenga efecto.
  const next = useCallback(() => {
    leave(1);
    dispatch({ type: "next", from: scene });
  }, [leave, scene]);
  const back = useCallback(() => {
    leave(-1);
    dispatch({ type: "back", from: scene });
  }, [leave, scene]);
  const answerQuiz = useCallback(
    (questionId: string, optionId: string) => dispatch({ type: "answerQuiz", questionId, optionId }),
    [],
  );
  const openNote = useCallback((noteId: string) => dispatch({ type: "openNote", noteId }), []);
  const finalIntroDone = useCallback(() => dispatch({ type: "finalIntroDone" }), []);
  const revealGift = useCallback(() => dispatch({ type: "revealGift" }), []);
  const restart = useCallback(() => {
    leave(1);
    dispatch({ type: "restart" });
  }, [leave]);

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
        <AnimatePresence mode="wait" custom={direction} onExitComplete={() => window.scrollTo(0, 0)}>
          <motion.main
            key={scene}
            ref={mainRef}
            custom={direction}
            variants={sceneVariants}
            initial={navigated ? "enter" : false}
            animate="center"
            exit="exit"
            style={{ transformOrigin: "50% 50vh" }}
          >
            {renderScene()}
          </motion.main>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
