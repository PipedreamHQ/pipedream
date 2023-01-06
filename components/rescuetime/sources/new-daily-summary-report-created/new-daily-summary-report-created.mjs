import rescuetime from "../../rescuetime.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "rescuetime-new-daily-summary-report-created",
  name: "New Daily Summary Report Created",
  description: "Emit new event each time a new daily summary report is available.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rescuetime,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
  },
};
