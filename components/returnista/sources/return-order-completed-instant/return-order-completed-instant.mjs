import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "returnista-return-order-completed-instant",
  name: "Return Order Completed (Instant)",
  description: "Emit new event when a return order is completed. [See the documentation](https://platform.returnista.com/reference/rest-api/#post-/account/-accountId/webhook-subscription)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "return_order.completed";
    },
    generateMeta({ data }) {
      const ts = Date.parse(data.updatedAt);
      return {
        id: `${data.id}-${ts}`,
        summary: `Return Order Completed: ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
