import chargekeep from "../../chargekeep.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    chargekeep,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    async processEvents(max) {
      const lastId = this._getLastId();
      let maxId = lastId;
      const { result } = await this.getResults();
      if (!result?.length) {
        return;
      }
      let items = [];
      for (const item of result) {
        if (item.id > lastId) {
          items.push(item);
          maxId = Math.max(item.id, maxId);
        }
      }
      this._setLastId(maxId);
      items = items.sort((a, b) => a.id - b.id);
      if (max && items.length > max) {
        items = items.slice(-1 * max);
      }
      items.forEach((item) => this.emitEvent(item));
    },
    getResults() {
      throw new ConfigurationError("getResults must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
