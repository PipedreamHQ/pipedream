import edusign from "../../edusign.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    edusign,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated") || new Date().toISOString();
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    processEvents() {
      throw new ConfigurationError("processEvents is not implemented");
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
