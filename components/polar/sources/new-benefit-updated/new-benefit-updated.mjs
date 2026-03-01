import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "polar-new-benefit-updated",
  name: "New Benefit Updated",
  description: "Emit new event when a benefit is updated. [See the API docs](https://polar.sh/docs/api-reference/webhooks/endpoints/create)",
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
