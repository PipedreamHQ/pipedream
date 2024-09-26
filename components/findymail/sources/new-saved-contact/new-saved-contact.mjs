import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import findymail from "../../findymail.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "findymail-new-saved-contact",
  name: "New Saved Contact",
  description: "Emit new event when a new contact is saved.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    findymail,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(createdAt) {
      this.db.set("lastDate", createdAt);
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New contact saved: ${event.email}`,
        ts: Date.parse(event.contact_created_at),
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      let { data } = await this.findymail.listContacts();

      data = data.filter(
        (item) => Date.parse(item.contact_created_at) > Date.parse(lastDate),
      ).reverse();

      if (maxResults && (data.length > maxResults)) data.length = maxResults;
      if (data.length) this._setLastDate(data[0].contact_created_at);

      for (const item of data.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
