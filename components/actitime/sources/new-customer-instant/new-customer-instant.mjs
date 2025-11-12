import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "actitime-new-customer-instant",
  name: "New Customer (Instant)",
  description: "Emit new event when a new customer is created. [See the documentation](https://www.actitime.com/api-documentation/rest-hooks).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.CUSTOMER_CREATE;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Customer: ${resource.name}`,
        ts: resource.created,
      };
    },
  },
  sampleEmit,
};
