import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../signalraven.app.mjs";
import constants from "../../common/constants.mjs";

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
    /** One page of items, newest first. Sources implement this. */
    async fetchPage() {
      throw new Error("fetchPage is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    /**
     * Walk pages, newest first, until a page is short, a page's oldest
     * item is at or before the watermark, or the page cap is reached.
     */
    async fetchSince(lastTs) {
      const items = [];
      for (let page = 0; page < constants.MAX_SOURCE_PAGES; page++) {
        const batch = await this.fetchPage(page * constants.MAX_LIMIT);
        items.push(...batch);
        if (batch.length < constants.MAX_LIMIT) {
          break;
        }
        const oldest = Math.min(...batch.map((item) => this.getTs(item)));
        if (oldest <= lastTs) {
          break;
        }
      }
      return items.filter((item) => this.getTs(item) > lastTs);
    },
    emitAll(items) {
      items
        .slice()
        .reverse()
        .forEach((item) => this.$emit(item, this.generateMeta(item)));
      if (items.length) {
        this._setLastTs(Math.max(...items.map((item) => this.getTs(item))));
      }
    },
  },
  hooks: {
    async deploy() {
      // Emit the most recent items on deploy so the workflow has sample events.
      const batch = await this.fetchPage(0);
      this.emitAll(batch.slice(0, 10));
      if (batch.length) {
        this._setLastTs(Math.max(...batch.map((item) => this.getTs(item))));
      }
    },
  },
  async run() {
    const fresh = await this.fetchSince(this._getLastTs());
    this.emitAll(fresh);
  },
};
