/**
 * Shared utilities for Connect demo API routes
 */

// Allowed origins for CORS security
export const ALLOWED_ORIGINS = [
  "https://pipedream.com",
  "https://www.pipedream.com",
  "http://localhost:3000", // For local development
];

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
  res.setHeader(
    "Access-Control-Allow-Origin",
    ALLOWED_ORIGINS.includes(req.headers.origin)
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
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({
      error: "Access denied",
    });
  }

  // Referer validation
  if (
    referer &&
    !ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed)) &&
    !referer.includes("/docs/connect/")
  ) {
    return res.status(403).json({
      error: "Access denied",
    });
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
