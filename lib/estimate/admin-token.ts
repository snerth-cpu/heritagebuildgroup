/**
 * Normalize admin secrets from env / headers without logging values.
 * Handles common Vercel dashboard paste issues: whitespace, wrapping quotes, BOM.
 */
export function normalizeAdminToken(raw: string | null | undefined) {
  if (!raw) return "";
  let value = raw.replace(/^\uFEFF/, "").trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

export function adminTokensMatch(provided: string, expected: string) {
  const a = normalizeAdminToken(provided);
  const b = normalizeAdminToken(expected);
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  // Constant-time-ish compare for equal-length strings.
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
