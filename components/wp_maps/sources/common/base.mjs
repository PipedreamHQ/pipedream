import wpMaps from "../../wp_maps.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    wpMaps,
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
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastId = this._getLastId();
    let maxId = lastId;

    const resourceFn = this.getResourceFn();
    const { data } = await resourceFn();
    for (const item of data) {
      if (item.id > lastId) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
        if (item.id > maxId) {
          maxId = item.id;
        }
      }
    }

    this._setLastId(maxId);
  },
};
