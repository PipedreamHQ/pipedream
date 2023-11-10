import signalwire from "../../signalwire.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    signalwire,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastCreated = this._getLastCreated();
    let maxCreated = lastCreated;
    const params = lastCreated
      ? {
        created_after: lastCreated,
        page_size: 1000,
      }
      : {
        page_size: 25,
      };

    const resourceFn = this.getResourceFn();
    const { data } = await resourceFn({
      params,
    });
    if (!data?.length) {
      return;
    }
    for (const item of data) {
      if (Date.parse(item.created_at) > Date.parse(maxCreated)) {
        maxCreated = (item.created_at).slice(0, 10);
      }
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }

    this._setLastCreated(maxCreated);
  },
};
