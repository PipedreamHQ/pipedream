import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "vercel_token_auth-deployment-error-instant",
  name: "Deployment Error (Instant)",
  description: "Emit new event when a deployment encounters an error [See the documentation](https://vercel.com/docs/rest-api/reference/endpoints/webhooks/creates-a-webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.DEPLOYMENT_ERROR,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Deployment Error: ${resource.id}`,
        ts: resource.createdAt,
      };
    },
  },
};
