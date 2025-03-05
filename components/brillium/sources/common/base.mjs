import brillium from "../../brillium.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    brillium,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountId: {
      propDefinition: [
        brillium,
        "accountId",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    async processEvent(limit) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const resourceKey = this.getResourceKey();
      const tsField = this.getTsField();

      const items = this.brillium.paginate({
        resourceFn,
        args,
        resourceKey,
      });

      let results = [];
      try {
        for await (const item of items) {
          const ts = Date.parse(item[tsField]);
          if (ts > lastTs) {
            results.push(item);
            maxTs = Math.max(maxTs, ts);
          }
        }
      } catch (e) {
        console.log(`${e.message}`);
        return;
      }

      if (!results.length) {
        return;
      }

      this._setLastTs(maxTs);

      if (limit) {
        results = results.slice(-1 * limit);
      }

      results.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getArgs() {
      throw new Error("getArgs is not implemented");
    },
    getResourceKey() {
      throw new Error("getResourceKey is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
