import common from "../common/webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "xola-purchase-updated-instant",
  name: "Purchase Updated (Instant)",
  description: "Emit new event when a purchase is updated. [See the documentation](https://developers.xola.com/reference/webhook-introduction)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "purchase.update";
    },
    generateMeta(body) {
      const { data } = body;
      const ts = Date.parse(data.updatedAt);
      return {
        id: `${data.id}-${ts}`,
        summary: `Purchase Updated ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
