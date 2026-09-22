import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-return-request-opened",
  name: "Return Request Opened (Instant)",
  description: "Emit new event when a return request is opened. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "return_request.opened",
      ];
    },
  },
};
