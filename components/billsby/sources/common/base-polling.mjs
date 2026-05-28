import billsby from "../../billsby.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    billsby,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getParams() {
      return {};
    },
    getTsField() {
      return "createdOn";
    },
    async processEvents(max) {
      const lastId = this._getLastId();

      const results = this.billsby.paginate({
        fn: this.getResourceFn(),
        params: this.getParams(),
        max,
      });

      let items = [];
      for await (const item of results) {
        const ts = Date.parse(item[this.getTsField()]);
        if (ts >= lastId) {
          items.push(item);
        } else {
          break;
        }
      }

      if (!items.length) {
        return;
      }

      this._setLastId(Date.parse(items[0][this.getTsField()]));

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
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
