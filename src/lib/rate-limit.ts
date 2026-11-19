/**
 * In-memory sliding-window rate limiter for enquiry submissions.
 * Limit: 5 submissions per 10 minutes per IP.
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
  maxRequests: number = 5,
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
