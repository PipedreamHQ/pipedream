import channable from "../../channable.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    channable,
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
      return this.db.get("lastTs");
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    getResourceKey() {
      return "offers";
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const tsField = this.getTsField();

      const results = await this.channable.paginate({
        fn: this.getResourceFn(),
        args: {
          params: {
            last_modified_after: lastTs,
          },
        },
        resourceKey: this.getResourceKey(),
      });

      let items = [];
      for await (const result of results) {
        const ts = result[tsField];
        if (!maxTs || Date.parse(ts) > Date.parse(maxTs)) {
          maxTs = ts;
        }
        items.push(result);
      }

      if (!items.length) {
        return;
      }

      this._setLastTs(maxTs);

      if (max && items.length > max) {
        items = items.slice(0, max);
      }

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn must be implemented");
    },
    getTsField() {
      throw new ConfigurationError("getTsField must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
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
