import type { QuizQuestion } from "@/types/birthday";

/** Se muestra solo si alguien dejó una reacción vacía al editar la config. */
export const FALLBACK_REACTION = "♡";

export interface Reaction {
  text: string;
  /** Presente solo cuando había respuesta correcta y se eligió otra. */
  correctOptionId?: string;
}

export function getReaction(question: QuizQuestion, optionId: string): Reaction {
  const { correctOptionId } = question;
  if (!correctOptionId) {
    const option = question.options.find((o) => o.id === optionId);
    return { text: option?.reaction?.trim() || FALLBACK_REACTION };
  }
  if (optionId === correctOptionId) {
    return { text: question.correctReaction?.trim() || FALLBACK_REACTION };
  }
  return { text: question.missReaction?.trim() || FALLBACK_REACTION, correctOptionId };
}
