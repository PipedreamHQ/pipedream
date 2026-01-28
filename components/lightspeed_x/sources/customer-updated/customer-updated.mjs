import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lightspeed_x-customer-updated",
  name: "Customer Updated (Instant)",
  description: "Emit new event when a customer is updated. [See the documentation](https://x-series-api.lightspeedhq.com/v2026.01/reference/post-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "customer.update";
    },
    generateMeta(customer) {
      const ts = Date.parse(customer.updated_at);
      return {
        id: `${customer.id}-${ts}`,
        summary: `Customer with ID ${customer.id} updated`,
        ts,
      };
    },
  },
  sampleEmit,
};
