// Search for apps in the Pipedream API

import { createApiHandler } from "./utils";

/**
 * Handler for searching apps
 */
async function appsHandler(req, res) {
  try {
    const {
      q, limit = 50,
    } = req.query;

    // Build the query parameters
    const params = new URLSearchParams();
    if (q) params.append("q", q);
    params.append("limit", String(limit));
    params.append("has_actions", "1"); // Only apps with components

    // First get an OAuth token
    const tokenResponse = await fetch(
      "https://api.pipedream.com/v1/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "client_credentials",
          client_id: process.env.PIPEDREAM_CLIENT_ID,
          client_secret: process.env.PIPEDREAM_CLIENT_SECRET,
        }),
      },
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to authenticate");
    }

    const { access_token } = await tokenResponse.json();

    // Now search for apps
    const appsResponse = await fetch(
      `https://api.pipedream.com/v1/apps?${params.toString()}`,
      {
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!appsResponse.ok) {
      throw new Error("Failed to fetch apps");
    }

    const appsData = await appsResponse.json();

    // Format the response with the fields we need
    const formattedApps = appsData.data.map((app) => ({
      id: app.id,
      name: app.name,
      name_slug: app.name_slug,
      description: app.description,
      icon: app.img_src,
      categories: app.categories || [],
    }));

    return res.status(200).json({
      apps: formattedApps,
      total_count: appsData.page_info?.total_count || formattedApps.length,
    });
  } catch (error) {
    console.error("Error searching apps:", error);
    return res.status(500).json({
      error: "Failed to search apps",
      details: error.message,
    });
  }
}

// Export the handler wrapped with security checks
export default createApiHandler(appsHandler, "GET");
