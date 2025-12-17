import canny from "../../canny.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    canny,
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
    getData() {
      return {};
    },
    getTsField() {
      return "created";
    },
    isRelevant() {
      return true;
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      const fn = this.getResourceFn();
      const data = this.getData();
      const resourceKey = this.getResourceKey();

      const results = this.canny.paginate({
        fn,
        data,
        resourceKey,
        max,
      });

      const items = [];
      for await (const item of results) {
        const ts = Date.parse(item[this.getTsField()]);
        if (ts >= lastTs) {
          if (this.isRelevant(item)) {
            items.push(item);
          }
        } else {
          break;
        }
      }

      if (!items.length) {
        return;
      }

      this._setLastTs(Date.parse(items[0][this.getTsField()]));

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn must be implemented");
    },
    getResourceKey() {
      throw new ConfigurationError("getResourceKey must be implemented");
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
