/**
 * API route for generating Connect tokens for the interactive demo
 * This endpoint creates short-lived tokens for testing the Pipedream Connect auth flow
 */

// Allowed origins for CORS security
const ALLOWED_ORIGINS = [
  "https://pipedream.com",
  "https://www.pipedream.com",
  "http://localhost:3000",  // For local development
];

/**
 * Generate a browser-specific token based on request properties
 * Used to verify requests are coming from our frontend
 */
function generateRequestToken(req) {
  const baseString = `${req.headers["user-agent"]}:${req.headers["host"]}:connect-demo`;
  return Buffer.from(baseString).toString("base64");
}

/**
 * Security middleware to validate requests
 * Ensures requests only come from our documentation site
 */
function validateRequest(req, res) {
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
  if (referer && !ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed)) &&
      !referer.includes("/docs/connect/")) {
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
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  // All security checks passed
  return null;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGINS.includes(req.headers.origin)
    ? req.headers.origin
    : "");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Request-Token");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Validate the request
  const validationError = validateRequest(req, res);
  if (validationError) return validationError;

  try {
    const { external_user_id } = req.body;

    if (!external_user_id) {
      return res.status(400).json({
        error: "external_user_id is required",
      });
    }

    // First, obtain an OAuth access token
    const tokenResponse = await fetch("https://api.pipedream.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: process.env.PIPEDREAM_CLIENT_ID,
        client_secret: process.env.PIPEDREAM_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return res.status(500).json({
        error: "Failed to authenticate with Pipedream API",
        details: errorData,
      });
    }

    const { access_token } = await tokenResponse.json();

    // Use the access token to create a Connect token
    const connectTokenResponse = await fetch(`https://api.pipedream.com/v1/connect/${process.env.PIPEDREAM_PROJECT_ID}/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-PD-Environment": process.env.PIPEDREAM_PROJECT_ENVIRONMENT || "development",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        external_user_id,
        allowed_origins: ALLOWED_ORIGINS,
        webhook_uri: process.env.PIPEDREAM_CONNECT_TOKEN_WEBHOOK_URI,
        success_redirect_uri: process.env.PIPEDREAM_CONNECT_SUCCESS_REDIRECT_URI,
        error_redirect_uri: process.env.PIPEDREAM_CONNECT_ERROR_REDIRECT_URI,
      }),
    });

    if (!connectTokenResponse.ok) {
      const errorData = await connectTokenResponse.json();
      return res.status(500).json({
        error: "Failed to create Connect token",
        details: errorData,
      });
    }

    const connectTokenData = await connectTokenResponse.json();
    return res.status(200).json({
      token: connectTokenData.token,
      expires_at: connectTokenData.expires_at,
      connect_link_url: connectTokenData.connect_link_url,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create token",
      message: error.message,
    });
  }
}
