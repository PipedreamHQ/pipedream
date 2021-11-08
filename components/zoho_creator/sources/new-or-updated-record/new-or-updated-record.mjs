import zohoCreator from "../../zoho_creator.app.mjs";

export default {
  key: "zoho_creator-new-or-updated-record",
  description: "Emit events on new or updated records",
  type: "source",
  version: "0.0.6",
  props: {
    zohoCreator,
    db: "$.service.db",
  },
  methods: {},
  async run(event) {
    const reports = await this.zohoCreator.getReports();

    for (const report of reports) {
      const key = this.zohoCreator.getReportKey(report);
      const latestCachedID = this.db.get(key)
        ? this.db.get(key)
        : null;

      let latestRow = await this.zohoCreator.getLatestReportRow(report);
      if (!latestRow) {
        latestRow = {
          ID: null,
        };
      }

      if (latestRow.ID !== latestCachedID) {
        this.$emit(
          {
            event,
          },
          {
            summary: `Report: ${report.display_name} has been updated`,
            ts: Date.now(),
          },
        );
      }
      if (latestRow.ID) {
        this.db.set(key, latestRow.ID);
      }
    }
  },
};
