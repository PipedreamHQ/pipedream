import zohoCreator from "../../zoho_creator.app.mjs";

export default {
  key: "zoho_creator-new-record",
  description: "Emit new events on new record in a form",
  type: "source",
  name: "New Record",
  version: "0.0.1",
  dedupe: "greatest",
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
  methods: {
    getMetadata({
      report, record,
    }) {
      return {
        id: record.ID,
        summary: `New Report Record: ${report.display_name} has been created`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const reports = await this.zohoCreator.getApplicationsReports();

    const promises = reports.map(async (report) => {
      const {
        appLinkName,
        link_name: reportLinkName,
      } = report;

      const records = await this.zohoCreator.paginateRecords({
        appLinkName,
        reportLinkName,
      });

      return [
        report,
        records,
      ];
    });

    const responses = await Promise.all(promises);

    responses.forEach(([
      report,
      records,
    ]) => {
      records.forEach((record) => {
        this.$emit(record, this.getMetadata({
          report,
          record,
        }));
      });
    });
  },
};
