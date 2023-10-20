import intercom from "../intercom.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    intercom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
    },
  },
  methods: {
    _getLastUpdate() {
      const monthAgo = this.intercom.monthAgo();
      return this.db.get("lastUpdate") || Math.floor(monthAgo / 1000);
    },
    _setLastUpdate(lastUpdate) {
      this.db.set("lastUpdate", lastUpdate);
    },
  },
};
