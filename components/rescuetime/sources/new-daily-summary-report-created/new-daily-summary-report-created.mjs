import rescuetime from "../../rescuetime.app.mjs";
const TIMER_INTERVAL_MILLISECONDS = 24 * 60 * 60 * 1000; // 24 hours

export default {
  key: "rescuetime-new-daily-summary-report-created",
  name: "New Daily Summary Report Created",
  description: "Emit new event each time a new daily summary report is available. [See the docs here](https://www.rescuetime.com/rtx/developers#daily-summary-feed-reference)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rescuetime,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: TIMER_INTERVAL_MILLISECONDS,
      },
    },
  },
  methods: {
    generateMeta(report) {
      return {
        id: report.id,
        summary: "New Daily Summary Report",
        ts: Date.now(),
      };
    },
  },
  async run() {
    const reports = await this.rescuetime.getDailySummaryFeed();
    for (const report of reports) {
      const meta = this.generateMeta(report);
      this.$emit(report, meta);
    }
  },
};
