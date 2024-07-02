import leadoku from "../../leadoku.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    leadoku,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastScannedDate() {
      return this.db.get("lastScannedDate") || 0;
    },
    _setLastScannedDate(lastScannedDate) {
      this.db.set("lastScannedDate", lastScannedDate);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    generateMeta(item) {
      const ts = Date.parse(item[this.getTsField()]);
      return {
        id: `${item.receiver_id}-${ts}`,
        summary: this.getSummary(),
        ts,
      };
    },
  },
  async run() {
    const lastScannedDate = this._getLastScannedDate();
    let maxScannedDate = lastScannedDate;
    const resourceFn = this.getResourceFn();
    const { data } = await resourceFn();
    for (const item of data) {
      const ts = Date.parse(item[this.getTsField()]);
      if (ts > lastScannedDate) {
        maxScannedDate = Math.max(maxScannedDate, ts);
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    }
    this._setLastScannedDate(maxScannedDate);
  },
};
