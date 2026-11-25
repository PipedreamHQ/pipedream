import common from "../common/contact.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "less_annoying_crm-new-contact-instant",
  name: "New Contact or Company (Instant)",
  description: "Emit new event when a contact or company is created in Less Annoying CRM. [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Advanced/UsingWebhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return "Contact.Create";
    },
    getAction() {
      return "created";
    },
  },
  sampleEmit,
};
