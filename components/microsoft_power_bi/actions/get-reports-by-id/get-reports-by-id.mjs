import microsoftPowerBi from "../../microsoft_power_bi.app.mjs";

export default {
  key: "microsoft_power_bi-get-reports-by-id",
  name: "Get Report",
  description: "Retrieve metadata for a single Power BI report by ID. Uses My workspace by default; set Workspace (Group) ID for a specific workspace. [See the documentation](https://learn.microsoft.com/en-us/rest/api/power-bi/reports/get-report)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftPowerBi,
    groupId: {
      propDefinition: [
        microsoftPowerBi,
        "groupId",
      ],
    },
    reportId: {
      propDefinition: [
        microsoftPowerBi,
        "reportId",
        ({ groupId }) => ({
          groupId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const report = await this.microsoftPowerBi.getReport({
      $,
      reportId: this.reportId,
      groupId: this.groupId,
    });
    $.export("$summary", `Retrieved report "${report.name}" (${report.id})`);
    return report;
  },
};
