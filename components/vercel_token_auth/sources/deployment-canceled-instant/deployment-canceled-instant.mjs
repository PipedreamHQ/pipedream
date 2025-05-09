import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "vercel_token_auth-deployment-canceled-instant",
  name: "Deployment Canceled (Instant)",
  description: "Emit new event when a deployment is canceled [See the documentation](https://vercel.com/docs/rest-api/reference/endpoints/webhooks/creates-a-webhook).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        events.DEPLOYMENT_CANCELED,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `Deployment Canceled: ${resource.id}`,
        ts: resource.createdAt,
      };
    },
  },
};
