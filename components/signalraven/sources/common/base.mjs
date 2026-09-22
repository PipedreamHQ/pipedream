import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../signalraven.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll SignalRaven for new items",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    getTs(item) {
      return Date.parse(item.createdAt) || Date.now();
    },
    async fetchItems() {
      throw new Error("fetchItems is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  hooks: {
    async deploy() {
      // Emit the most recent items on deploy so the workflow has sample events.
      const items = await this.fetchItems();
      const recent = items.slice(0, 10);
      recent.reverse().forEach((item) => this.$emit(item, this.generateMeta(item)));
      if (items.length) {
        this._setLastTs(Math.max(...items.map((item) => this.getTs(item))));
      }
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    const items = await this.fetchItems();
    const fresh = items.filter((item) => this.getTs(item) > lastTs);
    fresh.reverse().forEach((item) => this.$emit(item, this.generateMeta(item)));
    if (fresh.length) {
      this._setLastTs(Math.max(...fresh.map((item) => this.getTs(item))));
    }
  },
};
