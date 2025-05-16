import companyhub from "../../companyhub.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    companyhub,
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
    getArgs() {
      return {};
    },
    getTsField() {
      return "CreatedOn";
    },
    generateMeta(item) {
      return {
        id: item.ID,
        summary: this.getSummary(item),
        ts: Date.parse(item[this.getTsField()]),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const fn = this.getResourceFn();
      const args = this.getArgs();
      const tsField = this.getTsField();

      const results = await this.companyhub.paginate({
        fn,
        args,
        max,
      });

      const items = [];
      for await (const item of results) {
        const ts = Date.parse(item[tsField]);
        if (ts >= lastTs) {
          items.push(item);
        } else {
          break;
        }
      }

      if (!items.length) {
        return;
      }

      this._setLastTs(Date.parse(items[0][tsField]));

      for (const item of items.reverse()) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    },
    getResourceFn() {
      throw new Error("getResourceFn must be implemented");
    },
    getSummary() {
      throw new Error("getSummary must be implemented");
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
