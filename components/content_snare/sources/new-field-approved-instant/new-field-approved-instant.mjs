import common from "../common/webhook.mjs";
import subscription from "../common/subscription.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "content_snare-new-field-approved-instant",
  name: "New Field Approved (Instant)",
  description: "Emit new event when a field is approved in Content Snare. [See the documentation](https://contentsnare.com/help/knowledge-base/content-snare-webhooks/#field-webhooks)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptions() {
      return [
        subscription.FIELD_APPROVED,
      ];
    },
    generateMeta(resource) {
      const { id } = resource;
      const ts = Date.now();
      return {
        id: `${id}-${ts}`,
        summary: `Field Approved: ${id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
