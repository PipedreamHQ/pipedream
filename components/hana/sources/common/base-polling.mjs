import hana from "../../hana.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    hana,
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
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getTsField() {
      return "createdAt";
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const results = await this.getResults();
      if (!results?.length) {
        return;
      }
      let items = [];
      for (const result of results) {
        const ts = Date.parse(result[this.getTsField()]);
        if (ts > lastTs) {
          items.push(result);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }
      if (!items.length) {
        return;
      }
      if (max && items.length > max) {
        items = items.slice(-1 * max);
      }
      this._setLastTs(maxTs);
      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
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
