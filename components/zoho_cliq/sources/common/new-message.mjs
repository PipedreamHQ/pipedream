import app from "../../zoho_cliq.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(message) {
      const meta = this.generateMeta(message);
      this.$emit(message, meta);
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New Message ${message.id}`,
        ts: message.time,
      };
    },
    getChatId() {
      throw new Error("getChatId is not implemented");
    },
    async processEvent(limit) {
      const lastTs = this._getLastTs();

      const { data } = await this.app.getMessages({
        chatId: this.getChatId(),
        params: {
          fromtime: lastTs,
        },
      });

      if (!data?.length) {
        return;
      }

      const results = limit
        ? data.slice(limit * -1)
        : data;

      results.forEach((message) => this.emitEvent(message));
      this._setLastTs(results[results.length - 1].time);
    },
  },
  async run() {
    await this.processEvent();
  },
};
