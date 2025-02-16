import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sailpoint-identity-attribute-change-instant",
  name: "New Identity Attribute Change (Instant)",
  description: "Emit new event when any attributes of an identity change.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggerId() {
      return "idn:identity-attributes-changed";
    },
    getSummary(event) {
      return `Attributes changed for identity ${event.source.id}`;
    },
  },
  sampleEmit,
};
