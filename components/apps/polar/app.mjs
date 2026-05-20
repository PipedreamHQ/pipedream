javascript
import { defineApp } from "@pipedream/types";

export default defineApp({
  type: "app",
  app: "polar",
  displayName: "Polar.sh",
  description: "Polar.sh is a platform for funding open source projects and maintainers, enabling backers to support maintainers directly or pledge to issues and features.",
  auths: {
    api_key: {
      type: "apikey",
      label: "API Key",
      description: "Your Polar API Key, used for authenticating API requests to Polar.sh. You can generate one in your Polar dashboard under Settings > API Keys.",
      name: "apiKey",
      properties: [
        {
          key: "apiKey",
          label: "API Key",
          type: "string",
          secret: true,
          description: "The API key required to authenticate your requests with the Polar.sh API.",
        },
      ],
    },
    webhook_secret: {
      type: "custom",
      label: "Webhook Signing Secret",
      description: "The Webhook Signing Secret provided by Polar.sh for verifying incoming webhooks. This secret is crucial for securely processing webhook events according to Svix standards.",
      name: "webhookSecret",
      properties: [
        {
          key: "signingSecret",
          label: "Signing Secret",
          type: "string",
          secret: true,
          description: "The secret string used to verify webhook signatures from Polar.sh. This ensures the integrity and authenticity of the webhook payload. Find it in your Polar.sh dashboard under Settings > Webhooks.",
        },
      ],
    },
  },
});