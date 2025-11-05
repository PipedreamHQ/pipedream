import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-purchase-updated-instant",
  name: "Purchase Updated (Instant)",
  description: "Emit new event when a purchase is updated.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEventName() {
      return "purchase.update";
    },
    generateMeta(body) {
      const { data } = body;
      return {
        summary: `Purchase Updated ${data.id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};

