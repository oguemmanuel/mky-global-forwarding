/**
 * Vehicle Identification Number (VIN) helpers, ISO 3779.
 * A VIN is 17 characters: digits and capital letters except I, O and Q.
 * European VINs do not use a mandatory check digit, so we validate format only.
 */

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

export const normaliseVin = (input: string) => input.replace(/[\s-]+/g, "").toUpperCase();

export function vinProblem(input: string): string | null {
  const v = normaliseVin(input);
  if (v.length !== 17) return `A VIN has 17 characters; this one has ${v.length}.`;
  if (/[IOQ]/.test(v)) return "VINs never contain the letters I, O or Q. Check for a 1 or 0 instead.";
  if (!VIN_RE.test(v)) return "Use only letters and numbers.";
  return null;
}

export const isVin = (input: string) => vinProblem(input) === null;

/** Region of manufacture from the first character of the World Manufacturer Identifier */
export function vinRegion(input: string): string | null {
  const c = normaliseVin(input)[0];
  if (!c) return null;
  if ("ABCDEFGH".includes(c)) return "Africa";
  if ("JKLMNPR".includes(c)) return "Asia";
  if ("STUVWXYZ".includes(c)) return "Europe";
  if ("12345".includes(c)) return "North America";
  if ("67".includes(c)) return "Oceania";
  if ("89".includes(c)) return "South America";
  return null;
}

/** "VF7DEMXXX00000001" -> "VF7 DEMXXX 00000001" (WMI · VDS · VIS), easier to read aloud */
export const formatVin = (input: string) => {
  const v = normaliseVin(input);
  return `${v.slice(0, 3)} ${v.slice(3, 9)} ${v.slice(9)}`;
};
