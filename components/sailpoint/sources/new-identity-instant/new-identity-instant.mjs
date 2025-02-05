import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sailpoint-new-identity-instant",
  name: "New Identity Created (Instant)",
  description: "Emit new event when a new identity is created in IdentityNow.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggerId() {
      return "idn:identity-created";
    },
    getSummary(event) {
      return `New identity created: ${event.identity.name}`;
    },
  },
  sampleEmit,
};
