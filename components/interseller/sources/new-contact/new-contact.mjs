import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "interseller-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created in Interseller.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New Contact: ${event.name}`;
    },
    getDateField() {
      return "created_at";
    },
  },
  sampleEmit,
};
