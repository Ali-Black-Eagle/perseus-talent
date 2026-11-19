/**
 * In-memory sliding-window rate limiter for enquiry submissions.
 * Limit: 5 submissions per 10 minutes per IP.
 *
 * IMPORTANT (serverless hosting such as Netlify): the counters live in this function instance's
 * memory only. Instances are started and stopped on demand and several may run side by side, so
 * the limit is NOT shared or persistent there. It still stops a burst hitting a single warm
 * instance and costs nothing, so it is kept as a harmless extra layer. The real spam defences
 * on the live site are the honeypot field, the minimum time-to-submit check and Cloudflare
 * Turnstile (TURNSTILE_ENABLED=true).
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipRecords = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 15 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    const cutoff = now - 15 * 60 * 1000;
    for (const [ip, record] of ipRecords.entries()) {
      const active = record.timestamps.filter((ts) => ts > cutoff);
      if (active.length === 0) {
        ipRecords.delete(ip);
      } else {
        record.timestamps = active;
      }
    }
  }, 15 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  ip: string,
  maxRequests: number = ip === "127.0.0.1" || ip === "::1" ? 50 : 5,
  windowMs: number = 10 * 60 * 1000 // 10 minutes
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  const record = ipRecords.get(ip) || { timestamps: [] };
  // Keep only timestamps within window
  const recent = record.timestamps.filter((ts) => ts > cutoff);

  if (recent.length >= maxRequests) {
    const oldest = recent[0];
    const resetTime = oldest + windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetTime,
    };
  }

  recent.push(now);
  ipRecords.set(ip, { timestamps: recent });

  return {
    allowed: true,
    remaining: maxRequests - recent.length,
    resetTime: now + windowMs,
  };
}
