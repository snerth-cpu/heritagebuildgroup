type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

export type RateLimitOptions = {
  windowMs?: number;
  max?: number;
};

/** Simple in-memory rate limit (per serverless instance). Good first line of defense with honeypot + time-trap. */
export function checkRateLimit(
  key: string,
  options?: RateLimitOptions,
): { ok: true } | { ok: false; retryAfterSec: number } {
  const windowMs = options?.windowMs ?? WINDOW_MS;
  const max = options?.max ?? MAX_REQUESTS;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (existing.count >= max) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }

  existing.count += 1;
  buckets.set(key, existing);
  return { ok: true };
}

export function clientKeyFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  // Truncate to reduce PII surface in logs; enough for rate limiting.
  return `ip:${ip.slice(0, 64)}`;
}
