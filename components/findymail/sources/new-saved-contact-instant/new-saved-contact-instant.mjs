import findymail from "../../findymail.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "findymail-new-saved-contact-instant",
  name: "New Saved Contact (Instant)",
  description: "Emit new event when a new contact is saved.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    findymail,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Fetching the 50 most recent contacts to emit on deploy
      const contacts = await this.findymail.getContacts({ limit: 50 });
      contacts.forEach((contact) => {
        this.$emit(contact, {
          id: contact.id,
          summary: `New contact saved: ${contact.name}`,
          ts: Date.parse(contact.createdAt),
        });
      });
    },
    async activate() {
      // No webhook subscription is necessary for this component as it directly handles incoming HTTP requests
    },
    async deactivate() {
      // No webhook to delete since this component does not create one
    },
  },
  async run(event) {
    const { body } = event;
    
    // Assuming the webhook sends the contact information directly
    if (body && body.contact) {
      const contact = body.contact;
      this.$emit(contact, {
        id: contact.id || `${Date.now()}`,
        summary: `New contact saved: ${contact.name}`,
        ts: contact.createdAt ? Date.parse(contact.createdAt) : Date.now(),
      });
    } else {
      // Responding to the request if the body doesn't contain the expected contact information
      this.http.respond({
        status: 400,
        body: "No contact information received",
      });
    }
  },
};