import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ascora-customer-updated",
  name: "Customer Updated (Instant)",
  description: "Emit new event when a customer is updated. [See the documentation](https://www.ascora.com.au/Assets/Guides/AscoraApiGuide.pdf)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEventType() {
      return "CustomerModified";
    },
    generateMeta(customer) {
      return {
        id: customer.customerId,
        summary: `Customer updated with ID: ${customer.customerId}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
