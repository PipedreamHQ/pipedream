import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Order Created (Instant)",
  key: "cloudcart-new-order-created",
  type: "source",
  description: "Emit new event when a new order is created. [See the documentation](https://www.postman.com/cloudcartapi/cloudcart-public/request/l6v5w0f/site-url-api-v2-webhooks)",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "order.created";
    },
    getWebhookArgs() {
      return {
        new_version: 1,
      };
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New order created: ${body.id}`,
        ts: Date.parse(body.created_at),
      };
    },
  },
  sampleEmit,
};
