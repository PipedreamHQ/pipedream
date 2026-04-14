import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "returnista-sales-order-approved-or-denied-instant",
  name: "Sales Order Approved or Denied (Instant)",
  description: "Emit new event when a sales order is approved or denied. [See the documentation](https://platform.returnista.com/reference/rest-api/#post-/account/-accountId/webhook-subscription)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "sales_order.approved_or_denied";
    },
    generateMeta({ data }) {
      const ts = Date.parse(data.updatedAt);
      return {
        id: `${data.id}-${ts}`,
        summary: `Sales Order Approved or Denied: ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
