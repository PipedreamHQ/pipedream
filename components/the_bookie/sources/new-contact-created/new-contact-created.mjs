import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "the_bookie-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a contact is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.theBookie.listContacts;
    },
    getSummary(item) {
      return `New Contact created: ${item.id}`;
    },
  },
  sampleEmit,
};
