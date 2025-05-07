import plainly from "../../plainly.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    plainly,
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
    usePagination() {
      return true;
    },
    getArgs() {
      return {};
    },
    getTsField() {
      return "createdDate";
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const fn = this.getResourceFn();
      let args = this.getArgs();
      const paginate = this.usePagination();
      const tsField = this.getTsField();

      if (paginate) {
        args = {
          ...args,
          params: {
            ...args?.params,
            size: 100,
            page: 0,
          },
        };
      }

      const results = [];
      let total;
      do {
        const items = await fn(args);
        for (const item of items) {
          const ts = Date.parse(item[tsField]);
          if (ts > lastTs) {
            results.push(item);
            maxTs = Math.max(ts, maxTs);
          }
        }
        total = items?.length;
        if (args.params) {
          args.params.page++;
        }
      } while (paginate && total === args.params.size);

      if (!results.length) {
        return;
      }

      if (max && results.length > max) {
        results.length = max;
      }

      results.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });

      this._setLastTs(maxTs);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
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
