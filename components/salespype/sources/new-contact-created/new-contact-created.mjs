import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import salespype from "../../salespype.app.mjs";

export default {
  key: "salespype-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    salespype: {
      type: "app",
      app: "salespype",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const contacts = await this.salespype._makeRequest({
        method: "GET",
        path: "/contacts",
        params: {
          limit: 50,
          sort: "created_at_desc",
        },
      });

      for (const contact of contacts) {
        this.$emit(contact, {
          id: contact.contactId,
          summary: `New Contact: ${contact.firstName} ${contact.lastName}`,
          ts: new Date(contact.created_at).getTime(),
        });
      }

      if (contacts.length > 0) {
        const lastContact = contacts[0];
        this.db.set("lastTimestamp", new Date(lastContact.created_at).getTime());
      }
    },
    async activate() {
      // No webhook to create
    },
    async deactivate() {
      // No webhook to delete
    },
  },
  async run() {
    const lastTimestamp = this.db.get("lastTimestamp") || 0;

    const contacts = await this.salespype._makeRequest({
      method: "GET",
      path: "/contacts",
      params: {
        since: lastTimestamp,
        limit: 50,
        sort: "created_at_desc",
      },
    });

    for (const contact of contacts) {
      const contactTs = new Date(contact.created_at).getTime();
      if (contactTs > lastTimestamp) {
        this.$emit(contact, {
          id: contact.contactId,
          summary: `New Contact: ${contact.firstName} ${contact.lastName}`,
          ts: contactTs,
        });
      }
    }

    if (contacts.length > 0) {
      const newLastTimestamp = new Date(contacts[0].created_at).getTime();
      this.db.set("lastTimestamp", newLastTimestamp);
    }
  },
};
