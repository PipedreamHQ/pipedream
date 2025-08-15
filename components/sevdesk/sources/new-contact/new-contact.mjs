import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sevdesk-new-contact",
  name: "New Contact Created",
  description: "Emit new event when a contact is created in SevDesk.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.sevdesk.listContacts;
    },
    getSummary(data) {
      return `New contact created with Id: ${data.id}`;
    },
  },
  sampleEmit,
};
