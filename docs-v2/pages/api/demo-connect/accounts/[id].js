/**
 * API route to fetch account details from Pipedream API
 * Retrieves information about connected accounts for the interactive demo
 */
import { createBackendClient } from "@pipedream/sdk/server";
import { createApiHandler } from "../utils";

/**
 * Handler for account details retrieval
 */
async function accountHandler(req, res) {
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
    return res.status(500).json({
      error: "Failed to fetch account details",
    });
  }
}

// Export the handler with validation and CORS
export default createApiHandler(accountHandler, "GET");
