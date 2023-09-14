import raisely from "../../raisely.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    raisely,
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
    getParams() {
      return {};
    },
    isRelevant() {
      return true;
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const tsField = this.getTsField();
    const params = this.getParams();

    const items = this.raisely.paginate({
      resourceFn: this.getResourceFn(),
      args: {
        params: {
          ...params,
          sort: tsField,
          order: "desc",
        },
      },
    });

    for await (const item of items) {
      const ts = Date.parse(item[tsField]);
      if (ts > lastTs) {
        if (this.isRelevant(item)) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
        }
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
      else {
        break;
      }
    }

    this._setLastTs(maxTs);
  },
};
