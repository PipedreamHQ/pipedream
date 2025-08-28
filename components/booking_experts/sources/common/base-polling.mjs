import bookingExperts from "../../booking_experts.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    bookingExperts,
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
      return "created_at";
    },
    async processEvent(limit) {
      const lastTs = this._getLastTs();
      const resourceFn = this.getResourceFn();
      let args = this.getArgs();
      const tsField = this.getTsField();

      const items = [];
      let total, hasMore, count = 0;
      args = {
        ...args,
        params: {
          ...args?.params,
          "page[number]": 1,
          "page[size]": 100,
        },
      };
      do {
        const { data } = await resourceFn(args);
        total = data?.length;
        if (!total) {
          break;
        }
        for (const item of data) {
          const ts = Date.parse(item.attributes[tsField]);
          if (ts > lastTs) {
            items.push(item);
            if (limit && ++count >= limit) {
              hasMore = false;
              break;
            }
          } else {
            hasMore = false;
            break;
          }
        }
        args.params["page[number]"]++;
      } while (hasMore && total === args.params["page[size]"]);

      if (!items.length) {
        return;
      }

      this._setLastTs(Date.parse(items[0].attributes[tsField]));

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
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
