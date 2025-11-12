import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bilionis-new-message-received",
  name: "New Message Received",
  description: "Emit new event when a new lead sends a message. [See the documentation](https://bilionis.com/crm/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New Message ${message.id}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const lastId = this._getLastId();
    let maxId = lastId;
    let lastDate = this._getLastDate();
    const today = (new Date()).toISOString()
      .slice(0, 10);

    const messages = await this.bilionis.listMessages({
      params: lastDate
        ? {
          start_date: lastDate,
          end_date: today,
        }
        : {},
    });

    for (const message of messages) {
      if (message.id > lastId) {
        const meta = this.generateMeta(message);
        this.$emit(message, meta);
        if (message.id > maxId) {
          maxId = message.id;
          lastDate = message.data;
        }
      }
    }

    this._setLastId(maxId);
    this._setLastDate(lastDate);
  },
  sampleEmit,
};
