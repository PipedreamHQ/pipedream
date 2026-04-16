import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "connectwise_psa-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created in Connectwise.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.connectwise.listContacts;
    },
    getSummary(item) {
      return `New Contact Created: ${item.firstName} ${item.lastName}`;
    },
  },
  sampleEmit,
};
