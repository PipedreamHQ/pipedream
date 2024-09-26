import oncehub from "../../oncehub.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    oncehub,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      await this.emitHistoricalEvents({
        limit: 10,
      });
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    daysAgo(days) {
      return new Date(new Date().setDate(new Date().getDate() - days)).toISOString();
    },
    emitEvent(event) { console.log(event);
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    emitHistoricalEvents() {
      throw new Error("getHistoricalEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
};
