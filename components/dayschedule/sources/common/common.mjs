import dayschedule from "../../dayschedule.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    dayschedule,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const events = await this.getHistoricalEvents();
      this.processEvents(events);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    processEvents(events, lastTs = 0) {
      let maxLastTs = lastTs;

      for (const event of events) {
        const ts = this.getTs(event);
        if (ts > lastTs) {
          this.emitEvent(event);
        }
        if (ts > maxLastTs) {
          maxLastTs = ts;
        }
      }

      this._setLastTs(maxLastTs);
    },
    getHistoricalEvents() {
      throw new Error("getHistoricalEvents is not implemented");
    },
    getTs() {
      throw new Error("getTs is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
};
