import { describe, expect, it } from "vitest";
import { daysTogether } from "./daysTogether";

describe("daysTogether", () => {
  it("cuenta los días entre el inicio y hoy", () => {
    expect(daysTogether("2023-07-16", new Date(2023, 6, 17, 9, 0))).toBe(1);
    expect(daysTogether("2023-07-16", new Date(2026, 9, 17, 23, 59))).toBe(1189);
  });

  it("da 0 el mismo día", () => {
    expect(daysTogether("2023-07-16", new Date(2023, 6, 16, 23, 0))).toBe(0);
  });

  it("devuelve null si falta la fecha", () => {
    expect(daysTogether(undefined, new Date())).toBeNull();
    expect(daysTogether("", new Date())).toBeNull();
  });

  it("devuelve null si la fecha es inválida", () => {
    expect(daysTogether("16/07/2023", new Date())).toBeNull();
    expect(daysTogether("2023-13-40", new Date())).toBeNull();
  });

  it("devuelve null si la fecha es futura", () => {
    expect(daysTogether("2030-01-01", new Date(2026, 9, 17))).toBeNull();
  });
});
