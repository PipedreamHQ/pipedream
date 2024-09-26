import app from "../../lightspeed_retail_pos.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountId: {
      propDefinition: [
        app,
        "accountId",
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
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getSortKey() {
      throw new Error("getSortKey is not implemented");
    },
    getResourceKey() {
      throw new Error("getResourceKey is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent(limit) {
      const lastTs = this._getLastTs();
      const tsField = this.getTsField();

      const items = this.app.paginate({
        resourceFn: this.getResourceFn(),
        args: {
          accountId: this.accountId,
          params: {
            sort: this.getSortKey(),
          },
        },
        resourceKey: this.getResourceKey(),
        limit,
      });

      const results = [];
      for await (const item of items) {
        if (!item[tsField]) {
          continue;
        }
        if (Date.parse(item[tsField]) > lastTs) {
          results.push(item);
        } else {
          break;
        }
      }
      if (results?.length) {
        this._setLastTs(Date.parse(results[0][tsField]));
        results.reverse().forEach((result) => {
          const meta = this.generateMeta(result);
          this.$emit(result, meta);
        });
      }
    },
  },
  async run() {
    await this.processEvent();
  },
};
