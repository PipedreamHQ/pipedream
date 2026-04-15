import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "returnista-new-return-order-created-instant",
  name: "New Return Order Created (Instant)",
  description: "Emit new event when a new return order is created. [See the documentation](https://platform.returnista.com/reference/rest-api/#post-/account/-accountId/webhook-subscription)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "return_order.created";
    },
    generateMeta({ data }) {
      return {
        id: data.id,
        summary: `New Return Order Created: ${data.id}`,
        ts: Date.parse(data.createdAt),
      };
    },
  },
  sampleEmit,
};
