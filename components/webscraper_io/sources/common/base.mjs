import webscraper from "../../webscraper_io.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    webscraper,
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
      await this.emitHistoricalEvents({
        limit: 25,
      });
    },
  },
  methods: {
    _getPreviousIds() {
      return this.db.get("previousIds") || {};
    },
    _setPreviousIds(previousIds) {
      this.db.set("previousIds", previousIds);
    },
  },
};
