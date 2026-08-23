const xpFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
});

const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const ratingFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Formats an XP amount in pt-BR, without currency: `1248` -> `"1.248 XP"`. */
export function formatXp(points: number): string {
  return `${xpFormatter.format(points)} XP`;
}

/** Formats a BRL amount in pt-BR: `38` -> `"R$ 38,00"`. */
export function formatBRL(amount: number): string {
  return brlFormatter.format(amount);
}

/** Formats a rating with one decimal in pt-BR: `4.8` -> `"4,8"`. */
export function formatRating(value: number): string {
  return ratingFormatter.format(value);
}

/** Formats a duration in milliseconds as `mm:ss` (floored to whole seconds). */
export function formatMmSs(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

/** Formats a date as `DD/MM` (pt-BR short day/month). */
export function formatDayMonth(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}
