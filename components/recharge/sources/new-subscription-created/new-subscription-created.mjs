import common from "../common/common.mjs";

export default {
  ...common,
  key: "recharge-new-subscription-created",
  name: "New Subscription Created (Instant)",
  description: "Emit new event when a new subscription is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary() {
      return "New Subscription";
    },
    getHookData() {
      return {
        topic: "subscription/created",
        included_objects: [
          // "customer", // listed in documentation, but API returns an error
          "metafields",
        ],
      };
    },
  },
};
