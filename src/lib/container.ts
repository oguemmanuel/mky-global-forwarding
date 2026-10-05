/**
 * ISO 6346 container number helpers.
 * A container number is 4 letters (owner code + category, usually "U"), 6 digits and a check digit,
 * e.g. MSKU 123456 7. We validate it so typos are caught before a tracking lookup.
 */

const LETTER_VALUES: Record<string, number> = (() => {
  const values: Record<string, number> = {};
  let v = 10;
  for (const ch of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
    if (v % 11 === 0) v++; // skip multiples of 11
    values[ch] = v++;
  }
  return values;
})();

export function checkDigit(first10: string): number {
  const s = first10.toUpperCase();
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const ch = s[i];
    const val = /[0-9]/.test(ch) ? Number(ch) : LETTER_VALUES[ch];
    sum += val * 2 ** i;
  }
  return (sum % 11) % 10;
}

export function isContainerNumber(input: string) {
  const s = input.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{3}[UJZ][0-9]{7}$/.test(s)) return false;
  return checkDigit(s.slice(0, 10)) === Number(s[10]);
}

/** Format as "MKYU 123456 7" */
export function formatContainer(input: string) {
  const s = input.replace(/\s+/g, "").toUpperCase();
  return `${s.slice(0, 4)} ${s.slice(4, 10)} ${s.slice(10)}`;
}

export function withCheckDigit(first10: string) {
  return `${first10}${checkDigit(first10)}`;
}
