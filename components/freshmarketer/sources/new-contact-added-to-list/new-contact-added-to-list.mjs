import { axios } from "@pipedream/platform";
import freshmarketer from "../../freshmarketer.app.mjs";

export default {
  key: "freshmarketer-new-contact-added-to-list",
  name: "New Contact Added to List",
  description: "Emit new event when a contact is added to a specific list.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    freshmarketer,
    db: "$.service.db",
    listId: {
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
    generateMeta(contact) {
      return {
        id: `${contact.id}-${this.listId}`,
        summary: `Contact ${contact.email} added to list ${this.listId}`,
        ts: Date.parse(contact.created_at),
      };
    },
  },
  async run() {
    const lastProcessedTimestamp = this.db.get("lastProcessedTimestamp") || 0;
    const { contacts } = await this.freshmarketer._makeRequest({
      path: `/mas/api/v1/contacts?list_id=${this.listId}&page=1&size=30`,
    });

    contacts
      .filter((contact) => Date.parse(contact.created_at) > lastProcessedTimestamp)
      .forEach((contact) => {
        const meta = this.generateMeta(contact);
        this.$emit(contact, meta);
      });

    if (contacts.length > 0) {
      const latestTimestamp = Math.max(...contacts.map((contact) => Date.parse(contact.created_at)));
      this.db.set("lastProcessedTimestamp", latestTimestamp);
    }
  },
};
