"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { birthday } from "@/config/birthday";
import { Burst } from "@/components/ui/Burst";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SceneShell } from "@/components/ui/SceneShell";
import { getReaction } from "@/lib/quiz";

interface CoupleQuizSceneProps {
  answers: Record<string, string>;
  onAnswer: (questionId: string, optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CoupleQuizScene({ answers, onAnswer, onNext, onBack }: CoupleQuizSceneProps) {
  const { quiz } = birthday;
  const total = quiz.questions.length;

  // Al volver a la escena se retoma en la primera pregunta sin responder (o en el resultado).
  const [step, setStep] = useState(() => {
    const firstUnanswered = quiz.questions.findIndex((q) => answers[q.id] === undefined);
    return firstUnanswered === -1 ? total : firstUnanswered;
  });

  // La tarjeta con la que se entra a la escena no anima su entrada; las siguientes sí.
  // (AnimatePresence initial={false} apagaría también la animación de la primera reacción.)
  const [moved, setMoved] = useState(false);
  const goNext = () => {
    setMoved(true);
    setStep(step + 1);
  };

  const question = quiz.questions[step];
  const chosen = question ? answers[question.id] : undefined;
  const reaction = question && chosen !== undefined ? getReaction(question, chosen) : null;
  const done = step >= total;
  const answered = Math.min(step + (chosen !== undefined ? 1 : 0), total);

  return (
    <SceneShell heading={quiz.title} onBack={onBack}>
      <div
        role="progressbar"
        aria-label="Avance del juego"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
        className="mt-5 h-2 overflow-hidden rounded-full bg-plum/15"
      >
        <div
          className="h-full origin-left rounded-full bg-rose transition-transform duration-500"
          style={{ transform: `scaleX(${answered / total})` }}
        />
      </div>

      <AnimatePresence mode="wait">
        {done ? (
          <motion.div
            key="result"
            initial={moved ? { opacity: 0, scale: 0.96 } : false}
            animate={{ opacity: 1, scale: 1 }}
            className="relative mt-10 flex flex-1 flex-col items-center justify-center gap-8 text-center"
          >
            {moved && <Burst />}
            <p className="max-w-md font-serif text-3xl leading-snug text-balance">{quiz.result}</p>
            <PrimaryButton onClick={onNext}>{quiz.continueLabel}</PrimaryButton>
          </motion.div>
        ) : (
          <motion.div
            key={question.id}
            initial={moved ? { opacity: 0, x: 24 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-2xl bg-white p-5 shadow-[0_14px_28px_-16px_rgba(87,57,77,0.35)]"
          >
            <p className="font-hand text-xl text-rose-deep">
              Pregunta {step + 1} de {total}
            </p>
            <h2 className="mt-1 font-serif text-2xl leading-snug">{question.question}</h2>

            <div className="mt-5 grid gap-3">
              {question.options.map((option) => {
                const isChosen = chosen === option.id;
                const isCorrectHint = reaction?.correctOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={chosen !== undefined}
                    aria-pressed={isChosen}
                    onClick={() => onAnswer(question.id, option.id)}
                    className={`min-h-12 rounded-xl border-2 px-4 py-3 text-left text-base font-medium transition-colors ${
                      isChosen
                        ? "border-plum bg-blush"
                        : isCorrectHint
                          ? "border-dashed border-rose-deep bg-cream"
                          : "border-plum/15 bg-cream disabled:opacity-60"
                    }`}
                  >
                    {option.label}
                    {isCorrectHint && <span className="ml-2 font-hand text-lg text-rose-deep">← era esta</span>}
                  </button>
                );
              })}
            </div>

            {/* Altura reservada para que la reacción no empuje el contenido. */}
            <div className="relative mt-5 min-h-32" aria-live="polite">
              {reaction && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="flex flex-col items-start gap-4"
                >
                  <Burst count={6} />
                  <p className="font-hand text-2xl leading-tight">{reaction.text}</p>
                  <PrimaryButton onClick={goNext}>
                    {step + 1 === total ? quiz.resultLabel : quiz.nextLabel}
                    <ArrowRight size={18} aria-hidden />
                  </PrimaryButton>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
