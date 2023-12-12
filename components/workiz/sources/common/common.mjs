import workiz from "../../workiz.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    workiz,
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
    const resourceFn = this.getResourceFn();
    const params = {
      records: 100,
      offset: 0,
    };
    let more = false;

    do {
      const {
        data, has_more: hasMore,
      } = await resourceFn({
        params,
      });
      more = hasMore;
      for (const item of data) {
        const ts = Date.parse(item.CreatedDate);
        if (ts > lastTs) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          if (ts > maxTs) {
            maxTs = ts;
          }
        } else {
          more = false;
        }
      }
    } while (more);

    this._setLastTs(maxTs);
  },
};
