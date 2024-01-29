import { axios } from "@pipedream/platform";
import omnisend from "../../omnisend.app.mjs";

export default {
  key: "omnisend-new-contact-created",
  name: "New Contact Created",
  description: "Emits an event each time a new contact is created in Omnisend.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    omnisend,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // 1 minute
      },
    },
  },
  methods: {
    _getCreatedAfter() {
      return this.db.get("createdAfter") || null;
    },
    _setCreatedAfter(createdAfter) {
      this.db.set("createdAfter", createdAfter);
    },
    async _getContacts(createdAfter) {
      const params = createdAfter
        ? {
          createdAtMin: createdAfter,
        }
        : {};
      return this.omnisend._makeRequest({
        path: "/contacts",
        params,
      });
    },
  },
  hooks: {
    async deploy() {
      // Fetch all contacts during the first run
      const contacts = await this._getContacts();
      contacts.slice(-50).forEach((contact) => {
        this.$emit(contact, {
          id: contact.contactID || `${contact.createdAt}`,
          summary: `New Contact: ${contact.contactID}`,
          ts: Date.parse(contact.createdAt),
        });
      });

      // Set the createdAfter to the creation date of the most recent contact
      const mostRecentContact = contacts[contacts.length - 1];
      if (mostRecentContact) {
        this._setCreatedAfter(mostRecentContact.createdAt);
      }
    },
  },
  async run() {
    const createdAfter = this._getCreatedAfter();
    const contacts = await this._getContacts(createdAfter);

    contacts.forEach((contact) => {
      this.$emit(contact, {
        id: contact.contactID || `${contact.createdAt}`,
        summary: `New Contact: ${contact.contactID}`,
        ts: Date.parse(contact.createdAt),
      });
    });

    // Update the createdAfter to the creation date of the most recent contact
    const mostRecentContact = contacts[0];
    if (mostRecentContact) {
      this._setCreatedAfter(mostRecentContact.createdAt);
    }
  },
};
