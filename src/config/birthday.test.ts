import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { birthday } from "./birthday";

const publicPath = (src: string) => path.join(process.cwd(), "public", src);

describe("birthday config", () => {
  it("cada foto de recuerdos existe en public/ y tiene epígrafe y alt", () => {
    expect(birthday.memories.photos.length).toBeGreaterThanOrEqual(8);
    for (const photo of birthday.memories.photos) {
      expect(fs.existsSync(publicPath(photo.src)), photo.src).toBe(true);
      expect(photo.caption.trim()).not.toBe("");
      expect(photo.alt.trim()).not.toBe("");
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    }
  });

  it("la foto favorita, si está configurada, existe", () => {
    const fav = birthday.final.favoritePhoto;
    if (fav) expect(fs.existsSync(publicPath(fav.src)), fav.src).toBe(true);
  });

  it("el quiz tiene entre 4 y 5 preguntas con ids únicos", () => {
    const ids = birthday.quiz.questions.map((q) => q.id);
    expect(ids.length).toBeGreaterThanOrEqual(4);
    expect(ids.length).toBeLessThanOrEqual(5);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada pregunta tiene de 2 a 4 opciones y reacción para cualquier respuesta", () => {
    for (const q of birthday.quiz.questions) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(q.options.length, q.id).toBeLessThanOrEqual(4);
      expect(new Set(q.options.map((o) => o.id)).size, q.id).toBe(q.options.length);
      if (q.correctOptionId) {
        expect(q.options.some((o) => o.id === q.correctOptionId), q.id).toBe(true);
        expect(q.correctReaction?.trim(), q.id).toBeTruthy();
        expect(q.missReaction?.trim(), q.id).toBeTruthy();
      } else {
        for (const o of q.options) expect(o.reaction?.trim(), `${q.id}/${o.id}`).toBeTruthy();
      }
    }
  });

  it("hay 8 cartitas con ids únicos y mensaje", () => {
    const { items } = birthday.notes;
    expect(items).toHaveLength(8);
    expect(new Set(items.map((n) => n.id)).size).toBe(8);
    for (const n of items) expect(n.message.trim()).not.toBe("");
  });

  it("la carta tiene párrafos no vacíos y hay mensaje final", () => {
    expect(birthday.final.letter.length).toBeGreaterThan(0);
    for (const p of birthday.final.letter) expect(p.trim()).not.toBe("");
    expect(birthday.final.giftMessage.text.trim()).not.toBe("");
  });

  it("si hay música configurada, el archivo existe", () => {
    if (birthday.music) expect(fs.existsSync(publicPath(birthday.music.src))).toBe(true);
  });
});
