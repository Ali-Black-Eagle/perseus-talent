/**
 * Works out the visitor's IP address for rate limiting.
 *
 * On Netlify, `x-nf-client-connection-ip` is set by Netlify's edge from the real TCP connection and
 * cannot be forged by the visitor. `X-Forwarded-For` can: a client may send its own value, and taking
 * its first entry would let anyone dodge the rate limit by sending a new fake IP with each request.
 * So the Netlify header always wins, and X-Forwarded-For is only a fallback for local development,
 * tests and other hosts.
 */
export function getClientIp(headers: Headers): string {
  const netlify = headers.get("x-nf-client-connection-ip")?.trim();
  if (netlify) return netlify;

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "127.0.0.1";
}

/**
 * Rejects a request whose declared body is larger than `maxBytes` before the body is read into memory.
 * Returns true when the request is too large.
 */
export function isBodyTooLarge(headers: Headers, maxBytes: number): boolean {
  const declared = Number(headers.get("content-length"));
  return Number.isFinite(declared) && declared > maxBytes;
}
