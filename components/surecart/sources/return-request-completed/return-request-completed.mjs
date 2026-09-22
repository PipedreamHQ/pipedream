import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-return-request-completed",
  name: "Return Request Completed (Instant)",
  description: "Emit new event when a return request is completed. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "return_request.completed",
      ];
    },
  },
};
