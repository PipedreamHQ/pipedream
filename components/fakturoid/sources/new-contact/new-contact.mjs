import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fakturoid-new-contact",
  name: "New Contact Added",
  description: "Emit new event when a contact (subject) is added in Fakturoid.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.fakturoid.listSubjects;
    },
    getSummary(contact) {
      return `New Contact Added: ${contact.name}`;
    },
  },
  sampleEmit,
};
