import lawmatics from "../../lawmatics.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "lawmatics-new-contact-added",
  name: "New Contact Added",
  description: "Emit new event when a contact is added. [See the documentation](https://docs.lawmatics.com/#555909b6-ebb0-4b8b-9e56-1dceb1abb7b7)",
  version: "0.0.1",
  type: "source",
  props: {
    lawmatics,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `${contact.attributes.first_name} ${contact.attributes.last_name} ${contact.attributes.email}`.trim() || contact.id,
        ts: Date.parse(contact.attributes.created_at),
      };
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let newLastTs;

      const contacts = await this.lawmatics.paginate({
        fn: this.lawmatics.listContacts,
        params: {
          sort_by: "created_at",
          sort_order: "desc",
        },
        max,
      });

      for await (const contact of contacts) {
        if (Date.parse(contact.attributes.created_at) <= lastTs) {
          break;
        }
        this.$emit(contact, this.generateMeta(contact));
        if (!newLastTs) {
          newLastTs = Date.parse(contact.attributes.created_at);
        }
      }

      if (newLastTs) {
        this._setLastTs(newLastTs);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(25);
    },
  },
  async run() {
    await this.processEvents();
  },
};
