import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import screvi from "../../screvi.app.mjs";

/**
 * Screvi returns newest first and has no "created since" filter on every
 * endpoint, so each source keeps the timestamp of the newest item it has seen
 * and walks pages until it reaches something at or older than that. Emitting is
 * deferred to the end so events arrive oldest first, the order a workflow
 * expects.
 */
export default {
  props: {
    screvi,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "How often Pipedream polls the Screvi API",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getParams() {
      throw new Error("getParams is not implemented");
    },
    fetch() {
      throw new Error("fetch is not implemented");
    },
    getTs() {
      throw new Error("getTs is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const cutoff = lastTs
        ? Date.parse(lastTs)
        : null;
      const items = [];

      for await (const item of this.screvi.paginate({
        fn: (opts) => this.fetch(opts),
        params: this.getParams(lastTs),
        max,
      })) {
        if (cutoff && Date.parse(this.getTs(item)) <= cutoff) {
          break;
        }
        items.push(item);
      }

      if (items.length) {
        this._setLastTs(this.getTs(items[0]));
      }

      items.reverse().forEach((item) => this.$emit(item, this.generateMeta(item)));
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
