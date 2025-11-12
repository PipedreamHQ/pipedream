import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "americommerce-new-customer-instant",
  name: "New Customer Created (Instant)",
  description: "Emit new event when a customer is created in your Americommerce store. [See the documentation](https://developers.cart.com/docs/rest-api/ZG9jOjM1MDU4Nw-webhooks#subscribing-to-a-webhook).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return events.CUSTOMER_CREATED;
    },
    generateMeta(resource) {
      const { customer } = resource;
      return {
        id: customer.id,
        summary: `New Customer: ${customer.first_name}`,
        ts: Date.parse(customer.created_at),
      };
    },
  },
  sampleEmit,
};
