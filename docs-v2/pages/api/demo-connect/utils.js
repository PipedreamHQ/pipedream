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
  const baseString = `${req.headers["user-agent"]}:${req.headers["host"]}:connect-demo`;
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

  // Debug logging to diagnose token validation issues
  console.log("Request headers:", {
    host: req.headers.host,
    origin: req.headers.origin,
    referer: req.headers.referer,
    // Truncate user-agent to avoid huge logs
    userAgent: req.headers["user-agent"]?.substring(0, 50) + "...",
  });

  // Log token information
  console.log("Token comparison:", {
    received: requestToken,
    expected: expectedToken,
    matches: requestToken === expectedToken,
  });

  // If there's a mismatch, decode both tokens to see what's different
  if (requestToken !== expectedToken) {
    try {
      const decodedReceived = Buffer.from(requestToken, "base64").toString();
      const decodedExpected = Buffer.from(expectedToken, "base64").toString();
      console.log("Decoded tokens:", {
        received: decodedReceived,
        expected: decodedExpected,
      });
    } catch (e) {
      console.log("Error decoding tokens:", e.message);
    }
  }

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
