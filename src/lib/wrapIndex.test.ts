import { describe, expect, it } from "vitest";
import { wrapIndex } from "./wrapIndex";

describe("wrapIndex", () => {
  it("deja igual un índice válido", () => {
    expect(wrapIndex(3, 9)).toBe(3);
  });
  it("vuelve al principio después del último", () => {
    expect(wrapIndex(9, 9)).toBe(0);
  });
  it("va al último antes del primero", () => {
    expect(wrapIndex(-1, 9)).toBe(8);
  });
  it("devuelve 0 si no hay elementos", () => {
    expect(wrapIndex(2, 0)).toBe(0);
  });
});
