import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "onepagecrm-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event each time a new contact is created in OnePageCRM.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getField() {
      return "contact";
    },
    getFilterField() {
      return "created_at";
    },
    getFunction() {
      return this.onepagecrm.listContacts;
    },
    getParams() {
      return {
        sort_by: "created_at",
        order: "desc",
      };
    },
    getSummary(item) {
      return `A new contact with ID: ${item.id} was successfully created!`;
    },
  },
  sampleEmit,
};
