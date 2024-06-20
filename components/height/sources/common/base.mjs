import height from "../../height.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    height,
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
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || "1970-01-01T00:00:01Z";
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};
