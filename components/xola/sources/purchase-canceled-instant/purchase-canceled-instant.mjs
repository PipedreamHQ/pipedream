import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-purchase-canceled-instant",
  name: "Purchase Canceled (Instant)",
  description: "Emit new event when a purchase is canceled. [See the documentation](https://developers.xola.com/reference/webhook-introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "purchase.cancel";
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: data.id,
        summary: `Purchase Canceled ${data.id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
