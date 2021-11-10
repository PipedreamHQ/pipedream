import zohoCreator from "../../zoho_creator.app.mjs";

export default {
  key: "zoho_creator-new-record",
  description: "Emit new events on new record in a form",
  type: "source",
  name: "New Record",
  version: "0.0.11",
  props: {
    zohoCreator,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Timer",
      description: "Timer to run source periodically",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {},
  async run(event) {
    const reports = await this.zohoCreator.getReports();

    for (const report of reports) {
      const reportKey = this.zohoCreator.getReportKey(report);
      const key = `${reportKey}:count`;
      const lastRecordsCount = this.db.get(key);
      const recordsPage = this.zohoCreator.computeLastRecordsPage({
        count: lastRecordsCount,
      });
      const recordsStream = await this.zohoCreator.getReportRecords(report, {
        page: recordsPage,
      });

      let recordsOffset = this.zohoCreator.computeRecordsOffset({
        count: lastRecordsCount,
      });
      let newRecordsCount = lastRecordsCount;
      for await (const record of recordsStream) {
        if (recordsOffset > 0) {
          --recordsOffset;
          continue;
        }
        this.$emit(
          {
            event,
            record,
          },
          {
            summary: `Report: ${report.display_name} has been updated`,
            ts: Date.now(),
          },
        );
        ++newRecordsCount;
      }

      this.db.set(key, newRecordsCount);
    }
  },
};
