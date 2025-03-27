import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_books-new-customer-instant",
  name: "New Customer (Instant)",
  description: "Emit new event when a new customer is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEntity() {
      return "customer";
    },
    generateMeta({ contact }) {
      return {
        id: contact.contact_id,
        summary: `New Customer: ${contact.contact_name}`,
        ts: Date.parse(contact.created_time),
      };
    },
  },
  sampleEmit,
};
