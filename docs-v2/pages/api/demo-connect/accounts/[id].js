/**
 * API route to fetch account details from Pipedream API
 * Retrieves information about connected accounts for the interactive demo
 */
import { createBackendClient } from "@pipedream/sdk/server";

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
  if (req.method !== "GET") {
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
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Request-Token");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Validate the request
  const validationError = validateRequest(req, res);
  if (validationError) return validationError;

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      error: "Account ID is required",
    });
  }

  try {
    // Initialize the Pipedream SDK client
    const pd = createBackendClient({
      environment: process.env.PIPEDREAM_PROJECT_ENVIRONMENT || "development",
      credentials: {
        clientId: process.env.PIPEDREAM_CLIENT_ID,
        clientSecret: process.env.PIPEDREAM_CLIENT_SECRET,
      },
      projectId: process.env.PIPEDREAM_PROJECT_ID,
    });

    // Fetch the specific account by ID
    const accountDetails = await pd.getAccountById(id);

    // Return the account details
    return res.status(200).json(accountDetails);
  } catch (err) {
    console.error("Error fetching account details:", err);
    return res.status(500).json({
      error: "Failed to fetch account details",
      message: err.message,
    });
  }
}
