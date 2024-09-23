import firefish from "../../firefish.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    firefish,
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
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    async processEvent(limit) {
      const lastCreated = this._getLastCreated();
      const resourceFn = this.getResourceFn();
      const results = await resourceFn({
        params: {
          "from-date": lastCreated && lastCreated.slice(0, 10),
        },
      });
      if (!results?.length) {
        return;
      }
      this._setLastCreated(results[0].Created);
      if (limit && results.length > limit) {
        results.length = limit;
      }
      results.reverse().forEach((result) => {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      });
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
