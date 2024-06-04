import { axios } from "@pipedream/platform";
import botpenguin from "../../botpenguin.app.mjs";

export default {
  key: "botpenguin-new-contact-created",
  name: "New Contact Created",
  description: "Emits an event when a user interacts with the bot and a new contact or lead is created. [See the documentation](https://help.botpenguin.com/api-references/contacts-and-chats-apis/get-all-contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    botpenguin,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    async fetchContacts(lastContactDate) {
      return this.botpenguin._makeRequest({
        method: "GET",
        path: "/inbox/contacts",
        params: {
          updated_after: lastContactDate,
        },
      });
    },
  },
  hooks: {
    async deploy() {
      // Fetch contacts on initial deployment
      const contacts = await this.fetchContacts("1970-01-01T00:00:00Z");
      contacts.forEach((contact) => {
        this.$emit(contact, {
          id: contact.id,
          summary: `New contact: ${contact.name}`,
          ts: Date.parse(contact.created_at),
        });
      });
      // Save the last contact creation date for future polling
      if (contacts.length > 0) {
        const mostRecentContactDate = contacts[contacts.length - 1].created_at;
        this.db.set("lastContactDate", mostRecentContactDate);
      } else {
        this.db.set("lastContactDate", new Date().toISOString());
      }
    },
  },
  async run() {
    const lastContactDate = this.db.get("lastContactDate") || "1970-01-01T00:00:00Z";
    const contacts = await this.fetchContacts(lastContactDate);

    contacts.forEach((contact) => {
      this.$emit(contact, {
        id: contact.id,
        summary: `New contact: ${contact.name}`,
        ts: Date.parse(contact.created_at),
      });
    });

    if (contacts.length > 0) {
      // Update the last contact date with the creation date of the last contact fetched
      const mostRecentContactDate = contacts[contacts.length - 1].created_at;
      this.db.set("lastContactDate", mostRecentContactDate);
    }
  },
};
