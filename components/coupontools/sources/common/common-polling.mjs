import coupontools from "../../coupontools.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    coupontools,
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
    getTimestamp(item) {
      return item.created_at;
    },
    formatTimestamp(ts) {
      return new Date(ts)
        .toISOString()
        .slice(0, 16)
        .replace("T", " ");
    },
    async paginateSessions({
      type, args = {}, lastTs, max,
    }) {
      args = {
        ...args,
        data: {
          ...args.data,
          page: 1,
        },
      };
      let results = [];
      let total = 0;
      let maxTs = lastTs;

      do {
        const { data } = await this.coupontools.listSessions({
          type,
          ...args,
        });
        for (const item of data) {
          const ts = Date.parse(this.getTimestamp(item));
          if (ts > lastTs) {
            results.push(item);
            maxTs = Math.max(ts, maxTs);
          }
        }
        total = data?.length;
        args.data.page++;
      } while (total === 100);

      this._setLastTs(maxTs);

      if (max && results.length > max) {
        results = results.slice(-1 * max);
      }
      return results;
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      const results = await this.getResults(max, lastTs);
      if (!results?.length) {
        return;
      }
      results.forEach((result) => {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
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
