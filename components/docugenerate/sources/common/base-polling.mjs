import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import docugenerate from "../../docugenerate.app.mjs";

export default {
  props: {
    docugenerate,
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
      return this.db.get("lastTs") ?? 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    getArgs() {
      return {};
    },
    async processEvent(maxResults) {
      const lastTs = this._getLastTs();
      const fn = this.getResourceFn();
      const args = this.getArgs();
      const items = await fn(this, ...Object.values(args));

      let newItems = items
        .filter((item) => item.created > lastTs)
        .sort((a, b) => b.created - a.created);

      if (maxResults && newItems.length > maxResults) {
        newItems = newItems.slice(0, maxResults);
      }

      if (newItems.length) {
        this._setLastTs(newItems[newItems.length - 1].created);
      }

      for (const item of newItems.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
    async fetchItems() {
      throw new ConfigurationError("fetchItems is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  async run() {
    await this.processEvent();
  },
};
