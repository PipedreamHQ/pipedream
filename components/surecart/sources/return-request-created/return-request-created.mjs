import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "surecart-return-request-created",
  name: "New Return Request Created (Instant)",
  description: "Emit new event when a return request is created. [See the documentation](https://developer.surecart.com/api-reference/webhook-endpoints/create)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "return_request.created",
      ];
    },
  },
};
