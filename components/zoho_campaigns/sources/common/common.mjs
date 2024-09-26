import app from "../../zoho_campaigns.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _setStartIndex(startIndex) {
      this.db.set("startIndex", startIndex);
    },
    _getStartIndex() {
      return this.db.get("startIndex") || 0;
    },
  },
};
