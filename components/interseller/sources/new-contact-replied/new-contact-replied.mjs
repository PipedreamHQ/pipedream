import interseller from "../../interseller.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "interseller-new-contact-replied",
  name: "New Contact Replied",
  description: "Emits an event when a new contact replies. [See the documentation](https://interseller.readme.io/reference/list-contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    interseller,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5, // 5 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // On deploy, fetch the latest contacts and store the most recent contact's replied_at timestamp
      const { contacts } = await this.interseller.listContacts();
      if (contacts.length > 0) {
        const latestRepliedAt = contacts
          .filter((contact) => contact.replied_at)
          .map((contact) => new Date(contact.replied_at).getTime())
          .sort((a, b) => b - a)[0];
        this.db.set("latestRepliedAt", latestRepliedAt);
      }
    },
  },
  methods: {
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New reply from ${contact.name}`,
        ts: new Date(contact.replied_at).getTime(),
      };
    },
  },
  async run() {
    const latestRepliedAt = this.db.get("latestRepliedAt") || 0;
    let newLatestRepliedAt = latestRepliedAt;

    const { contacts } = await this.interseller.listContacts();
    contacts
      .filter((contact) => contact.replied_at && new Date(contact.replied_at).getTime() > latestRepliedAt)
      .forEach((contact) => {
        this.$emit(contact, this.generateMeta(contact));
        const contactRepliedAt = new Date(contact.replied_at).getTime();
        if (contactRepliedAt > newLatestRepliedAt) {
          newLatestRepliedAt = contactRepliedAt;
        }
      });

    this.db.set("latestRepliedAt", newLatestRepliedAt);
  },
};
