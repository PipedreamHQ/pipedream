import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "indiefunnels-contact-updated-instant",
  name: "Contact Updated (Instant)",
  description: "Emit new event when a contact is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "contact_updated",
      ];
    },
    getSummary(details) {
      return `Contact with ID ${details.id} updated`;
    },
  },
  sampleEmit,
};
