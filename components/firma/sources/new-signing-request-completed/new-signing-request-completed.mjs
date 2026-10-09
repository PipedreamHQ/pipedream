import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "firma-new-signing-request-completed",
  name: "New Signing Request Completed (Instant)",
  description: "Triggers when a signing request is completed by all signers. [See the documentation](https://docs.firma.dev/api-reference/webhooks/overview)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "signing_request.completed",
      ];
    },
    generateMeta(event) {
      const sr = event?.data || event;
      const id = event?.id || sr?.id;
      const name = sr?.name || id;
      return {
        id,
        summary: `Signing Request Completed: ${name}`,
        ts: Date.parse(event?.created_at || sr?.created_on) || Date.now(),
      };
    },
  },
};
