import interseller from "../../interseller.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "interseller-new-contact",
  name: "New Contact",
  description: "Emits an event when a new contact is created in Interseller.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    interseller,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900, // 15 minutes
      },
    },
  },
  methods: {
    ...interseller.methods,
    async fetchContacts(lastEmittedTimestamp) {
      const contacts = [];
      let hasMore = true;
      let skip = 0;

      while (hasMore) {
        const response = await this.interseller.listContacts({
          limit: 100,
          skip,
          sort: "created_at",
        });

        response.forEach((contact) => {
          const contactTimestamp = Date.parse(contact.created_at);
          if (contactTimestamp > lastEmittedTimestamp) {
            contacts.push(contact);
          }
        });

        if (response.length < 100) {
          hasMore = false;
        } else {
          skip += 100;
        }
      }

      return contacts;
    },
  },
  hooks: {
    async deploy() {
      // On deploy, fetch and emit the most recent contacts without updating the timestamp
      const lastEmittedTimestamp = 0;
      const contacts = await this.fetchContacts(lastEmittedTimestamp);

      contacts.forEach((contact) => {
        this.$emit(contact, {
          id: contact.id,
          summary: `New Contact: ${contact.name}`,
          ts: Date.parse(contact.created_at),
        });
      });
    },
  },
  async run() {
    const lastEmittedTimestamp = this.db.get("lastEmittedTimestamp") || 0;
    const contacts = await this.fetchContacts(lastEmittedTimestamp);

    contacts.forEach((contact) => {
      this.$emit(contact, {
        id: contact.id,
        summary: `New Contact: ${contact.name}`,
        ts: Date.parse(contact.created_at),
      });
    });

    if (contacts.length > 0) {
      const mostRecentTimestamp = Math.max(...contacts.map((contact) => Date.parse(contact.created_at)));
      this.db.set("lastEmittedTimestamp", mostRecentTimestamp);
    }
  },
};
