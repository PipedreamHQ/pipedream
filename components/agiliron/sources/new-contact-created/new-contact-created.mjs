import agiliron from "../../agiliron.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agiliron-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created in Agiliron. [See the documentation](https://api.agiliron.com/docs/read-contact-1)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    agiliron,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Poll every 15 minutes
      },
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
  },
  hooks: {
    async deploy() {
      const contacts = await this.agiliron.getContacts();
      const lastTimestamp = this._getLastTimestamp();
      const newContacts = contacts.Contacts.Contact.filter((contact) => {
        const contactTimestamp = new Date(contact.CreatedTimeUTC).getTime();
        return contactTimestamp > lastTimestamp;
      });

      newContacts.slice(0, 50).forEach((contact) => {
        this.$emit(contact, {
          id: contact.ContactId,
          summary: `New contact: ${contact.FirstName} ${contact.LastName}`,
          ts: new Date(contact.CreatedTimeUTC).getTime(),
        });
      });

      if (newContacts.length > 0) {
        const latestTimestamp = newContacts[0].CreatedTimeUTC;
        this._setLastTimestamp(new Date(latestTimestamp).getTime());
      }
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const contacts = await this.agiliron.getContacts({
      params: {
        filter: `CreatedTimeUTC,gt,${new Date(lastTimestamp).toISOString()}`,
      },
    });

    for (const contact of contacts.Contacts.Contact) {
      this.$emit(contact, {
        id: contact.ContactId,
        summary: `New contact: ${contact.FirstName} ${contact.LastName}`,
        ts: new Date(contact.CreatedTimeUTC).getTime(),
      });
    }

    if (contacts.Contacts.Contact.length > 0) {
      const latestContact = contacts.Contacts.Contact[contacts.Contacts.Contact.length - 1];
      this._setLastTimestamp(new Date(latestContact.CreatedTimeUTC).getTime());
    }
  },
};
