import { describe, expect, it } from "vitest";
import type { QuizQuestion } from "@/types/birthday";
import { FALLBACK_REACTION, getReaction } from "./quiz";

const factual: QuizQuestion = {
  id: "q",
  question: "¿?",
  options: [
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ],
  correctOptionId: "b",
  correctReaction: "¡Bien!",
  missReaction: "Era B.",
};

const humor: QuizQuestion = {
  id: "h",
  question: "¿?",
  options: [
    { id: "a", label: "A", reaction: "Reacción A" },
    { id: "b", label: "B" },
  ],
};

describe("getReaction", () => {
  it("al acertar devuelve la reacción de acierto y no marca ninguna opción", () => {
    expect(getReaction(factual, "b")).toEqual({ text: "¡Bien!" });
  });

  it("al no acertar devuelve la reacción cariñosa y cuál era la correcta", () => {
    expect(getReaction(factual, "a")).toEqual({ text: "Era B.", correctOptionId: "b" });
  });

  it("en preguntas de humor devuelve la reacción de la opción elegida", () => {
    expect(getReaction(humor, "a")).toEqual({ text: "Reacción A" });
  });

  it("usa un texto de respaldo si la config quedó incompleta", () => {
    expect(getReaction(humor, "b")).toEqual({ text: FALLBACK_REACTION });
    expect(getReaction({ ...factual, correctReaction: "" }, "b")).toEqual({ text: FALLBACK_REACTION });
    expect(getReaction({ ...factual, missReaction: undefined }, "a")).toEqual({
      text: FALLBACK_REACTION,
      correctOptionId: "b",
    });
  });
});
