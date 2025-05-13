import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "vercel_token_auth-new-deployment-instant",
  name: "New Deployment (Instant)",
  description: "Emit new event when a deployment is created [See the documentation](https://vercel.com/docs/rest-api/reference/endpoints/webhooks/creates-a-webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.DEPLOYMENT_CREATED,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Deployment: ${resource.id}`,
        ts: resource.createdAt,
      };
    },
  },
};
