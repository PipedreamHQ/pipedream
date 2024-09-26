import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "forcemanager-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created. [See the documentation](https://developer.forcemanager.com/#c1c37cd1-5cb9-473f-8918-7583ee0469e4)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.forcemanager.listContacts;
    },
    getSummary(contact) {
      return `New Contact: ${contact.firstName} ${contact.lastName}`;
    },
  },
  sampleEmit,
};
