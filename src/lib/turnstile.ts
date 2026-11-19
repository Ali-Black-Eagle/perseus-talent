/**
 * Cloudflare Turnstile verification helper.
 * Active only when TURNSTILE_ENABLED="true" in environment.
 */

export interface TurnstileVerifyResult {
  success: boolean;
  error?: string;
}

export async function verifyTurnstileToken(
  token?: string | null,
  ip?: string
): Promise<TurnstileVerifyResult> {
  const isEnabled = process.env.TURNSTILE_ENABLED === "true";

  // If Turnstile is disabled (e.g. localhost default), bypass check
  if (!isEnabled) {
    return { success: true };
  }

  if (!token || token.trim() === "") {
    return {
      success: false,
      error: "Human verification failed. Please complete the verification challenge.",
    };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error("TURNSTILE_ENABLED is true but TURNSTILE_SECRET_KEY is missing.");
    return { success: false, error: "Verification configuration error." };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const outcome = (await response.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (outcome.success) {
      return { success: true };
    }

    return {
      success: false,
      error: "Verification failed. Please refresh and try again.",
    };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return {
      success: false,
      error: "Verification service temporarily unavailable.",
    };
  }
}
