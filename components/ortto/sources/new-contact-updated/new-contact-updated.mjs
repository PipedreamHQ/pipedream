import { axios } from "@pipedream/platform";
import ortto from "../../ortto.app.mjs";

export default {
  key: "ortto-new-contact-updated",
  name: "New Contact Updated",
  description: "Emit an event when a contact is updated in your Ortto account. [See the documentation](https://help.ortto.com/a-250-api-reference)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ortto,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 3600,  // Runs every hour
      },
    },
  },
  methods: {
    _getLastProcessedTimestamp() {
      return this.db.get("lastUpdated") || new Date(0).toISOString();
    },
    _setLastProcessedTimestamp(timestamp) {
      this.db.set("lastUpdated", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const contacts = await this.ortto.paginate(this.ortto.getNewContacts);
      const recentContacts = contacts.slice(-50).reverse();

      for (const contact of recentContacts) {
        this.$emit(contact, {
          id: contact.id,
          summary: `New Contact Updated: ${contact.fields["str::email"] || contact.fields["str::first"] || contact.id}`,
          ts: Date.parse(contact.updated_at),
        });
      }

      if (recentContacts.length) {
        const lastContact = recentContacts[recentContacts.length - 1];
        this._setLastProcessedTimestamp(lastContact.updated_at);
      }
    },
  },
  async run() {
    const lastUpdated = this._getLastProcessedTimestamp();

    const response = await this.ortto.getNewContacts({
      params: {
        filter: {
          updated_at: {
            $gt: lastUpdated,
          },
        },
      },
    });

    const contacts = response.contacts;

    if (contacts.length) {
      for (const contact of contacts) {
        this.$emit(contact, {
          id: contact.id,
          summary: `Contact Updated: ${contact.fields["str::email"] || contact.fields["str::first"] || contact.id}`,
          ts: Date.parse(contact.updated_at),
        });
      }

      const lastContact = contacts[contacts.length - 1];
      this._setLastProcessedTimestamp(lastContact.updated_at);
    }
  },
};
