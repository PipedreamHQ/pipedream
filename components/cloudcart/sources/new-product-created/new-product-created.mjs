import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Product Created (Instant)",
  key: "cloudcart-new-product-created",
  type: "source",
  description: "Emit new event when a new product is created. [See the documentation](https://www.postman.com/cloudcartapi/cloudcart-public/request/l6v5w0f/site-url-api-v2-webhooks)",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "product.created";
    },
    getWebhookArgs() {
      return {
        new_version: 1,
      };
    },
    generateMeta(body) {
      return {
        id: body.id,
        summary: `New product created: ${body.id}`,
        ts: Date.parse(body.date_added),
      };
    },
  },
  sampleEmit,
};
