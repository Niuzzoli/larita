const MS_PER_DAY = 86_400_000;

/** Días completos desde `startIso` (AAAA-MM-DD) hasta `now`. Null si la fecha falta, es inválida o futura. */
export function daysTogether(startIso: string | undefined, now: Date): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(startIso ?? "");
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const start = new Date(year, month - 1, day);
  if (start.getFullYear() !== year || start.getMonth() !== month - 1 || start.getDate() !== day) {
    return null;
  }
  // Se compara en UTC para que el horario de verano no mueva la cuenta.
  const startDay = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((today - startDay) / MS_PER_DAY);
  return days < 0 ? null : days;
}
