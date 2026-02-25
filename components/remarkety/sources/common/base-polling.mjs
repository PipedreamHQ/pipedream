import remarkety from "../../remarkety.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    remarkety,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    processEvents() {
      throw new ConfigurationError("processEvents must be implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
