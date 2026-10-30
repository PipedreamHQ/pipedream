import crypto from "crypto";
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
      // The record fetched after the webhook may already reflect a later update, so
      // key on the delivery: its MessageId (one payload can list several contacts) or,
      // if that is missing, the LastUpdate the payload reported for this contact.
      const {
        messageId, payloadContact,
      } = this.getEventContext(contact);
      const eventKey = messageId ?? payloadContact.LastUpdate ?? contact.LastUpdate;
      // Hashed because the MessageId alone is 63 characters, and the dedupe limit is 64.
      return crypto
        .createHash("sha256")
        .update(`${contact.ContactId}-${eventKey}`)
        .digest("hex");
    },
  },
  sampleEmit,
};
