import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "chargify-new-subscription-instant",
  name: "New Subscription (Instant)",
  description: "Emit new event when a new subscription is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "signup_success";
    },
    getSummary(item) {
      return `New Subscription with ID: ${item["payload[subscription][id]"]}`;
    },
  },
  sampleEmit,
};
