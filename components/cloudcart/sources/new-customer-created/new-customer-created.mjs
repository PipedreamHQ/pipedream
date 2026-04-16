import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Customer Created (Instant)",
  key: "cloudcart-new-customer-created",
  type: "source",
  description: "Emit new event when a new customer is created. [See the documentation](https://www.postman.com/cloudcartapi/cloudcart-public/request/l6v5w0f/site-url-api-v2-webhooks)",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "customer.created";
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New customer created: ${(body.first_name + " " + body.last_name).trim()}`,
        ts: Date.parse(body.date_added),
      };
    },
  },
  sampleEmit,
};
