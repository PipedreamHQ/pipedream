import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-purchase-canceled-instant",
  name: "Purchase Canceled (Instant)",
  description: "Emit new event when a purchase is canceled.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEventName() {
      return "purchase.cancel";
    },
    generateMeta(body) {
      const { data } = body;
      const ts = Date.now();
      return {
        id: `${data.id}-${ts}`,
        summary: `Purchase Canceled ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
