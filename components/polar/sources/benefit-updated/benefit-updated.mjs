import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "polar-benefit-updated",
  name: "Benefit Updated",
  description: "Emits an event when a benefit is updated. [See the API docs](https://polar.sh/docs/api-reference/webhooks/endpoints/create)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "benefit.updated",
      ];
    },
  },
};
