import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "wati-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a contact is created from an incoming WhatsApp message.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getPaginateOpts(maxResults) {
      return {
        fn: this.wati.listContacts,
        itemsField: "result",
        optsField: "data",
        maxResults,
      };
    },
    getDateField() {
      return "created";
    },
    checkBreak(item, lastDate) {
      return Date.parse(item.created) < lastDate;
    },
    getSummary(item) {
      return `New contact created: ${item.wAid}`;
    },
  },
  sampleEmit,
};
