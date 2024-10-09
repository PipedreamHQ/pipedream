import fakturoid from "../../fakturoid.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fakturoid-new-contact",
  name: "New Contact Added",
  description: "Emit new event when a contact (subject) is added in Fakturoid. [See the documentation](https://www.fakturoid.cz/api/v3/subjects)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fakturoid,
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
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const subjects = await this.fakturoid._makeRequest({
        method: "GET",
        path: `/accounts/${this.fakturoid.$auth.account_slug}/subjects.json`,
      });

      subjects.slice(-50).forEach((contact) => {
        this.$emit(contact, {
          id: contact.id,
          summary: `New Contact Added: ${contact.name}`,
          ts: contact.created_at
            ? new Date(contact.created_at).getTime()
            : Date.now(),
        });
      });

      if (subjects.length) {
        const lastTimestamp = new Date(subjects[subjects.length - 1].created_at).getTime();
        this._setLastTimestamp(lastTimestamp);
      }
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const subjects = await this.fakturoid._makeRequest({
      method: "GET",
      path: `/accounts/${this.fakturoid.$auth.account_slug}/subjects.json`,
    });

    subjects.forEach((contact) => {
      const contactTimestamp = new Date(contact.created_at).getTime();
      if (contactTimestamp > lastTimestamp) {
        this.$emit(contact, {
          id: contact.id,
          summary: `New Contact Added: ${contact.name}`,
          ts: contactTimestamp,
        });
      }
    });

    if (subjects.length) {
      const latestTimestamp = new Date(subjects[0].created_at).getTime();
      this._setLastTimestamp(latestTimestamp);
    }
  },
};
