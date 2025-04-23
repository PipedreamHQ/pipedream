// API route for generating Connect tokens for demonstration purposes
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

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
        allowed_origins: [
          req.headers.origin || "https://pipedream.com",
        ],
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
