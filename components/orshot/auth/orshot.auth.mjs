export default {
  type: "api_key",
  key: "orshot",
  name: "Orshot",
  description:
    "API key authentication for Orshot - Generate dynamic images from templates",
  authProps: {
    token: {
      type: "string",
      label: "API Token",
      description:
        "Your Orshot API token. You can find this in your Orshot workspace settings under API Key.",
      secret: true,
    },
    domain: {
      type: "string",
      label: "API Domain",
      description: "The Orshot API domain",
      default: "https://api.orshot.com",
      optional: true,
    },
  },
  async test({ auth }) {
    const response = await fetch(
      `${auth.domain || "https://api.orshot.com"}/v1/me/user_id`,
      {
        headers: {
          "Authorization": `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Authentication failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  },
};
