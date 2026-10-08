// Advance widths (in em) of uppercase glyphs in the display font, Syne
// ExtraBold with `tracking-tight`, measured in the browser.
const GLYPH_EM: Record<string, number> = {
  A: 1.135, B: 1.115, C: 1.291, D: 1.277, E: 1.115, F: 1.103, G: 1.315, H: 1.255, I: 0.395,
  J: 0.979, K: 1.19, L: 0.918, M: 1.555, N: 1.275, O: 1.305, P: 1.152, Q: 1.305, R: 1.207,
  S: 1.031, T: 1.075, U: 1.264, V: 1.135, W: 1.857, X: 1.115, Y: 1.045, Z: 1.175,
  "0": 1.041, "1": 0.504, "2": 0.978, "3": 1.03, "4": 1.069, "5": 0.99, "6": 1.108,
  "7": 1.128, "8": 1.056, "9": 1.133, "&": 1.195, ".": 0.329, "-": 0.565, "'": 0.275,
};
const UNKNOWN_EM = 1.6;
/** Widest glyph ScrambleText may show in place of a letter (see its GLYPHS). */
export const SCRAMBLE_MAX_EM = 1.15;
const SAFETY = 1.04;

function wordEm(word: string) {
  let em = 0;
  for (const ch of word.toUpperCase()) {
    // Mid-scramble a slot shows either the real glyph or a random one.
    em += Math.max(GLYPH_EM[ch] ?? UNKNOWN_EM, SCRAMBLE_MAX_EM);
  }
  return em;
}

/**
 * Font size for a big uppercase title that must never overflow: scales with
 * the nearest `@container` width so its widest word fits on one line, and is
 * capped at `maxRem`. Multi-word titles still wrap between words.
 */
export function fitTitle(title: string, maxRem: number) {
  const widest = Math.max(...title.split(/\s+/).map(wordEm));
  return `min(${maxRem}rem, ${(100 / (widest * SAFETY)).toFixed(2)}cqw)`;
}
