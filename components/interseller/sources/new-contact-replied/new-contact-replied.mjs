import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "interseller-new-contact-replied",
  name: "New Contact Replied",
  description: "Emit new event when a contact is replied.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New reply to ${event.name}`;
    },
    getParams() {
      return {
        "filter[]": "replied",
        "sort": "updated_at:desc",
      };
    },
    getDateField() {
      return "replied_at";
    },
  },
  sampleEmit,
};

