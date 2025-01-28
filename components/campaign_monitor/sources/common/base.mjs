import campaignMonitor from "../../campaign_monitor.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    campaignMonitor,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    clientId: {
      propDefinition: [
        campaignMonitor,
        "clientId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
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
    getTsField() {
      return "Date";
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const fn = this.getResourceFn();
      const args = this.getArgs();
      const tsField = this.getTsField();

      const results = this.campaignMonitor.paginate({
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

      if (!items?.length) {
        return;
      }

      this._setLastTs(Date.parse(items[0][tsField]));

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  async run() {
    await this.processEvent();
  },
};
