import getprospect from "../../getprospect.app.mjs";
import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  props: {
    getprospect,
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
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getParams() {
      return {
        sort: "id",
        order: "DESC",
      };
    },
    getData() {
      return;
    },
    isRelevant() {
      return true;
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const fn = this.getResourceFn();
      const params = this.getParams();
      const data = this.getData(lastTs);

      const results = this.getprospect.paginate({
        fn,
        params,
        data,
        max,
      });

      const items = [];
      for await (const item of results) {
        if (!this.isRelevant(item, lastTs)) {
          break;
        }
        items.push(item);
      }

      if (!items.length) {
        return;
      }

      this._setLastTs(items[0]?.createdAt || items[0]?.lastUpdatedAt || new Date().toISOString()
        .split("T")[0]);

      items.reverse().forEach((item) => {
        this.$emit(item, this.generateMeta(item));
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  async run() {
    await this.processEvent();
  },
};
