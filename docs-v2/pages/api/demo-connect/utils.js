/**
 * Shared utilities for Connect demo API routes
 */

/**
 * Get allowed origins from environment variables or use defaults
 * This supports Vercel preview deployments with their dynamic URLs
 */
export function getAllowedOrigins() {
  // Get from environment if defined
  const originsFromEnv = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : [];

  // Default allowed origins
  const defaultOrigins = [
    "https://pipedream.com",
    "https://www.pipedream.com",
    "http://localhost:3000", // For local development
  ];

  // Vercel preview deployment support - match any Vercel preview URL
  const vercelPreviewRegexes = [
    // Standard preview URLs: project-branch-username.vercel.app
    /^https:\/\/[a-zA-Z0-9-]+-[a-zA-Z0-9-]+-[a-zA-Z0-9-]+\.vercel\.app$/,
    // Shortened preview URLs: project-username.vercel.app
    /^https:\/\/[a-zA-Z0-9-]+-[a-zA-Z0-9-]+\.vercel\.app$/,
    // Any subdomain on vercel.app (most permissive)
    /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/,
  ];

  return {
    originsList: [
      ...defaultOrigins,
      ...originsFromEnv,
    ],
    regexPatterns: vercelPreviewRegexes,

    // Helper method to check if an origin is allowed
    isAllowed(origin) {
      if (!origin) return false;

      // Check exact matches
      if (this.originsList.includes(origin)) return true;

      // Check regex patterns
      return this.regexPatterns.some((pattern) => pattern.test(origin));
    },
  };
}

// Export the helper for consistent use
export const ALLOWED_ORIGINS = getAllowedOrigins();

/**
 * Generate a browser-specific token based on request properties
 * Used to verify requests are coming from our frontend
 */
export function generateRequestToken(req) {
  // Try to determine the effective host that matches what the client would use
  let effectiveHost = req.headers["host"];

  // First try to use origin header (best match for client's window.location.host)
  if (req.headers.origin) {
    try {
      const originUrl = new URL(req.headers.origin);
      effectiveHost = originUrl.host;
    } catch (e) {
      console.log("Error parsing origin:", e.message);
    }
  }
  // If no origin, try referer (can also contain the original hostname)
  else if (req.headers.referer) {
    try {
      const refererUrl = new URL(req.headers.referer);
      effectiveHost = refererUrl.host;
    } catch (e) {
      console.log("Error parsing referer:", e.message);
    }
  }
  // Fall back to x-forwarded-host which might be set by proxies
  else if (req.headers["x-forwarded-host"]) {
    effectiveHost = req.headers["x-forwarded-host"];
  }

  // For account endpoints specifically, try to extract the host from the requestToken
  // This is a special case for the accounts endpoint where the origin header might be missing
  if (req.url?.includes("/accounts/") && req.headers["x-request-token"]) {
    try {
      const decodedToken = Buffer.from(req.headers["x-request-token"], "base64").toString();
      const parts = decodedToken.split(":");
      // If the token has the expected format with 3 parts, use the host from the token
      if (parts.length === 3) {
        // User-agent:host:connect-demo
        effectiveHost = parts[1];
      }
    } catch (e) {
      console.log("Error extracting host from token:", e.message);
    }
  }

  const baseString = `${req.headers["user-agent"]}:${effectiveHost}:connect-demo`;
  return Buffer.from(baseString).toString("base64");
}

/**
 * Sets CORS headers for API responses
 */
export function setCorsHeaders(req, res, methods = "GET, POST, OPTIONS") {
  // Use the new isAllowed method to check if the origin is allowed
  res.setHeader(
    "Access-Control-Allow-Origin",
    ALLOWED_ORIGINS.isAllowed(req.headers.origin)
      ? req.headers.origin
      : "",
  );
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Request-Token");

  // Set COOP header to allow popups to communicate with the parent window
  // This is important for OAuth flows in the Connect integration
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
}

/**
 * Validates if a request comes from an allowed source
 * Performs checks on origin, referer, and request token
 */
export function validateRequest(req, res, allowedMethod) {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const requestToken = req.headers["x-request-token"];

  // Origin validation
  if (origin && !ALLOWED_ORIGINS.isAllowed(origin)) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  // Referer validation for docs context
  if (referer) {
    // Extract the origin part of the referer URL (protocol + hostname)
    let refererOrigin;
    try {
      // Try to parse the referer as a URL
      const refererUrl = new URL(referer);
      refererOrigin = refererUrl.origin;
    } catch (e) {
      // If parsing fails, construct it manually
      const parts = referer.split("/");
      if (parts.length >= 3) {
        refererOrigin = parts[0] + "//" + parts[2];
      }
    }

    // Check if the referer origin is allowed
    const isRefererAllowed =
      // Check if referer matches allowed origins list
      ALLOWED_ORIGINS.originsList.some((allowed) => referer.startsWith(allowed)) ||
      // Check if referer origin matches any regex pattern
      (refererOrigin &&
        ALLOWED_ORIGINS.regexPatterns.some((pattern) =>
          pattern.test(refererOrigin))
      ) ||
      // Allow if it contains the docs path
      referer.includes("/docs/connect/");

    if (!isRefererAllowed) {
      return res.status(403).json({
        error: "Access denied",
      });
    }
  }

  // Request token validation to prevent API automation
  const expectedToken = generateRequestToken(req);

  if (!requestToken || requestToken !== expectedToken) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  // Method validation
  if (req.method !== allowedMethod && req.method !== "OPTIONS") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  // All security checks passed
  return null;
}

/**
 * Common handler for API requests with validation and CORS
 */
export function createApiHandler(handler, allowedMethod) {
  return async (req, res) => {
    // Set CORS headers
    setCorsHeaders(req, res, allowedMethod === "GET"
      ? "GET, OPTIONS"
      : "POST, OPTIONS");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // Validate the request
    const validationError = validateRequest(req, res, allowedMethod);
    if (validationError) return validationError;

    // Call the actual handler
    return handler(req, res);
  };
}
