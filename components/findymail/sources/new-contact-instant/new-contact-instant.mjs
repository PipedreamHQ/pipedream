import findymail from "../../findymail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "findymail-new-contact-instant",
  name: "New Contact Instant",
  description: "Emit new event when a new contact email is found.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    findymail: {
      type: "app",
      app: "findymail",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // This source does not fetch historical data
    },
    async activate() {
      // No webhook subscription is created for instant triggers in this example
    },
    async deactivate() {
      // No webhook subscription to delete in this example
    },
  },
  async run(event) {
    const body = event.body;
    // Assuming the webhook payload contains the contact information directly
    if (body && body.contact) {
      const contact = body.contact;
      const contactId = contact.email; // Using email as a unique identifier for deduplication
      const summary = `New contact found: ${contact.email}`;
      const ts = new Date().getTime(); // Using current time as timestamp

      this.$emit(contact, {
        id: contactId,
        summary,
        ts,
      });
    } else {
      this.http.respond({
        status: 400,
        body: "No contact information found in the webhook payload",
      });
    }
  },
};