import freshservice from "../../freshservice.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    freshservice,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
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
    getParams() {
      return {};
    },
    getTsField() {
      return "created_at";
    },
    async processEvents(max = 100) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const fn = this.getResourceFn();
      const params = {
        ...this.getParams(),
        per_page: max,
      };
      const tsField = this.getTsField();
      const resourceKey = this.getResourceKey();

      const results = await fn({
        params,
      });
      const resources = results[resourceKey];

      if (!resources.length) {
        return;
      }

      for (const resource of resources) {
        const ts = Date.parse(resource[tsField]);
        if (!lastTs || ts > Date.parse(lastTs)) {
          if (!maxTs || ts > Date.parse(maxTs)) {
            maxTs = resource[tsField];
          }
          const meta = this.generateMeta(resource);
          this.$emit(resource, meta);
        }
      }

      this._setLastTs(maxTs);
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
      await this.processEvents(25);
    },
  },
  async run() {
    await this.processEvents();
  },
};
