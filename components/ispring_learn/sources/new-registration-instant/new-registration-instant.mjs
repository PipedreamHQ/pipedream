import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ispring_learn-new-registration-instant",
  name: "New User Registration (Instant)",
  description: "Emit new event when a new user is registered.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptionType() {
      return "USER_REGISTERED";
    },
    getSummary({ payloads }) {
      return `${payloads.length} new user${payloads.length > 1
        ? "s"
        : ""} successfully registered.`;
    },
  },
  sampleEmit,
};
