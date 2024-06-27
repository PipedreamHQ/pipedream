import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kommo-new-contact-instant",
  name: "New Contact (Instant)",
  description: "Emit new event when a contact is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "add_contact",
      ];
    },
    getSummary(body) {
      return `New Contact: ${body["contacts[add][0][name]"]}`;
    },
  },
  sampleEmit,
};
