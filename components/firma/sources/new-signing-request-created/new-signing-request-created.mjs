import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "firma-new-signing-request-created",
  name: "New Signing Request Created (Instant)",
  description: "Triggers when a new signing request is created. [See the documentation](https://docs.firma.dev/api-reference/webhooks/overview)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "signing_request.created",
      ];
    },
    generateMeta(event) {
      const sr = event?.data || event;
      const id = event?.id || sr?.id;
      const name = sr?.name || id;
      return {
        id,
        summary: `Signing Request Created: ${name}`,
        ts: Date.parse(event?.created_at || sr?.created_on) || Date.now(),
      };
    },
  },
};
