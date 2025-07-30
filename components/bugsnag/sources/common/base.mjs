import bugsnag from "../../bugsnag.app.mjs";
import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  props: {
    bugsnag,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    organizationId: {
      propDefinition: [
        bugsnag,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        bugsnag,
        "projectId",
        (c) => ({
          organizationId: c.organizationId,
        }),
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
    getArgs() {
      return {};
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.parse(item[this.getTsField()]),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const fn = this.getResourceFn();
      const args = this.getArgs();
      const tsField = this.getTsField();

      const results = this.bugsnag.paginate({
        fn,
        args,
        max,
      });

      const items = [];
      for await (const item of results) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs) {
          items.push(item);
        } else {
          break;
        }
      }

      if (!items?.length) {
        return;
      }

      this._setLastTs(Date.parse(items[0][tsField]));

      items.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getTsField() {
      throw new ConfigurationError("getTsField is not implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary is not implemented");
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
