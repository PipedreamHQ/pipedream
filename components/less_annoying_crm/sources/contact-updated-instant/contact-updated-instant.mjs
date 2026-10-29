import common from "../common/contact.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "less_annoying_crm-contact-updated-instant",
  name: "New Contact or Company Update (Instant)",
  description: "Emit new event when a contact or company is updated in Less Annoying CRM. [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Advanced/UsingWebhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "Contact.Update";
    },
    getAction() {
      return "updated";
    },
    getDedupeId(contact) {
      return `${contact.ContactId}-${contact.LastUpdate}`;
    },
  },
  sampleEmit,
};
