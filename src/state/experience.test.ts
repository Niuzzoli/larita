import { describe, expect, it } from "vitest";
import { experienceReducer, initialState, type ExperienceState } from "./experience";

const at = (overrides: Partial<ExperienceState>): ExperienceState => ({ ...initialState, ...overrides });

describe("experienceReducer", () => {
  it("empieza en la caja", () => {
    expect(initialState.scene).toBe("intro");
    expect(initialState.maxReached).toBe("intro");
  });

  it("next avanza una escena y actualiza maxReached", () => {
    const s = experienceReducer(initialState, { type: "next", from: "intro" });
    expect(s.scene).toBe("memories");
    expect(s.maxReached).toBe("memories");
  });

  it("ignora un segundo next disparado desde la escena anterior (doble toque)", () => {
    const once = experienceReducer(initialState, { type: "next", from: "intro" });
    const twice = experienceReducer(once, { type: "next", from: "intro" });
    expect(twice).toBe(once);
  });

  it("next no hace nada en la última escena", () => {
    const s = at({ scene: "final", maxReached: "final" });
    expect(experienceReducer(s, { type: "next", from: "final" })).toBe(s);
  });

  it("back retrocede sin bajar maxReached", () => {
    const s = experienceReducer(at({ scene: "quiz", maxReached: "notes" }), { type: "back", from: "quiz" });
    expect(s.scene).toBe("memories");
    expect(s.maxReached).toBe("notes");
  });

  it("back no hace nada en la primera escena ni desde otra escena", () => {
    expect(experienceReducer(initialState, { type: "back", from: "intro" })).toBe(initialState);
    const s = at({ scene: "quiz", maxReached: "quiz" });
    expect(experienceReducer(s, { type: "back", from: "notes" })).toBe(s);
  });

  it("volver y avanzar de nuevo conserva maxReached", () => {
    const s = experienceReducer(at({ scene: "memories", maxReached: "notes" }), { type: "next", from: "memories" });
    expect(s.scene).toBe("quiz");
    expect(s.maxReached).toBe("notes");
  });

  it("guarda solo la primera respuesta de cada pregunta", () => {
    const first = experienceReducer(initialState, { type: "answerQuiz", questionId: "q1", optionId: "a" });
    const second = experienceReducer(first, { type: "answerQuiz", questionId: "q1", optionId: "b" });
    expect(second).toBe(first);
    expect(second.quizAnswers).toEqual({ q1: "a" });
  });

  it("openNote es idempotente y conserva el orden", () => {
    let s = experienceReducer(initialState, { type: "openNote", noteId: "2" });
    s = experienceReducer(s, { type: "openNote", noteId: "1" });
    const again = experienceReducer(s, { type: "openNote", noteId: "2" });
    expect(again).toBe(s);
    expect(s.openedNotes).toEqual(["2", "1"]);
  });

  it("finalIntroDone y revealGift marcan sus banderas", () => {
    let s = experienceReducer(initialState, { type: "finalIntroDone" });
    s = experienceReducer(s, { type: "revealGift" });
    expect(s.finalIntroDone).toBe(true);
    expect(s.giftRevealed).toBe(true);
  });

  it("restart vuelve al estado inicial", () => {
    const s = at({
      scene: "final",
      maxReached: "final",
      quizAnswers: { q1: "a" },
      openedNotes: ["1"],
      finalIntroDone: true,
      giftRevealed: true,
    });
    expect(experienceReducer(s, { type: "restart" })).toEqual(initialState);
  });
});
