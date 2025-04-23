// API route to fetch account details from Pipedream API
import { createBackendClient } from "@pipedream/sdk/server";

export default async function handler(req, res) {
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
