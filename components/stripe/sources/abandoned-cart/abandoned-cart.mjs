import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-abandoned-cart",
  name: "New Abandoned Cart",
  type: "source",
  version: "0.1.4",
  description: "Emit new event when a customer abandons their cart.",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "checkout.session.expired",
      ];
    },
  },
};
