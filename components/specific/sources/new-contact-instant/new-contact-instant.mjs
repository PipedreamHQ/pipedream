import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "specific-new-contact-instant",
  name: "New Contact Created (Instant)",
  description: "Emit new event whenever a new contact is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getOperation() {
      return "new-contact";
    },
    getSummary(body) {
      return `New contact created: ${body.name}`;
    },
  },
  sampleEmit,
};
