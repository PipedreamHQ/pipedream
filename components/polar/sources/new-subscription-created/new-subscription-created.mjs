import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "polar-new-subscription-created",
  name: "New Subscription Created",
  description: "Emit new event when a new subscription is created. [See the API docs](https://polar.sh/docs/api-reference/webhooks/endpoints/create)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "subscription.created",
      ];
    },
  },
};
