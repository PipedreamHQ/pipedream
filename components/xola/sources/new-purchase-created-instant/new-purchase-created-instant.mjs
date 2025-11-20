import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-new-purchase-created-instant",
  name: "New Purchase Created (Instant)",
  description: "Emit new event when a new purchase is created. [See the documentation](https://developers.xola.com/reference/webhook-introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "purchase.create";
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: data.id,
        summary: `New Purchase Created ${data.id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
