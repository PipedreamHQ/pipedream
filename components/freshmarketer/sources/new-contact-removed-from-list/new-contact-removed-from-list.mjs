import freshmarketer from "../../freshmarketer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "freshmarketer-new-contact-removed-from-list",
  name: "New Contact Removed From List",
  description: "Emits a new event as soon as a contact is removed from a list. [See the documentation](https://developers.freshworks.com/crm/api/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    freshmarketer,
    db: "$.service.db",
    list: {
      propDefinition: [
        freshmarketer,
        "listId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    ...freshmarketer.methods,
    async fetchRemovedContacts(listId, lastRun) {
      const contacts = await this.freshmarketer.removeContactByEmailOrId({
        listId,
        since: lastRun,
      });
      return contacts;
    },
    generateMeta(contact) {
      return {
        id: `${contact.id}-${contact.removed_at}`,
        summary: `Contact ${contact.email} removed from list`,
        ts: Date.parse(contact.removed_at),
      };
    },
  },
  hooks: {
    async deploy() {
      const lastRun = this.db.get("lastRun") || new Date().toISOString();
      const contacts = await this.fetchRemovedContacts(this.list, lastRun);
      contacts.forEach((contact) => {
        const meta = this.generateMeta(contact);
        this.$emit(contact, meta);
      });
      this.db.set("lastRun", new Date().toISOString());
    },
  },
  async run() {
    const lastRun = this.db.get("lastRun") || new Date().toISOString();
    const contacts = await this.fetchRemovedContacts(this.list, lastRun);
    contacts.forEach((contact) => {
      const meta = this.generateMeta(contact);
      this.$emit(contact, meta);
    });
    this.db.set("lastRun", new Date().toISOString());
  },
};
