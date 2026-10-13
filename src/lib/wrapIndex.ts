/** Índice circular: después del último viene el primero y antes del primero, el último. */
export function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}
