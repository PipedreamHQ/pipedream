import zohoCreator from "../../zoho_creator.app.mjs";
import utils from "../../utils.mjs";

export default {
  key: "zoho_creator-new-record",
  description: "Emit new events on new record in a form",
  type: "source",
  name: "New Record",
  version: "0.0.12",
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
    reportCounterKey({
      appLinkName, reportLinkName,
    }) {
      return `${appLinkName.toLowerCase()}:${reportLinkName.toLowerCase()}:count`;
    },
    getReportCounter(args) {
      return this.db.get(this.reportCounterKey(args));
    },
    setReportCounter({
      value, ...args
    }) {
      return this.db.set(this.reportCounterKey(args), value);
    },
    getMetadata(report) {
      return {
        summary: `Report: ${report.display_name} has been updated`,
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const reports = await this.zohoCreator.getApplicationsReports();

    const promises = reports.map(async (report) => {
      const {
        appLinkName,
        link_name: reportLinkName,
      } = report;

      const args = {
        appLinkName,
        reportLinkName,
      };

      const recordsCount = this.getReportCounter(args);

      const [
        page,
        offset,
      ] = utils.computePageAndOffset({
        recordsCount,
      });

      const records =
        await this.zohoCreator.paginateRecords({
          ...args,
          page,
        });

      return [
        recordsCount,
        page,
        offset,
        report,
        records,
      ];
    });

    const response = await Promise.all(promises);

    response.forEach(([
      ,,,
      report,
      records,
    ]) => {
      records.forEach((record) => {
        this.$emit({
          event,
          record,
        }, this.getMetadata(report));
      });
    });
  },
};
