import zendeskSell from "../../zendesk_sell.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    zendeskSell,
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
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getTsField() {
      return "created_at";
    },
    getParams() {
      return {
        sort_by: `${this.getTsField()}:desc`,
      };
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.parse(item[this.getTsField()]),
      };
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const fn = this.getResourceFn();
      const params = this.getParams();
      const tsField = this.getTsField();

      const results = this.zendeskSell.paginate({
        fn,
        params,
        max,
      });

      const items = [];
      for await (const result of results) {
        const { data: item } = result;
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
