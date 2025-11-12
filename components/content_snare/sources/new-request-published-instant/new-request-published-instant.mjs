import common from "../common/webhook.mjs";
import subscription from "../common/subscription.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "content_snare-new-request-published-instant",
  name: "New Request Published (Instant)",
  description: "Emit new event when a request is published on Content Snare. [See the documentation](https://contentsnare.com/help/knowledge-base/content-snare-webhooks/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptions() {
      return [
        subscription.REQUEST_PUBLISHED,
      ];
    },
    generateMeta(resource) {
      const { id } = resource;
      const ts = Date.now();
      return {
        id: `${id}-${ts}`,
        summary: `Request Published: ${id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
