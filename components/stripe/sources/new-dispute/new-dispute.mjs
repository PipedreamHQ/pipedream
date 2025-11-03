import common from "../common/webhook-base.mjs";

export default {
  ...common,
  key: "stripe-new-dispute",
  name: "New Dispute",
  type: "source",
  version: "0.1.4",
  description: "Emit new event for each new dispute",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "charge.dispute.created",
      ];
    },
  },
};
