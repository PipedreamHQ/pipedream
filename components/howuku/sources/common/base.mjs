import howuku from "../../howuku.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    howuku,
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
    _getLastDateTime() {
      return this.db.get("lastDateTime");
    },
    _setLastDateTime(lastDateTime) {
      this.db.set("lastDateTime", lastDateTime);
    },
    async processEvent(limit) {
      const lastDateTime = this._getLastDateTime();
      let maxDateTime = lastDateTime;
      const resourceFn = this.getResourceFn();
      const params = limit
        ? {
          limit,
        }
        : {
          startdate: lastDateTime,
        };
      const items = await resourceFn({
        params,
      });
      for (const item of items) {
        if (!lastDateTime || Date.parse(item.dt) > Date.parse(lastDateTime)) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          if (Date.parse(item.dt) > Date.parse(maxDateTime)) {
            maxDateTime = item.dt;
          }
        }
      }
      this._setLastDateTime(maxDateTime);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
