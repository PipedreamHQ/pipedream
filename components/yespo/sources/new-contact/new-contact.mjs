import yespo from "../../yespo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "yespo-new-contact",
  name: "New Contact Added to Yespo",
  description: "Emits an event when a new contact is added to Yespo. [See the documentation](https://docs.yespo.io/reference/searchcontacts-1)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    yespo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit the last 50 contacts on first run in order of most recent to least recent
      const contacts = await this.fetchContacts();
      contacts.slice(0, 50).forEach((contact) => {
        this.$emit(contact, {
          id: contact.id,
          summary: `New contact: ${contact.firstName} ${contact.lastName}`,
          ts: Date.now(),
        });
      });
    },
  },
  methods: {
    async fetchContacts() {
      const lastFetched = this.db.get("lastFetched") || 0;
      const now = Date.now();
      const contacts = [];

      let hasMore = true;
      let page = 1;

      while (hasMore) {
        const response = await this.yespo._makeRequest({
          method: "GET",
          path: "contacts",
          params: {
            page,
            per_page: 50,
            created_after: new Date(lastFetched).toISOString(),
          },
        });

        contacts.push(...response.data);
        hasMore = response.data.length === 50;
        page += 1;
      }

      this.db.set("lastFetched", now);
      return contacts;
    },
  },
  async run() {
    const contacts = await this.fetchContacts();
    contacts.forEach((contact) => {
      this.$emit(contact, {
        id: contact.id,
        summary: `New contact: ${contact.firstName} ${contact.lastName}`,
        ts: Date.now(),
      });
    });
  },
};
